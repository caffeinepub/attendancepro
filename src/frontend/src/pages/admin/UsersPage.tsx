import { Search, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { type User, UserRole } from "../../backend";
import Layout from "../../components/Layout";
import { useActor } from "../../hooks/useActor";
import { cn } from "../../lib/utils";

const roleBadge: Record<string, string> = {
  [UserRole.admin]: "bg-purple-500/20 text-purple-300",
  [UserRole.faculty]: "bg-blue-500/20 text-blue-300",
  [UserRole.student]: "bg-emerald-500/20 text-emerald-300",
};

const MOCK_USERS: User[] = [
  {
    id: { toText: () => "admin-1" } as never,
    name: "Sarah Chen",
    email: "admin@attendancepro.com",
    role: UserRole.admin,
    department: "Administration",
    createdAt: 0n,
  },
  {
    id: { toText: () => "fac-1" } as never,
    name: "Dr. James Wilson",
    email: "james.wilson@college.edu",
    role: UserRole.faculty,
    facultyId: "FAC001",
    department: "Computer Science",
    createdAt: 0n,
  },
  {
    id: { toText: () => "fac-2" } as never,
    name: "Prof. Lisa Park",
    email: "lisa.park@college.edu",
    role: UserRole.faculty,
    facultyId: "FAC002",
    department: "Mathematics",
    createdAt: 0n,
  },
  {
    id: { toText: () => "stu-1" } as never,
    name: "Alex Thompson",
    email: "alex.t@student.edu",
    role: UserRole.student,
    studentId: "STU001",
    department: "Computer Science",
    createdAt: 0n,
  },
  {
    id: { toText: () => "stu-2" } as never,
    name: "Priya Sharma",
    email: "priya.s@student.edu",
    role: UserRole.student,
    studentId: "STU002",
    department: "Computer Science",
    createdAt: 0n,
  },
  {
    id: { toText: () => "stu-3" } as never,
    name: "Michael Chen",
    email: "michael.c@student.edu",
    role: UserRole.student,
    studentId: "STU003",
    department: "Computer Science",
    createdAt: 0n,
  },
];

type TabType = "all" | "faculty" | "student";

export default function UsersPage() {
  const { actor } = useActor();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [tab, setTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: UserRole.student,
    studentId: "",
    facultyId: "",
    department: "",
  });

  useEffect(() => {
    actor
      ?.getAllUsers()
      .then((u) => {
        if (u.length) setUsers(u);
      })
      .catch(() => {});
  }, [actor]);

  const filtered = users.filter((u) => {
    const matchTab = tab === "all" || u.role === tab;
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleDelete = (id: string) =>
    setUsers((u) => u.filter((x) => x.id.toText() !== id));

  const handleAdd = () => {
    setUsers((u) => [
      ...u,
      {
        id: { toText: () => `new-${Date.now()}` } as never,
        ...form,
        createdAt: 0n,
      },
    ]);
    setShowModal(false);
    setForm({
      name: "",
      email: "",
      role: UserRole.student,
      studentId: "",
      facultyId: "",
      department: "",
    });
  };

  const tabs: { label: string; value: TabType }[] = [
    { label: "All Users", value: "all" },
    { label: "Faculty", value: "faculty" },
    { label: "Students", value: "student" },
  ];

  return (
    <Layout title="User Management">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex bg-[#151F2E] border border-[#223047] rounded-lg p-1 gap-1">
          {tabs.map((t) => (
            <button
              type="button"
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                tab === t.value
                  ? "bg-blue-600 text-white"
                  : "text-[#94A3B8] hover:text-[#EAF0FF]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#151F2E] border border-[#223047] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-[#94A3B8]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="bg-transparent text-[#EAF0FF] text-sm placeholder:text-[#94A3B8] outline-none w-40"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <div className="bg-[#151F2E] border border-[#223047] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#223047]">
              {["Name", "Email", "Role", "ID", "Department", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-[#94A3B8] text-sm"
                >
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr
                  key={u.id.toText()}
                  className="border-b border-[#223047] last:border-0 hover:bg-[#1a2740] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {u.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <span className="text-[#EAF0FF] text-sm font-medium">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#94A3B8] text-sm">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        roleBadge[u.role],
                      )}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#94A3B8] text-sm font-mono">
                    {u.studentId || u.facultyId || "-"}
                  </td>
                  <td className="px-4 py-3 text-[#94A3B8] text-sm">
                    {u.department || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(u.id.toText())}
                      className="text-[#94A3B8] hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151F2E] border border-[#223047] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-[#EAF0FF] font-semibold text-lg mb-5">
              Add New User
            </h3>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="user-name"
                  className="text-[#94A3B8] text-xs mb-1 block"
                >
                  Full Name
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full bg-[#0C1422] border border-[#223047] rounded-lg px-3 py-2 text-[#EAF0FF] text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="user-email"
                  className="text-[#94A3B8] text-xs mb-1 block"
                >
                  Email
                </label>
                <input
                  id="user-email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full bg-[#0C1422] border border-[#223047] rounded-lg px-3 py-2 text-[#EAF0FF] text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="user-dept"
                  className="text-[#94A3B8] text-xs mb-1 block"
                >
                  Department
                </label>
                <input
                  id="user-dept"
                  type="text"
                  value={form.department}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, department: e.target.value }))
                  }
                  className="w-full bg-[#0C1422] border border-[#223047] rounded-lg px-3 py-2 text-[#EAF0FF] text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="user-role"
                  className="text-[#94A3B8] text-xs mb-1 block"
                >
                  Role
                </label>
                <select
                  id="user-role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, role: e.target.value as UserRole }))
                  }
                  className="w-full bg-[#0C1422] border border-[#223047] rounded-lg px-3 py-2 text-[#EAF0FF] text-sm outline-none focus:border-blue-500"
                >
                  <option value={UserRole.student}>Student</option>
                  <option value={UserRole.faculty}>Faculty</option>
                  <option value={UserRole.admin}>Admin</option>
                </select>
              </div>
              {form.role === UserRole.student && (
                <div>
                  <label
                    htmlFor="user-sid"
                    className="text-[#94A3B8] text-xs mb-1 block"
                  >
                    Student ID
                  </label>
                  <input
                    id="user-sid"
                    value={form.studentId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, studentId: e.target.value }))
                    }
                    className="w-full bg-[#0C1422] border border-[#223047] rounded-lg px-3 py-2 text-[#EAF0FF] text-sm outline-none focus:border-blue-500"
                  />
                </div>
              )}
              {form.role === UserRole.faculty && (
                <div>
                  <label
                    htmlFor="user-fid"
                    className="text-[#94A3B8] text-xs mb-1 block"
                  >
                    Faculty ID
                  </label>
                  <input
                    id="user-fid"
                    value={form.facultyId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, facultyId: e.target.value }))
                    }
                    className="w-full bg-[#0C1422] border border-[#223047] rounded-lg px-3 py-2 text-[#EAF0FF] text-sm outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-[#223047] rounded-lg text-[#94A3B8] hover:text-[#EAF0FF] text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
