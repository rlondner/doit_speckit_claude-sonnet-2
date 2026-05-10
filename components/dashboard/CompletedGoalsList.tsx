import { getRelativeCompletion } from "@/lib/utils/dates";
import type { Goal } from "@/lib/storage/types";

interface CompletedGoalsListProps {
  goals: Goal[];
  onToggleComplete: (id: string) => void;
  onClick: (goal: Goal) => void;
}

export function CompletedGoalsList({ goals, onToggleComplete, onClick }: CompletedGoalsListProps) {
  const sorted = [...goals].sort((a, b) => {
    if (!a.completedAt) return 1;
    if (!b.completedAt) return -1;
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
  });

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-headline text-lg font-bold text-[#1e293b] mb-1">Recently Completed</h2>
      {sorted.length === 0 ? (
        <p className="text-[#64748b] text-sm py-8 text-center">
          No completed goals yet — keep going!
        </p>
      ) : (
        sorted.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] min-h-[56px] cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onClick(goal)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(goal); }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onToggleComplete(goal.id); }}
              className="shrink-0 w-5 h-5 rounded-full bg-[#ff7f70] flex items-center justify-center text-white"
              aria-label={`Restore "${goal.title}"`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm line-through text-[#64748b] truncate">{goal.title}</p>
              {goal.completedAt && (
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  {getRelativeCompletion(goal.completedAt)}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
