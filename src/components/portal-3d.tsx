"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue } from "framer-motion";
import { Heart, Sparkles, Stars } from "lucide-react";
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

  // Enhanced scroll transforms with more dramatic scaling
  const portalScale = useTransform(scrollY, [0, 500], [1, 20]);
  const portalOpacity = useTransform(scrollY, [0, 350, 450], [1, 1, 0]);
  const contentOpacity = useTransform(scrollY, [0, 250], [1, 0]);
  const portalRotateZ = useTransform(scrollY, [0, 500], [0, 180]);

  const smoothScale = useSpring(portalScale, { stiffness: 80, damping: 25 });
  const smoothOpacity = useSpring(portalOpacity, { stiffness: 100, damping: 30 });
  const smoothRotate = useSpring(portalRotateZ, { stiffness: 50, damping: 20 });

  // Mouse parallax for 3D tilt effect
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      rotateY.set(deltaX * 8);
      rotateX.set(-deltaY * 8);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rotateX, rotateY]);

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
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Outer Cosmic Ring */}
            <motion.div
              className="absolute w-[550px] h-[550px] md:w-[680px] md:h-[680px] rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent 0%, oklch(0.82 0.16 75 / 0.2) 10%, transparent 20%, oklch(0.58 0.22 15 / 0.25) 35%, transparent 45%, oklch(0.82 0.14 75 / 0.15) 60%, transparent 70%, oklch(0.58 0.18 15 / 0.2) 85%, transparent 100%)",
                filter: "blur(3px)",
                rotate: smoothRotate,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />

            {/* Portal Ring - Outer with enhanced glow */}
            <motion.div
              className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent, oklch(0.82 0.14 75 / 0.35), transparent, oklch(0.58 0.22 15 / 0.35), transparent)",
                filter: "blur(2px)",
                boxShadow: "0 0 80px oklch(0.82 0.14 75 / 0.2), inset 0 0 80px oklch(0.58 0.18 15 / 0.1)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* Portal Ring - Middle with pulsing */}
            <motion.div
              className="absolute w-[400px] h-[400px] md:w-[480px] md:h-[480px] rounded-full"
              style={{
                background: "conic-gradient(from 180deg, transparent, oklch(0.58 0.20 15 / 0.45), transparent, oklch(0.82 0.14 75 / 0.45), transparent)",
                filter: "blur(1px)",
              }}
              animate={{ 
                rotate: -360,
                scale: [1, 1.02, 1],
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />

            {/* Energy Ring - New inner detail */}
            <motion.div
              className="absolute w-[350px] h-[350px] md:w-[420px] md:h-[420px] rounded-full"
              style={{
                border: "1px solid oklch(0.82 0.12 75 / 0.3)",
                boxShadow: "0 0 30px oklch(0.82 0.14 75 / 0.2), inset 0 0 30px oklch(0.58 0.15 15 / 0.1)",
              }}
              animate={{ 
                rotate: 360,
                scale: [1, 1.03, 1],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }}
            />

            {/* Portal Ring - Inner Glow with enhanced depth */}
            <motion.div
              className="absolute w-[320px] h-[320px] md:w-[380px] md:h-[380px] rounded-full"
              style={{
                background: "radial-gradient(circle, oklch(0.58 0.18 15 / 0.25) 0%, oklch(0.82 0.12 75 / 0.2) 40%, oklch(0.58 0.10 15 / 0.1) 60%, transparent 75%)",
                boxShadow: `
                  0 0 80px oklch(0.82 0.16 75 / 0.5),
                  0 0 150px oklch(0.58 0.20 15 / 0.35),
                  0 0 200px oklch(0.82 0.12 75 / 0.2),
                  inset 0 0 80px oklch(0.82 0.14 75 / 0.25)
                `,
              }}
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.85, 1, 0.85],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Celestial Core - New glowing center */}
            <motion.div
              className="absolute w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full"
              style={{
                background: "radial-gradient(circle, oklch(1 0 0 / 0.15) 0%, oklch(0.82 0.14 75 / 0.1) 30%, transparent 70%)",
                boxShadow: "0 0 60px oklch(0.82 0.14 75 / 0.3)",
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating Star Elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${50 + Math.cos((i * 60 * Math.PI) / 180) * 35}%`,
                  top: `${50 + Math.sin((i * 60 * Math.PI) / 180) * 35}%`,
                  transform: "translate(-50%, -50%)",
                }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.4, 1, 0.4],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              >
                <Stars className="w-3 h-3 md:w-4 md:h-4 text-secondary/60" />
              </motion.div>
            ))}

            {/* Portal Particles - Increased count */}
            <PortalParticles count={36} />

            {/* Center Heart */}
            <motion.div
              className="relative z-20 flex flex-col items-center cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleEnter}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glowing Heart Container with enhanced effects */}
              <motion.div
                className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center"
                animate={{
                  boxShadow: isHovering
                    ? [
                        "0 0 50px oklch(0.58 0.22 15 / 0.6), 0 0 100px oklch(0.82 0.16 75 / 0.5), 0 0 150px oklch(0.58 0.18 15 / 0.3)",
                        "0 0 70px oklch(0.58 0.22 15 / 0.7), 0 0 140px oklch(0.82 0.16 75 / 0.6), 0 0 200px oklch(0.58 0.18 15 / 0.4)",
                        "0 0 50px oklch(0.58 0.22 15 / 0.6), 0 0 100px oklch(0.82 0.16 75 / 0.5), 0 0 150px oklch(0.58 0.18 15 / 0.3)",
                      ]
                    : [
                        "0 0 30px oklch(0.58 0.20 15 / 0.4), 0 0 60px oklch(0.82 0.14 75 / 0.3), 0 0 90px oklch(0.58 0.15 15 / 0.2)",
                        "0 0 45px oklch(0.58 0.20 15 / 0.5), 0 0 90px oklch(0.82 0.14 75 / 0.4), 0 0 120px oklch(0.58 0.15 15 / 0.25)",
                        "0 0 30px oklch(0.58 0.20 15 / 0.4), 0 0 60px oklch(0.82 0.14 75 / 0.3), 0 0 90px oklch(0.58 0.15 15 / 0.2)",
                      ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Multi-layer glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle, oklch(0.58 0.15 15 / 0.35) 0%, oklch(0.82 0.12 75 / 0.2) 40%, transparent 70%)",
                  }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle, oklch(0.82 0.14 75 / 0.2) 0%, transparent 60%)",
                  }}
                  animate={{ scale: [1.2, 1.6, 1.2], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                
                {/* Heart with enhanced styling */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1, 1.15, 1],
                    rotate: isHovering ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{ 
                    scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 0.5, repeat: isHovering ? Infinity : 0 }
                  }}
                >
                  <Heart
                    className="w-18 h-18 md:w-24 md:h-24 text-primary fill-primary/50 drop-shadow-[0_0_30px_rgba(180,100,130,0.7)]"
                    style={{ filter: "drop-shadow(0 0 20px oklch(0.58 0.22 15 / 0.6))" }}
                  />
                </motion.div>
              </motion.div>

              {/* Enter Text */}
              <motion.div
                className="mt-10 text-center"
                style={{ opacity: contentOpacity }}
              >
                <motion.div
                  className="flex items-center gap-3 justify-center mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </motion.div>
                  <span className="text-xs tracking-[0.35em] uppercase text-secondary font-semibold">
                    Enter Our World
                  </span>
                  <motion.div
                    animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </motion.div>
                </motion.div>

                <motion.h1
                  className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <motion.span 
                    className="block text-glow-rose"
                    animate={{ 
                      textShadow: [
                        "0 0 20px oklch(0.58 0.22 15 / 0.3)",
                        "0 0 40px oklch(0.58 0.22 15 / 0.5)",
                        "0 0 20px oklch(0.58 0.22 15 / 0.3)",
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {names[0]}
                  </motion.span>
                  <motion.span
                    className="text-3xl md:text-4xl text-primary/60 inline-flex items-center gap-4 my-3"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    &
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="w-6 h-6 fill-primary/40 text-primary" />
                    </motion.div>
                  </motion.span>
                  <motion.span 
                    className="block text-glow-gold"
                    animate={{ 
                      textShadow: [
                        "0 0 20px oklch(0.82 0.14 75 / 0.3)",
                        "0 0 40px oklch(0.82 0.14 75 / 0.5)",
                        "0 0 20px oklch(0.82 0.14 75 / 0.3)",
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  >
                    {names[1]}
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="mt-8 text-muted-foreground text-sm md:text-base max-w-sm mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Scroll to enter our magical world of memories
                </motion.p>

                {/* Enhanced scroll indicator */}
                <motion.div
                  className="mt-10 flex flex-col items-center"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div 
                    className="w-7 h-12 border-2 border-primary/40 rounded-full flex justify-center pt-2 relative overflow-hidden"
                    animate={{ 
                      borderColor: ["oklch(0.58 0.22 15 / 0.4)", "oklch(0.82 0.14 75 / 0.5)", "oklch(0.58 0.22 15 / 0.4)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{ y: [0, 16, 0], opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent"
                      animate={{ y: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                  <motion.span
                    className="mt-3 text-xs text-muted-foreground/60 tracking-widest uppercase"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Scroll
                  </motion.span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced Decorative Corner Elements */}
          <div className="absolute top-8 left-8 opacity-40">
            <motion.div
              className="w-24 h-24 relative"
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, oklch(0.82 0.16 75 / 0.6) 0%, transparent 50%)",
                }}
              />
              <motion.div
                className="absolute top-2 left-2 w-2 h-2 rounded-full bg-secondary/60"
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
          <div className="absolute bottom-8 right-8 opacity-40">
            <motion.div
              className="w-24 h-24 relative"
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(-45deg, oklch(0.58 0.20 15 / 0.6) 0%, transparent 50%)",
                }}
              />
              <motion.div
                className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-primary/60"
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
          </div>
          
          {/* Additional floating corner accents */}
          <div className="absolute top-8 right-8 opacity-30">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity }
              }}
            >
              <Stars className="w-6 h-6 text-secondary" />
            </motion.div>
          </div>
          <div className="absolute bottom-8 left-8 opacity-30">
            <motion.div
              animate={{ 
                rotate: [360, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity }
              }}
            >
              <Stars className="w-6 h-6 text-primary" />
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
