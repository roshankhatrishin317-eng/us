"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight, MapPin, Camera, Lock, Trophy, ListTodo, Hourglass, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

const SPARKLE_POSITIONS = [
  { x: 15, y: 20 }, { x: 85, y: 10 }, { x: 45, y: 80 },
  { x: 70, y: 45 }, { x: 25, y: 60 }, { x: 90, y: 75 },
  { x: 10, y: 90 }, { x: 55, y: 30 }, { x: 35, y: 50 },
  { x: 80, y: 85 }, { x: 5, y: 40 }, { x: 65, y: 15 }
];

function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            y: "100vh",
            x: `${5 + i * 12}vw`,
            rotate: 0,
            scale: 0.5
          }}
          animate={{ 
            opacity: [0, 0.7, 0.7, 0],
            y: "-10vh",
            rotate: [0, 15, -15, 0],
            scale: [0.5, 1, 1, 0.5]
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            delay: i * 2.5,
            ease: "easeInOut"
          }}
          className="absolute"
        >
          <Heart 
            className={`text-primary/30 fill-primary/20 ${i % 3 === 0 ? 'w-8 h-8' : i % 2 === 0 ? 'w-5 h-5' : 'w-3 h-3'}`}
          />
        </motion.div>
      ))}
    </div>
  );
}

function SparkleParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {SPARKLE_POSITIONS.map((pos, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0,
            scale: 0,
          }}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut"
          }}
          className="absolute"
        >
          <Sparkles className="w-3 h-3 text-primary/40" />
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
  const hydrated = useStoreHydrated();
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
      
      {/* Sparkle Particles */}
      <SparkleParticles />
      
      {/* Large Decorative Blurs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.2, 0.15]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[150px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px]" 
      />
      
      <div className="paper-texture" />

      <div className="z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {/* HERO SECTION */}
        <BentoCard className="md:col-span-2 lg:col-span-2 row-span-2 flex flex-col justify-between min-h-[420px] glow-primary relative overflow-visible">
          {/* Animated gradient orb behind text */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 rounded-full blur-3xl"
          />
          
          <div className="space-y-8 relative">
            {/* Badge */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="flex items-center gap-4"
            >
              <motion.div 
                animate={{ 
                  boxShadow: ["0 0 20px rgba(var(--primary), 0.3)", "0 0 40px rgba(var(--primary), 0.5)", "0 0 20px rgba(var(--primary), 0.3)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center shadow-xl backdrop-blur-sm border border-white/20"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="w-7 h-7 text-primary fill-primary/50" />
                </motion.div>
              </motion.div>
              <div className="flex flex-col">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-primary/60" />
                  <span className="text-xs font-bold tracking-[0.25em] text-primary/80 uppercase">
                    Our Love Story
                  </span>
                  <Sparkles className="w-4 h-4 text-primary/60" />
                </motion.div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-[10px] text-muted-foreground/60 tracking-wider mt-1"
                >
                  Since {new Date(settings.relationshipStartDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </motion.span>
              </div>
            </motion.div>
            
            {/* Names with dramatic stagger */}
            <div className="relative">
              <h1 className="font-serif text-6xl md:text-8xl text-foreground tracking-tight leading-[0.85]">
                <motion.span
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
                  className="block bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text"
                >
                  {settings.coupleName.split(" & ")[0]}
                </motion.span>
                
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
                  className="inline-flex items-center justify-center my-2"
                >
                  <span className="relative">
                    <span className="text-4xl md:text-5xl text-primary/30 font-light">&</span>
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="absolute -top-1 -right-3"
                    >
                      <Heart className="w-4 h-4 text-primary/50 fill-primary/30" />
                    </motion.span>
                  </span>
                </motion.span>
                
                <motion.span
                  initial={{ opacity: 0, y: 50, rotateX: 90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 100 }}
                  className="block bg-gradient-to-r from-primary/80 via-foreground to-foreground bg-clip-text"
                >
                  {settings.coupleName.split(" & ")[1]}
                </motion.span>
              </h1>
              
              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="absolute -bottom-4 left-0 h-[2px] w-24 bg-gradient-to-r from-primary/60 to-transparent origin-left"
              />
            </div>
            
            {/* Tagline with typewriter effect feel */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-lg md:text-xl text-muted-foreground/80 font-light max-w-md leading-relaxed italic"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                A digital sanctuary for our shared moments,
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="text-primary/70"
              >
                whispered secrets,
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                and the infinite love between us.
              </motion.span>
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, type: "spring" }}
            className="flex gap-4 mt-8"
          >
             <Button
                asChild
                size="lg"
                className="group glow-primary relative overflow-hidden"
              >
                <Link href="/timeline">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  Begin Our Journey 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
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
