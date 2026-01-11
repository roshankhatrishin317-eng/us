"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { MAP_LOCATIONS } from "@/lib/data";

// Fix for default Leaflet marker icons not loading in Next.js
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapView() {
  // Center map on the first location or a default
  const defaultCenter: [number, number] = MAP_LOCATIONS.length > 0
    ? [MAP_LOCATIONS[0].lat, MAP_LOCATIONS[0].lng]
    : [40.7128, -74.0060];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={3}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {MAP_LOCATIONS.map((loc) => (
        <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={customIcon}
        >
          <Popup className="font-sans">
            <div className="text-center p-2">
                <h3 className="font-serif text-lg font-bold text-primary">{loc.title}</h3>
                <p className="text-sm text-muted-foreground">{loc.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
