import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Layout from "../../components/Layout";
import {
  MOCK_CLASSES,
  MOCK_WEEKLY_DATA,
  exportToCSV,
  getAttendanceBadge,
} from "../../utils/helpers";

const monthlyData = [
  { month: "Jan", attendance: 82 },
  { month: "Feb", attendance: 85 },
  { month: "Mar", attendance: 88 },
  { month: "Apr", attendance: 79 },
  { month: "May", attendance: 91 },
  { month: "Jun", attendance: 87 },
];

export default function AdminReportsPage() {
  const handleExport = () => {
    exportToCSV(
      MOCK_CLASSES.map((c) => ({
        Class: c.name,
        Subject: c.subject,
        Section: c.section,
        Students: c.students,
        "Avg Attendance": `${c.avg}%`,
      })),
      "attendance-report.csv",
    );
  };

  return (
    <Layout title="Analytics & Reports">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#151F2E] border border-[#223047] rounded-xl p-5">
          <h2 className="text-[#EAF0FF] font-semibold mb-4">Weekly Trend</h2>
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
        <div className="bg-[#151F2E] border border-[#223047] rounded-xl p-5">
          <h2 className="text-[#EAF0FF] font-semibold mb-4">
            Monthly Attendance
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
              <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 12 }} />
              <YAxis
                stroke="#94A3B8"
                tick={{ fontSize: 12 }}
                domain={[70, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "#151F2E",
                  border: "1px solid #223047",
                  borderRadius: 8,
                }}
              />
              <Bar
                dataKey="attendance"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name="Attendance %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-[#151F2E] border border-[#223047] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#223047]">
          <h2 className="text-[#EAF0FF] font-semibold">Class Summary</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#223047]">
              {[
                "Class",
                "Subject",
                "Section",
                "Students",
                "Avg Attendance",
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
            {MOCK_CLASSES.map((c) => (
              <tr
                key={String(c.id)}
                className="border-b border-[#223047] last:border-0 hover:bg-[#1a2740]"
              >
                <td className="px-4 py-3 text-[#EAF0FF] text-sm font-medium">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-[#94A3B8] text-sm">
                  {c.subject}
                </td>
                <td className="px-4 py-3 text-[#94A3B8] text-sm">
                  {c.section}
                </td>
                <td className="px-4 py-3 text-[#94A3B8] text-sm">
                  {c.students}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${getAttendanceBadge(c.avg)}`}
                  >
                    {c.avg}%
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
