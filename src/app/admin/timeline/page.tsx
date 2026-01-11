"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";
import { useAppStore, TimelineEvent } from "@/lib/store";

export default function TimelinePage() {
  const { timeline, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<TimelineEvent, "id">>({
    date: "",
    title: "",
    description: "",
    image: "",
  });

  const resetForm = () => {
    setForm({ date: "", title: "", description: "", image: "" });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleAdd = () => {
    if (!form.title || !form.date) return;
    addTimelineEvent(form);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingId || !form.title || !form.date) return;
    updateTimelineEvent(editingId, form);
    resetForm();
  };

  const startEdit = (event: TimelineEvent) => {
    setEditingId(event.id);
    setForm({
      date: event.date,
      title: event.title,
      description: event.description,
      image: event.image || "",
    });
    setIsAdding(false);
  };

  const sortedTimeline = [...timeline].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-foreground mb-2">Timeline Events</h2>
          <p className="text-muted-foreground">Manage your relationship milestones.</p>
        </div>
        <Button 
          onClick={() => { setIsAdding(true); setEditingId(null); setForm({ date: "", title: "", description: "", image: "" }); }}
          className="gap-2"
          disabled={isAdding}
        >
          <Plus className="w-4 h-4" />
          Add Event
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
              {isAdding ? "Add New Event" : "Edit Event"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date *</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Our First Date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What made this moment special?"
                className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-input bg-white/50 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Event Photo (optional)</label>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                onRemove={() => setForm({ ...form, image: "" })}
                accept="image"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={isAdding ? handleAdd : handleUpdate} className="gap-2" disabled={!form.title || !form.date}>
                <Save className="w-4 h-4" />
                {isAdding ? "Add Event" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={resetForm} className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {sortedTimeline.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 rounded-2xl group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {event.image ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div>
                  <div className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
                    {new Date(event.date).toLocaleDateString("en-US", { 
                      month: "long", 
                      day: "numeric",
                      year: "numeric" 
                    })}
                  </div>
                  <h3 className="font-serif text-xl text-foreground">{event.title}</h3>
                  {event.description && (
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{event.description}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(event)}
                  className="gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteTimelineEvent(event.id)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {timeline.length === 0 && (
          <div className="glass-card p-12 rounded-2xl text-center">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">No Events Yet</h3>
            <p className="text-muted-foreground">Add your first timeline event to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
