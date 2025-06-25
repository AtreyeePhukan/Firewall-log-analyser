import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import L from "leaflet";
import { useEffect } from "react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView() {
  const center = [20.5937, 78.9629]; // India

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100); 
  }, []);

  return (
    <Card className="bg-zinc-800 text-white shadow-lg">
      <CardHeader>
        <CardTitle>Geographic Activity</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] p-0 rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={4}
          scrollWheelZoom={false}
          className="h-full w-full z-0 rounded-md"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>Sample Marker (India)</Popup>
          </Marker>
        </MapContainer>
      </CardContent>
    </Card>
  );
}






// import { ComposableMap, Geographies, Geography } from "react-simple-maps"

// const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// export default function MapView() {
//   return (
//     <div className="mt-8 mx-auto w-full max-w-4xl h-64">
//       <ComposableMap projectionConfig={{ scale: 120 }}>
//         <Geographies geography={geoUrl}>
//           {({ geographies }) =>
//             geographies.map((geo) => (
//               <Geography
//                 key={geo.rsmKey}
//                 geography={geo}
//                 style={{
//                   default: {
//                     fill: "#334155",
//                     stroke: "#94a3b8",
//                     strokeWidth: 0.5,
//                   },
//                   hover: {
//                     fill: "#64748b",
//                   },
//                 }}
//               />
//             ))
//           }
//         </Geographies>
//       </ComposableMap>
//     </div>
//   )
// }