"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore, MapLocation } from "@/lib/store";

export default function LocationsPage() {
  const { locations, addLocation, updateLocation, deleteLocation } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<MapLocation, "id">>({
    lat: 0,
    lng: 0,
    title: "",
    description: "",
  });

  const resetForm = () => {
    setForm({ lat: 0, lng: 0, title: "", description: "" });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleAdd = () => {
    if (!form.title) return;
    addLocation(form);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingId || !form.title) return;
    updateLocation(editingId, form);
    resetForm();
  };

  const startEdit = (location: MapLocation) => {
    setEditingId(location.id);
    setForm({
      lat: location.lat,
      lng: location.lng,
      title: location.title,
      description: location.description,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-foreground mb-2">Map Locations</h2>
          <p className="text-muted-foreground">Add places you&apos;ve visited together.</p>
        </div>
        <Button 
          onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
          className="gap-2"
          disabled={isAdding}
        >
          <Plus className="w-4 h-4" />
          Add Location
        </Button>
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 rounded-2xl space-y-4"
          >
            <h3 className="font-serif text-xl text-foreground">
              {isAdding ? "Add New Location" : "Edit Location"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Where We Met"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="A short note about this place"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <Input
                  type="number"
                  step="any"
                  value={form.lat}
                  onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., 40.7128"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <Input
                  type="number"
                  step="any"
                  value={form.lng}
                  onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g., -74.0060"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: Find coordinates on Google Maps by right-clicking any location.
            </p>

            <div className="flex gap-3 pt-2">
              <Button onClick={isAdding ? handleAdd : handleUpdate} className="gap-2">
                <Save className="w-4 h-4" />
                {isAdding ? "Add Location" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={resetForm} className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 rounded-2xl group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg text-foreground">{location.title}</h3>
                {location.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{location.description}</p>
                )}
                <p className="text-xs text-muted-foreground/60 mt-2 font-mono">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startEdit(location)}
                className="flex-1 gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteLocation(location.id)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}

        {locations.length === 0 && (
          <div className="col-span-full glass-card p-12 rounded-2xl text-center">
            <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">No Locations Yet</h3>
            <p className="text-muted-foreground">Add your first map pin to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
