import { Download, FileText } from "lucide-react";
import { useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import { MOCK_CLASSES, getAttendanceBadge } from "../../utils/helpers";

const MOCK_RECORDS = [
  {
    date: "Dec 20, 2024",
    class: "CS-301",
    subject: "Data Structures",
    status: "present",
  },
  {
    date: "Dec 18, 2024",
    class: "CS-401",
    subject: "Algorithms",
    status: "absent",
  },
  {
    date: "Dec 17, 2024",
    class: "CS-201",
    subject: "Web Development",
    status: "present",
  },
  {
    date: "Dec 16, 2024",
    class: "CS-501",
    subject: "Machine Learning",
    status: "absent",
  },
  {
    date: "Dec 15, 2024",
    class: "CS-302",
    subject: "Database Systems",
    status: "present",
  },
  {
    date: "Dec 13, 2024",
    class: "CS-301",
    subject: "Data Structures",
    status: "late",
  },
  {
    date: "Dec 12, 2024",
    class: "CS-401",
    subject: "Algorithms",
    status: "present",
  },
  {
    date: "Dec 11, 2024",
    class: "CS-201",
    subject: "Web Development",
    status: "present",
  },
];

const statusStyle: Record<string, string> = {
  present: "bg-emerald-500/20 text-emerald-400",
  absent: "bg-red-500/20 text-red-400",
  late: "bg-amber-500/20 text-amber-400",
};

export default function StudentAttendancePage() {
  const { profile } = useAuth();
  const [filterClass, setFilterClass] = useState("all");
  const [downloading, setDownloading] = useState(false);

  const filtered =
    filterClass === "all"
      ? MOCK_RECORDS
      : MOCK_RECORDS.filter((r) => r.class === filterClass);

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const rows = MOCK_CLASSES.map((c) => ({
        Subject: c.subject,
        Class: c.name,
        Total: 20,
        Attended: Math.round((20 * c.avg) / 100),
        Percentage: `${c.avg}%`,
      }));
      const headers = Object.keys(rows[0]);
      const csv = [
        `Attendance Report - ${profile?.name || "Student"}`,
        `Generated: ${new Date().toLocaleDateString()}`,
        "",
        headers.join(","),
        ...rows.map((r) =>
          headers.map((h) => (r as Record<string, unknown>)[h]).join(","),
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-report-${profile?.name?.replace(/\s/g, "-") || "student"}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
    setDownloading(false);
  };

  return (
    <Layout title="My Attendance">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <label htmlFor="class-filter" className="text-[#94A3B8] text-sm">
            Filter:
          </label>
          <select
            id="class-filter"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-[#151F2E] border border-[#223047] rounded-lg px-3 py-2 text-[#EAF0FF] text-sm outline-none"
          >
            <option value="all">All Classes</option>
            {MOCK_CLASSES.map((c) => (
              <option key={String(c.id)} value={c.name}>
                {c.name} - {c.subject}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleDownloadReport}
          disabled={downloading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {downloading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {MOCK_CLASSES.map((c) => (
          <div
            key={String(c.id)}
            className="bg-[#151F2E] border border-[#223047] rounded-xl p-3 text-center"
          >
            <p className="text-[#94A3B8] text-xs mb-1">{c.name}</p>
            <p
              className={`text-lg font-bold ${getAttendanceBadge(c.avg).split(" ")[1]}`}
            >
              {c.avg}%
            </p>
            <div className="w-full bg-[#223047] rounded-full h-1 mt-1">
              <div
                className={`h-1 rounded-full ${c.avg >= 75 ? "bg-emerald-500" : c.avg >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${c.avg}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#151F2E] border border-[#223047] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#223047] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#94A3B8]" />
          <h2 className="text-[#EAF0FF] font-semibold">Attendance Records</h2>
          <span className="text-[#94A3B8] text-sm ml-1">
            ({filtered.length} records)
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#223047]">
              {["Date", "Class", "Subject", "Status"].map((h) => (
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
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-[#94A3B8] text-sm"
                >
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={`${r.date}-${r.class}`}
                  className="border-b border-[#223047] last:border-0 hover:bg-[#1a2740] transition-colors"
                >
                  <td className="px-4 py-3 text-[#94A3B8] text-sm">{r.date}</td>
                  <td className="px-4 py-3 text-[#EAF0FF] text-sm font-medium">
                    {r.class}
                  </td>
                  <td className="px-4 py-3 text-[#94A3B8] text-sm">
                    {r.subject}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
                        statusStyle[r.status] || "",
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
