"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, ListTodo, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore, BucketListItem } from "@/lib/store";

export default function BucketListAdminPage() {
  const { bucketList, addBucketListItem, updateBucketListItem, deleteBucketListItem } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<BucketListItem, "id">>({
    text: "",
    completed: false,
  });

  const resetForm = () => {
    setForm({ text: "", completed: false });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleAdd = () => {
    if (!form.text) return;
    addBucketListItem(form);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingId || !form.text) return;
    updateBucketListItem(editingId, form);
    resetForm();
  };

  const startEdit = (item: BucketListItem) => {
    setEditingId(item.id);
    setForm({
      text: item.text,
      completed: item.completed,
    });
    setIsAdding(false);
  };

  const toggleComplete = (item: BucketListItem) => {
    updateBucketListItem(item.id, { completed: !item.completed });
  };

  const completedCount = bucketList.filter(i => i.completed).length;
  const progress = bucketList.length > 0 ? (completedCount / bucketList.length) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-foreground mb-2">Bucket List</h2>
          <p className="text-muted-foreground">Dreams and goals to chase together.</p>
        </div>
        <Button 
          onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
          className="gap-2"
          disabled={isAdding}
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="font-serif text-lg text-primary font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{completedCount} of {bucketList.length} completed</p>
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
              {isAdding ? "Add New Item" : "Edit Item"}
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Goal / Dream *</label>
              <Input
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="e.g., Visit the Northern Lights"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.completed}
                onChange={(e) => setForm({ ...form, completed: e.target.checked })}
                className="w-5 h-5 rounded border-primary text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Mark as completed</span>
            </label>

            <div className="flex gap-3 pt-2">
              <Button onClick={isAdding ? handleAdd : handleUpdate} className="gap-2">
                <Save className="w-4 h-4" />
                {isAdding ? "Add Item" : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={resetForm} className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {bucketList.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`glass-card p-4 rounded-xl group flex items-center gap-4 ${item.completed ? "bg-primary/5" : ""}`}
          >
            <button
              onClick={() => toggleComplete(item)}
              className={`shrink-0 transition-colors ${item.completed ? "text-primary" : "text-muted-foreground/40 hover:text-primary/60"}`}
            >
              {item.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </button>
            
            <span className={`flex-1 font-medium ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {item.text}
            </span>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEdit(item)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteBucketListItem(item.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}

        {bucketList.length === 0 && (
          <div className="glass-card p-12 rounded-2xl text-center">
            <ListTodo className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">No Items Yet</h3>
            <p className="text-muted-foreground">Add your first dream to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
