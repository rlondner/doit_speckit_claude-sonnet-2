import type { GoalStorage } from "./types";
import { LocalStorageGoalStorage } from "./localStorageStorage";
import { ApiGoalStorage } from "./apiStorage";

export function getStorage(): GoalStorage {
  if (process.env.NEXT_PUBLIC_STORAGE_MODE === "production") {
    return new ApiGoalStorage();
  }
  return new LocalStorageGoalStorage();
}

export type { GoalStorage };
export type { Goal } from "./types";
