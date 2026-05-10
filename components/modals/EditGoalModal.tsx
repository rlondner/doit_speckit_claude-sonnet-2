"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Goal } from "@/lib/storage/types";

interface EditGoalModalProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, title: string, endDate: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function EditGoalModal({
  goal,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: EditGoalModalProps) {
  const [title, setTitle] = useState(goal?.title ?? "");
  const [endDate, setEndDate] = useState(goal?.endDate ?? "");
  const [titleError, setTitleError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!goal) return;

    if (!title.trim()) {
      setTitleError("Title is required (max 100 characters)");
      return;
    }
    if (title.trim().length > 100) {
      setTitleError("Title is required (max 100 characters)");
      return;
    }
    setTitleError("");
    setSaving(true);
    try {
      await onSave(goal.id, title.trim(), endDate);
    } catch (err) {
      setTitleError(err instanceof Error ? err.message : "Failed to save goal");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!goal) return;
    setDeleting(true);
    try {
      await onDelete(goal.id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-lg border-0 shadow-[0_24px_48px_-12px_rgba(255,127,112,0.15)]">
        {/* Orange gradient header */}
        <div
          className="px-8 pt-10 pb-12 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #ff7f70 0%, #ff9e94 100%)" }}
        >
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="font-headline text-3xl font-bold tracking-tight text-white mb-2">
                Edit Your Goal
              </DialogTitle>
            </DialogHeader>
            <p className="text-white/90 leading-relaxed text-sm">
              Refine your objective or adjust the deadline as your journey evolves.
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Form body */}
        <form onSubmit={handleSave} className="p-8 pt-10 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-xs font-bold tracking-wide text-[#64748b] uppercase">
              Goal Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="bg-[#f1f5f9] border-0 rounded-xl px-5 py-4 focus-visible:ring-2 focus-visible:ring-[#ff7f70]/20"
            />
            {titleError && <p className="text-xs text-[#ef4444]">{titleError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-end-date" className="text-xs font-bold tracking-wide text-[#64748b] uppercase">
              End Date
            </Label>
            <Input
              id="edit-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#f1f5f9] border-0 rounded-xl px-5 py-4 focus-visible:ring-2 focus-visible:ring-[#ff7f70]/20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#ff7f70] hover:bg-[#f47164] text-white rounded-xl font-semibold"
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-[#64748b]"
            >
              Cancel
            </Button>
          </div>

          {/* Delete section */}
          <div className="pt-2 border-t border-[#e2e8f0]">
            <AlertDialog>
              <AlertDialogTrigger
                className="text-sm text-[#ef4444] hover:text-[#991b1b] font-medium transition-colors"
              >
                Delete Goal
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your goal. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-[#ef4444] hover:bg-[#991b1b] text-white"
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
