"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, X, ChevronLeft, ChevronRight, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

export default function GalleryPage() {
  const { gallery } = useAppStore();
  const hydrated = useStoreHydrated();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxIndex === null) return;
    const newIndex = direction === "next" 
      ? (lightboxIndex + 1) % gallery.length
      : (lightboxIndex - 1 + gallery.length) % gallery.length;
    setLightboxIndex(newIndex);
  };

  const categories = [...new Set(gallery.map(img => img.category))];

  return (
    <main className="min-h-screen bg-romantic-gradient relative overflow-hidden">
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
        <div className="max-w-7xl mx-auto mb-10 md:mb-14">
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
                {gallery.length} Memories
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground"
            >
              Visual Memories
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl"
            >
              A curated collection of moments frozen in time.
            </motion.p>

            {/* Categories */}
            {categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 pt-4"
              >
                {categories.map((cat) => (
                  <Badge key={cat} variant="romantic" className="text-sm">
                    {cat}
                  </Badge>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        {gallery.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="glass-card rounded-3xl p-12 text-center">
              <Camera className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-foreground mb-2">No Photos Yet</h3>
              <p className="text-muted-foreground">Add photos from the admin panel to see them here.</p>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-5">
            {gallery.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: Math.min(index * 0.08, 0.4), duration: 0.5 }}
                onClick={() => openLightbox(index)}
                className="break-inside-avoid mb-4 md:mb-5 group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl glass-card hover-lift">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] bg-muted">
                    {img.src ? (
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Camera className="w-12 h-12 text-muted-foreground/20" />
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Info on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {img.category}
                      </Badge>
                      <p className="text-white text-sm line-clamp-2">{img.alt}</p>
                    </div>
                    
                    {/* Expand Icon */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-[90vw] max-h-[80vh] aspect-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {gallery[lightboxIndex]?.src && (
                <Image
                  src={gallery[lightboxIndex].src}
                  alt={gallery[lightboxIndex].alt}
                  width={1200}
                  height={800}
                  className="object-contain max-h-[80vh] rounded-lg"
                />
              )}
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <Badge variant="secondary" className="mb-2">
                  {gallery[lightboxIndex]?.category}
                </Badge>
                <p className="text-white text-lg">{gallery[lightboxIndex]?.alt}</p>
              </div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightboxIndex + 1} / {gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
