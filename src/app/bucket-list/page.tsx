"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle, Heart, Sparkles, Star, MapPin, Utensils, Mountain, Home, Leaf } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";
import confetti from "canvas-confetti";

const THEME_ICONS = [
  { name: "Travel", icon: MapPin, color: "text-blue-500" },
  { name: "Food", icon: Utensils, color: "text-orange-500" },
  { name: "Adventure", icon: Mountain, color: "text-emerald-500" },
  { name: "Home", icon: Home, color: "text-violet-500" },
  { name: "Wellness", icon: Leaf, color: "text-green-500" },
];

export default function BucketListPage() {
  const { bucketList, addBucketListItem, updateBucketListItem, deleteBucketListItem } = useAppStore();
  const hydrated = useStoreHydrated();
  const [newItemText, setNewItemText] = useState("");

  const toggleItem = (id: string) => {
    const item = bucketList.find(i => i.id === id);
    if (item) {
      const wasCompleted = item.completed;
      updateBucketListItem(id, { completed: !item.completed });
      
      if (!wasCompleted) {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 },
          colors: ["#c87882", "#a885b5", "#d4a574"]
        });
      }
    }
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    addBucketListItem({ text: newItemText, completed: false });
    setNewItemText("");
  };

  const deleteItem = (id: string) => {
    deleteBucketListItem(id);
  };

  const completedCount = bucketList.filter(i => i.completed).length;
  const pendingCount = bucketList.length - completedCount;
  const progress = bucketList.length > 0 ? (completedCount / bucketList.length) * 100 : 0;

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
    <main className="min-h-screen bg-romantic-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-romantic-radial" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
      />
      
      <div className="paper-texture" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 md:mb-14">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Button asChild variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary text-muted-foreground">
                <Link href="/"><ArrowLeft className="mr-2 w-4 h-4" /> Back to Home</Link>
              </Button>
            </motion.div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-emerald-600" />
                  </div>
                  <Badge variant="glow">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {bucketList.length} Dreams
                  </Badge>
                </div>
                
                <h1 className="font-serif text-4xl md:text-6xl text-foreground">
                  Bucket List
                </h1>
                
                <p className="text-muted-foreground text-lg">
                  Adventures waiting to happen, together.
                </p>
              </motion.div>

              {/* Progress Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 rounded-3xl min-w-[240px]"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-4xl font-serif text-primary font-bold">
                    {Math.round(progress)}%
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{completedCount} done</div>
                    <div className="text-xs text-muted-foreground">{pendingCount} to go</div>
                  </div>
                </div>
                <Progress value={progress} className="h-3" />
              </motion.div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* List Section */}
            <div className="space-y-6">
              {/* Add Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={addItem}
                className="flex gap-3"
              >
                <div className="flex-1 relative">
                  <Input 
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="Add a new dream adventure..."
                    className="glass-card h-14 text-lg pl-5 pr-4 border-0 focus-visible:ring-primary/30"
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-6 rounded-2xl glow-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Add
                </Button>
              </motion.form>

              {/* Items List */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {bucketList.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-card rounded-3xl p-12 text-center"
                    >
                      <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-serif text-xl text-foreground mb-2">No Dreams Yet</h3>
                      <p className="text-muted-foreground">Add your first bucket list item above!</p>
                    </motion.div>
                  ) : (
                    bucketList.map((item, index) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        key={item.id}
                        className={`group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 ${
                          item.completed 
                            ? "glass-card bg-emerald-50/50 border-emerald-200/50" 
                            : "glass-card hover:shadow-lg"
                        }`}
                      >
                        <button 
                          onClick={() => toggleItem(item.id)}
                          className="shrink-0 transition-all duration-300"
                        >
                          {item.completed ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center"
                            >
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            </motion.div>
                          ) : (
                            <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/30 hover:border-primary/60 transition-colors flex items-center justify-center group-hover:border-primary/40">
                              <Circle className="w-5 h-5 text-transparent group-hover:text-primary/30 transition-colors" />
                            </div>
                          )}
                        </button>
                        
                        <span className={`flex-1 text-lg transition-all duration-300 ${
                          item.completed 
                            ? "text-muted-foreground line-through decoration-emerald-400/50 decoration-2" 
                            : "text-foreground"
                        }`}>
                          {item.text}
                        </span>

                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 hidden lg:block">
              {/* Themes */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-3xl p-6"
              >
                <h3 className="font-serif text-lg mb-4 text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Dream Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_ICONS.map(({ name, icon: Icon, color }) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-default"
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-sm text-muted-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Quote */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-3xl p-8 text-center relative overflow-hidden"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
                />
                <span className="text-4xl mb-4 block">🌍</span>
                <p className="text-muted-foreground font-serif italic text-sm leading-relaxed relative z-10">
                  &quot;The world is a book and those who do not travel read only one page.&quot;
                </p>
                <p className="text-xs text-muted-foreground/60 mt-3">— Saint Augustine</p>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-3"
              >
                <div className="glass-card rounded-2xl p-4 text-center">
                  <div className="text-2xl font-serif text-emerald-600">{completedCount}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Completed</div>
                </div>
                <div className="glass-card rounded-2xl p-4 text-center">
                  <div className="text-2xl font-serif text-primary">{pendingCount}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Pending</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
