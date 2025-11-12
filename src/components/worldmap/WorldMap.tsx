import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import type { TRegion } from "@/types/map.type";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const regions: TRegion[] = [
  { id: "Region 1", coordinates: [-100, 40], bookings: 1537 },
  { id: "Region 2", coordinates: [0, 50], bookings: 1537 },
  { id: "Region 3", coordinates: [10, 10], bookings: 1537 },
  { id: "Region 4", coordinates: [100, 50], bookings: 1537 },
];

const WorldMap = () => {
  const [hovered, setHovered] = useState<null | string>(null);
  return (
    <div className="w-[620px] h-fit rounded-[6px] inset-shadow-xs inset-shadow-[#F1F1F1]  shadow-base-light p-4">
      <div className="relative">
        <ComposableMap projectionConfig={{ scale: 160 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} fill="#E0E0E0" stroke="#D6D6DA" />)
            }
          </Geographies>

          {regions?.map((region) => (
            <Marker
              key={region?.id}
              coordinates={region?.coordinates}
              onMouseEnter={() => setHovered(region?.id)}
              onMouseLeave={() => setHovered(null)}
              onTouchStartCapture={() => setHovered(!hovered ? region?.id : null)}
            >
              <circle r={16} fill="#333" stroke="#fff" strokeWidth={2} className="cursor-crosshair" />
              {hovered === region?.id && (
                <foreignObject x={10} y={-40} width={120} height={60}>
                  <div className="bg-gray-800 text-white text-sm p-2 rounded shadow-md ">
                    <strong>{region?.id}</strong>
                    <br />
                    Bookings: {region?.bookings}
                  </div>
                </foreignObject>
              )}
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
};

export default WorldMap;
