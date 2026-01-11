"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { PortalParticles } from "./magical-particles";

interface Portal3DProps {
  onEnter?: () => void;
  coupleName?: string;
  isVisible?: boolean;
}

export function Portal3D({ onEnter, coupleName = "You & Me", isVisible = true }: Portal3DProps) {
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const portalScale = useTransform(scrollY, [0, 400], [1, 15]);
  const portalOpacity = useTransform(scrollY, [0, 300, 400], [1, 1, 0]);
  const contentOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  const smoothScale = useSpring(portalScale, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(portalOpacity, { stiffness: 100, damping: 30 });

  const handleEnter = () => {
    onEnter?.();
  };

  const names = coupleName.split(" & ");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          ref={containerRef}
          className="relative min-h-screen w-full flex items-center justify-center overflow-hidden perspective-1000"
          style={{ perspective: "1200px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.8 }}
        >
          {/* Ethereal Background Layers */}
          <div className="absolute inset-0">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-valentime" />

            {/* Animated gradient orbs */}
            <motion.div
              className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px]"
              style={{
                background: "radial-gradient(circle, oklch(0.58 0.15 15 / 0.15) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[140px]"
              style={{
                background: "radial-gradient(circle, oklch(0.82 0.12 75 / 0.12) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.15, 1],
                x: [0, -40, 0],
                y: [0, -50, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            />
            <motion.div
              className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full blur-[100px]"
              style={{
                background: "radial-gradient(circle, oklch(0.58 0.10 15 / 0.08) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 8 }}
            />
          </div>

          {/* 3D Portal Container */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center"
            style={{
              scale: smoothScale,
              opacity: smoothOpacity,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Portal Ring - Outer */}
            <motion.div
              className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent, oklch(0.82 0.14 75 / 0.3), transparent, oklch(0.58 0.20 15 / 0.3), transparent)",
                filter: "blur(2px)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* Portal Ring - Middle */}
            <motion.div
              className="absolute w-[400px] h-[400px] md:w-[480px] md:h-[480px] rounded-full"
              style={{
                background: "conic-gradient(from 180deg, transparent, oklch(0.58 0.18 15 / 0.4), transparent, oklch(0.82 0.12 75 / 0.4), transparent)",
                filter: "blur(1px)",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />

            {/* Portal Ring - Inner Glow */}
            <motion.div
              className="absolute w-[320px] h-[320px] md:w-[380px] md:h-[380px] rounded-full"
              style={{
                background: "radial-gradient(circle, oklch(0.58 0.15 15 / 0.2) 0%, oklch(0.82 0.10 75 / 0.15) 50%, transparent 70%)",
                boxShadow: `
                  0 0 60px oklch(0.82 0.14 75 / 0.4),
                  0 0 120px oklch(0.58 0.18 15 / 0.3),
                  inset 0 0 60px oklch(0.82 0.14 75 / 0.2)
                `,
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Portal Particles */}
            <PortalParticles count={24} />

            {/* Center Heart */}
            <motion.div
              className="relative z-20 flex flex-col items-center cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleEnter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glowing Heart Container */}
              <motion.div
                className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center"
                animate={{
                  boxShadow: isHovering
                    ? [
                        "0 0 40px oklch(0.58 0.20 15 / 0.5), 0 0 80px oklch(0.82 0.14 75 / 0.4)",
                        "0 0 60px oklch(0.58 0.20 15 / 0.6), 0 0 120px oklch(0.82 0.14 75 / 0.5)",
                        "0 0 40px oklch(0.58 0.20 15 / 0.5), 0 0 80px oklch(0.82 0.14 75 / 0.4)",
                      ]
                    : [
                        "0 0 20px oklch(0.58 0.18 15 / 0.3), 0 0 40px oklch(0.82 0.12 75 / 0.2)",
                        "0 0 30px oklch(0.58 0.18 15 / 0.4), 0 0 60px oklch(0.82 0.12 75 / 0.3)",
                        "0 0 20px oklch(0.58 0.18 15 / 0.3), 0 0 40px oklch(0.82 0.12 75 / 0.2)",
                      ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle, oklch(0.58 0.12 15 / 0.3) 0%, transparent 70%)",
                  }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <Heart
                  className="w-16 h-16 md:w-20 md:h-20 text-primary fill-primary/40 drop-shadow-[0_0_20px_rgba(180,100,130,0.6)]"
                />
              </motion.div>

              {/* Enter Text */}
              <motion.div
                className="mt-8 text-center"
                style={{ opacity: contentOpacity }}
              >
                <motion.div
                  className="flex items-center gap-2 justify-center mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="text-xs tracking-[0.3em] uppercase text-secondary font-medium">
                    Enter Our World
                  </span>
                  <Sparkles className="w-4 h-4 text-secondary" />
                </motion.div>

                <motion.h1
                  className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <span className="block">{names[0]}</span>
                  <motion.span
                    className="text-2xl md:text-3xl text-primary/50 inline-flex items-center gap-3 my-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    &
                    <Heart className="w-5 h-5 fill-primary/30" />
                  </motion.span>
                  <span className="block">{names[1]}</span>
                </motion.h1>

                <motion.p
                  className="mt-6 text-muted-foreground text-sm md:text-base max-w-xs mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Scroll to enter our magical world of memories
                </motion.p>

                {/* Scroll indicator */}
                <motion.div
                  className="mt-8 flex flex-col items-center"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
                    <motion.div
                      className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                      animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-8 left-8 opacity-30">
            <motion.div
              className="w-20 h-20"
              style={{
                background: "linear-gradient(135deg, oklch(0.82 0.14 75 / 0.5) 0%, transparent 50%)",
              }}
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="absolute bottom-8 right-8 opacity-30">
            <motion.div
              className="w-20 h-20"
              style={{
                background: "linear-gradient(-45deg, oklch(0.58 0.18 15 / 0.5) 0%, transparent 50%)",
              }}
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
