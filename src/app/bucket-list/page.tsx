"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

export default function BucketListPage() {
  const { bucketList, addBucketListItem, updateBucketListItem, deleteBucketListItem } = useAppStore();
  const hydrated = useStoreHydrated();
  const [newItemText, setNewItemText] = useState("");

  const toggleItem = (id: string) => {
    const item = bucketList.find(i => i.id === id);
    if (item) {
      updateBucketListItem(id, { completed: !item.completed });
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
  const progress = bucketList.length > 0 ? (completedCount / bucketList.length) * 100 : 0;

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-romantic-gradient p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-romantic-radial" />
      <div className="paper-texture" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                 <Button asChild variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary transition-colors text-muted-foreground mb-4">
                    <Link href="/">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Home
                    </Link>
                </Button>
                <h1 className="font-serif text-5xl md:text-6xl text-foreground tracking-tight">Bucket List</h1>
                <p className="text-muted-foreground mt-2">Dreams we&apos;re chasing together.</p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/60 shadow-lg min-w-[200px]">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-3xl font-serif text-primary font-bold">{Math.round(progress)}%</span>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Completed</span>
                </div>
                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary"
                    />
                </div>
            </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            {/* List Section */}
            <div className="space-y-4">
                 <form onSubmit={addItem} className="flex gap-4 mb-8">
                    <Input 
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Add a new adventure..."
                        className="bg-white/80 h-14 text-lg"
                    />
                    <Button type="submit" size="icon-lg" className="rounded-full shrink-0">
                        <Plus className="w-6 h-6" />
                    </Button>
                </form>

                <div className="space-y-3">
                    {bucketList.map((item) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={item.id}
                            className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${item.completed ? "bg-primary/5 border-primary/10" : "bg-white/60 border-white/50 hover:border-primary/20"}`}
                        >
                            <button 
                                onClick={() => toggleItem(item.id)}
                                className={`shrink-0 transition-colors ${item.completed ? "text-primary" : "text-muted-foreground/40 hover:text-primary/60"}`}
                            >
                                {item.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </button>
                            
                            <span className={`flex-1 text-lg font-medium transition-all ${item.completed ? "text-muted-foreground line-through decoration-primary/30" : "text-foreground"}`}>
                                {item.text}
                            </span>

                            <button 
                                onClick={() => deleteItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Inspiration/Stats Sidebar (Hidden on mobile) */}
            <div className="hidden md:block space-y-6">
                 <div className="bg-secondary/10 p-8 rounded-[2rem]">
                    <h3 className="font-serif text-xl mb-4 text-secondary-foreground">Themes</h3>
                    <div className="flex flex-wrap gap-2">
                        {["Travel", "Food", "Adventure", "Home", "Wellness"].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/50 rounded-full text-xs font-bold uppercase tracking-wider text-secondary-foreground/70">
                                {tag}
                            </span>
                        ))}
                    </div>
                 </div>
                 
                 <div className="p-8 rounded-[2rem] border border-dashed border-primary/20 flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-4xl">🌍</span>
                    <p className="text-sm text-muted-foreground font-serif italic">
                        &quot;The world is a book and those who do not travel read only one page.&quot;
                    </p>
                 </div>
            </div>
        </div>
      </div>
    </main>
  );
}
