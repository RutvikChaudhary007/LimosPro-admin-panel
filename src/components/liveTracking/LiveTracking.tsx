// @ts-nocheck

import {
  GoogleMap,
  InfoWindow,
  Marker,
  OverlayView,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Navigation } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { env } from "@/utils/env";
import { geoDecoding } from "@/utils/googleMaps";
import { Spinner } from "../Spinner";

const containerStyle: React.CSSProperties = { width: "100%", height: "100%" };

const mapStyle = [
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#E3F2FD" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#FAFAFA" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#EEEEEE" }],
  },
];

const APIKEY = env?.VITE_GOOGLE_MAP_KEY;
const libraries: ("geometry" | "places" | "geocoding")[] = [
  "geometry",
  "places",
  "geocoding",
];

interface LatLng {
  lat: number;
  lng: number;
}

interface Props {
  dropPosition: LatLng;
  pickPosition: LatLng;
  /** Optional: external car position for WebSocket updates */
  externalCarPosition?: LatLng;
}

const CAR_SIZE = 40;

// Custom SVG icon for pickup marker
const PickupMarkerIcon = () => (
  <svg
    width="32"
    height="40"
    viewBox="0 0 32 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Pickup Marker"
    aria-hidden="true"
    aria-labelledby="Pickup Marker"
    aria-describedby="Pickup Marker"
  >
    <path
      d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z"
      fill="#1976D2"
    />
    <circle cx="16" cy="16" r="6" fill="white" />
    <circle cx="16" cy="16" r="3" fill="#1976D2" />
  </svg>
);

// Custom SVG icon for drop marker
const DropMarkerIcon = () => (
  <svg
    width="32"
    height="40"
    viewBox="0 0 32 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Drop Marker"
    aria-hidden="true"
    aria-labelledby="Drop Marker"
    aria-describedby="Drop Marker"
  >
    <path
      d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z"
      fill="#4CAF50"
    />
    <path d="M16 10l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" fill="white" />
  </svg>
);

// Custom SVG icon for car
const CarIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Car Icon"
    aria-hidden="true"
    aria-labelledby="car"
    aria-describedby="car"
  >
    <g filter="url(#shadow)">
      <path
        d="M8 18l2-6h20l2 6v10a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1H14v1a2 2 0 01-2 2H10a2 2 0 01-2-2V18z"
        fill="#1976D2"
      />
      <circle cx="13" cy="24" r="2" fill="#333" />
      <circle cx="27" cy="24" r="2" fill="#333" />
      <path d="M11 12l1-2h16l1 2-2 4H13l-2-4z" fill="#90CAF9" />
      <rect x="14" y="18" width="12" height="4" rx="1" fill="#BBDEFB" />
    </g>
    <defs>
      <filter
        id="shadow"
        x="0"
        y="0"
        width="40"
        height="40"
        filterUnits="userSpaceOnUse"
      >
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
      </filter>
    </defs>
  </svg>
);

const LiveTracking: React.FC<Props> = ({
  dropPosition,
  pickPosition,
  externalCarPosition,
}) => {
  // Load Google Maps script
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: APIKEY,
    libraries,
  });
  const [pickUpAddress, setPickUpAddress] = useState<string | undefined>(
    undefined,
  );
  const [dropOffAddress, setDropOffAddress] = useState<string | undefined>(
    undefined,
  );

  // Initialize Places Autocomplete
  useEffect(() => {
    let isMounted = true;

    const fetchAddress = async () => {
      if (isLoaded && pickPosition && dropPosition && !loadError) {
        try {
          const address = await geoDecoding({
            lat: pickPosition?.lat,
            lng: pickPosition?.lng,
          });
          const address2 = await geoDecoding({
            lat: dropPosition?.lat,
            lng: dropPosition?.lng,
          });
          if (isMounted) {
            console.log("Decoded Address:", address);
            if (address) {
              setPickUpAddress(address as string);
            }
            if (address2) {
              setDropOffAddress(address2 as string);
            }
          }
        } catch (err) {
          console.error("Geocoding failed:", err);
        }
      }
    };

    fetchAddress();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, loadError, pickPosition, dropPosition]);

  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [carPosition, setCarPosition] = useState<LatLng>(
    externalCarPosition || pickPosition,
  );
  const [heading, setHeading] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState(true);
  const [routePath, setRoutePath] = useState<LatLng[]>([pickPosition]);

  // const animationRef = useRef<number>();
  const pathIndexRef = useRef<number>(0);

  // Update car position from external source (WebSocket simulation)
  useEffect(() => {
    if (externalCarPosition) {
      setCarPosition(externalCarPosition);
      if (routePath.length > 0) {
        // update heading to next point
        const current = new window.google.maps.LatLng(carPosition);
        const next = new window.google.maps.LatLng(
          routePath[pathIndexRef.current] || externalCarPosition,
        );
        const h = window.google.maps.geometry.spherical.computeHeading(
          current,
          next,
        );
        setHeading(h);
      }
    }
  }, [externalCarPosition, routePath, carPosition]);

  // Calculate route using DirectionsService
  useEffect(() => {
    if (!isLoaded || !window.google?.maps) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickPosition,
        destination: dropPosition,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
        avoidTolls: false,
      },
      (result, status) => {
        if (status === "OK" && result?.routes?.[0]?.legs) {
          const route = result.routes[0];
          const fullPath: LatLng[] = [];

          // collect detailed step-by-step path
          route.legs.forEach((leg) => {
            leg.steps.forEach((step) => {
              if (step.path) {
                step.path.forEach((p) => {
                  fullPath.push({ lat: p.lat(), lng: p.lng() });
                });
              }
            });
          });

          setRoutePath(fullPath);
        } else {
          console.error("Error fetching directions", result);
          setRoutePath([pickPosition, dropPosition]); // fallback to straight line
        }
        // if (status === "OK" && result?.routes?.[0]?.overview_path) {
        //   const path = result.routes[0].overview_path.map((p) => ({
        //     lat: p.lat(),
        //     lng: p.lng(),
        //   }));
        //   setRoutePath(path);
        // } else {
        //   console.error("Error fetching directions", result);
        //   setRoutePath([pickPosition, dropPosition]); // fallback
        // }
      },
    );
  }, [isLoaded, pickPosition, dropPosition]);

  if (!isLoaded) return <Spinner />;

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
        {/* Pickup Marker */}
        <Marker
          position={pickPosition}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
              '<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="#1976D2"/><circle cx="16" cy="16" r="6" fill="white"/><circle cx="16" cy="16" r="3" fill="#1976D2"/></svg>',
            )}`,
            scaledSize: new window.google.maps.Size(32, 40),
            anchor: new window.google.maps.Point(16, 40),
          }}
          onClick={() => setActiveMarker("pickUpClicked")}
        />
        {activeMarker === "pickUpClicked" && (
          <InfoWindow
            onCloseClick={() => setActiveMarker(null)}
            position={pickPosition}
          >
            <div className="p-2 min-w-[200px]">
              <div className="font-semibold text-base-black mb-1">
                Pickup Location
              </div>
              <div className="text-sm text-base-black/70">
                {pickUpAddress || "Loading..."}
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Drop Marker */}
        <Marker
          position={dropPosition}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
              '<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="#4CAF50"/><path d="M16 10l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" fill="white"/></svg>',
            )}`,
            scaledSize: new window.google.maps.Size(32, 40),
            anchor: new window.google.maps.Point(16, 40),
          }}
          onClick={() => setActiveMarker("dropClicked")}
        />
        {activeMarker === "dropClicked" && (
          <InfoWindow
            onCloseClick={() => setActiveMarker(null)}
            position={dropPosition}
          >
            <div className="p-2 min-w-[200px]">
              <div className="font-semibold text-base-black mb-1">
                Drop Location
              </div>
              <div className="text-sm text-base-black/70">
                {dropOffAddress || "Loading..."}
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Route */}
        <Polyline
          path={routePath}
          options={{
            strokeColor: "#1976D2",
            strokeWeight: 5,
            strokeOpacity: 0.9,
          }}
        />

        {/* Car */}
        <OverlayView
          position={carPosition}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            style={{
              width: `${CAR_SIZE}px`,
              height: `${CAR_SIZE}px`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `translate(-50%, -50%) rotate(${heading}deg)`,
              transformOrigin: "center",
              transition: "transform 0.1s linear",
              pointerEvents: "none",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Car"
              aria-hidden="true"
              aria-labelledby="car"
              aria-describedby="car"
            >
              <defs>
                <filter
                  id="car-shadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="3"
                    floodOpacity="0.4"
                  />
                </filter>
              </defs>
              <g filter="url(#car-shadow)">
                <path
                  d="M8 18l2-6h20l2 6v10a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1H14v1a2 2 0 01-2 2h-2a2 2 0 01-2-2V18z"
                  fill="#1976D2"
                  stroke="#0D47A1"
                  strokeWidth="0.5"
                />
                <circle
                  cx="13"
                  cy="24"
                  r="2.5"
                  fill="#333"
                  stroke="#666"
                  strokeWidth="0.5"
                />
                <circle
                  cx="27"
                  cy="24"
                  r="2.5"
                  fill="#333"
                  stroke="#666"
                  strokeWidth="0.5"
                />
                <path d="M11 12l1-2h16l1 2-2 4H13l-2-4z" fill="#90CAF9" />
                <rect
                  x="14"
                  y="18"
                  width="12"
                  height="4"
                  rx="1"
                  fill="#BBDEFB"
                  opacity="0.8"
                />
                <circle cx="13" cy="24" r="1" fill="#666" />
                <circle cx="27" cy="24" r="1" fill="#666" />
              </g>
            </svg>
          </div>
        </OverlayView>
      </GoogleMap>

      {!isFollowing && (
        <div className="absolute bottom-5 right-16">
          <Button
            onClick={() => setIsFollowing(true)}
            variant="default"
            size="sm"
            spacing="sm"
            className="shadow-lg"
          >
            <Navigation className="size-4" />
            Follow Car
          </Button>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;
