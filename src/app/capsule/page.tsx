"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Timer, Hourglass } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

export default function CapsulePage() {
  const { capsule } = useAppStore();
  const hydrated = useStoreHydrated();
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    const calculateTime = () => {
      const unlockDate = new Date(capsule.unlockDate).getTime();
      const now = new Date().getTime();
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

    const timer = setInterval(calculateTime, 1000);
    calculateTime();

    return () => clearInterval(timer);
  }, [hydrated, capsule.unlockDate]);

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-romantic-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-romantic-radial" />
      <div className="paper-texture" />
      
      <div className="absolute top-6 left-6 z-20">
        <Button asChild variant="ghost" className="hover:bg-transparent hover:text-primary transition-colors text-muted-foreground">
            <Link href="/">
            <ArrowLeft className="mr-2 w-4 h-4" /> Home
            </Link>
        </Button>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {!isUnlocked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
             <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.1)] flex items-center justify-center relative">
                 <div className="absolute inset-2 rounded-full border border-dashed border-gray-300 animate-[spin_60s_linear_infinite]" />
                 <Lock className="w-16 h-16 text-muted-foreground/50" />
             </div>

             <div className="space-y-4">
                 <h1 className="font-serif text-4xl md:text-5xl text-foreground">Time Capsule</h1>
                 <p className="text-muted-foreground">This memory is locked until {new Date(capsule.unlockDate).toLocaleDateString()}.</p>
             </div>

             {timeLeft && (
                 <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
                     {[
                         { val: timeLeft.days, label: "Days" },
                         { val: timeLeft.hours, label: "Hours" },
                         { val: timeLeft.minutes, label: "Mins" },
                         { val: timeLeft.seconds, label: "Secs" }
                     ].map((unit, i) => (
                         <div key={i} className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                             <div className="text-3xl font-serif font-bold text-primary tabular-nums">
                                 {unit.val.toString().padStart(2, '0')}
                             </div>
                             <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                                 {unit.label}
                             </div>
                         </div>
                     ))}
                 </div>
             )}
             
             <div className="p-6 bg-primary/5 rounded-2xl inline-flex items-center gap-3 text-primary/80">
                 <Hourglass className="w-5 h-5 animate-pulse" />
                 <span className="text-sm font-medium tracking-wide">Patience is a virtue</span>
             </div>
          </motion.div>
        ) : (
           <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
           >
               <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                   <Timer className="w-10 h-10 text-primary" />
               </div>
               
               <h1 className="font-serif text-5xl text-primary">The Wait is Over</h1>
               
               <div className="bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl border border-white/60 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
                   
                   <p className="font-serif text-2xl leading-relaxed text-foreground italic">
                       &quot;{capsule.message}&quot;
                   </p>
                   
                   <div className="mt-8 pt-8 border-t border-dashed border-primary/20">
                       {/* Placeholder for real image */}
                       <div className="aspect-video w-full bg-stone-100 rounded-xl flex items-center justify-center text-muted-foreground">
                            Memory Image Placeholder
                       </div>
                   </div>
               </div>
           </motion.div> 
        )}
      </div>
    </main>
  );
}
