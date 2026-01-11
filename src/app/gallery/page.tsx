"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, X, ChevronLeft, ChevronRight, Heart, Sparkles, Grid3X3, LayoutGrid, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

type ViewMode = "masonry" | "grid";

export default function GalleryPage() {
  const { gallery } = useAppStore();
  const hydrated = useStoreHydrated();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");

  const categories = useMemo(() => 
    [...new Set(gallery.map(img => img.category).filter(Boolean))],
    [gallery]
  );

  const filteredGallery = useMemo(() => 
    activeCategory 
      ? gallery.filter(img => img.category === activeCategory)
      : gallery,
    [gallery, activeCategory]
  );

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  
  const navigateLightbox = useCallback((direction: "prev" | "next") => {
    if (lightboxIndex === null) return;
    const newIndex = direction === "next" 
      ? (lightboxIndex + 1) % filteredGallery.length
      : (lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length;
    setLightboxIndex(newIndex);
  }, [lightboxIndex, filteredGallery.length]);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === "ArrowLeft") navigateLightbox("prev");
    if (e.key === "ArrowRight") navigateLightbox("next");
    if (e.key === "Escape") closeLightbox();
  }, [lightboxIndex, navigateLightbox, closeLightbox]);

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Heart className="w-8 h-8 text-primary/50 fill-primary/30" />
        </motion.div>
      </main>
    );
  }

  return (
    <main 
      className="min-h-screen bg-romantic-gradient relative overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-romantic-radial" />
      
      {/* Animated Background Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
      />
      
      <div className="paper-texture" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              asChild
              variant="ghost"
              className="pl-0 hover:bg-transparent hover:text-primary text-muted-foreground"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
              </Link>
            </Button>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* Title Section */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-amber-700" />
                </div>
                <Badge variant="glow">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {filteredGallery.length} {filteredGallery.length === 1 ? "Memory" : "Memories"}
                </Badge>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground"
              >
                Visual Memories
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground max-w-md"
              >
                Moments frozen in time, curated with love.
              </motion.p>
            </div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* View Toggle */}
              <div className="flex items-center glass-card rounded-full p-1">
                <button
                  onClick={() => setViewMode("masonry")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === "masonry" 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Masonry</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === "grid" 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mt-8 flex-wrap"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span>Filter:</span>
              </div>
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === null
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-white/50 text-muted-foreground hover:bg-white/80 hover:text-foreground"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-white/50 text-muted-foreground hover:bg-white/80 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Gallery Grid */}
        <AnimatePresence mode="wait">
          {filteredGallery.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto"
            >
              <div className="glass-card rounded-3xl p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="font-serif text-2xl text-foreground mb-2">
                  {activeCategory ? `No photos in "${activeCategory}"` : "No Photos Yet"}
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {activeCategory 
                    ? "Try selecting a different category or view all photos."
                    : "Add photos from the admin panel to see them here."}
                </p>
                {activeCategory && (
                  <Button
                    variant="outline"
                    onClick={() => setActiveCategory(null)}
                    className="mt-6"
                  >
                    View All Photos
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`gallery-${viewMode}-${activeCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`max-w-7xl mx-auto ${
                viewMode === "masonry"
                  ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
                  : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              }`}
            >
              {filteredGallery.map((img, index) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.4 }}
                  onClick={() => openLightbox(index)}
                  className={`group cursor-pointer ${
                    viewMode === "masonry" ? "break-inside-avoid mb-4" : ""
                  }`}
                >
                  <div className="relative overflow-hidden rounded-2xl glass-card hover-lift">
                    {/* Image Container */}
                    <div className={`relative bg-muted ${
                      viewMode === "masonry" 
                        ? index % 3 === 0 ? "aspect-[3/4]" : index % 3 === 1 ? "aspect-square" : "aspect-[4/3]"
                        : "aspect-square"
                    }`}>
                      {img.src ? (
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                          <Camera className="w-12 h-12 text-muted-foreground/20" />
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Info on Hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        {img.category && (
                          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-2">
                            {img.category}
                          </span>
                        )}
                        <p className="text-white text-sm font-medium line-clamp-2">{img.alt}</p>
                      </div>
                      
                      {/* Heart Icon */}
                      <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            onClick={closeLightbox}
          >
            {/* Full Black Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black"
            />
            
            {/* Ambient Glow */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(180,100,130,0.5) 0%, transparent 60%)"
              }}
            />

            {/* Header Bar */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6"
            >
              {/* Counter */}
              <div className="flex items-center gap-3">
                <span className="text-white/90 text-base md:text-lg font-medium tabular-nums">
                  {lightboxIndex + 1} <span className="text-white/40 mx-1">/</span> {filteredGallery.length}
                </span>
                {filteredGallery[lightboxIndex]?.category && (
                  <span className="hidden sm:inline-block px-3 py-1 bg-white/10 rounded-full text-white/60 text-sm">
                    {filteredGallery[lightboxIndex].category}
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Close"
              >
                <X className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </motion.div>

            {/* Main Image Area */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pt-20 pb-32 md:p-8 md:pt-24 md:pb-36">
              {/* Navigation - Previous */}
              {filteredGallery.length > 1 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
                  className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-50 h-14 w-14 md:h-16 md:w-16 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-8 h-8 md:w-9 md:h-9" />
                </motion.button>
              )}

              {/* Image */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative max-w-full max-h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {filteredGallery[lightboxIndex]?.src && (
                  <img
                    src={filteredGallery[lightboxIndex].src}
                    alt={filteredGallery[lightboxIndex].alt}
                    className="max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-12rem)] max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-12rem)] w-auto h-auto object-contain rounded-xl shadow-2xl"
                    draggable={false}
                  />
                )}
              </motion.div>

              {/* Navigation - Next */}
              {filteredGallery.length > 1 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
                  className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-50 h-14 w-14 md:h-16 md:w-16 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-sm"
                  aria-label="Next"
                >
                  <ChevronRight className="w-8 h-8 md:w-9 md:h-9" />
                </motion.button>
              )}
            </div>
            
            {/* Bottom Caption Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/80 to-transparent"
            >
              <div className="px-6 pt-12 pb-6 md:pb-8">
                {/* Caption */}
                <p className="text-white text-center text-lg md:text-xl font-serif max-w-3xl mx-auto leading-relaxed">
                  {filteredGallery[lightboxIndex]?.alt}
                </p>

                {/* Thumbnail Strip / Dots */}
                {filteredGallery.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    {filteredGallery.length <= 10 ? (
                      // Show thumbnail dots for <= 10 images
                      filteredGallery.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                          className={`rounded-full transition-all duration-300 ${
                            idx === lightboxIndex 
                              ? "w-10 h-2 bg-white" 
                              : "w-2 h-2 bg-white/40 hover:bg-white/70"
                          }`}
                          aria-label={`View image ${idx + 1}`}
                        />
                      ))
                    ) : (
                      // Show simple counter for > 10 images
                      <div className="flex items-center gap-4 text-white/60 text-sm">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
                          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          Previous
                        </button>
                        <span className="tabular-nums">{lightboxIndex + 1} of {filteredGallery.length}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
                          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
