import { differenceInCalendarDays, parseISO, formatDistanceToNow } from "date-fns";

export function getDaysLeft(endDate: string): number {
  return differenceInCalendarDays(parseISO(endDate), new Date());
}

export function isUrgent(endDate: string): boolean {
  const daysLeft = getDaysLeft(endDate);
  return daysLeft >= 0 && daysLeft <= 3;
}

export function isOverdue(endDate: string): boolean {
  return getDaysLeft(endDate) < 0;
}

export function getRelativeCompletion(completedAt: string): string {
  return formatDistanceToNow(parseISO(completedAt), { addSuffix: true });
}
