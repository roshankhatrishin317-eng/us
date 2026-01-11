"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Calendar, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore, TimelineEvent } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="relative mb-16 md:mb-24 last:mb-0"
    >
      {/* Connection Line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2">
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="h-full w-full bg-gradient-to-b from-primary/30 to-primary/10 origin-top"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y, scale }}
        className={`flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        {/* Date Marker */}
        <div className="flex items-center gap-4 md:hidden pl-12">
          <Badge variant="glow" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </Badge>
        </div>

        {/* Text Content */}
        <div className={`flex-1 pl-12 md:pl-0 ${isEven ? "md:text-right md:pr-16" : "md:text-left md:pl-16"}`}>
          <motion.div
            initial={{ opacity: 0, x: isEven ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className={`hidden md:flex items-center gap-2 text-primary/60 text-sm tracking-wider uppercase mb-3 ${isEven ? "justify-end" : "justify-start"}`}>
              <Calendar className="w-4 h-4" />
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <h2 className="text-2xl md:text-4xl font-serif text-foreground mb-3 leading-tight">
              {event.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md text-base">
              {event.description}
            </p>
          </motion.div>
        </div>

        {/* Center Marker */}
        <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.1 }}
            className="relative"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center shadow-lg shadow-primary/10">
              <Heart className="w-5 h-5 text-primary fill-primary/30" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border border-primary/30"
            />
          </motion.div>
        </div>

        {/* Image */}
        <div className="flex-1 w-full pl-12 md:pl-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="glass-card rounded-2xl overflow-hidden hover-lift">
              <div className="relative aspect-[4/3] bg-muted">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <div className="text-center">
                      <Heart className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
                      <span className="text-sm text-muted-foreground/40">Memory #{index + 1}</span>
                    </div>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            
            {/* Floating Number */}
            <div className={`absolute -bottom-4 ${isEven ? "-left-4" : "-right-4"} hidden md:flex`}>
              <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-lg shadow-lg shadow-primary/30">
                {index + 1}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TimelinePage() {
  const { timeline } = useAppStore();
  const hydrated = useStoreHydrated();

  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

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
    <main className="min-h-screen bg-romantic-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-romantic-radial" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[100px]"
      />
      
      <div className="paper-texture" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              asChild
              variant="ghost"
              className="hover:bg-transparent hover:text-primary text-muted-foreground"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Badge variant="glow" className="mx-auto">
              <Sparkles className="w-3 h-3 mr-1" />
              {sortedTimeline.length} Milestones
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground">
              Our Journey
            </h1>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1 w-20 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 mx-auto rounded-full"
            />
            
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Every moment together is a chapter in our love story.
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        {sortedTimeline.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-card rounded-3xl p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-foreground mb-2">No Memories Yet</h3>
              <p className="text-muted-foreground">Add timeline events from the admin panel to see them here.</p>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {sortedTimeline.map((event, index) => (
              <TimelineItem 
                key={event.id} 
                event={event} 
                index={index}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mt-16 md:mt-24 text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-primary/20" />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-6 h-6 text-primary/40 fill-primary/20" />
            </motion.div>
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-primary/20" />
          </div>
          <p className="text-muted-foreground/50 font-serif italic mt-4 text-lg">
            To be continued...
          </p>
        </motion.div>
      </div>
    </main>
  );
}
