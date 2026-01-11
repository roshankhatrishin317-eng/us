"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Hourglass, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";
import { useAppStore } from "@/lib/store";

export default function CapsuleAdminPage() {
  const { capsule, updateCapsule } = useAppStore();
  const [form, setForm] = useState(capsule);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCapsule(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const unlockDate = new Date(form.unlockDate);
  const now = new Date();
  const isLocked = unlockDate > now;
  const daysUntilUnlock = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="font-serif text-3xl text-foreground mb-2">Time Capsule</h2>
        <p className="text-muted-foreground">Set a message to be revealed on a future date.</p>
      </div>

      <div className={`glass-card p-6 rounded-2xl ${isLocked ? "bg-gradient-to-br from-violet-50/50 to-transparent" : "bg-gradient-to-br from-emerald-50/50 to-transparent"}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isLocked ? "bg-violet-100" : "bg-emerald-100"}`}>
            <Hourglass className={`w-6 h-6 ${isLocked ? "text-violet-600" : "text-emerald-600"}`} />
          </div>
          <div>
            <h3 className="font-serif text-xl">{isLocked ? "Capsule Locked" : "Capsule Unlocked"}</h3>
            <p className="text-sm text-muted-foreground">
              {isLocked 
                ? `Opens in ${daysUntilUnlock} days (${unlockDate.toLocaleDateString()})` 
                : "The message is now visible to visitors"
              }
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="font-serif text-xl text-foreground border-b border-border/50 pb-3">Capsule Settings</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Unlock Date
            </label>
            <Input
              type="datetime-local"
              value={form.unlockDate.slice(0, 16)}
              onChange={(e) => setForm({ ...form, unlockDate: e.target.value + ":00" })}
            />
            <p className="text-xs text-muted-foreground">The capsule content will be hidden until this date.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Hidden Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write a heartfelt message to your future selves..."
              className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-input bg-white/50 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">This message will be revealed when the capsule unlocks.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Memory Photo (optional)</label>
            <ImageUpload
              value={form.image || ""}
              onChange={(url) => setForm({ ...form, image: url })}
              onRemove={() => setForm({ ...form, image: "" })}
              accept="both"
            />
            <p className="text-xs text-muted-foreground">Upload an image or short video to accompany the message.</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h4 className="font-medium text-foreground mb-3">Message Preview</h4>
          <div className="bg-white/50 p-6 rounded-xl border border-dashed border-violet-200">
            <p className="font-serif text-lg italic text-foreground leading-relaxed">
              &quot;{form.message || "Your future message will appear here..."}&quot;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" size="lg" className="gap-2">
            <Save className="w-4 h-4" />
            Save Capsule
          </Button>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-emerald-600 font-medium"
            >
              Capsule saved!
            </motion.span>
          )}
        </div>
      </form>
    </div>
  );
}
