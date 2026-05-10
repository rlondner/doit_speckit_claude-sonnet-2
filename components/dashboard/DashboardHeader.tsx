import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  activeCount: number;
  onAddClick: () => void;
}

export function DashboardHeader({ activeCount, onAddClick }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-[#1e293b]">
          Good morning, Alex
        </h1>
        <p className="text-[#64748b] mt-1">
          You have{" "}
          <span className="text-[#ff7f70] font-semibold">{activeCount} active goal{activeCount !== 1 ? "s" : ""}</span>{" "}
          to focus on today.
        </p>
      </div>
      <Button
        onClick={onAddClick}
        className="bg-[#ff7f70] hover:bg-[#f47164] text-white rounded-full px-6 font-semibold shrink-0"
      >
        + Add New Goal
      </Button>
    </div>
  );
}
