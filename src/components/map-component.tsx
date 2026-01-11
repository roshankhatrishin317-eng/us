"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAppStore, MapLocation } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, ImageIcon, FileText, ChevronLeft, ChevronRight } from "lucide-react";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom heart marker for special locations
const heartIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #d4a5a5 0%, #b4646a 100%);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  "><div style="
    transform: rotate(45deg);
    color: white;
    font-size: 14px;
  ">♥</div></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

// Kathmandu, Nepal coordinates
const KATHMANDU_CENTER: [number, number] = [27.7172, 85.3240];
const DEFAULT_ZOOM = 12;

function FitBounds({ locations }: { locations: MapLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    } else {
      // Default to Kathmandu if no locations
      map.setView(KATHMANDU_CENTER, DEFAULT_ZOOM);
    }
  }, [locations, map]);

  return null;
}

interface LocationDetailProps {
  location: MapLocation;
  onClose: () => void;
}

function LocationDetail({ location, onClose }: LocationDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = location.images || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image Gallery */}
        {images.length > 0 ? (
          <div className="relative h-64 md:h-80 bg-muted">
            <img
              src={images[currentImageIndex]}
              alt={location.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? "w-6 bg-white" : "w-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-primary/40" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-20rem)]">
          {/* Title & Category */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground">{location.title}</h2>
              {location.category && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium shrink-0">
                  {location.category}
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-2">{location.description}</p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            {location.date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date(location.date).toLocaleDateString("en-US", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="font-mono text-xs">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
            </div>
          </div>

          {/* Notes */}
          {location.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="w-4 h-4" />
                <span>Our Notes</span>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-muted-foreground whitespace-pre-wrap">
                {location.notes}
              </div>
            </div>
          )}

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ImageIcon className="w-4 h-4" />
                <span>{images.length} Photos</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MapComponent() {
  const { locations } = useAppStore();
  const hydrated = useStoreHydrated();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  if (!hydrated) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="animate-pulse text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <>
      <MapContainer
        center={KATHMANDU_CENTER}
        zoom={DEFAULT_ZOOM}
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
            icon={location.category === "Special" ? heartIcon : icon}
            eventHandlers={{
              click: () => setSelectedLocation(location),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1 min-w-[200px]">
                {location.images && location.images[0] && (
                  <div className="w-full h-24 rounded-lg overflow-hidden mb-3 -mt-1 -mx-1" style={{ width: "calc(100% + 8px)" }}>
                    <img 
                      src={location.images[0]} 
                      alt={location.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-serif text-lg font-bold text-primary">{location.title}</h3>
                {location.category && (
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs mt-1">
                    {location.category}
                  </span>
                )}
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{location.description}</p>
                {location.date && (
                  <p className="text-xs text-muted-foreground/70 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(location.date).toLocaleDateString()}
                  </p>
                )}
                <button
                  onClick={() => setSelectedLocation(location)}
                  className="w-full mt-3 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        <FitBounds locations={locations} />
      </MapContainer>

      {/* Location Detail Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <LocationDetail
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
