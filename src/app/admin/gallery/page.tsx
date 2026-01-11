"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";
import { useAppStore, GalleryImage } from "@/lib/store";

export default function GalleryAdminPage() {
  const { gallery, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<GalleryImage, "id">>({
    src: "",
    alt: "",
    category: "",
  });

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

  const categories = [...new Set(gallery.map(img => img.category))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-foreground mb-2">Gallery</h2>
          <p className="text-muted-foreground">Manage your photo memories. Upload images directly or use URLs.</p>
        </div>
        <Button 
          onClick={() => { setIsAdding(true); setEditingId(null); setForm({ src: "", alt: "", category: "" }); }}
          className="gap-2"
          disabled={isAdding}
        >
          <Plus className="w-4 h-4" />
          Add Image
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
              {isAdding ? "Add New Image" : "Edit Image"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Image</label>
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
                    <span className="bg-background px-2 text-muted-foreground">or use URL</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={form.src}
                    onChange={(e) => setForm({ ...form, src: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Caption / Description *</label>
                  <Input
                    value={form.alt}
                    onChange={(e) => setForm({ ...form, alt: e.target.value })}
                    placeholder="Our sunset at the beach"
                  />
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
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={isAdding ? handleAdd : handleUpdate} className="gap-2" disabled={!form.src || !form.alt}>
                <Save className="w-4 h-4" />
                {isAdding ? "Add Image" : "Save Changes"}
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
        {gallery.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4 rounded-2xl group"
          >
            <div className="aspect-square rounded-xl bg-muted mb-4 overflow-hidden flex items-center justify-center">
              {image.src ? (
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                  }}
                />
              ) : null}
              <div className={`flex items-center justify-center ${image.src ? "hidden" : ""}`}>
                <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                  {image.category || "Uncategorized"}
                </span>
              </div>
              <h3 className="font-medium text-foreground line-clamp-1">{image.alt}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{image.src}</p>
            </div>

            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startEdit(image)}
                className="flex-1 gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteGalleryImage(image.id)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}

        {gallery.length === 0 && (
          <div className="col-span-full glass-card p-12 rounded-2xl text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">No Images Yet</h3>
            <p className="text-muted-foreground">Add your first photo to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
