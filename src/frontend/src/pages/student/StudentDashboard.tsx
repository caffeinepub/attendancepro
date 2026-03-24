import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Mail,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { Class } from "../../backend";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { useActor } from "../../hooks/useActor";
import {
  MOCK_CLASSES,
  getAttendanceBadge,
  getAttendanceBg,
  getAttendanceColor,
} from "../../utils/helpers";

const PIE_DATA = [
  { name: "Present", value: 76, color: "#22C55E" },
  { name: "Late", value: 8, color: "#F59E0B" },
  { name: "Absent", value: 16, color: "#EF4444" },
];

const MOCK_ALERTS = [
  {
    class: "CS-401 Algorithms",
    pct: 62,
    msg: "Attendance below 75% threshold",
  },
  {
    class: "CS-501 Machine Learning",
    pct: 58,
    msg: "Critical: Risk of attendance shortage",
  },
];

export default function StudentDashboard() {
  const { profile } = useAuth();
  const { actor } = useActor();
  const [_classes, setClasses] = useState<Class[]>([]);
  const [otpBannerVisible, setOtpBannerVisible] = useState(true);
  const [mockOtp] = useState(() =>
    Math.floor(100000 + Math.random() * 900000).toString(),
  );

  useEffect(() => {
    actor
      ?.getEnrolledClasses()
      .then((c) => {
        if (c.length) setClasses(c);
      })
      .catch(() => {});
  }, [actor]);

  const mockSubjects = MOCK_CLASSES.map((c, i) => ({
    ...c,
    pct: [88, 62, 91, 58, 83][i] ?? 75,
  }));
  const overallPct = Math.round(
    mockSubjects.reduce((s, c) => s + c.pct, 0) / mockSubjects.length,
  );
  const atRisk = mockSubjects.filter((c) => c.pct < 75).length;
  const subjectsBelow80 = mockSubjects.filter((c) => c.pct < 80);

  const kpis = [
    {
      label: "Enrolled Classes",
      value: String(mockSubjects.length),
      icon: BookOpen,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Overall Attendance",
      value: `${overallPct}%`,
      icon: TrendingUp,
      color: overallPct >= 75 ? "text-emerald-400" : "text-amber-400",
      bg: overallPct >= 75 ? "bg-emerald-500/10" : "bg-amber-500/10",
    },
    {
      label: "Classes at Risk",
      value: String(atRisk),
      icon: AlertTriangle,
      color: atRisk > 0 ? "text-red-400" : "text-emerald-400",
      bg: atRisk > 0 ? "bg-red-500/10" : "bg-emerald-500/10",
    },
    {
      label: "Sessions This Month",
      value: "48",
      icon: Calendar,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <Layout>
      {/* OTP Alert Banner */}
      {otpBannerVisible && subjectsBelow80.length > 0 && (
        <div
          data-ocid="student.card"
          className="mb-5 flex items-start gap-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-amber-300 font-semibold text-sm">
              OTP Alert Received
            </p>
            <p className="text-[#94A3B8] text-xs mt-0.5">
              An attendance alert OTP has been sent to your registered email for
              subjects with attendance below 80%.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[#94A3B8] text-xs">Your OTP:</span>
              <span className="px-3 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 font-mono font-bold text-sm tracking-widest">
                {mockOtp}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOtpBannerVisible(false)}
            data-ocid="student.close_button"
            className="text-[#94A3B8] hover:text-[#EAF0FF] transition-colors flex-shrink-0"
            aria-label="Dismiss OTP alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#EAF0FF]">
          Welcome back, {profile?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-[#94A3B8] text-sm mt-1">
          Track your attendance across all subjects.
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
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#151F2E] border border-[#223047] rounded-xl p-5">
          <h2 className="text-[#EAF0FF] font-semibold mb-4">
            Attendance Overview
          </h2>
          <ResponsiveContainer width="100%" height={200}>
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

        <div className="lg:col-span-2 bg-[#151F2E] border border-[#223047] rounded-xl p-5">
          <h2 className="text-[#EAF0FF] font-semibold mb-4">
            Attendance Alerts
          </h2>
          {MOCK_ALERTS.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-[#94A3B8] text-sm">
                ✓ All subjects above threshold
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {MOCK_ALERTS.map((alert) => (
                <div
                  key={alert.class}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${
                    alert.pct < 65
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-amber-500/30 bg-amber-500/5"
                  }`}
                >
                  <div
                    className={`w-1 h-12 rounded-full flex-shrink-0 ${
                      alert.pct < 65 ? "bg-red-500" : "bg-amber-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-[#EAF0FF] text-sm font-medium">
                      {alert.class}
                    </p>
                    <p className="text-[#94A3B8] text-xs mt-0.5">{alert.msg}</p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      alert.pct < 65 ? "text-red-400" : "text-amber-400"
                    }`}
                  >
                    {alert.pct}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-[#EAF0FF] font-semibold mb-3">
        Subject-wise Attendance
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSubjects.map((cls) => (
          <div
            key={String(cls.id)}
            className="bg-[#151F2E] border border-[#223047] rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[#EAF0FF] font-semibold text-sm">
                  {cls.subject}
                </h3>
                <p className="text-[#94A3B8] text-xs">
                  {cls.name} · Sec {cls.section}
                </p>
              </div>
              <span
                className={`text-xl font-bold ${getAttendanceColor(cls.pct)}`}
              >
                {cls.pct}%
              </span>
            </div>
            <div className="w-full bg-[#223047] rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${getAttendanceBg(cls.pct)} transition-all`}
                style={{ width: `${cls.pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[#94A3B8] text-xs">
                {Math.round(cls.pct * 0.2)}/20 sessions attended
              </p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${getAttendanceBadge(cls.pct)}`}
              >
                {cls.pct >= 75
                  ? "Good"
                  : cls.pct >= 60
                    ? "Warning"
                    : "Critical"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
