"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Heart, MapPin, Camera, Lock, Trophy, ListTodo, Hourglass, Calendar, ArrowRight, Sparkles, Star, Infinity as InfinityIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollSection({ children, className = "" }: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.95]);

  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 20 });

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        opacity: smoothOpacity,
        y: smoothY,
        scale: smoothScale,
      }}
    >
      {children}
    </motion.div>
  );
}

interface TimeCounterProps {
  value: number;
  label: string;
}

export function TimeCounter({ value, label }: TimeCounterProps) {
  return (
    <div className="text-center">
      <motion.div
        key={value}
        initial={{ scale: 1.1, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground tabular-nums"
      >
        {value.toString().padStart(2, "0")}
      </motion.div>
      <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.25em] mt-2">
        {label}
      </div>
    </div>
  );
}

interface FeatureCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  gradient: string;
  iconColor: string;
  delay?: number;
}

export function FeatureCard({ href, icon: Icon, title, subtitle, gradient, iconColor, delay = 0 }: FeatureCardProps) {
  return (
    <Link href={href} className="block group">
      <motion.div
        className={`relative overflow-hidden rounded-3xl p-6 md:p-8 backdrop-blur-xl border border-white/40 h-full min-h-[180px] ${gradient}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{
          y: -8,
          boxShadow: "0 25px 80px -12px oklch(0.58 0.15 15 / 0.25)",
          transition: { duration: 0.3 }
        }}
      >
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)",
            backgroundSize: "250% 100%",
          }}
          animate={{ backgroundPosition: ["250% 0", "-250% 0"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <motion.div
              className={`h-14 w-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-lg ${iconColor}`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
            <motion.div
              className="opacity-30 group-hover:opacity-80 transition-opacity"
              whileHover={{ x: 4, y: -4 }}
            >
              <ArrowRight className="w-5 h-5 text-foreground -rotate-45" />
            </motion.div>
          </div>

          <div className="mt-4">
            <h3 className="font-serif text-2xl md:text-3xl text-foreground group-hover:text-gradient transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground/80 mt-1">{subtitle}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

interface HeroTimerSectionProps {
  coupleName: string;
  startDate: string;
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  showTimer: boolean;
}

export function HeroTimerSection({ coupleName, startDate, timeLeft, showTimer }: HeroTimerSectionProps) {
  const names = coupleName.split(" & ");

  return (
    <ScrollSection className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Badge variant="glow" className="text-sm px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Our Love Story
          </Badge>
        </motion.div>

        {/* Names with elegant typography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.85]">
            <span className="block">{names[0]}</span>
            <span className="text-3xl md:text-4xl text-primary/40 inline-flex items-center gap-3 my-4">
              &
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Heart className="w-6 h-6 fill-primary/30 text-primary/50" />
              </motion.span>
            </span>
            <span className="block">{names[1]}</span>
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="h-0.5 w-32 mx-auto mt-8 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          />
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12 max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-2 justify-center mb-8">
                <Star className="w-4 h-4 text-secondary" />
                <span className="text-xs font-semibold tracking-[0.25em] text-secondary uppercase">
                  Together Since {startDate ? new Date(startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Forever"}
                </span>
                <Star className="w-4 h-4 text-secondary" />
              </div>

              {showTimer ? (
                <>
                  <div className="grid grid-cols-4 gap-4 md:gap-8">
                    <TimeCounter value={timeLeft.days} label="Days" />
                    <TimeCounter value={timeLeft.hours} label="Hours" />
                    <TimeCounter value={timeLeft.minutes} label="Minutes" />
                    <TimeCounter value={timeLeft.seconds} label="Seconds" />
                  </div>
                  <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground/60">
                    <Heart className="w-4 h-4 fill-primary/30 text-primary/40" />
                    <span className="tracking-wide italic">And counting forever...</span>
                    <Heart className="w-4 h-4 fill-primary/30 text-primary/40" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <InfinityIcon className="w-20 h-20 text-primary/50 mb-4" />
                  <span className="text-2xl font-serif text-primary/70 tracking-wide">Forever & Always</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Button asChild size="lg" className="group glow-primary text-base px-8">
            <Link href="/timeline">
              <Calendar className="w-5 h-5 mr-2" />
              Explore Our Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </ScrollSection>
  );
}

interface FeatureGridProps {
  bucketList: { completed: boolean }[];
}

export function FeatureGrid({ bucketList }: FeatureGridProps) {
  const completedBucketItems = bucketList.filter(i => i.completed).length;
  const bucketProgress = bucketList.length > 0 ? (completedBucketItems / bucketList.length) * 100 : 0;

  return (
    <ScrollSection className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Explore Together
          </Badge>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
            Our Sacred Spaces
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Every memory, every dream, every moment—preserved in our digital sanctuary
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            href="/map"
            icon={MapPin}
            title="Our Map"
            subtitle="Places we've loved together"
            gradient="bg-gradient-to-br from-white/90 to-secondary/10"
            iconColor="text-secondary"
            delay={0}
          />

          <FeatureCard
            href="/gallery"
            icon={Camera}
            title="Gallery"
            subtitle="Captured moments in time"
            gradient="bg-gradient-to-br from-white/90 to-amber-100/50"
            iconColor="text-amber-600"
            delay={0.1}
          />

          <FeatureCard
            href="/quiz"
            icon={Trophy}
            title="Love Quiz"
            subtitle="Test your connection"
            gradient="bg-gradient-to-br from-white/90 to-amber-50/50"
            iconColor="text-amber-500"
            delay={0.2}
          />

          {/* Bucket List - Wide Card */}
          <Link href="/bucket-list" className="block group md:col-span-2 lg:col-span-2">
            <motion.div
              className="relative overflow-hidden rounded-3xl p-6 md:p-8 backdrop-blur-xl border border-white/40 h-full bg-gradient-to-br from-white/90 to-emerald-50/50"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -8,
                boxShadow: "0 25px 80px -12px oklch(0.58 0.15 15 / 0.25)",
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="h-14 w-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-lg text-emerald-600"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <ListTodo className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground">Bucket List</h3>
                    <p className="text-sm text-muted-foreground/80">Dreams we&apos;re chasing together</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-emerald-600 transition-colors -rotate-45" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{completedBucketItems} of {bucketList.length} completed</span>
                  <span className="font-medium text-emerald-600">{Math.round(bucketProgress)}%</span>
                </div>
                <Progress value={bucketProgress} className="h-3" />
              </div>
            </motion.div>
          </Link>

          <FeatureCard
            href="/capsule"
            icon={Hourglass}
            title="Time Capsule"
            subtitle="Letters to our future"
            gradient="bg-gradient-to-br from-white/90 to-violet-50/50"
            iconColor="text-violet-600"
            delay={0.4}
          />

          {/* Vault - Special Card */}
          <Link href="/vault" className="block group md:col-span-2 lg:col-span-3">
            <motion.div
              className="relative overflow-hidden rounded-3xl p-8 md:p-12 backdrop-blur-xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -8,
                boxShadow: "0 25px 80px -12px oklch(0.58 0.20 15 / 0.35)",
              }}
            >
              {/* Animated glow */}
              <motion.div
                className="absolute inset-0 opacity-50"
                animate={{
                  background: [
                    "radial-gradient(600px circle at 0% 50%, oklch(0.58 0.15 15 / 0.1), transparent 50%)",
                    "radial-gradient(600px circle at 100% 50%, oklch(0.58 0.15 15 / 0.1), transparent 50%)",
                    "radial-gradient(600px circle at 0% 50%, oklch(0.58 0.15 15 / 0.1), transparent 50%)",
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <motion.div
                    className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center backdrop-blur border border-primary/20"
                    animate={{
                      boxShadow: [
                        "0 0 30px oklch(0.58 0.20 15 / 0.3)",
                        "0 0 60px oklch(0.58 0.20 15 / 0.5)",
                        "0 0 30px oklch(0.58 0.20 15 / 0.3)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Lock className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-serif text-3xl md:text-4xl text-primary">The Secret Vault</h3>
                    <p className="text-primary/60 mt-1">Hidden surprises await those who know the password...</p>
                  </div>
                </div>
                <motion.div
                  className="hidden md:block"
                  whileHover={{ x: 4 }}
                >
                  <ArrowRight className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors" />
                </motion.div>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </ScrollSection>
  );
}
