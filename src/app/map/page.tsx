"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, List, X, Search, Heart, Plane, Home, Utensils, Mountain, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <p className="text-muted-foreground font-medium">Loading our world...</p>
      </div>
    </div>
  ),
});

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "First Date": <Heart className="w-4 h-4" />,
  "Travel": <Plane className="w-4 h-4" />,
  "Special": <Sparkles className="w-4 h-4" />,
  "Home": <Home className="w-4 h-4" />,
  "Restaurant": <Utensils className="w-4 h-4" />,
  "Adventure": <Mountain className="w-4 h-4" />,
};

export default function MapPage() {
  const { locations } = useAppStore();
  const hydrated = useStoreHydrated();
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => 
    [...new Set(locations.map(loc => loc.category).filter(Boolean))] as string[],
    [locations]
  );

  const filteredLocations = useMemo(() => {
    let result = locations;
    if (activeCategory) {
      result = result.filter(loc => loc.category === activeCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(loc => 
        loc.title.toLowerCase().includes(query) || 
        loc.description?.toLowerCase().includes(query)
      );
    }
    return result;
  }, [locations, activeCategory, searchQuery]);

  return (
    <main className="h-screen w-full relative flex flex-col overflow-hidden">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 z-[999] pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-60" />
      </div>

      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto pointer-events-auto">
            {/* Back Button */}
            <Button
              asChild
              variant="secondary"
              className="bg-white/90 backdrop-blur-md shadow-lg hover:bg-white text-foreground rounded-full px-5 h-11 border border-white/50"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Link>
            </Button>
            
            {/* Center Title */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md shadow-lg px-6 py-3 rounded-full border border-white/50"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <div className="text-left">
                <h1 className="font-serif text-lg text-foreground leading-tight">Our Journey</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {hydrated ? `${locations.length} memories pinned` : "Loading..."}
                </p>
              </div>
            </motion.div>

            {/* Toggle Sidebar Button */}
            <Button
              variant="secondary"
              onClick={() => setShowSidebar(!showSidebar)}
              className="bg-white/90 backdrop-blur-md shadow-lg hover:bg-white text-foreground rounded-full h-11 w-11 p-0 border border-white/50"
            >
              {showSidebar ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills - Bottom */}
      {hydrated && categories.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto"
        >
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md shadow-xl px-2 py-2 rounded-full border border-white/50">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeCategory === null
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">All</span>
              <span className="text-xs opacity-70">({locations.length})</span>
            </button>
            {categories.slice(0, 5).map((cat) => {
              const count = locations.filter(loc => loc.category === cat).length;
              const Icon = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {Icon || <MapPin className="w-4 h-4" />}
                  <span className="hidden sm:inline">{cat}</span>
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Floating Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 w-full sm:w-96 z-[1001] pointer-events-auto"
          >
            <div className="h-full bg-white/95 backdrop-blur-xl shadow-2xl border-l border-white/50 flex flex-col">
              {/* Sidebar Header */}
              <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl text-foreground">Locations</h2>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowSidebar(false)}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search places..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Location List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredLocations.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No locations found</p>
                  </div>
                ) : (
                  filteredLocations.map((location, idx) => (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all overflow-hidden cursor-pointer"
                    >
                      <div className="flex gap-3 p-3">
                        {/* Thumbnail */}
                        {location.images && location.images[0] ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
                            <img 
                              src={location.images[0]} 
                              alt={location.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-6 h-6 text-primary/40" />
                          </div>
                        )}
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-foreground truncate">{location.title}</h3>
                            {location.category && (
                              <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                {CATEGORY_ICONS[location.category] || <MapPin className="w-3 h-3 text-primary" />}
                              </span>
                            )}
                          </div>
                          {location.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{location.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground/70">
                            <span className="font-mono">{location.lat.toFixed(2)}, {location.lng.toFixed(2)}</span>
                            {location.date && (
                              <>
                                <span>•</span>
                                <span>{new Date(location.date).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t bg-muted/30">
                <p className="text-xs text-center text-muted-foreground">
                  {filteredLocations.length} of {locations.length} places shown
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map */}
      <div className="flex-1 w-full h-full relative z-0">
        <MapComponent activeCategory={activeCategory} />
      </div>

      {/* Mobile Title (shown on small screens) */}
      <div className="absolute top-20 left-4 z-[999] md:hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/90 backdrop-blur-md shadow-lg px-4 py-2 rounded-2xl border border-white/50"
        >
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{hydrated ? locations.length : "..."}</span> memories
          </p>
        </motion.div>
      </div>
    </main>
  );
}
