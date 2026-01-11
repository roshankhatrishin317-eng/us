"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, HelpCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore, QuizQuestion } from "@/lib/store";

export default function QuizAdminPage() {
  const { quiz, addQuizQuestion, updateQuizQuestion, deleteQuizQuestion } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<QuizQuestion, "id">>({
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });

  const resetForm = () => {
    setForm({ question: "", options: ["", "", "", ""], answer: "" });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleAdd = () => {
    if (!form.question || !form.answer) return;
    const filteredOptions = form.options.filter(o => o.trim());
    if (filteredOptions.length < 2) return;
    addQuizQuestion({ ...form, options: filteredOptions });
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingId || !form.question || !form.answer) return;
    const filteredOptions = form.options.filter(o => o.trim());
    if (filteredOptions.length < 2) return;
    updateQuizQuestion(editingId, { ...form, options: filteredOptions });
    resetForm();
  };

  const startEdit = (q: QuizQuestion) => {
    setEditingId(q.id);
    const paddedOptions = [...q.options];
    while (paddedOptions.length < 4) paddedOptions.push("");
    setForm({
      question: q.question,
      options: paddedOptions,
      answer: q.answer,
    });
    setIsAdding(false);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-foreground mb-2">Quiz Questions</h2>
          <p className="text-muted-foreground">Test how well visitors know your relationship.</p>
        </div>
        <Button 
          onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
          className="gap-2"
          disabled={isAdding}
        >
          <Plus className="w-4 h-4" />
          Add Question
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
              {isAdding ? "Add New Question" : "Edit Question"}
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Question *</label>
              <Input
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="e.g., Where was our first date?"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Options (at least 2)</label>
              {form.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {option === form.answer && (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Correct Answer *</label>
              <select
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-input bg-white/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select the correct answer</option>
                {form.options.filter(o => o.trim()).map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={isAdding ? handleAdd : handleUpdate} className="gap-2">
                <Save className="w-4 h-4" />
                {isAdding ? "Add Question" : "Save Changes"}
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
        {quiz.map((q, index) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 rounded-2xl group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-600 font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-foreground mb-3">{q.question}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((option, i) => (
                    <div 
                      key={i}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        option === q.answer 
                          ? "bg-emerald-100 text-emerald-700 font-medium" 
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {option === q.answer && <CheckCircle className="w-4 h-4 inline mr-2" />}
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startEdit(q)}
                className="gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteQuizQuestion(q.id)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </motion.div>
        ))}

        {quiz.length === 0 && (
          <div className="glass-card p-12 rounded-2xl text-center">
            <HelpCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">No Questions Yet</h3>
            <p className="text-muted-foreground">Add your first quiz question to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
