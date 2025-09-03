export function getCurrentWeek(startDate: Date): number {
  const now = new Date();
  const start = new Date(startDate);
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
  return Math.min(diffWeeks, 12);
}
