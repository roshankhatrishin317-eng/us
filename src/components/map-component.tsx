"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAppStore, MapLocation } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ locations }: { locations: MapLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [locations, map]);

  return null;
}

export default function MapComponent() {
  const { locations } = useAppStore();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="animate-pulse text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      className="w-full h-full"
      style={{ background: "#f0f0f0" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {locations.map((location) => (
        <Marker 
            key={location.id} 
            position={[location.lat, location.lng]} 
            icon={icon}
        >
          <Popup className="font-sans">
            <div className="p-2 text-center">
                <h3 className="font-serif text-lg font-bold text-primary">{location.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{location.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      <FitBounds locations={locations} />
    </MapContainer>
  );
}
