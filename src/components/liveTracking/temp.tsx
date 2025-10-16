import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  OverlayView,
  useJsApiLoader,
  InfoWindow,
} from "@react-google-maps/api";
import { env } from "@/utils/env";

const containerStyle: React.CSSProperties = { width: "100%", height: "100%", userSelect: "none" };

const mapStyle = [
  { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#d4f1f9" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
];

const APIKEY = env? env.VITE_GOOGLE_MAP_KEY : "";
const libraries: ("geometry" | "places")[] = ["geometry", "places"];

interface LatLng {
  lat: number;
  lng: number;
}

interface Props {
  dropPosition: LatLng;
  livePosition: LatLng;
}

const CAR_SIZE = 40;

const LiveTracking: React.FC<Props> = ({ dropPosition, livePosition }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: APIKEY,
    libraries,
  });
 const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [carPosition, setCarPosition] = useState<google.maps.LatLngLiteral>(livePosition);
  const [heading, setHeading] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState(true);
  const [routePath, setRoutePath] = useState<LatLng[]>([livePosition]);

  // Calculate route using DirectionsService
  useEffect(() => {
    if (!isLoaded || !window.google?.maps) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: livePosition,
        destination: dropPosition,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result?.routes?.[0]?.overview_path) {
          const path = result.routes[0].overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }));
          setRoutePath(path);
        } else {
          console.error("Error fetching directions", result);
          setRoutePath([livePosition, dropPosition]); // fallback to straight line
        }
      }
    );
  }, [isLoaded, livePosition, dropPosition]);

  // Move car along the route
  useEffect(() => {
    if (!isLoaded || !window.google?.maps?.geometry || routePath.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      setCarPosition((prev) => {
        if (index >= routePath.length) {
          clearInterval(interval);
          return dropPosition;
        }

        const next = routePath[index];
        const h = window.google.maps.geometry.spherical.computeHeading(prev, next);
        setHeading(h);

        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(prev),
          new window.google.maps.LatLng(next)
        );
console.log("distance:",distance)
        index++;
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoaded, routePath, dropPosition]);

  if (!isLoaded) return <div>Loading…</div>;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={isFollowing ? carPosition : undefined}
        zoom={12}
        onDragStart={() => setIsFollowing(false)}
        options={{
          styles: mapStyle,
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          draggable: true,
        }}
      >
        <Marker position={livePosition} icon={{ url: "/icons/pin.png",
          scaledSize: new window.google.maps.Size(20, 20),
          }} 
          label={"Pickup Point"}
          onClick={() => setActiveMarker("pickUpClicked")}
          />
          {activeMarker === "pickUpClicked" && (
        <InfoWindow onCloseClick={() => setActiveMarker(null)} position={livePosition}>
          <div>
            <strong>Pickup:</strong> 5678 Oak Avenue Austin, TX 73301
          </div>
        </InfoWindow>
      )}
        <Marker position={dropPosition} icon={{ url: "/icons/pin.png",
          scaledSize: new window.google.maps.Size(20, 20),
         }} 
         label={"Drop Point"}
        onClick={() => setActiveMarker("dropClicked")}
         />
         {activeMarker === "dropClicked" && (
         <InfoWindow onCloseClick={() => setActiveMarker(null)} position={dropPosition}>
          <div>
            <strong>Drop:</strong> John F. Kennedy International Airport (JFK)
          </div>
        </InfoWindow>)}

        <Polyline
          path={routePath}
          options={{
            strokeColor: "#007bff",
            strokeWeight: 4,
            strokeOpacity: 0.8,
          }}
        />

        <OverlayView position={carPosition} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
          <div
            style={{
              width: `${CAR_SIZE}px`,
              height: `${CAR_SIZE}px`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `translate(-50%, -50%) rotate(${heading - 130}deg)`,
              transformOrigin: "center",
              transition: "transform 0.2s linear",
              pointerEvents: "none",
            }}
          >
            <img src="/icons/car.png" alt="car" style={{ width: "100%", height: "100%" }} />
          </div>
        </OverlayView>
      </GoogleMap>

      {!isFollowing && (
        <button
          onClick={() => setIsFollowing(true)}
          style={{
            position: "absolute",
            bottom: 20,
            right: 60,
            padding: "8px 12px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Follow Car
        </button>
      )}
    </div>
  );
};


export default LiveTracking