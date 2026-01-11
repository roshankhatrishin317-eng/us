"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
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
        <p className="text-muted-foreground">Configure your website details and security.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="font-serif text-xl text-foreground border-b border-border/50 pb-3">General</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Couple Name</label>
            <Input
              value={form.coupleName}
              onChange={(e) => setForm({ ...form, coupleName: e.target.value })}
              placeholder="e.g., Roshan & Alisha"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Relationship Start Date</label>
            <Input
              type="datetime-local"
              value={form.relationshipStartDate.slice(0, 16)}
              onChange={(e) => setForm({ ...form, relationshipStartDate: e.target.value + ":00" })}
            />
            <p className="text-xs text-muted-foreground">This is used for the countdown timer on the homepage.</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h3 className="font-serif text-xl text-foreground border-b border-border/50 pb-3">Security</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Site Passcode</label>
            <div className="relative">
              <Input
                type={showPasscode ? "text" : "password"}
                value={form.passcode}
                onChange={(e) => setForm({ ...form, passcode: e.target.value })}
                placeholder="Enter site passcode"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Used for login and vault access.</p>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
