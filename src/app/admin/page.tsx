"use client";

import { motion } from "framer-motion";
import { Calendar, Image, MapPin, ListTodo, HelpCircle, Lock, Hourglass, Settings } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

const stats = [
  { label: "Timeline Events", icon: Calendar, href: "/admin/timeline", color: "bg-blue-100 text-blue-600" },
  { label: "Gallery Images", icon: Image, href: "/admin/gallery", color: "bg-amber-100 text-amber-600" },
  { label: "Map Locations", icon: MapPin, href: "/admin/locations", color: "bg-emerald-100 text-emerald-600" },
  { label: "Bucket List Items", icon: ListTodo, href: "/admin/bucket-list", color: "bg-violet-100 text-violet-600" },
  { label: "Quiz Questions", icon: HelpCircle, href: "/admin/quiz", color: "bg-rose-100 text-rose-600" },
];

export default function AdminDashboard() {
  const { settings, timeline, gallery, locations, bucketList, quiz } = useAppStore();

  const counts = {
    "Timeline Events": timeline.length,
    "Gallery Images": gallery.length,
    "Map Locations": locations.length,
    "Bucket List Items": bucketList.length,
    "Quiz Questions": quiz.length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl text-foreground mb-2">Welcome Back</h2>
        <p className="text-muted-foreground">Manage your couple website content from here.</p>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-serif text-xl">{settings.coupleName}</h3>
            <p className="text-sm text-muted-foreground">
              Together since {new Date(settings.relationshipStartDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={stat.href}>
              <div className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all group cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-serif font-bold text-foreground">
                    {counts[stat.label as keyof typeof counts]}
                  </span>
                </div>
                <h3 className="font-medium text-foreground">{stat.label}</h3>
                <p className="text-sm text-muted-foreground">Click to manage</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/vault">
          <div className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all group cursor-pointer bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-foreground">The Vault</h3>
                <p className="text-sm text-muted-foreground">Manage secret messages</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/admin/capsule">
          <div className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all group cursor-pointer bg-gradient-to-br from-violet-50/50 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Hourglass className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-foreground">Time Capsule</h3>
                <p className="text-sm text-muted-foreground">Set unlock date & message</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
