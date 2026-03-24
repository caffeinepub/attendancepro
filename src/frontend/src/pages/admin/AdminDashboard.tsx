import { AlertTriangle, BookOpen, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useActor } from "../../hooks/useActor";
import {
  MOCK_CLASSES,
  MOCK_WEEKLY_DATA,
  getAttendanceBadge,
} from "../../utils/helpers";

const PIE_DATA = [
  { name: "Present", value: 78, color: "#22C55E" },
  { name: "Late", value: 10, color: "#F59E0B" },
  { name: "Absent", value: 12, color: "#EF4444" },
];

const MOCK_ALERTS = [
  {
    name: "Alex Thompson",
    class: "CS-401 Algorithms",
    pct: 62,
    severity: "amber",
  },
  { name: "Carlos Rivera", class: "CS-501 ML", pct: 58, severity: "red" },
  {
    name: "Emily Davis",
    class: "CS-401 Algorithms",
    pct: 68,
    severity: "amber",
  },
];

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { actor } = useActor();
  const [analytics, setAnalytics] = useState({
    totalClasses: 5n,
    avgAttendance: 82n,
    lowAttendanceCount: 3n,
  });

  useEffect(() => {
    actor
      ?.getSystemAnalytics()
      .then(setAnalytics)
      .catch(() => {});
  }, [actor]);

  const kpis = [
    {
      label: "Total Students",
      value: "247",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      delta: "+12 this month",
    },
    {
      label: "Total Classes",
      value: String(Number(analytics.totalClasses) || 5),
      icon: BookOpen,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      delta: "Active",
    },
    {
      label: "Avg Attendance",
      value: `${Number(analytics.avgAttendance) || 82}%`,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      delta: "+0.5%",
    },
    {
      label: "Active Alerts",
      value: String(Number(analytics.lowAttendanceCount) || 3),
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      delta: "Low attendance",
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#EAF0FF]">
          Welcome back, {profile?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-[#94A3B8] text-sm mt-1">
          Here's what's happening with attendance today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className="bg-[#151F2E] border border-[#223047] rounded-xl p-5"
            >
              <div
                className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-3`}
              >
                <Icon className={`w-5 h-5 ${k.color}`} />
              </div>
              <p className="text-[#94A3B8] text-xs uppercase tracking-wide mb-1">
                {k.label}
              </p>
              <p className="text-[#EAF0FF] text-2xl font-bold">{k.value}</p>
              <p className="text-[#94A3B8] text-xs mt-1">{k.delta}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-[#151F2E] border border-[#223047] rounded-xl p-5">
          <h2 className="text-[#EAF0FF] font-semibold mb-4">
            Weekly Attendance Trend
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MOCK_WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
              <XAxis dataKey="day" stroke="#94A3B8" tick={{ fontSize: 12 }} />
              <YAxis
                stroke="#94A3B8"
                tick={{ fontSize: 12 }}
                domain={[60, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "#151F2E",
                  border: "1px solid #223047",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#EAF0FF" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="present"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                name="Present %"
              />
              <Line
                type="monotone"
                dataKey="absent"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
                name="Absent %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#151F2E] border border-[#223047] rounded-xl p-5">
          <h2 className="text-[#EAF0FF] font-semibold mb-4">
            Today's Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                paddingAngle={3}
              >
                {PIE_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#151F2E",
                  border: "1px solid #223047",
                  borderRadius: 8,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#151F2E] border border-[#223047] rounded-xl p-5">
          <h2 className="text-[#EAF0FF] font-semibold mb-4">
            Classes Overview
          </h2>
          <div className="space-y-2">
            {MOCK_CLASSES.map((cls) => (
              <div
                key={String(cls.id)}
                className="flex items-center justify-between py-2 border-b border-[#223047] last:border-0"
              >
                <div>
                  <p className="text-[#EAF0FF] text-sm font-medium">
                    {cls.name}
                  </p>
                  <p className="text-[#94A3B8] text-xs">
                    {cls.subject} · {cls.students} students
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${getAttendanceBadge(cls.avg)}`}
                >
                  {cls.avg}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#151F2E] border border-[#223047] rounded-xl p-5">
          <h2 className="text-[#EAF0FF] font-semibold mb-4">Active Alerts</h2>
          <div className="space-y-3">
            {MOCK_ALERTS.map((alert) => (
              <div
                key={alert.name}
                className={`flex items-start gap-3 p-3 rounded-lg border ${alert.severity === "red" ? "border-red-500/30 bg-red-500/5" : "border-amber-500/30 bg-amber-500/5"}`}
              >
                <div
                  className={`w-1 h-10 rounded-full flex-shrink-0 ${alert.severity === "red" ? "bg-red-500" : "bg-amber-500"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[#EAF0FF] text-sm font-medium">
                    {alert.name}
                  </p>
                  <p className="text-[#94A3B8] text-xs">{alert.class}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${alert.severity === "red" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}
                >
                  {alert.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
