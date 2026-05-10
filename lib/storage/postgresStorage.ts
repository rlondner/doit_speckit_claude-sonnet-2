import type { Goal, GoalStorage } from "./types";
import pool from "../db/pool";
import type { QueryResult } from "pg";

interface GoalRow {
  id: string;
  title: string;
  end_date: string;
  status: "active" | "completed";
  completed_at: string | null;
  created_at: string;
}

function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    title: row.title,
    endDate: typeof row.end_date === "string"
      ? row.end_date.slice(0, 10)
      : new Date(row.end_date).toISOString().slice(0, 10),
    status: row.status,
    completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export class PostgresGoalStorage implements GoalStorage {
  async getAll(): Promise<Goal[]> {
    const result: QueryResult<GoalRow> = await pool.query(
      "SELECT * FROM goals ORDER BY created_at DESC"
    );
    return result.rows.map(rowToGoal);
  }

  async getById(id: string): Promise<Goal | null> {
    const result: QueryResult<GoalRow> = await pool.query(
      "SELECT * FROM goals WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) return null;
    return rowToGoal(result.rows[0]);
  }

  async create(data: Pick<Goal, "title" | "endDate">): Promise<Goal> {
    const result: QueryResult<GoalRow> = await pool.query(
      "INSERT INTO goals (title, end_date) VALUES ($1, $2) RETURNING *",
      [data.title, data.endDate]
    );
    return rowToGoal(result.rows[0]);
  }

  async update(
    id: string,
    data: Partial<Pick<Goal, "title" | "endDate" | "status" | "completedAt">>
  ): Promise<Goal> {
    const fieldMap: Record<string, string> = {
      title: "title",
      endDate: "end_date",
      status: "status",
      completedAt: "completed_at",
    };

    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      const col = fieldMap[key];
      if (col) {
        setClauses.push(`${col} = $${paramIndex++}`);
        values.push(value);
      }
    }

    if (setClauses.length === 0) {
      const existing = await this.getById(id);
      if (!existing) throw new Error(`Goal ${id} not found`);
      return existing;
    }

    values.push(id);
    const result: QueryResult<GoalRow> = await pool.query(
      `UPDATE goals SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) throw new Error(`Goal ${id} not found`);
    return rowToGoal(result.rows[0]);
  }

  async remove(id: string): Promise<void> {
    await pool.query("DELETE FROM goals WHERE id = $1", [id]);
  }
}
