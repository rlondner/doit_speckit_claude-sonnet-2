import { NextRequest, NextResponse } from "next/server";
import { PostgresGoalStorage } from "@/lib/storage/postgresStorage";

const storage = new PostgresGoalStorage();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    let goals = await storage.getAll();
    if (status === "active" || status === "completed") {
      goals = goals.filter((g) => g.status === status);
    }
    return NextResponse.json({ data: goals });
  } catch (err) {
    console.error("GET /api/goals error:", err);
    return NextResponse.json({ code: "SERVER_ERROR", message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, endDate } = body as { title?: string; endDate?: string };

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", message: "Title is required (max 100 characters)" },
        { status: 400 }
      );
    }
    if (title.trim().length > 100) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", message: "Title is required (max 100 characters)" },
        { status: 400 }
      );
    }
    if (!endDate || typeof endDate !== "string") {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", message: "End date must be today or in the future" },
        { status: 400 }
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(endDate)) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", message: "Invalid date format" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    if (endDate < today) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", message: "End date must be today or in the future" },
        { status: 400 }
      );
    }

    const goal = await storage.create({ title: title.trim(), endDate });
    return NextResponse.json({ data: goal }, { status: 201 });
  } catch (err) {
    console.error("POST /api/goals error:", err);
    return NextResponse.json({ code: "SERVER_ERROR", message: "Internal server error" }, { status: 500 });
  }
}
