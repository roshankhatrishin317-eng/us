"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="font-serif text-3xl text-foreground mb-2">Site Settings</h2>
        <p className="text-muted-foreground">Configure your website details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-3">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-xl text-foreground">General</h3>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Couple Name</label>
            <Input
              value={form.coupleName}
              onChange={(e) => setForm({ ...form, coupleName: e.target.value })}
              placeholder="e.g., Roshan & Alisha"
            />
            <p className="text-xs text-muted-foreground">Displayed on the homepage hero section.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Relationship Start Date</label>
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                value={form.relationshipStartDate ? form.relationshipStartDate.slice(0, 16) : ""}
                onChange={(e) => setForm({ ...form, relationshipStartDate: e.target.value ? e.target.value + ":00" : "" })}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm({ ...form, relationshipStartDate: "" })}
                className="shrink-0"
              >
                Clear
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Used for the countdown timer. Leave empty to show 00:00:00:00.</p>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-foreground">Show Countdown Timer</label>
              <p className="text-xs text-muted-foreground">Toggle to hide the timer on the homepage (Null Mode).</p>
            </div>
            <Switch
              checked={form.showTimer}
              onCheckedChange={(checked: boolean) => setForm({ ...form, showTimer: checked })}
            />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-3">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-xl text-foreground">Admin Access</h3>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Admin Password</label>
            <div className="relative">
              <Input
                type={showAdminPass ? "text" : "password"}
                value={form.adminPassword}
                onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                placeholder="Enter admin password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowAdminPass(!showAdminPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showAdminPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Used to access this admin panel.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" size="lg" className="gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-emerald-600 font-medium"
            >
              Settings saved!
            </motion.span>
          )}
        </div>
      </form>
    </div>
  );
}
