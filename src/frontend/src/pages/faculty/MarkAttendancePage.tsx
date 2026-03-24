import { Bell, Check, CheckSquare, Clock, X } from "lucide-react";
import { useState } from "react";
import Layout from "../../components/Layout";
import OtpAlertModal from "../../components/OtpAlertModal";
import { useActor } from "../../hooks/useActor";
import { cn } from "../../lib/utils";
import { MOCK_CLASSES, MOCK_STUDENTS } from "../../utils/helpers";

type Status = "present" | "absent" | "late";

// Mock cumulative attendance percentages per student index
const MOCK_CUMULATIVE: Record<string, number> = {
  [MOCK_STUDENTS[0]?.id ?? ""]: 62,
  [MOCK_STUDENTS[1]?.id ?? ""]: 71,
};

function getCumulativeAttendance(studentId: string): number {
  return MOCK_CUMULATIVE[studentId] ?? 88;
}

function buildDefaultAttendance(): Record<string, Status> {
  const result: Record<string, Status> = {};
  for (const s of MOCK_STUDENTS) {
    result[s.id] = "present";
  }
  return result;
}

function buildAllAttendance(status: Status): Record<string, Status> {
  const result: Record<string, Status> = {};
  for (const s of MOCK_STUDENTS) {
    result[s.id] = status;
  }
  return result;
}

export default function MarkAttendancePage() {
  const { actor } = useActor();
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessionId, setSessionId] = useState<bigint | null>(null);
  const [attendance, setAttendance] = useState<Record<string, Status>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");

  const startSession = async () => {
    setLoading(true);
    setSaved(false);
    setAttendance(buildDefaultAttendance());
    try {
      const classId =
        MOCK_CLASSES.find((c) => c.name === selectedClass)?.id || 1n;
      const ts = BigInt(new Date(date).getTime()) * 1_000_000n;
      const id = await actor?.createAttendanceSession(classId, ts);
      setSessionId(id !== undefined ? id : 1n);
    } catch {
      setSessionId(1n);
    }
    setLoading(false);
  };

  const saveAttendance = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSaved(true);
    } catch {}
    setLoading(false);
  };

  const sendOtpAlerts = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(newOtp);
    setOtpModalOpen(true);
  };

  // Students whose cumulative attendance is below 80%
  const belowThreshold = MOCK_STUDENTS.filter(
    (s) => getCumulativeAttendance(s.id) < 80,
  ).map((s) => ({
    name: s.name,
    attendance: getCumulativeAttendance(s.id),
    email: `${s.name.toLowerCase().replace(/\s+/g, "")}@student.edu`,
  }));

  const statusConfig = {
    present: {
      label: "Present",
      icon: Check,
      color: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
      active: "bg-emerald-600 border-emerald-600 text-white",
    },
    absent: {
      label: "Absent",
      icon: X,
      color: "bg-red-500/20 border-red-500/50 text-red-400",
      active: "bg-red-600 border-red-600 text-white",
    },
    late: {
      label: "Late",
      icon: Clock,
      color: "bg-amber-500/20 border-amber-500/50 text-amber-400",
      active: "bg-amber-600 border-amber-600 text-white",
    },
  };

  const presentCount = Object.values(attendance).filter(
    (s) => s === "present",
  ).length;
  const absentCount = Object.values(attendance).filter(
    (s) => s === "absent",
  ).length;
  const lateCount = Object.values(attendance).filter(
    (s) => s === "late",
  ).length;

  return (
    <Layout title="Mark Attendance">
      {!sessionId ? (
        <div className="max-w-lg">
          <div className="bg-[#151F2E] border border-[#223047] rounded-xl p-6 space-y-4">
            <div>
              <label
                htmlFor="class-select"
                className="text-[#94A3B8] text-xs mb-1.5 block"
              >
                Select Class
              </label>
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                data-ocid="mark_attendance.select"
                className="w-full bg-[#0C1422] border border-[#223047] rounded-lg px-3 py-2.5 text-[#EAF0FF] text-sm outline-none focus:border-blue-500"
              >
                <option value="">Choose a class...</option>
                {MOCK_CLASSES.map((c) => (
                  <option key={String(c.id)} value={c.name}>
                    {c.name} - {c.subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="date-input"
                className="text-[#94A3B8] text-xs mb-1.5 block"
              >
                Session Date
              </label>
              <input
                id="date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-ocid="mark_attendance.input"
                className="w-full bg-[#0C1422] border border-[#223047] rounded-lg px-3 py-2.5 text-[#EAF0FF] text-sm outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={startSession}
              disabled={!selectedClass || loading}
              data-ocid="mark_attendance.primary_button"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              {loading ? "Starting..." : "Start Attendance Session"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#94A3B8] text-sm">
              {selectedClass} ·{" "}
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                {presentCount} present
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                {absentCount} absent
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                {lateCount} late
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setAttendance(buildAllAttendance("present"))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-600/30 transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5" /> Mark All Present
            </button>
            <button
              type="button"
              onClick={() => setAttendance(buildAllAttendance("absent"))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-medium hover:bg-red-600/30 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Mark All Absent
            </button>
          </div>

          <div className="bg-[#151F2E] border border-[#223047] rounded-xl overflow-hidden mb-4">
            {MOCK_STUDENTS.map((student, i) => {
              const status = attendance[student.id] || "present";
              const cumPct = getCumulativeAttendance(student.id);
              return (
                <div
                  key={student.id}
                  className={cn(
                    "flex items-center justify-between px-5 py-3.5 border-b border-[#223047] last:border-0",
                    i % 2 === 0 ? "" : "bg-[#0C1422]/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {student.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-[#EAF0FF] text-sm font-medium">
                        {student.name}
                      </p>
                      <p className="text-[#94A3B8] text-xs">
                        {student.id}{" "}
                        <span
                          className={cn(
                            "ml-1 font-medium",
                            cumPct < 65
                              ? "text-red-400"
                              : cumPct < 80
                                ? "text-amber-400"
                                : "text-emerald-400",
                          )}
                        >
                          ({cumPct}% cumulative)
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(Object.keys(statusConfig) as Status[]).map((s) => {
                      const { icon: Icon, color, active } = statusConfig[s];
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() =>
                            setAttendance((a) => ({ ...a, [student.id]: s }))
                          }
                          className={cn(
                            "flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all",
                            status === s ? active : color,
                          )}
                        >
                          <Icon className="w-3 h-3" />
                          <span className="hidden sm:inline">
                            {statusConfig[s].label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {saved ? (
            <div className="flex flex-wrap items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-400 font-medium flex-1">
                Attendance saved successfully!
              </p>
              {belowThreshold.length > 0 && (
                <button
                  type="button"
                  onClick={sendOtpAlerts}
                  data-ocid="mark_attendance.secondary_button"
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-sm font-medium transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  Send OTP Alerts ({belowThreshold.length} students)
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={saveAttendance}
              disabled={loading}
              data-ocid="mark_attendance.submit_button"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg font-medium text-sm transition-colors"
            >
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          )}
        </div>
      )}

      <OtpAlertModal
        open={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        students={belowThreshold}
        otp={otp}
      />
    </Layout>
  );
}
