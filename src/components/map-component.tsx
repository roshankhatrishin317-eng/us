"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAppStore, MapLocation } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, ImageIcon, FileText, ChevronLeft, ChevronRight, Heart, ExternalLink } from "lucide-react";

// Kathmandu, Nepal coordinates
const KATHMANDU_CENTER: [number, number] = [27.7172, 85.3240];
const DEFAULT_ZOOM = 12;

// Create custom markers
const createMarkerIcon = (category?: string) => {
  const isSpecial = category === "Special" || category === "First Date";
  
  if (isSpecial) {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #e879a0 0%, #c94b7a 100%);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 15px rgba(201,75,122,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s infinite;
      "><div style="
        transform: rotate(45deg);
        color: white;
        font-size: 16px;
      ">♥</div></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  }
  
  // Default elegant marker
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #6b7280 0%, #374151 100%);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    "><div style="
      transform: rotate(45deg);
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
    "></div></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

function FitBounds({ locations }: { locations: MapLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 14 });
    } else {
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && images.length > 1) {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight" && images.length > 1) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, images.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image Gallery */}
        {images.length > 0 ? (
          <div className="relative h-72 md:h-96 bg-muted overflow-hidden">
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={images[currentImageIndex]}
              alt={location.title}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-white drop-shadow-lg">{location.title}</h2>
                  {location.category && (
                    <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                      {location.category}
                    </span>
                  )}
                </div>
                <div className="text-white/80 text-sm flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  {currentImageIndex + 1}/{images.length}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-40 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <MapPin className="w-8 h-8 text-primary/50" />
              </div>
              <h2 className="font-serif text-2xl text-foreground">{location.title}</h2>
              {location.category && (
                <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {location.category}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8 space-y-5 overflow-y-auto max-h-[calc(90vh-24rem)]">
          {/* Description */}
          {location.description && (
            <p className="text-muted-foreground leading-relaxed">{location.description}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            {location.date && (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-foreground">{new Date(location.date).toLocaleDateString("en-US", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
            </div>
            <a 
              href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-xl text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">Open in Maps</span>
            </a>
          </div>

          {/* Notes */}
          {location.notes && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="w-4 h-4 text-primary" />
                <span>Our Memory</span>
              </div>
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-5 text-muted-foreground leading-relaxed whitespace-pre-wrap border border-muted">
                {location.notes}
              </div>
            </div>
          )}

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>{images.length} Photos</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
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

interface MapComponentProps {
  activeCategory?: string | null;
}

export default function MapComponent({ activeCategory }: MapComponentProps) {
  const { locations } = useAppStore();
  const hydrated = useStoreHydrated();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);

  const filteredLocations = activeCategory 
    ? locations.filter(loc => loc.category === activeCategory)
    : locations;

  if (!hydrated) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading memories...</p>
        </div>
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
        style={{ background: "#faf5f0" }}
      >
        {/* Romantic warm-toned map style */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {filteredLocations.map((location) => (
          <Marker 
            key={location.id} 
            position={[location.lat, location.lng]} 
            icon={createMarkerIcon(location.category)}
            eventHandlers={{
              click: () => setSelectedLocation(location),
            }}
          >
            <Popup className="custom-popup">
              <div className="min-w-[220px] -m-3">
                {location.images && location.images[0] && (
                  <div className="w-full h-28 overflow-hidden">
                    <img 
                      src={location.images[0]} 
                      alt={location.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-serif text-base font-bold text-foreground">{location.title}</h3>
                  {location.category && (
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] mt-1.5 font-medium">
                      {location.category}
                    </span>
                  )}
                  {location.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{location.description}</p>
                  )}
                  {location.date && (
                    <p className="text-[10px] text-muted-foreground/70 mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(location.date).toLocaleDateString()}
                    </p>
                  )}
                  <button
                    onClick={() => setSelectedLocation(location)}
                    className="w-full mt-3 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
                  >
                    View Memory
                    <Heart className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <FitBounds locations={filteredLocations} />
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
