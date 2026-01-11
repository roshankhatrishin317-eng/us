"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export default function VaultPage() {
  const { settings, vault } = useAppStore();
  const hydrated = useHydrated();
  const [code, setCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === settings.passcode) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      // Shake animation trigger
      setTimeout(() => setError(false), 500);
    }
  };

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
      
       <Button
            asChild
            variant="ghost"
            className="absolute top-6 left-6 md:top-12 md:left-12 hover:bg-transparent hover:text-primary transition-colors text-muted-foreground z-20"
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
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md z-10"
          >
            <div className="bg-white/50 backdrop-blur-xl border border-white/60 p-10 rounded-[2.5rem] shadow-2xl shadow-primary/10 text-center space-y-8">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h1 className="font-serif text-3xl text-foreground">Top Secret</h1>
                <p className="text-muted-foreground text-sm">Enter the passcode to unlock the future.</p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Enter Passcode"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`text-center text-lg tracking-widest placeholder:tracking-normal font-serif h-14 ${error ? "border-destructive ring-destructive/20 animate-shake" : ""}`}
                  />
                  {error && (
                      <span className="absolute -bottom-6 left-0 right-0 text-xs text-destructive font-medium animate-pulse">
                          Incorrect Passcode
                      </span>
                  )}
                </div>
                <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full rounded-full h-12 text-lg font-serif mt-2"
                >
                    Unlock
                </Button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content-screen"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-2xl text-center z-10 space-y-12"
          >
             <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-tr from-primary to-accent rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-primary/30"
             >
                 <Unlock className="w-10 h-10 text-white" />
             </motion.div>

             <div className="space-y-6">
                 <h1 className="font-serif text-5xl md:text-7xl text-foreground leading-tight">
                    {vault.hiddenMessage}
                 </h1>
                 <p className="text-2xl md:text-3xl text-primary font-light italic">
                     {vault.subMessage}
                 </p>
             </div>

             <div className="p-8 border border-dashed border-primary/30 rounded-2xl bg-primary/5 inline-block">
                 <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Confirmation Code</p>
                 <p className="font-mono text-3xl font-bold text-foreground tracking-wider">{vault.code}</p>
             </div>
             
             <div className="pt-10">
                <Button
                    onClick={() => setIsUnlocked(false)}
                    variant="outline"
                    className="rounded-full border-primary/20 hover:bg-primary/5 text-primary"
                >
                    Lock Vault
                </Button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
