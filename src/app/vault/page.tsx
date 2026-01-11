"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Heart, Sparkles, Gift } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

export default function VaultPage() {
  const { vault } = useAppStore();
  const hydrated = useStoreHydrated();

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
        animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-15%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], y: [0, -40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px]"
      />
      
      {/* Floating Hearts */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: i * 0.8
          }}
          className="absolute"
          style={{
            left: `${10 + i * 20}%`,
            top: `${15 + (i % 3) * 30}%`
          }}
        >
          <Heart className="w-6 h-6 text-primary/20 fill-primary/10" />
        </motion.div>
      ))}
      
      <div className="paper-texture" />
      
      {/* Back Button */}
      <Button
        asChild
        variant="ghost"
        className="absolute top-6 left-6 hover:bg-transparent hover:text-primary text-muted-foreground z-20"
      >
        <Link href="/">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Link>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl text-center z-10 space-y-10"
      >
        {/* Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="relative w-28 h-28 mx-auto"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-secondary animate-glow" />
          <div className="absolute inset-2 rounded-full bg-white/90 flex items-center justify-center">
            <Gift className="w-10 h-10 text-primary" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-primary/30"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <Badge variant="glow" className="mx-auto">
            <Sparkles className="w-3 h-3 mr-1" />
            Secret Vault
          </Badge>
          
          <h1 className="font-serif text-4xl md:text-6xl text-foreground leading-tight">
            {vault.hiddenMessage || "A Special Message"}
          </h1>
          
          <p className="text-xl md:text-2xl text-primary/80 font-light italic">
            {vault.subMessage || "Just for you"}
          </p>
        </motion.div>

        {/* Code Display */}
        {vault.code && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl p-8 inline-block relative overflow-hidden"
          >
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
            <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] mb-3">
              Special Code
            </p>
            <p className="font-mono text-3xl md:text-4xl font-bold text-foreground tracking-[0.2em]">
              {vault.code}
            </p>
          </motion.div>
        )}
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pt-6"
        >
          <Button asChild className="rounded-full glow-primary">
            <Link href="/">
              <Heart className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
