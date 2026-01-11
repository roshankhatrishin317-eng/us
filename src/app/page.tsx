"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Heart } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";
import { Portal3D } from "@/components/portal-3d";
import { MagicalParticles } from "@/components/magical-particles";
import { HeroTimerSection, FeatureGrid } from "@/components/scroll-sections";

export default function Home() {
  const { settings, bucketList } = useAppStore();
  const hydrated = useStoreHydrated();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { scrollY } = useScroll();

  // Transform values for scroll-based animations
  const portalOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const contentOpacity = useTransform(scrollY, [400, 700], [0, 1]);

  const smoothPortalOpacity = useSpring(portalOpacity, { stiffness: 100, damping: 30 });
  const smoothContentOpacity = useSpring(contentOpacity, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (!hydrated) return;

    const calculateTime = () => {
      if (settings.showTimer === false || !settings.relationshipStartDate || settings.relationshipStartDate.trim() === "") {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const start = new Date(settings.relationshipStartDate).getTime();

      if (isNaN(start)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const now = Date.now();
      const diff = now - start;

      if (diff < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [hydrated, settings.relationshipStartDate, settings.showTimer]);

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-valentime">
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {/* Glowing orb behind heart */}
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{
              background: "radial-gradient(circle, oklch(0.58 0.15 15 / 0.3) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Heart className="w-12 h-12 text-primary fill-primary/40 relative z-10" />
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative overflow-x-hidden">
      {/* Global Background */}
      <div className="fixed inset-0 bg-valentime -z-10" />

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-5">
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[150px]"
          style={{
            background: "radial-gradient(circle, oklch(0.58 0.12 15 / 0.12) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 60, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-30%] right-[-15%] w-[800px] h-[800px] rounded-full blur-[180px]"
          style={{
            background: "radial-gradient(circle, oklch(0.82 0.10 75 / 0.10) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -50, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        <motion.div
          className="absolute top-[50%] right-[10%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{
            background: "radial-gradient(circle, oklch(0.58 0.08 15 / 0.06) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 10 }}
        />
      </div>

      {/* Magical Particles */}
      <MagicalParticles count={40} className="fixed inset-0 -z-1" />

      {/* Paper Texture */}
      <div className="paper-texture" />

      {/* Portal Section - Fixed at top */}
      <motion.div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ opacity: smoothPortalOpacity }}
      >
        <div className="pointer-events-auto">
          <Portal3D coupleName={settings.coupleName} />
        </div>
      </motion.div>

      {/* Scroll Content */}
      <motion.div
        className="relative z-20"
        style={{ opacity: smoothContentOpacity }}
      >
        {/* Spacer for portal section */}
        <div className="h-[100vh]" />

        {/* Main Content Sections */}
        <div className="relative bg-gradient-to-b from-transparent via-background/50 to-background">
          {/* Transition gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-background/80 -translate-y-full" />

          {/* Timer Section */}
          <HeroTimerSection
            coupleName={settings.coupleName}
            startDate={settings.relationshipStartDate}
            timeLeft={timeLeft}
            showTimer={settings.showTimer}
          />

          {/* Feature Grid */}
          <FeatureGrid bucketList={bucketList} />

          {/* Footer Quote Section */}
          <motion.section
            className="py-24 px-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-2xl mx-auto">
              <motion.div
                className="inline-flex items-center gap-3 mb-6"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-primary/50 fill-primary/30" />
                </motion.div>
              </motion.div>

              <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground/80 italic leading-relaxed">
                &ldquo;In all the world, there is no heart for me like yours.
                In all the world, there is no love for you like mine.&rdquo;
              </blockquote>

              <motion.div
                className="h-0.5 w-20 mx-auto mt-8 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />

              <p className="mt-6 text-sm text-muted-foreground/60 tracking-wide">
                — Maya Angelou
              </p>
            </div>
          </motion.section>

          {/* Bottom Padding */}
          <div className="h-16" />
        </div>
      </motion.div>
    </main>
  );
}
