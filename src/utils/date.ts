export function newDatePlusMinutes(minutes: number) {
  const now = new Date();
  return new Date(now.getTime() + minutes * 60_000);
}
