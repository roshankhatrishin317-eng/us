"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "sparkle" | "petal" | "orb";
  rotation: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    duration: Math.random() * 8 + 12,
    delay: Math.random() * 10,
    type: ["sparkle", "petal", "orb"][Math.floor(Math.random() * 3)] as Particle["type"],
    rotation: Math.random() * 360,
  }));
}

interface PortalParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  duration: number;
  delay: number;
}

function generatePortalParticles(count: number): PortalParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i,
    distance: Math.random() * 200 + 100,
    size: Math.random() * 6 + 3,
    duration: Math.random() * 4 + 6,
    delay: Math.random() * 3,
  }));
}

function Sparkle({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0.8, 1, 0],
        scale: [0.5, 1, 0.8, 1.2, 0.5],
        y: [0, -50, -100, -150, -200],
        x: [0, 10, -5, 15, 0],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path
          d="M12 0L13.5 9L22 12L13.5 15L12 24L10.5 15L2 12L10.5 9L12 0Z"
          fill="url(#sparkle-gradient)"
          className="drop-shadow-[0_0_6px_rgba(212,175,55,0.8)]"
        />
        <defs>
          <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#F5E6C8" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

function RosePetal({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size * 2,
        height: particle.size * 2.5,
      }}
      initial={{ opacity: 0, scale: 0, rotate: particle.rotation }}
      animate={{
        opacity: [0, 0.7, 0.5, 0.7, 0],
        scale: [0.3, 1, 0.9, 1.1, 0.3],
        y: [0, -30, -80, -120, -180],
        x: [0, 20, -15, 25, 10],
        rotate: [particle.rotation, particle.rotation + 60, particle.rotation + 120, particle.rotation + 200, particle.rotation + 360],
      }}
      transition={{
        duration: particle.duration * 1.2,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 24 30" className="w-full h-full drop-shadow-[0_2px_4px_rgba(180,100,130,0.3)]">
        <ellipse
          cx="12"
          cy="15"
          rx="10"
          ry="13"
          fill="url(#petal-gradient)"
          opacity="0.9"
        />
        <defs>
          <radialGradient id="petal-gradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#FFB6C1" />
            <stop offset="40%" stopColor="#E8909C" />
            <stop offset="100%" stopColor="#C46B7A" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

function GlowOrb({ particle }: { particle: Particle }) {
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size * 3,
        height: particle.size * 3,
        background: `radial-gradient(circle, rgba(212,175,55,0.6) 0%, rgba(255,215,0,0.3) 40%, transparent 70%)`,
        filter: "blur(2px)",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0.5, 0.8, 0],
        scale: [0.5, 1.2, 1, 1.3, 0.5],
        y: [0, -40, -90, -140, -200],
        x: [0, -15, 10, -20, 5],
      }}
      transition={{
        duration: particle.duration * 0.9,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function MagicalParticles({
  count = 30,
  className = ""
}: {
  count?: number;
  className?: string;
}) {
  const [particles] = useState(() => generateParticles(count));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => {
        switch (particle.type) {
          case "sparkle":
            return <Sparkle key={particle.id} particle={particle} />;
          case "petal":
            return <RosePetal key={particle.id} particle={particle} />;
          case "orb":
            return <GlowOrb key={particle.id} particle={particle} />;
        }
      })}
    </div>
  );
}

// Portal-specific particles that emanate from center
export function PortalParticles({ count = 20 }: { count?: number }) {
  const [particles] = useState(() => generatePortalParticles(count));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const radians = (particle.angle * Math.PI) / 180;
        const endX = Math.cos(radians) * particle.distance;
        const endY = Math.sin(radians) * particle.distance;

        return (
          <motion.div
            key={particle.id}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(212,175,55,0.6) 50%, transparent 100%)`,
              boxShadow: "0 0 10px rgba(212,175,55,0.8)",
            }}
            animate={{
              x: [0, endX * 0.3, endX * 0.6, endX],
              y: [0, endY * 0.3, endY * 0.6, endY],
              opacity: [0, 1, 0.8, 0],
              scale: [0.5, 1, 0.8, 0.3],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        );
      })}
    </div>
  );
}
