'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminCharts({
  data,
}: {
  data: { date: string; trades: number; users: number }[];
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card p-4">
        <p className="font-display text-sm mb-3">Trade baru — 14 hari terakhir</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ left: -20, top: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7DFCF" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6E6255' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#6E6255' }} />
            <Tooltip contentStyle={{ border: '2px solid #1B1712', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="trades" stroke="#D97757" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-4">
        <p className="font-display text-sm mb-3">User baru — 14 hari terakhir</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ left: -20, top: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7DFCF" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6E6255' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#6E6255' }} />
            <Tooltip contentStyle={{ border: '2px solid #1B1712', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="users" stroke="#B4762F" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
