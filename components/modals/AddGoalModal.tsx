"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, endDate: string) => Promise<void>;
}

export function AddGoalModal({ open, onOpenChange, onSubmit }: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setTitle("");
    setEndDate("");
    setTitleError("");
    setDateError("");
    setSubmitting(false);
  }

  function handleOpenChange(val: boolean) {
    if (!val) reset();
    onOpenChange(val);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;

    if (!title.trim()) {
      setTitleError("Title is required (max 100 characters)");
      valid = false;
    } else if (title.trim().length > 100) {
      setTitleError("Title is required (max 100 characters)");
      valid = false;
    } else {
      setTitleError("");
    }

    const today = new Date().toISOString().slice(0, 10);
    if (!endDate) {
      setDateError("End date must be today or in the future");
      valid = false;
    } else if (endDate < today) {
      setDateError("End date must be today or in the future");
      valid = false;
    } else {
      setDateError("");
    }

    if (!valid) return;

    setSubmitting(true);
    try {
      await onSubmit(title.trim(), endDate);
      reset();
    } catch (err) {
      setTitleError(err instanceof Error ? err.message : "Failed to create goal");
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-lg border-0 shadow-[0_24px_48px_-12px_rgba(255,127,112,0.15)]">
        {/* Orange gradient header */}
        <div
          className="px-8 pt-10 pb-12 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #ff7f70 0%, #ff9e94 100%)" }}
        >
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="font-headline text-3xl font-bold tracking-tight text-white mb-2">
                Ignite a New Path
              </DialogTitle>
            </DialogHeader>
            <p className="text-white/90 leading-relaxed text-sm">
              Define your objective and set the milestone. Clarity is the first step to achievement.
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-8 pt-10 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="goal-title" className="text-xs font-bold tracking-wide text-[#64748b] uppercase">
              Goal Title
            </Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Master Minimalist UI Design"
              maxLength={100}
              className="bg-[#f1f5f9] border-0 rounded-xl px-5 py-4 focus-visible:ring-2 focus-visible:ring-[#ff7f70]/20"
            />
            {titleError && <p className="text-xs text-[#ef4444]">{titleError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-xs font-bold tracking-wide text-[#64748b] uppercase">
              End Date
            </Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              min={today}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#f1f5f9] border-0 rounded-xl px-5 py-4 focus-visible:ring-2 focus-visible:ring-[#ff7f70]/20"
            />
            {dateError && <p className="text-xs text-[#ef4444]">{dateError}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#ff7f70] hover:bg-[#f47164] text-white rounded-xl font-semibold"
            >
              {submitting ? "Creating…" : "Create Goal"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              className="rounded-xl text-[#64748b]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
