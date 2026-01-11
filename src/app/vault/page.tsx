"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ArrowLeft, Heart, Sparkles, KeyRound, ShieldCheck, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";
import confetti from "canvas-confetti";

export default function VaultPage() {
  const { settings, vault } = useAppStore();
  const hydrated = useStoreHydrated();
  const [code, setCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === settings.passcode) {
      setIsUnlocked(true);
      setError(false);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#c87882", "#a885b5", "#d4a574", "#fff"]
      });
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      setTimeout(() => setError(false), 600);
    }
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
        animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-15%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], y: [0, -40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px]"
      />
      
      {/* Floating Lock Icons */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.2, 0.4, 0.2]
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
          <Lock className="w-6 h-6 text-primary/20" />
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

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md z-10"
          >
            <div className="glass-card rounded-[2rem] p-8 md:p-10 text-center space-y-8 relative overflow-hidden">
              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl"
              />
              
              {/* Lock Icon */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Lock className="w-10 h-10 text-primary" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-primary/30"
                  />
                </div>
              </motion.div>
              
              {/* Title */}
              <div className="space-y-2 relative">
                <Badge variant="glow" className="mx-auto mb-2">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Protected
                </Badge>
                <h1 className="font-serif text-3xl text-foreground">The Secret Vault</h1>
                <p className="text-muted-foreground text-sm">
                  Enter the passcode to reveal the surprise.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleUnlock} className="space-y-5 relative">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter passcode"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`text-center text-xl tracking-[0.3em] font-mono h-14 pl-12 pr-12 rounded-2xl border-2 transition-all ${
                      error 
                        ? "border-destructive bg-destructive/5 animate-shake" 
                        : "border-primary/20 focus:border-primary/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-destructive font-medium"
                    >
                      Incorrect passcode. Try again.
                    </motion.p>
                  )}
                </AnimatePresence>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full rounded-2xl h-14 text-lg glow-primary"
                >
                  <Unlock className="w-5 h-5 mr-2" />
                  Unlock Vault
                </Button>
              </form>
              
              {/* Hint */}
              {attempts >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-muted-foreground/60"
                >
                  Hint: Think about something special to both of you 💕
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content-screen"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-2xl text-center z-10 space-y-10"
          >
            {/* Unlocked Icon */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="relative w-28 h-28 mx-auto"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-secondary animate-glow" />
              <div className="absolute inset-2 rounded-full bg-white/90 flex items-center justify-center">
                <Unlock className="w-10 h-10 text-primary" />
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
                Vault Unlocked
              </Badge>
              
              <h1 className="font-serif text-4xl md:text-6xl text-foreground leading-tight">
                {vault.hiddenMessage}
              </h1>
              
              <p className="text-xl md:text-2xl text-primary/80 font-light italic">
                {vault.subMessage}
              </p>
            </motion.div>

            {/* Code Display */}
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
                Confirmation Code
              </p>
              <p className="font-mono text-3xl md:text-4xl font-bold text-foreground tracking-[0.2em]">
                {vault.code}
              </p>
            </motion.div>
            
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-4 pt-6"
            >
              <Button
                onClick={() => {
                  setIsUnlocked(false);
                  setCode("");
                }}
                variant="outline"
                className="rounded-full border-primary/20 hover:bg-primary/5 text-primary"
              >
                <Lock className="w-4 h-4 mr-2" />
                Lock Vault
              </Button>
              
              <Button asChild className="rounded-full">
                <Link href="/">
                  <Heart className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
