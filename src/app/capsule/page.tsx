"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Unlock, Hourglass, Heart, Sparkles, Gift, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";
import confetti from "canvas-confetti";

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass-card rounded-2xl p-4 md:p-6 text-center relative overflow-hidden"
    >
      <motion.div
        key={value}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl md:text-5xl font-serif font-bold text-foreground tabular-nums"
      >
        {value.toString().padStart(2, "0")}
      </motion.div>
      <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">
        {label}
      </div>
    </motion.div>
  );
}

export default function CapsulePage() {
  const { capsule } = useAppStore();
  const hydrated = useStoreHydrated();
  const [timeLeft, setTimeLeft] = useState<{days: number; hours: number; minutes: number; seconds: number} | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    
    const calculateTime = () => {
      const unlockDate = new Date(capsule.unlockDate).getTime();
      const now = Date.now();
      const difference = unlockDate - now;

      if (difference <= 0) {
        setIsUnlocked(true);
        setTimeLeft(null);
      } else {
        setIsUnlocked(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [hydrated, capsule.unlockDate]);

  const handleReveal = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 },
      colors: ["#c87882", "#a885b5", "#d4a574", "#fff"]
    });
    setShowContent(true);
  };

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Heart className="w-8 h-8 text-primary/50 fill-primary/30" />
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-romantic-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-romantic-radial" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] right-[-15%] w-[500px] h-[500px] bg-violet-200/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute bottom-[-20%] left-[-15%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]"
      />
      
      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5
          }}
          className="absolute"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`
          }}
        >
          <Sparkles className="w-4 h-4 text-primary/30" />
        </motion.div>
      ))}
      
      <div className="paper-texture" />
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button asChild variant="ghost" className="hover:bg-transparent hover:text-primary text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="mr-2 w-4 h-4" /> Home
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-10"
            >
              {/* Lock Icon */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-40 h-40 mx-auto"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-100 via-primary/10 to-secondary/20 shadow-xl" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-3 rounded-full border border-dashed border-primary/30"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-6 rounded-full border border-dotted border-secondary/40"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Lock className="w-14 h-14 text-muted-foreground/50" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Title */}
              <div className="space-y-3">
                <Badge variant="glow" className="mx-auto">
                  <Hourglass className="w-3 h-3 mr-1" />
                  Sealed Memory
                </Badge>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground">
                  Time Capsule
                </h1>
                <p className="text-muted-foreground flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Opens on {new Date(capsule.unlockDate).toLocaleDateString("en-US", { 
                    month: "long", 
                    day: "numeric", 
                    year: "numeric" 
                  })}
                </p>
              </div>

              {/* Countdown */}
              {timeLeft && (
                <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto">
                  <CountdownUnit value={timeLeft.days} label="Days" />
                  <CountdownUnit value={timeLeft.hours} label="Hours" />
                  <CountdownUnit value={timeLeft.minutes} label="Mins" />
                  <CountdownUnit value={timeLeft.seconds} label="Secs" />
                </div>
              )}
              
              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-2xl p-6 inline-flex items-center gap-3"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-5 h-5 text-primary fill-primary/30" />
                </motion.div>
                <span className="text-sm text-muted-foreground font-medium">
                  Good things come to those who wait...
                </span>
              </motion.div>
            </motion.div>
          ) : !showContent ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative w-32 h-32 mx-auto"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 animate-glow" />
                <div className="absolute inset-2 rounded-full bg-white/80 flex items-center justify-center">
                  <Gift className="w-12 h-12 text-primary" />
                </div>
              </motion.div>
              
              <div className="space-y-4">
                <Badge variant="glow" className="mx-auto">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Ready to Open!
                </Badge>
                <h1 className="font-serif text-4xl md:text-5xl text-primary">
                  The Wait is Over
                </h1>
                <p className="text-muted-foreground">Your memory is ready to be revealed.</p>
              </div>
              
              <Button onClick={handleReveal} size="lg" className="rounded-full text-lg px-8 glow-primary">
                <Unlock className="w-5 h-5 mr-2" />
                Reveal Memory
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Badge variant="glow" className="mx-auto">
                <Heart className="w-3 h-3 mr-1 fill-primary" />
                Memory Unlocked
              </Badge>
              
              <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
                {/* Top Gradient Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
                
                {/* Message */}
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground italic">
                  &quot;{capsule.message}&quot;
                </p>
                
                {/* Image */}
                {capsule.image && (
                  <div className="mt-8 pt-8 border-t border-dashed border-primary/20">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden">
                      <Image
                        src={capsule.image}
                        alt="Time Capsule Memory"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                
                {/* Date */}
                <div className="mt-6 text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Sealed until {new Date(capsule.unlockDate).toLocaleDateString()}
                </div>
              </div>
              
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/">
                  <Heart className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
