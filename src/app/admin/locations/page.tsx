"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, MapPin, Calendar, Tag, ImageIcon, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";
import { useAppStore, MapLocation } from "@/lib/store";

const CATEGORY_OPTIONS = ["First Date", "Travel", "Special", "Home", "Restaurant", "Adventure", "Other"];

export default function LocationsPage() {
  const { locations, addLocation, updateLocation, deleteLocation } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<MapLocation, "id">>({
    lat: 0,
    lng: 0,
    title: "",
    description: "",
    date: "",
    category: "",
    images: [],
    notes: "",
  });

  const categories = useMemo(() => 
    [...new Set(locations.map(loc => loc.category).filter(Boolean))],
    [locations]
  );

  const filteredLocations = useMemo(() =>
    activeCategory
      ? locations.filter(loc => loc.category === activeCategory)
      : locations,
    [locations, activeCategory]
  );

  const resetForm = () => {
    setForm({ lat: 0, lng: 0, title: "", description: "", date: "", category: "", images: [], notes: "" });
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
      date: location.date || "",
      category: location.category || "",
      images: location.images || [],
      notes: location.notes || "",
    });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this location?")) {
      deleteLocation(id);
    }
  };

  const addImage = (url: string) => {
    setForm({ ...form, images: [...(form.images || []), url] });
  };

  const removeImage = (index: number) => {
    const newImages = [...(form.images || [])];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-foreground mb-2">Map Locations</h2>
          <p className="text-muted-foreground">Pin your special places with photos, notes, and memories.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="gap-2">
            <a href="/map" target="_blank">
              <Eye className="w-4 h-4" />
              Preview Map
            </a>
          </Button>
          <Button 
            onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
            className="gap-2"
            disabled={isAdding}
          >
            <Plus className="w-4 h-4" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All ({locations.length})
          </button>
          {categories.map((cat) => {
            const count = locations.filter(loc => loc.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as string)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 rounded-2xl space-y-6 border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-foreground">
                  {isAdding ? "Add New Location" : "Edit Location"}
                </h3>
                <Button variant="ghost" size="icon-sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Title *
                  </label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., Where We Met"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g., Travel, First Date"
                      list="category-options"
                    />
                    <datalist id="category-options">
                      {CATEGORY_OPTIONS.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Short Description</label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="A brief description that shows on the map pin"
                />
              </div>

              {/* Coordinates & Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Latitude</label>
                  <Input
                    type="number"
                    step="any"
                    value={form.lat || ""}
                    onChange={(e) => setForm({ ...form, lat: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., 40.7128"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Longitude</label>
                  <Input
                    type="number"
                    step="any"
                    value={form.lng || ""}
                    onChange={(e) => setForm({ ...form, lng: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., -74.0060"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Visited
                  </label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">
                Tip: Find coordinates on Google Maps by right-clicking any location and selecting the coordinates.
              </p>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notes & Memories
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Write about what happened here, how you felt, what you did together..."
                  className="w-full min-h-[120px] p-3 rounded-xl border bg-background resize-y text-sm"
                />
              </div>

              {/* Images */}
              <div className="space-y-4">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Photos ({form.images?.length || 0})
                </label>
                
                {/* Image Grid */}
                {form.images && form.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 hover:bg-red-500 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Image */}
                <ImageUpload
                  value=""
                  onChange={addImage}
                  onRemove={() => {}}
                  accept="image"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={isAdding ? handleAdd : handleUpdate} className="gap-2" disabled={!form.title}>
                  <Save className="w-4 h-4" />
                  {isAdding ? "Add Location" : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={resetForm} className="gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredLocations.map((location, index) => (
            <motion.div
              key={location.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.03 }}
              className={`glass-card rounded-2xl overflow-hidden group ${
                editingId === location.id ? "ring-2 ring-primary" : ""
              }`}
            >
              {/* Image */}
              {location.images && location.images[0] ? (
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img 
                    src={location.images[0]} 
                    alt={location.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {location.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded-full text-white text-xs">
                      +{location.images.length - 1}
                    </span>
                  )}
                  {location.category && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded-full text-xs font-medium">
                      {location.category}
                    </span>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center relative">
                  <MapPin className="w-10 h-10 text-primary/30" />
                  {location.category && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded-full text-xs font-medium">
                      {location.category}
                    </span>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <h3 className="font-serif text-lg text-foreground">{location.title}</h3>
                {location.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{location.description}</p>
                )}
                
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  <span className="font-mono">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                  {location.date && (
                    <>
                      <span>•</span>
                      <span>{new Date(location.date).toLocaleDateString()}</span>
                    </>
                  )}
                </div>

                {/* Actions */}
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
                    onClick={() => handleDelete(location.id)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredLocations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full"
          >
            <div className="glass-card p-12 rounded-2xl text-center">
              <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-foreground mb-2">
                {activeCategory ? `No locations in "${activeCategory}"` : "No Locations Yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {activeCategory 
                  ? "Try a different filter or add new locations."
                  : "Add your first map pin to get started."}
              </p>
              {activeCategory ? (
                <Button variant="outline" onClick={() => setActiveCategory(null)}>
                  Clear Filter
                </Button>
              ) : (
                <Button onClick={() => setIsAdding(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add First Location
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats */}
      {locations.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t text-sm text-muted-foreground">
          <span>{locations.length} {locations.length === 1 ? "location" : "locations"} pinned</span>
          <div className="flex items-center gap-2">
            {categories.slice(0, 4).map(cat => (
              <span key={cat as string} className="px-2 py-1 bg-muted rounded-full text-xs">{cat}</span>
            ))}
            {categories.length > 4 && <span className="text-xs">+{categories.length - 4} more</span>}
          </div>
        </div>
      )}
    </div>
  );
}
