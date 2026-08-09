export function last14DaySeries<T extends { created_at: string }>(
  trades: T[],
  users: T[]
): { date: string; trades: number; users: number }[] {
  const days: { date: string; key: string; trades: number; users: number }[] = [];
  const now = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    days.push({ date: label, key, trades: 0, users: 0 });
  }

  const bucket = new Map(days.map((d) => [d.key, d]));

  trades.forEach((t) => {
    const key = t.created_at?.slice(0, 10);
    const day = bucket.get(key);
    if (day) day.trades++;
  });

  users.forEach((u) => {
    const key = u.created_at?.slice(0, 10);
    const day = bucket.get(key);
    if (day) day.users++;
  });

  return days.map(({ date, trades, users }) => ({ date, trades, users }));
}
