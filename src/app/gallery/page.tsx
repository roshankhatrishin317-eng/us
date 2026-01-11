"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

export default function GalleryPage() {
  const { gallery } = useAppStore();
  const hydrated = useStoreHydrated();

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-romantic-gradient p-6 md:p-12 relative">
       <div className="absolute inset-0 bg-romantic-radial" />
       <div className="paper-texture" />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-4">
          <Button
            asChild
            variant="ghost"
            className="pl-0 hover:bg-transparent hover:text-primary transition-colors text-muted-foreground"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
            </Link>
          </Button>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-7xl text-foreground tracking-tight"
          >
            Visual Memories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-xl"
          >
            A curated collection of moments frozen in time.
          </motion.p>
        </div>
      </div>

      {/* Masonry Grid Simulation using CSS Columns */}
      <div className="max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 relative z-10">
        {gallery.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            className="break-inside-avoid relative group overflow-hidden rounded-2xl bg-muted"
          >
            <div className="aspect-[3/4] md:aspect-auto w-full relative">
               {/* In a real app, use Next.js Image. Using div for placeholder simplicity if images don't exist */}
               <div className="w-full h-full bg-stone-200 min-h-[300px] object-cover transition-transform duration-700 group-hover:scale-105 flex items-center justify-center text-stone-400">
                  <span className="sr-only">{img.alt}</span>
                  {/* Placeholder Visual */}
                  <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               </div>
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/60 to-transparent text-white">
              <p className="font-serif text-xl">{img.category}</p>
              <p className="text-sm opacity-80">{img.alt}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
