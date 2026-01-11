"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";

export default function VaultAdminPage() {
  const { vault, updateVault } = useAppStore();
  const [form, setForm] = useState(vault);
  const [saved, setSaved] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVault(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="font-serif text-3xl text-foreground mb-2">The Vault</h2>
        <p className="text-muted-foreground">Manage the secret message revealed after unlocking.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-xl">Secret Content</h3>
              <p className="text-sm text-muted-foreground">This is revealed when visitors unlock the vault.</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Main Message / Headline</label>
            <Input
              value={form.hiddenMessage}
              onChange={(e) => setForm({ ...form, hiddenMessage: e.target.value })}
              placeholder="e.g., Pack your bags!"
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">This is the big reveal headline.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Sub Message</label>
            <textarea
              value={form.subMessage}
              onChange={(e) => setForm({ ...form, subMessage: e.target.value })}
              placeholder="e.g., We're going to Italy this summer!"
              className="w-full min-h-[80px] px-4 py-3 rounded-xl border border-input bg-white/50 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">Additional details or message.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Confirmation Code</label>
            <div className="relative">
              <Input
                type={showCode ? "text" : "password"}
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g., AMORE-2025"
                className="pr-12 font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">A special code displayed after unlock (like a ticket confirmation).</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h4 className="font-medium text-foreground mb-3">Preview</h4>
          <div className="bg-white/50 p-6 rounded-xl text-center space-y-3 border border-dashed border-primary/20">
            <h3 className="font-serif text-2xl text-foreground">{form.hiddenMessage || "Your Headline"}</h3>
            <p className="text-primary italic">{form.subMessage || "Your sub message"}</p>
            <div className="pt-3">
              <span className="font-mono text-lg font-bold tracking-wider">{form.code || "CODE-XXXX"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" size="lg" className="gap-2">
            <Save className="w-4 h-4" />
            Save Vault Content
          </Button>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-emerald-600 font-medium"
            >
              Saved successfully!
            </motion.span>
          )}
        </div>
      </form>
    </div>
  );
}
