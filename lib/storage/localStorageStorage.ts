import type { Goal, GoalStorage } from "./types";

const STORAGE_KEY = "doit:goals";

export class LocalStorageGoalStorage implements GoalStorage {
  private read(): Goal[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Goal[]) : [];
    } catch {
      return [];
    }
  }

  private write(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (err) {
      if (err instanceof DOMException && err.name === "QuotaExceededError") {
        throw new Error(
          "Storage is full. Please delete some goals to continue."
        );
      }
      throw err;
    }
  }

  async getAll(): Promise<Goal[]> {
    return Promise.resolve(this.read());
  }

  async getById(id: string): Promise<Goal | null> {
    const goals = this.read();
    return Promise.resolve(goals.find((g) => g.id === id) ?? null);
  }

  async create(data: Pick<Goal, "title" | "endDate">): Promise<Goal> {
    const goals = this.read();
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: data.title,
      endDate: data.endDate,
      status: "active",
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    this.write([...goals, newGoal]);
    return Promise.resolve(newGoal);
  }

  async update(
    id: string,
    data: Partial<Pick<Goal, "title" | "endDate" | "status" | "completedAt">>
  ): Promise<Goal> {
    const goals = this.read();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) throw new Error(`Goal ${id} not found`);
    const updated: Goal = { ...goals[index], ...data };
    const newGoals = [...goals];
    newGoals[index] = updated;
    this.write(newGoals);
    return Promise.resolve(updated);
  }

  async remove(id: string): Promise<void> {
    const goals = this.read();
    this.write(goals.filter((g) => g.id !== id));
    return Promise.resolve();
  }
}
