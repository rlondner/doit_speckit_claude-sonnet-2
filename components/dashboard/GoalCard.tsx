import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getDaysLeft, isUrgent, isOverdue } from "@/lib/utils/dates";
import type { Goal } from "@/lib/storage/types";

interface GoalCardProps {
  goal: Goal;
  onToggleComplete: (id: string) => void;
  onClick: (goal: Goal) => void;
}

export function GoalCard({ goal, onToggleComplete, onClick }: GoalCardProps) {
  const daysLeft = getDaysLeft(goal.endDate);
  const urgent = isUrgent(goal.endDate);
  const overdue = isOverdue(goal.endDate);

  let badgeClass = "bg-[#e2e8f0] text-[#475569] border-0";
  let badgeLabel = `${daysLeft} DAYS LEFT`;
  let cardClass =
    "flex items-center gap-4 p-4 rounded-xl bg-[#ffffff] border border-[#e2e8f0] cursor-pointer min-h-[56px] transition-shadow hover:shadow-md";

  if (overdue) {
    badgeClass = "bg-[#fee2e2] text-[#7f1d1d] border-0";
    badgeLabel = "Overdue";
    cardClass += " border-l-4 border-l-[#ef4444]";
  } else if (urgent) {
    badgeClass = "bg-[#fee2e2] text-[#7f1d1d] border-0";
    badgeLabel = `${daysLeft} DAYS LEFT`;
    cardClass += " border-l-4 border-l-[#ff7f70]";
  }

  return (
    <div className={cardClass} onClick={() => onClick(goal)} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(goal); }}>
      <Checkbox
        checked={false}
        onCheckedChange={() => onToggleComplete(goal.id)}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Mark "${goal.title}" as complete`}
        className="shrink-0"
      />
      <span className="flex-1 font-medium text-[#1e293b] text-sm leading-snug">{goal.title}</span>
      <Badge className={badgeClass}>{badgeLabel}</Badge>
    </div>
  );
}
