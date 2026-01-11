"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight, MapPin, Camera, Lock, Trophy, ListTodo, Hourglass, Sparkles, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

const HEART_CONFIGS = [
  { delay: 0, x: "8vw", size: "w-6 h-6", duration: 18 },
  { delay: 2, x: "20vw", size: "w-4 h-4", duration: 22 },
  { delay: 4, x: "35vw", size: "w-8 h-8", duration: 20 },
  { delay: 1, x: "55vw", size: "w-5 h-5", duration: 24 },
  { delay: 3, x: "70vw", size: "w-4 h-4", duration: 19 },
  { delay: 5, x: "85vw", size: "w-6 h-6", duration: 21 },
];

function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {HEART_CONFIGS.map((config, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: "110vh", x: config.x }}
          animate={{ 
            opacity: [0, 0.5, 0.5, 0],
            y: "-10vh",
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: config.duration,
            repeat: Infinity,
            delay: config.delay,
            ease: "linear"
          }}
          className="absolute"
        >
          <Heart className={`${config.size} text-primary/25 fill-primary/15`} />
        </motion.div>
      ))}
    </div>
  );
}

function TimeCounter({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <motion.div
        key={value}
        initial={{ scale: 1.1, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground tabular-nums"
      >
        {value.toString().padStart(2, "0")}
      </motion.div>
      <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1">
        {label}
      </div>
    </div>
  );
}

function BentoCard({
  children,
  className = "",
  href,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  delay?: number;
}) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-3xl glass-card p-6 md:p-8 hover-lift ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
}

function FeatureCard({
  href,
  icon: Icon,
  title,
  subtitle,
  color,
  delay,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: "primary" | "secondary" | "accent" | "rose" | "violet" | "amber" | "emerald";
  delay: number;
}) {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5 text-primary group-hover:text-primary",
    secondary: "from-secondary/20 to-secondary/5 text-secondary group-hover:text-secondary",
    accent: "from-accent/30 to-accent/10 text-amber-700 group-hover:text-amber-600",
    rose: "from-rose-100 to-rose-50 text-rose-600 group-hover:text-rose-500",
    violet: "from-violet-100 to-violet-50 text-violet-600 group-hover:text-violet-500",
    amber: "from-amber-100 to-amber-50 text-amber-600 group-hover:text-amber-500",
    emerald: "from-emerald-100 to-emerald-50 text-emerald-600 group-hover:text-emerald-500",
  };

  return (
    <BentoCard href={href} delay={delay} className="h-full">
      <div className="h-full flex flex-col justify-between min-h-[140px]">
        <div className="flex items-start justify-between">
          <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-foreground/60 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 -rotate-45" />
        </div>
        <div className="mt-4">
          <h3 className="font-serif text-xl md:text-2xl text-foreground group-hover:text-gradient transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>
    </BentoCard>
  );
}

export default function Home() {
  const { settings, bucketList } = useAppStore();
  const hydrated = useStoreHydrated();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!hydrated) return;
    
    const calculateTime = () => {
      const start = new Date(settings.relationshipStartDate).getTime();
      const now = Date.now();
      const diff = now - start;

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
  }, [hydrated, settings.relationshipStartDate]);

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Heart className="w-8 h-8 text-primary/50 fill-primary/30" />
        </motion.div>
      </main>
    );
  }

  const completedBucketItems = bucketList.filter(i => i.completed).length;
  const bucketProgress = bucketList.length > 0 ? (completedBucketItems / bucketList.length) * 100 : 0;
  const names = settings.coupleName.split(" & ");

  return (
    <main className="min-h-screen relative overflow-hidden bg-romantic-gradient">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-romantic-radial" />
      <FloatingHearts />
      
      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px]"
      />
      
      <div className="paper-texture" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-7xl mx-auto">
          
          {/* Hero Card - Large */}
          <BentoCard className="md:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[400px] md:min-h-[480px] flex flex-col justify-between" delay={0}>
            {/* Decorative Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 rounded-full blur-2xl"
            />
            
            <div className="relative space-y-6">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex items-center gap-3"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/25 to-secondary/20 flex items-center justify-center shadow-lg shadow-primary/10 backdrop-blur-sm border border-white/30"
                >
                  <Heart className="w-7 h-7 text-primary fill-primary/40" />
                </motion.div>
                <div>
                  <Badge variant="glow" className="mb-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Our Love Story
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Since {new Date(settings.relationshipStartDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </motion.div>

              {/* Names */}
              <div className="space-y-2">
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[0.9]">
                  <motion.span
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="block"
                  >
                    {names[0]}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="inline-flex items-center gap-2 my-1"
                  >
                    <span className="text-3xl md:text-4xl text-primary/40 font-light">&</span>
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                      <Heart className="w-5 h-5 text-primary/40 fill-primary/20" />
                    </motion.div>
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="block"
                  >
                    {names[1]}
                  </motion.span>
                </h1>
                
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="h-0.5 w-20 bg-gradient-to-r from-primary/50 to-transparent origin-left"
                />
              </div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-lg text-muted-foreground/80 font-light max-w-sm leading-relaxed"
              >
                A digital sanctuary for our{" "}
                <span className="text-primary/70 italic">cherished moments</span>,{" "}
                whispered secrets, and infinite love.
              </motion.p>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="relative"
            >
              <Button asChild size="lg" className="group relative overflow-hidden glow-primary">
                <Link href="/timeline">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                  />
                  <Calendar className="w-4 h-4 mr-2" />
                  Explore Our Journey
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </BentoCard>

          {/* Timer Card */}
          <BentoCard className="md:col-span-2 lg:col-span-2" delay={0.15}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-4 h-4 text-primary/60" />
                <span className="text-xs font-semibold tracking-[0.2em] text-primary/70 uppercase">Together</span>
              </div>
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                <TimeCounter value={timeLeft.days} label="Days" />
                <TimeCounter value={timeLeft.hours} label="Hours" />
                <TimeCounter value={timeLeft.minutes} label="Mins" />
                <TimeCounter value={timeLeft.seconds} label="Secs" />
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
                <Heart className="w-3 h-3 fill-primary/30 text-primary/40" />
                <span className="tracking-wide">And counting forever...</span>
                <Heart className="w-3 h-3 fill-primary/30 text-primary/40" />
              </div>
            </div>
          </BentoCard>

          {/* Feature Cards */}
          <FeatureCard
            href="/map"
            icon={MapPin}
            title="Our Map"
            subtitle="Places we've loved"
            color="secondary"
            delay={0.2}
          />

          <FeatureCard
            href="/gallery"
            icon={Camera}
            title="Gallery"
            subtitle="Captured moments"
            color="accent"
            delay={0.25}
          />

          {/* Bucket List with Progress */}
          <BentoCard href="/bucket-list" className="md:col-span-2 lg:col-span-2" delay={0.3}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ListTodo className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-foreground">Bucket List</h3>
                  <p className="text-sm text-muted-foreground">Dreams we&apos;re chasing</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all -rotate-45" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{completedBucketItems} of {bucketList.length} completed</span>
                <span className="font-medium text-emerald-600">{Math.round(bucketProgress)}%</span>
              </div>
              <Progress value={bucketProgress} className="h-2" />
            </div>
          </BentoCard>

          <FeatureCard
            href="/quiz"
            icon={Trophy}
            title="Love Quiz"
            subtitle="Test your bond"
            color="amber"
            delay={0.35}
          />

          <FeatureCard
            href="/capsule"
            icon={Hourglass}
            title="Time Capsule"
            subtitle="Future memories"
            color="violet"
            delay={0.4}
          />

          {/* Vault Card - Special Styling */}
          <BentoCard href="/vault" className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20" delay={0.45}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ boxShadow: ["0 0 20px rgba(180,100,130,0.2)", "0 0 40px rgba(180,100,130,0.4)", "0 0 20px rgba(180,100,130,0.2)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20"
                >
                  <Lock className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-serif text-xl text-primary">The Secret Vault</h3>
                  <p className="text-sm text-primary/60">Hidden surprises await...</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-primary/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </BentoCard>

        </div>
      </div>
    </main>
  );
}
