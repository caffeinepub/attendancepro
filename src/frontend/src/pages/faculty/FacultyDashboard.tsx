import { BookOpen, Calendar, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Class } from "../../backend";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useActor } from "../../hooks/useActor";
import { useRouter } from "../../router";
import {
  MOCK_CLASSES,
  MOCK_WEEKLY_DATA,
  getAttendanceBadge,
  getAttendanceBg,
} from "../../utils/helpers";

export default function FacultyDashboard() {
  const { profile } = useAuth();
  const { actor } = useActor();
  const { navigate } = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    actor
      ?.getFacultyClasses()
      .then((c) => {
        if (c.length) setClasses(c);
      })
      .catch(() => {});
  }, [actor]);

  const displayClasses = classes.length
    ? classes
    : MOCK_CLASSES.map((c) => ({
        id: c.id,
        name: c.name,
        subject: c.subject,
        section: c.section,
        schedule: c.schedule,
        studentIds: Array(c.students).fill(null) as never[],
        facultyId: null as never,
        createdAt: 0n,
      }));

  const totalStudents = displayClasses.reduce(
    (s, c) => s + c.studentIds.length,
    0,
  );

  const kpis = [
    {
      label: "My Classes",
      value: String(displayClasses.length),
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Students",
      value: String(totalStudents || 147),
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Avg Attendance",
      value: "82%",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Sessions This Week",
      value: "12",
      icon: Calendar,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#EAF0FF]">
          Welcome back, {profile?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-[#94A3B8] text-sm mt-1">
          Manage your classes and track attendance.
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
            </div>
          );
        })}
      </div>

      <div className="bg-[#151F2E] border border-[#223047] rounded-xl p-5 mb-6">
        <h2 className="text-[#EAF0FF] font-semibold mb-4">
          Weekly Attendance Trend
        </h2>
        <ResponsiveContainer width="100%" height={200}>
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
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-[#EAF0FF] font-semibold mb-3">My Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_CLASSES.map((cls) => (
          <button
            type="button"
            key={String(cls.id)}
            onClick={() => navigate("/faculty/attendance")}
            className="bg-[#151F2E] border border-[#223047] rounded-xl p-5 cursor-pointer hover:border-blue-500/50 hover:bg-[#1a2740] transition-all text-left w-full"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[#EAF0FF] font-semibold">{cls.name}</h3>
                <p className="text-[#94A3B8] text-xs">{cls.subject}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${getAttendanceBadge(cls.avg)}`}
              >
                {cls.avg}%
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#94A3B8] mb-3">
              <span>Section {cls.section}</span>
              <span>·</span>
              <span>{cls.students} students</span>
            </div>
            <div className="w-full bg-[#223047] rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${getAttendanceBg(cls.avg)}`}
                style={{ width: `${cls.avg}%` }}
              />
            </div>
            <p className="text-[#94A3B8] text-xs mt-2">{cls.schedule}</p>
          </button>
        ))}
      </div>
    </Layout>
  );
}
