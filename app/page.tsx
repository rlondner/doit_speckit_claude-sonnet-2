"use client";

import { useEffect, useState } from "react";
import { getStorage } from "@/lib/storage";
import type { Goal } from "@/lib/storage/types";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ActiveGoalsList } from "@/components/dashboard/ActiveGoalsList";
import { CompletedGoalsList } from "@/components/dashboard/CompletedGoalsList";
import { AddGoalModal } from "@/components/modals/AddGoalModal";
import { EditGoalModal } from "@/components/modals/EditGoalModal";

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalGoal, setEditModalGoal] = useState<Goal | null>(null);

  const storage = getStorage();

  async function loadGoals() {
    try {
      const all = await storage.getAll();
      setGoals(all);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load goals");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggleComplete(id: string) {
    try {
      const goal = goals.find((g) => g.id === id);
      if (!goal) return;
      if (goal.status === "active") {
        await storage.update(id, {
          status: "completed",
          completedAt: new Date().toISOString(),
        });
      } else {
        await storage.update(id, { status: "active", completedAt: null });
      }
      await loadGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update goal");
    }
  }

  async function handleAddGoal(title: string, endDate: string) {
    await storage.create({ title, endDate });
    await loadGoals();
    setAddModalOpen(false);
  }

  async function handleSaveGoal(id: string, title: string, endDate: string) {
    await storage.update(id, { title, endDate });
    await loadGoals();
    setEditModalGoal(null);
  }

  async function handleDeleteGoal(id: string) {
    await storage.remove(id);
    await loadGoals();
    setEditModalGoal(null);
  }

  const active = goals.filter((g) => g.status === "active");
  const completed = goals.filter((g) => g.status === "completed");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="w-full bg-white border-b border-[#e2e8f0] sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-[#ff7f70] font-headline">Do It</span>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-[#fee2e2] text-[#7f1d1d] text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 font-bold text-[#991b1b]">✕</button>
          </div>
        )}

        <DashboardHeader activeCount={active.length} onAddClick={() => setAddModalOpen(true)} />

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <ActiveGoalsList
              goals={active}
              onToggleComplete={handleToggleComplete}
              onClick={setEditModalGoal}
            />
          </div>
          <div className="flex-1">
            <CompletedGoalsList
              goals={completed}
              onToggleComplete={handleToggleComplete}
              onClick={setEditModalGoal}
            />
          </div>
        </div>
      </main>

      <AddGoalModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleAddGoal}
      />

      <EditGoalModal
        key={editModalGoal?.id ?? "none"}
        goal={editModalGoal}
        open={editModalGoal !== null}
        onOpenChange={(open) => { if (!open) setEditModalGoal(null); }}
        onSave={handleSaveGoal}
        onDelete={handleDeleteGoal}
      />
    </div>
  );
}
