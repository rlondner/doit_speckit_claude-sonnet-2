export interface Goal {
  id: string;
  title: string;
  endDate: string; // 'YYYY-MM-DD'
  status: "active" | "completed";
  completedAt: string | null; // ISO datetime string or null
  createdAt: string; // ISO datetime string
}

export interface GoalStorage {
  getAll(): Promise<Goal[]>;
  getById(id: string): Promise<Goal | null>;
  create(data: Pick<Goal, "title" | "endDate">): Promise<Goal>;
  update(
    id: string,
    data: Partial<Pick<Goal, "title" | "endDate" | "status" | "completedAt">>
  ): Promise<Goal>;
  remove(id: string): Promise<void>;
}
