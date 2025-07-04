"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DonutChartComponent({ data }) {
  if (!data || data.length === 0) return null;

  const COLORS = ["#2563eb", "#dc2626", "#f59e0b", "#059669", "#7c3aed", "#6b7280"];

  const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    return (
      <div
        style={{
          backgroundColor: "#111",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          fontSize: "14px",
          lineHeight: "1.4",
        }}
      >
        <div style={{ fontWeight: "600", marginBottom: "4px" }}>{entry.name}</div>
        <div>{entry.value} logs</div>
      </div>
    );
  }
  return null;
};


  return (
    <div className="dashboard-card">
      <h2 className="dashboard-card-title">Severity Breakdown</h2>
      <ResponsiveContainer width="100%" height={250} className="mb-6">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
