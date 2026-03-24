import { Download } from "lucide-react";
import { useState } from "react";
import Layout from "../../components/Layout";
import {
  MOCK_CLASSES,
  MOCK_STUDENTS,
  exportToCSV,
  getAttendanceBadge,
} from "../../utils/helpers";

const generateStudentStats = (classAvg: number) =>
  MOCK_STUDENTS.map((s, i) => {
    const attended = Math.round(
      (20 * (classAvg + (i % 3 === 0 ? -10 : i % 3 === 1 ? 5 : 0))) / 100,
    );
    const total = 20;
    const absent = total - attended;
    const pct = Math.round((attended / total) * 100);
    return { name: s.name, id: s.id, total, attended, absent, pct };
  });

export default function FacultyReportsPage() {
  const [selectedClass, setSelectedClass] = useState(MOCK_CLASSES[0].name);
  const cls =
    MOCK_CLASSES.find((c) => c.name === selectedClass) || MOCK_CLASSES[0];
  const stats = generateStudentStats(cls.avg);

  const handleExport = () => {
    exportToCSV(
      stats.map((s) => ({
        Name: s.name,
        ID: s.id,
        Total: s.total,
        Attended: s.attended,
        Absent: s.absent,
        Percentage: `${s.pct}%`,
      })),
      `${selectedClass}-report.csv`,
    );
  };

  const avg = Math.round(stats.reduce((s, x) => s + x.pct, 0) / stats.length);
  const atRisk = stats.filter((s) => s.pct < 75).length;

  return (
    <Layout title="Class Reports">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-[#151F2E] border border-[#223047] rounded-lg px-3 py-2 text-[#EAF0FF] text-sm outline-none"
        >
          {MOCK_CLASSES.map((c) => (
            <option key={String(c.id)} value={c.name}>
              {c.name} - {c.subject}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          {
            label: "Class Average",
            value: `${avg}%`,
            color: avg >= 75 ? "text-emerald-400" : "text-amber-400",
          },
          {
            label: "At Risk (<75%)",
            value: String(atRisk),
            color: atRisk > 0 ? "text-red-400" : "text-emerald-400",
          },
          {
            label: "Total Students",
            value: String(stats.length),
            color: "text-[#EAF0FF]",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#151F2E] border border-[#223047] rounded-xl p-4"
          >
            <p className="text-[#94A3B8] text-xs mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#151F2E] border border-[#223047] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#223047]">
              {[
                "#",
                "Student",
                "ID",
                "Sessions",
                "Attended",
                "Absent",
                "Attendance",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr
                key={s.id}
                className="border-b border-[#223047] last:border-0 hover:bg-[#1a2740]"
              >
                <td className="px-4 py-3 text-[#94A3B8] text-sm">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs">
                      {s.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <span className="text-[#EAF0FF] text-sm">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#94A3B8] text-xs font-mono">
                  {s.id}
                </td>
                <td className="px-4 py-3 text-[#94A3B8] text-sm">{s.total}</td>
                <td className="px-4 py-3 text-emerald-400 text-sm">
                  {s.attended}
                </td>
                <td className="px-4 py-3 text-red-400 text-sm">{s.absent}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${getAttendanceBadge(s.pct)}`}
                  >
                    {s.pct}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
