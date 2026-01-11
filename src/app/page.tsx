"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight, MapPin, Camera, Lock, Trophy, ListTodo, Hourglass, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            y: "100vh",
            x: `${10 + i * 15}vw`
          }}
          animate={{ 
            opacity: [0, 0.6, 0.6, 0],
            y: "-10vh",
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            delay: i * 3,
            ease: "linear"
          }}
          className="absolute"
        >
          <Heart 
            className={`text-primary/20 fill-primary/10 ${i % 2 === 0 ? 'w-6 h-6' : 'w-4 h-4'}`}
          />
        </motion.div>
      ))}
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span 
        key={value}
        initial={{ opacity: 0.5, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-4xl md:text-5xl font-serif text-primary font-bold tabular-nums"
      >
        {value.toString().padStart(2, "0")}
      </motion.span>
      <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  );
}

function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative overflow-hidden rounded-[2rem] glass-card p-8 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { settings } = useAppStore();
  const hydrated = useHydrated();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!hydrated) return;
    const calculateTime = () => {
      const start = new Date(settings.relationshipStartDate).getTime();
      const now = new Date().getTime();
      const difference = now - start;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();

    return () => clearInterval(timer);
  }, [hydrated, settings.relationshipStartDate]);

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-romantic-gradient">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-romantic-radial" />
      
      {/* Floating Hearts */}
      <FloatingHearts />
      
      {/* Large Decorative Blurs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-soft" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[150px] animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      
      <div className="paper-texture" />

      <div className="z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {/* HERO SECTION */}
        <BentoCard className="md:col-span-2 lg:col-span-2 row-span-2 flex flex-col justify-between min-h-[420px] glow-primary">
          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                <Heart className="w-6 h-6 text-primary fill-primary/30 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary/40" />
                <span className="text-xs font-bold tracking-[0.2em] text-primary/60 uppercase">
                  Our Love Story
                </span>
              </div>
            </motion.div>
            
            <h1 className="font-serif text-5xl md:text-7xl text-foreground tracking-tight leading-[0.9]">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="block"
              >
                {settings.coupleName.split(" & ")[0]}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-primary/40 mx-2"
              >
                &
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="block"
              >
                {settings.coupleName.split(" & ")[1]}
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-muted-foreground font-light max-w-md leading-relaxed"
            >
              A digital sanctuary for our shared moments, whispered secrets, and the infinite love between us.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex gap-4 mt-8"
          >
             <Button
                asChild
                size="lg"
                className="group glow-primary"
              >
                <Link href="/timeline">
                  Begin Our Journey 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
          </motion.div>
        </BentoCard>

        {/* TIMER SECTION */}
        <BentoCard className="md:col-span-1 lg:col-span-2 flex flex-col items-center justify-center" delay={0.2}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
          <div className="grid grid-cols-4 gap-4 w-full relative">
            <CountdownUnit value={timeLeft.days} label="Days" />
            <CountdownUnit value={timeLeft.hours} label="Hrs" />
            <CountdownUnit value={timeLeft.minutes} label="Mins" />
            <CountdownUnit value={timeLeft.seconds} label="Secs" />
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs font-medium tracking-[0.25em] text-muted-foreground/60 uppercase text-center">
            <Heart className="w-3 h-3 fill-primary/30 text-primary/50" />
            Together Forever
            <Heart className="w-3 h-3 fill-primary/30 text-primary/50" />
          </div>
        </BentoCard>

        {/* MAP LINK */}
        <BentoCard className="md:col-span-1 group cursor-pointer hover:glow-secondary" delay={0.3}>
            <Link href="/map" className="absolute inset-0 z-20" />
            <div className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-secondary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all -rotate-45" />
                </div>
                <div>
                    <h3 className="font-serif text-2xl text-foreground group-hover:text-secondary transition-colors">Locations</h3>
                    <p className="text-sm text-muted-foreground mt-1">Our global footprint.</p>
                </div>
            </div>
        </BentoCard>

        {/* GALLERY LINK */}
        <BentoCard className="md:col-span-1 lg:col-span-1 group cursor-pointer" delay={0.35}>
             <Link href="/gallery" className="absolute inset-0 z-20" />
             <div className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5 text-foreground/60" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-foreground/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all -rotate-45" />
                </div>
                 <div>
                    <h3 className="font-serif text-2xl text-foreground">Gallery</h3>
                    <p className="text-sm text-muted-foreground mt-1">Visual memories.</p>
                </div>
            </div>
        </BentoCard>

        {/* QUIZ LINK */}
        <BentoCard className="md:col-span-1 group cursor-pointer bg-gradient-to-br from-amber-50/50 to-transparent" delay={0.4}>
             <Link href="/quiz" className="absolute inset-0 z-20" />
             <div className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200/50 to-amber-100/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Trophy className="w-5 h-5 text-amber-600" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-amber-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all -rotate-45" />
                </div>
                 <div>
                    <h3 className="font-serif text-2xl text-foreground group-hover:text-amber-700 transition-colors">Love Quiz</h3>
                    <p className="text-sm text-muted-foreground mt-1">Test your knowledge.</p>
                </div>
            </div>
        </BentoCard>

        {/* BUCKET LIST LINK */}
        <BentoCard className="md:col-span-1 group cursor-pointer bg-gradient-to-br from-emerald-50/50 to-transparent" delay={0.45}>
             <Link href="/bucket-list" className="absolute inset-0 z-20" />
             <div className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-200/50 to-emerald-100/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ListTodo className="w-5 h-5 text-emerald-600" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-emerald-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all -rotate-45" />
                </div>
                 <div>
                    <h3 className="font-serif text-2xl text-foreground group-hover:text-emerald-700 transition-colors">Bucket List</h3>
                    <p className="text-sm text-muted-foreground mt-1">Shared dreams.</p>
                </div>
            </div>
        </BentoCard>

        {/* CAPSULE LINK */}
        <BentoCard className="md:col-span-1 group cursor-pointer bg-gradient-to-br from-violet-50/50 to-transparent" delay={0.5}>
             <Link href="/capsule" className="absolute inset-0 z-20" />
             <div className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-200/50 to-violet-100/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all">
                        <Hourglass className="w-5 h-5 text-violet-600" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground/20 group-hover:text-violet-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all -rotate-45" />
                </div>
                 <div>
                    <h3 className="font-serif text-2xl text-foreground group-hover:text-violet-700 transition-colors">Time Capsule</h3>
                    <p className="text-sm text-muted-foreground mt-1">Locked until 2026.</p>
                </div>
            </div>
        </BentoCard>

        {/* VAULT LINK */}
        <BentoCard className="md:col-span-3 lg:col-span-1 lg:row-span-1 group cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40" delay={0.55}>
            <Link href="/vault" className="absolute inset-0 z-20" />
            <div className="h-full flex flex-row lg:flex-col items-center lg:items-start justify-between gap-4">
                 <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                    <Lock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left lg:text-left flex-1">
                    <h3 className="font-serif text-xl text-primary">The Vault</h3>
                    <p className="text-xs text-primary/50 mt-1">Secret surprises await.</p>
                </div>
                 <ArrowRight className="w-5 h-5 text-primary/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
        </BentoCard>
      </div>
    </main>
  );
}
