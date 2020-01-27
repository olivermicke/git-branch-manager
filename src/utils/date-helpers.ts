const MILLISECONDS_PER_DAY = 86400000;

export const daysBetween = (dateA: Date, dateB: Date): number =>
  Math.abs(dateA.getTime() - dateB.getTime()) / MILLISECONDS_PER_DAY;
