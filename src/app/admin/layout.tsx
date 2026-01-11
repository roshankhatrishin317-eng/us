"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Calendar, 
  Image, 
  MapPin, 
  ListTodo, 
  HelpCircle, 
  Lock, 
  Hourglass,
  Menu,
  X,
  Home,
  LogOut,
  Shield,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { useStoreHydrated } from "@/lib/use-hydrated";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/timeline", label: "Timeline", icon: Calendar },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/bucket-list", label: "Bucket List", icon: ListTodo },
  { href: "/admin/quiz", label: "Quiz", icon: HelpCircle },
  { href: "/admin/vault", label: "Vault", icon: Lock },
  { href: "/admin/capsule", label: "Time Capsule", icon: Hourglass },
];

// Auth state management outside React
let authState = false;
const authListeners = new Set<() => void>();

function getAuthSnapshot() {
  return authState;
}

function getServerSnapshot() {
  return false;
}

function subscribeAuth(callback: () => void) {
  authListeners.add(callback);
  return () => authListeners.delete(callback);
}

function setAuth(value: boolean) {
  authState = value;
  if (typeof window !== "undefined") {
    if (value) {
      sessionStorage.setItem("admin_auth", "true");
    } else {
      sessionStorage.removeItem("admin_auth");
    }
  }
  authListeners.forEach(l => l());
}

// Initialize auth state from sessionStorage
if (typeof window !== "undefined") {
  authState = sessionStorage.getItem("admin_auth") === "true";
}

function useAdminAuth() {
  return useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerSnapshot);
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { settings } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === settings.adminPassword) {
      setAuth(true);
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-romantic-gradient">
      <div className="absolute inset-0 bg-romantic-radial" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-10 rounded-[2rem] text-center space-y-8 z-10"
      >
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Enter admin password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`text-center text-lg ${error ? "border-destructive animate-shake" : ""}`}
          />
          {error && (
            <p className="text-destructive text-sm animate-pulse">Incorrect password</p>
          )}
          <Button type="submit" size="lg" className="w-full">
            Access Dashboard
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  const handleLogout = () => {
    setAuth(false);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-white/50 
        z-50 transform transition-transform duration-300 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold">Admin</h2>
                <p className="text-xs text-muted-foreground">Control Panel</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 space-y-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Home className="w-4 h-4" />
              View Website
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useStoreHydrated();
  const isAuthenticated = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading while checking hydration
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-romantic-gradient">
        <div className="absolute inset-0 bg-romantic-radial" />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Heart className="w-8 h-8 text-primary/50 fill-primary/30" />
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen flex bg-romantic-gradient">
      <div className="absolute inset-0 bg-romantic-radial pointer-events-none" />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-h-screen relative">
        <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-white/50 px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-xl text-foreground">Admin Dashboard</h1>
          </div>
        </header>

        <div className="p-6 md:p-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
