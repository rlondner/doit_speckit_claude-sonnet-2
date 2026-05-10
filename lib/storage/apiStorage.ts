import type { Goal, GoalStorage } from "./types";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body.message ?? res.statusText);
  }
  const json = await res.json();
  return json.data as T;
}

export class ApiGoalStorage implements GoalStorage {
  async getAll(): Promise<Goal[]> {
    const res = await fetch("/api/goals");
    return handleResponse<Goal[]>(res);
  }

  async getById(id: string): Promise<Goal | null> {
    const res = await fetch(`/api/goals/${id}`);
    if (res.status === 404) return null;
    return handleResponse<Goal>(res);
  }

  async create(data: Pick<Goal, "title" | "endDate">): Promise<Goal> {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Goal>(res);
  }

  async update(
    id: string,
    data: Partial<Pick<Goal, "title" | "endDate" | "status" | "completedAt">>
  ): Promise<Goal> {
    const res = await fetch(`/api/goals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Goal>(res);
  }

  async remove(id: string): Promise<void> {
    const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(body.message ?? res.statusText);
    }
  }
}
