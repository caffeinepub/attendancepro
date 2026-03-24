export function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getAttendanceColor(pct: number): string {
  if (pct >= 75) return "text-emerald-400";
  if (pct >= 60) return "text-amber-400";
  return "text-red-400";
}

export function getAttendanceBg(pct: number): string {
  if (pct >= 75) return "bg-emerald-500";
  if (pct >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function getAttendanceBadge(pct: number): string {
  if (pct >= 75) return "bg-emerald-500/20 text-emerald-400";
  if (pct >= 60) return "bg-amber-500/20 text-amber-400";
  return "bg-red-500/20 text-red-400";
}

export function exportToCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => JSON.stringify(r[h] ?? "")).join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const MOCK_WEEKLY_DATA = [
  { day: "Mon", present: 88, absent: 12 },
  { day: "Tue", present: 92, absent: 8 },
  { day: "Wed", present: 85, absent: 15 },
  { day: "Thu", present: 90, absent: 10 },
  { day: "Fri", present: 78, absent: 22 },
  { day: "Sat", present: 95, absent: 5 },
  { day: "Sun", present: 70, absent: 30 },
];

export const MOCK_CLASSES = [
  {
    id: 1n,
    name: "CS-301",
    subject: "Data Structures",
    section: "A",
    schedule: "Mon/Wed 10AM",
    students: 32,
    avg: 88,
  },
  {
    id: 2n,
    name: "CS-401",
    subject: "Algorithms",
    section: "B",
    schedule: "Tue/Thu 2PM",
    students: 28,
    avg: 72,
  },
  {
    id: 3n,
    name: "CS-201",
    subject: "Web Development",
    section: "A",
    schedule: "Mon/Fri 11AM",
    students: 35,
    avg: 91,
  },
  {
    id: 4n,
    name: "CS-501",
    subject: "Machine Learning",
    section: "C",
    schedule: "Wed/Fri 3PM",
    students: 22,
    avg: 65,
  },
  {
    id: 5n,
    name: "CS-302",
    subject: "Database Systems",
    section: "B",
    schedule: "Tue/Thu 9AM",
    students: 30,
    avg: 83,
  },
];

export const MOCK_STUDENTS = [
  { id: "STU001", name: "Alex Thompson", dept: "CS" },
  { id: "STU002", name: "Priya Sharma", dept: "CS" },
  { id: "STU003", name: "Michael Chen", dept: "CS" },
  { id: "STU004", name: "Emily Davis", dept: "CS" },
  { id: "STU005", name: "Omar Hassan", dept: "CS" },
  { id: "STU006", name: "Sofia Martinez", dept: "CS" },
  { id: "STU007", name: "Liam Johnson", dept: "CS" },
  { id: "STU008", name: "Aisha Patel", dept: "CS" },
  { id: "STU009", name: "Carlos Rivera", dept: "CS" },
  { id: "STU010", name: "Yuki Tanaka", dept: "CS" },
];
