import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, isSameMonth } from "date-fns";

export function dateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function monthKey(d: Date): string {
  return format(d, "yyyy-MM");
}

export function weekRange(d: Date): { from: string; to: string } {
  const from = startOfWeek(d, { weekStartsOn: 1 });
  const to = endOfWeek(d, { weekStartsOn: 1 });
  return { from: dateKey(from), to: dateKey(to) };
}

export function monthGrid(d: Date): Date[] {
  const start = startOfWeek(startOfMonth(d), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(d), { weekStartsOn: 1 });
  const days: Date[] = [];
  for (let cur = start; cur <= end; cur = addDays(cur, 1)) days.push(cur);
  return days;
}

export function isInMonth(day: Date, month: Date): boolean {
  return isSameMonth(day, month);
}
