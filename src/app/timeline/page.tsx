"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore, TimelineEvent } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center mb-24 md:mb-32 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Date & Content Side */}
      <div className={`flex-1 text-center ${isEven ? "md:text-right" : "md:text-left"}`}>
        <div className="inline-flex items-center gap-2 text-primary/60 text-sm tracking-widest uppercase mb-2 font-medium">
          <Calendar className="w-4 h-4" />
          {new Date(event.date).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4">
          {event.title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0 inline-block">
          {event.description}
        </p>
      </div>

      {/* Center Line Marker */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className="w-px h-full bg-primary/20 absolute top-0 bottom-0 md:-my-32" />
        <div className="w-4 h-4 rounded-full border-2 border-primary bg-background z-10" />
      </div>

      {/* Image Side */}
      <div className="flex-1 w-full">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-lg shadow-primary/5 group">
           {/* Placeholder for real image */}
           <div className="absolute inset-0 bg-stone-200 flex items-center justify-center text-stone-400 group-hover:scale-105 transition-transform duration-700">
               <span className="sr-only">{event.title}</span>
               <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TimelinePage() {
  const { timeline } = useAppStore();
  const hydrated = useHydrated();

  const sortedTimeline = [...timeline].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-romantic-gradient p-6 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-romantic-radial" />
        <div className="paper-texture" />
        {/* Background Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent -translate-x-1/2 hidden md:block" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-20 text-center space-y-4">
            <Button
                asChild
                variant="ghost"
                className="hover:bg-transparent hover:text-primary transition-colors text-muted-foreground mb-4"
            >
                <Link href="/">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back Home
                </Link>
            </Button>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-5xl md:text-7xl text-foreground tracking-tight"
            >
                Our Journey
            </motion.h1>
             <motion.div 
                 initial={{ scaleX: 0 }}
                 animate={{ scaleX: 1 }}
                 transition={{ delay: 0.5, duration: 1 }}
                 className="h-1 w-24 bg-primary/20 mx-auto rounded-full"
             />
        </div>

        <div className="mt-12">
          {sortedTimeline.map((event, index) => (
            <TimelineItem key={event.id} event={event} index={index} />
          ))}
        </div>
        
        <div className="h-32 flex items-center justify-center text-muted-foreground/40 font-serif italic">
            To be continued...
        </div>
      </div>
    </main>
  );
}
