"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, Image as ImageIcon, Grid3X3, Filter, Eye } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/image-upload";
import { useAppStore, GalleryImage } from "@/lib/store";

export default function GalleryAdminPage() {
  const { gallery, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<GalleryImage, "id">>({
    src: "",
    alt: "",
    category: "",
  });

  const categories = useMemo(() => 
    [...new Set(gallery.map(img => img.category).filter(Boolean))],
    [gallery]
  );

  const filteredGallery = useMemo(() => 
    activeFilter 
      ? gallery.filter(img => img.category === activeFilter)
      : gallery,
    [gallery, activeFilter]
  );

  const resetForm = () => {
    setForm({ src: "", alt: "", category: "" });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleAdd = () => {
    if (!form.src || !form.alt) return;
    addGalleryImage(form);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingId || !form.src || !form.alt) return;
    updateGalleryImage(editingId, form);
    resetForm();
  };

  const startEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setForm({
      src: image.src,
      alt: image.alt,
      category: image.category,
    });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      deleteGalleryImage(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-serif text-3xl text-foreground">Gallery</h2>
            <Badge variant="secondary" className="text-sm">
              {gallery.length} {gallery.length === 1 ? "photo" : "photos"}
            </Badge>
          </div>
          <p className="text-muted-foreground">Manage your photo memories. Upload images or use external URLs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            asChild
            className="gap-2"
          >
            <a href="/gallery" target="_blank">
              <Eye className="w-4 h-4" />
              Preview
            </a>
          </Button>
          <Button 
            onClick={() => { setIsAdding(true); setEditingId(null); setForm({ src: "", alt: "", category: "" }); }}
            className="gap-2"
            disabled={isAdding}
          >
            <Plus className="w-4 h-4" />
            Add Image
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeFilter === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All ({gallery.length})
          </button>
          {categories.map((cat) => {
            const count = gallery.filter(img => img.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === cat
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
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 rounded-2xl space-y-6 border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-foreground">
                  {isAdding ? "Add New Image" : "Edit Image"}
                </h3>
                <Button variant="ghost" size="icon-sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Image Upload */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image</label>
                    <ImageUpload
                      value={form.src}
                      onChange={(url) => setForm({ ...form, src: url })}
                      onRemove={() => setForm({ ...form, src: "" })}
                      accept="image"
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 text-muted-foreground">or paste URL</span>
                    </div>
                  </div>

                  <Input
                    value={form.src}
                    onChange={(e) => setForm({ ...form, src: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Right: Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Caption / Description *</label>
                    <Input
                      value={form.alt}
                      onChange={(e) => setForm({ ...form, alt: e.target.value })}
                      placeholder="Our sunset at the beach"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be shown below the image and used for accessibility.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g., Travel, Food, Candid"
                      list="categories"
                    />
                    <datalist id="categories">
                      {categories.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                    <p className="text-xs text-muted-foreground">
                      Categories help organize your gallery and enable filtering.
                    </p>
                  </div>

                  {/* Preview */}
                  {form.src && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preview</label>
                      <div className="aspect-video rounded-xl bg-muted overflow-hidden relative">
                        <Image
                          src={form.src}
                          alt={form.alt || "Preview"}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t">
                <Button 
                  onClick={isAdding ? handleAdd : handleUpdate} 
                  className="gap-2" 
                  disabled={!form.src || !form.alt}
                >
                  <Save className="w-4 h-4" />
                  {isAdding ? "Add Image" : "Save Changes"}
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredGallery.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.03 }}
              className={`glass-card rounded-xl overflow-hidden group ${
                editingId === image.id ? "ring-2 ring-primary" : ""
              }`}
            >
              {/* Image */}
              <div className="aspect-square bg-muted relative overflow-hidden">
                {image.src ? (
                  <Image 
                    src={image.src} 
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    onClick={() => startEdit(image)}
                    className="h-10 w-10"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => handleDelete(image.id)}
                    className="h-10 w-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Category Badge */}
                {image.category && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      {image.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="p-3">
                <p className="text-sm font-medium text-foreground line-clamp-1">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredGallery.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full"
          >
            <div className="glass-card p-12 rounded-2xl text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Grid3X3 className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">
                {activeFilter ? `No images in "${activeFilter}"` : "No Images Yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {activeFilter 
                  ? "Try a different filter or add new images."
                  : "Upload your first photo to get started."}
              </p>
              {activeFilter ? (
                <Button variant="outline" onClick={() => setActiveFilter(null)}>
                  Clear Filter
                </Button>
              ) : (
                <Button onClick={() => setIsAdding(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add First Image
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats Footer */}
      {gallery.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t text-sm text-muted-foreground">
          <div>
            {gallery.length} total {gallery.length === 1 ? "image" : "images"}
            {categories.length > 0 && ` in ${categories.length} ${categories.length === 1 ? "category" : "categories"}`}
          </div>
          <div className="flex items-center gap-2">
            {categories.slice(0, 5).map(cat => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {cat}
              </Badge>
            ))}
            {categories.length > 5 && (
              <span className="text-xs">+{categories.length - 5} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
