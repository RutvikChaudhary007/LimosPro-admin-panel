// @ts-nocheck

// import React, { useEffect, useState } from "react";
// import {
//   GoogleMap,
//   Marker,
//   Polyline,
//   OverlayView,
//   useJsApiLoader,
//   InfoWindow,
// } from "@react-google-maps/api";

// const containerStyle: React.CSSProperties = { width: "100%", height: "100%", userSelect: "none" };

// const mapStyle = [
//   { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
//   { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
//   { featureType: "water", elementType: "geometry", stylers: [{ color: "#d4f1f9" }] },
//   { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
// ];

// const APIKEY = import.meta.env.VITE_GOOGLE_MAP_KEY;
// const libraries: ("geometry" | "places")[] = ["geometry", "places"];

// interface LatLng {
//   lat: number;
//   lng: number;
// }

// interface Props {
//   dropPosition: LatLng;
//   livePosition: LatLng;
// }

// const CAR_SIZE = 40;

// const LiveTracking: React.FC<Props> = ({ dropPosition, livePosition }) => {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: APIKEY,
//     libraries,
//   });
//  const [activeMarker, setActiveMarker] = useState<string | null>(null);
//   const [carPosition, setCarPosition] = useState<google.maps.LatLngLiteral>(livePosition);
//   const [heading, setHeading] = useState<number>(0);
//   const [isFollowing, setIsFollowing] = useState(true);
//   const [routePath, setRoutePath] = useState<LatLng[]>([livePosition]);

//   // Calculate route using DirectionsService
//   useEffect(() => {
//     if (!isLoaded || !window.google?.maps) return;

//     const directionsService = new google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: livePosition,
//         destination: dropPosition,
//         travelMode: google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === "OK" && result?.routes?.[0]?.overview_path) {
//           const path = result.routes[0].overview_path.map((p) => ({
//             lat: p.lat(),
//             lng: p.lng(),
//           }));
//           setRoutePath(path);
//         } else {
//           console.error("Error fetching directions", result);
//           setRoutePath([livePosition, dropPosition]); // fallback to straight line
//         }
//       }
//     );
//   }, [isLoaded, livePosition, dropPosition]);

//   // Move car along the route
//   useEffect(() => {
//     if (!isLoaded || !window.google?.maps?.geometry || routePath.length === 0) return;

//     let index = 0;
//     const interval = setInterval(() => {
//       setCarPosition((prev) => {
//         if (index >= routePath.length) {
//           clearInterval(interval);
//           return dropPosition;
//         }

//         const next = routePath[index];
//         const h = window.google.maps.geometry.spherical.computeHeading(prev, next);
//         setHeading(h);

//         const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
//           new window.google.maps.LatLng(prev),
//           new window.google.maps.LatLng(next)
//         );
// console.log("distance:",distance)
//         index++;
//         return next;
//       });
//     }, 500);

//     return () => clearInterval(interval);
//   }, [isLoaded, routePath, dropPosition]);

//   if (!isLoaded) return <div>Loading…</div>;

//   return (
//     <div style={{ position: "relative", width: "100%", height: "100%" }}>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={isFollowing ? carPosition : undefined}
//         zoom={12}
//         onDragStart={() => setIsFollowing(false)}
//         options={{
//           styles: mapStyle,
//           disableDefaultUI: true,
//           zoomControl: true,
//           streetViewControl: false,
//           mapTypeControl: false,
//           draggable: true,
//         }}
//       >
//         <Marker position={livePosition} icon={{ url: "/icons/pin.png",
//           scaledSize: new window.google.maps.Size(20, 20),
//           }} 
//           label={"Pickup Point"}
//           onClick={() => setActiveMarker("pickUpClicked")}
//           />
//           {activeMarker === "pickUpClicked" && (
//         <InfoWindow onCloseClick={() => setActiveMarker(null)} position={livePosition}>
//           <div>
//             <strong>Pickup:</strong> 5678 Oak Avenue Austin, TX 73301
//           </div>
//         </InfoWindow>
//       )}
//         <Marker position={dropPosition} icon={{ url: "/icons/pin.png",
//           scaledSize: new window.google.maps.Size(20, 20),
//          }} 
//          label={"Drop Point"}
//         onClick={() => setActiveMarker("dropClicked")}
//          />
//          {activeMarker === "dropClicked" && (
//          <InfoWindow onCloseClick={() => setActiveMarker(null)} position={dropPosition}>
//           <div>
//             <strong>Drop:</strong> John F. Kennedy International Airport (JFK)
//           </div>
//         </InfoWindow>)}

//         <Polyline
//           path={routePath}
//           options={{
//             strokeColor: "#007bff",
//             strokeWeight: 4,
//             strokeOpacity: 0.8,
//           }}
//         />

//         <OverlayView position={carPosition} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
//           <div
//             style={{
//               width: `${CAR_SIZE}px`,
//               height: `${CAR_SIZE}px`,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               transform: `translate(-50%, -50%) rotate(${heading - 135}deg)`,
//               transformOrigin: "center",
//               transition: "transform 0.2s linear",
//               pointerEvents: "none",
//             }}
//           >
//             <img src="/icons/car.png" alt="car" style={{ width: "100%", height: "100%" }} />
//           </div>
//         </OverlayView>
//       </GoogleMap>

//       {!isFollowing && (
//         <button
//           onClick={() => setIsFollowing(true)}
//           style={{
//             position: "absolute",
//             bottom: 20,
//             right: 60,
//             padding: "8px 12px",
//             background: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: 8,
//             cursor: "pointer",
//           }}
//         >
//           Follow Car
//         </button>
//       )}
//     </div>
//   );
// };


// export default LiveTracking;


import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  OverlayView,
  useJsApiLoader,
  InfoWindow,  
} from "@react-google-maps/api";
import { geoDecoding } from "@/utils/googleMaps";

const containerStyle: React.CSSProperties = { width: "100%", height: "100%" };

const mapStyle = [
  { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#d4f1f9" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
];

const APIKEY = import.meta.env.VITE_GOOGLE_MAP_KEY;
const libraries: ("geometry" | "places" | "geocoding")[] = ["geometry", "places","geocoding"];

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

const LiveTracking: React.FC<Props> = ({ dropPosition, pickPosition, externalCarPosition }) => {
  // Load Google Maps script
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: APIKEY,
    libraries,
  });
  const [pickUpAddress, setPickUpAddress] = useState<string | undefined>(undefined);
  const [dropOffAddress, setDropOffAddress] = useState<string | undefined>(undefined);


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
                        if(address2){
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
  const [carPosition, setCarPosition] = useState<LatLng>(externalCarPosition || pickPosition);
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
        const next = new window.google.maps.LatLng(routePath[pathIndexRef.current] || externalCarPosition);
        const h = window.google.maps.geometry.spherical.computeHeading(current, next);
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
      }
    );
  }, [isLoaded, pickPosition, dropPosition]);

  // Smooth animation along the polyline (for now, when WebSocket is not used)
  // useEffect(() => {
  //   if (!isLoaded || !window.google?.maps?.geometry || routePath.length === 0) return;
  //   if (externalCarPosition) return; // skip internal animation if external position is provided

  //   const speed = 50; // meters per second
  //   const step = 16; // ms per frame (~60fps)

  //   const animate = () => {
  //     if (pathIndexRef.current >= routePath.length - 1) return;

  //     const from = new window.google.maps.LatLng(carPosition);
  //     const to = new window.google.maps.LatLng(routePath[pathIndexRef.current + 1]);

  //     const distance = window.google.maps.geometry.spherical.computeDistanceBetween(from, to);
  //     const fraction = (speed * step) / 1000 / distance;

  //     if (fraction >= 1) {
  //       pathIndexRef.current += 1;
  //       setCarPosition(routePath[pathIndexRef.current]);
  //     } else {
  //       const nextPos = window.google.maps.geometry.spherical.interpolate(from, to, fraction);
  //       setCarPosition({ lat: nextPos.lat(), lng: nextPos.lng() });
  //       const h = window.google.maps.geometry.spherical.computeHeading(from, to);
  //       setHeading(h);
  //     }

  //     animationRef.current = requestAnimationFrame(animate);
  //   };

  //   animationRef.current = requestAnimationFrame(animate);
  //   return () => animationRef.current && cancelAnimationFrame(animationRef.current);
  // }, [isLoaded, routePath, carPosition, externalCarPosition]);

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
        {/* Pickup Marker */}
        <Marker
          position={pickPosition}
          icon={{ url: "/icons/pin.png", scaledSize: new window.google.maps.Size(20, 20) }}
          onClick={() => setActiveMarker("pickUpClicked")}
        />
        {activeMarker === "pickUpClicked" && (
          <InfoWindow onCloseClick={() => setActiveMarker(null)} position={pickPosition}>
            <div>
              <strong>Pickup:</strong> {pickUpAddress}
            </div>
          </InfoWindow>
        )}

        {/* Drop Marker */}
        <Marker
          position={dropPosition}
          icon={{ url: "/icons/pin.png", scaledSize: new window.google.maps.Size(20, 20) }}
          onClick={() => setActiveMarker("dropClicked")}
        />
        {activeMarker === "dropClicked" && (
          <InfoWindow onCloseClick={() => setActiveMarker(null)} position={dropPosition}>
            <div>
              <strong>Drop:</strong> {dropOffAddress}
            </div>
          </InfoWindow>
        )}

        {/* Route */}
        <Polyline path={routePath} options={{ strokeColor: "#007bff", strokeWeight: 4, strokeOpacity: 0.8 }} />

        {/* Car */}
        <OverlayView position={carPosition} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
          <div
            style={{
              width: `${CAR_SIZE}px`,
              height: `${CAR_SIZE}px`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `translate(-50%, -50%) rotate(${heading - 135}deg)`,
              transformOrigin: "center",
              transition: "transform 0.1s linear",
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

export default LiveTracking;
