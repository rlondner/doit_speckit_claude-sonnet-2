import { getDaysLeft } from "@/lib/utils/dates";
import { GoalCard } from "./GoalCard";
import type { Goal } from "@/lib/storage/types";

interface ActiveGoalsListProps {
  goals: Goal[];
  onToggleComplete: (id: string) => void;
  onClick: (goal: Goal) => void;
}

export function ActiveGoalsList({ goals, onToggleComplete, onClick }: ActiveGoalsListProps) {
  const sorted = [...goals].sort(
    (a, b) => getDaysLeft(a.endDate) - getDaysLeft(b.endDate)
  );

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-headline text-lg font-bold text-[#1e293b] mb-1">Active Goals</h2>
      {sorted.length === 0 ? (
        <p className="text-[#64748b] text-sm py-8 text-center">
          No active goals yet — add one to get started!
        </p>
      ) : (
        sorted.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onToggleComplete={onToggleComplete}
            onClick={onClick}
          />
        ))
      )}
    </div>
  );
}
