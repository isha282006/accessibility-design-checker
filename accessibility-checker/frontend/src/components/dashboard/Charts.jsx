/**
 * Charts.jsx
 * Recharts-based visualization components for issue analytics
 */

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar, Legend,
} from 'recharts'

// ─── Severity Pie Chart ───────────────────────────────────────
const SEVERITY_COLORS = {
  High:   '#ef4444',
  Medium: '#f59e0b',
  Low:    '#3b82f6',
}

export function SeverityPieChart({ severityCounts = {} }) {
  const data = Object.entries(severityCounts)
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }))
    .filter(d => d.value > 0)

  if (data.length === 0) return <p className="text-sm text-slate-400 text-center py-8">No data</p>

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={75}
          innerRadius={45}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] || '#6366f1'} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ fontSize: 12, color: '#64748b' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ─── Issue Type Bar Chart ─────────────────────────────────────
const TYPE_COLOR = '#6366f1'

export function IssueTypeBarChart({ issueCounts = {} }) {
  const data = Object.entries(issueCounts)
    .map(([name, count]) => ({ name: name.replace(' ', '\n'), count }))
    .sort((a, b) => b.count - a.count)

  if (data.length === 0) return <p className="text-sm text-slate-400 text-center py-8">No data</p>

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          formatter={(value) => [value, 'Issues']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
        />
        <Bar dataKey="count" fill={TYPE_COLOR} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Score Radial Bar ─────────────────────────────────────────
export function ScoreRadialChart({ score = 0 }) {
  const data = [{ name: 'Score', value: score, fill: score >= 80 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#ef4444' }]

  return (
    <ResponsiveContainer width="100%" height={160}>
      <RadialBarChart
        cx="50%" cy="50%"
        innerRadius="60%" outerRadius="90%"
        startAngle={180} endAngle={-180}
        data={data}
      >
        <RadialBar minAngle={15} dataKey="value" cornerRadius={8} />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          fill={data[0].fill} fontSize={28} fontWeight={700} fontFamily="DM Sans, sans-serif">
          {score}
        </text>
        <text x="50%" y="63%" textAnchor="middle" dominantBaseline="middle"
          fill="#94a3b8" fontSize={11} fontFamily="DM Sans, sans-serif">
          / 100
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  )
}
