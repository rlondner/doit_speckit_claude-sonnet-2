import { NextRequest, NextResponse } from "next/server";
import { PostgresGoalStorage } from "@/lib/storage/postgresStorage";

const storage = new PostgresGoalStorage();

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const goal = await storage.getById(id);
    if (!goal) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Goal not found" }, { status: 404 });
    }
    return NextResponse.json({ data: goal });
  } catch (err) {
    console.error("GET /api/goals/[id] error:", err);
    return NextResponse.json({ code: "SERVER_ERROR", message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const existing = await storage.getById(id);
    if (!existing) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Goal not found" }, { status: 404 });
    }

    const body = await req.json() as {
      title?: string;
      endDate?: string;
      status?: "active" | "completed";
      completedAt?: string | null;
    };

    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim().length === 0) {
        return NextResponse.json(
          { code: "VALIDATION_ERROR", message: "Title is required (max 100 characters)" },
          { status: 400 }
        );
      }
      if (body.title.trim().length > 100) {
        return NextResponse.json(
          { code: "VALIDATION_ERROR", message: "Title is required (max 100 characters)" },
          { status: 400 }
        );
      }
      body.title = body.title.trim();
    }

    if (body.endDate !== undefined) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(body.endDate)) {
        return NextResponse.json(
          { code: "VALIDATION_ERROR", message: "Invalid date format" },
          { status: 400 }
        );
      }
    }

    // Auto-manage completedAt based on status transitions
    const updateData: Parameters<typeof storage.update>[1] = { ...body };
    if (body.status === "completed" && existing.status !== "completed") {
      updateData.completedAt = new Date().toISOString();
    } else if (body.status === "active" && existing.status === "completed") {
      updateData.completedAt = null;
    }

    const updated = await storage.update(id, updateData);
    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error("PATCH /api/goals/[id] error:", err);
    return NextResponse.json({ code: "SERVER_ERROR", message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await storage.remove(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/goals/[id] error:", err);
    return NextResponse.json({ code: "SERVER_ERROR", message: "Internal server error" }, { status: 500 });
  }
}
