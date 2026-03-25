import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import { UserRole } from "../backend";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";
import { Link, useRouter } from "../router";

const navByRole = {
  [UserRole.admin]: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { icon: Bell, label: "Alerts", path: "/admin/reports" },
  ],
  [UserRole.faculty]: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/faculty" },
    { icon: BookOpen, label: "My Classes", path: "/faculty/classes" },
    {
      icon: ClipboardCheck,
      label: "Mark Attendance",
      path: "/faculty/attendance",
    },
    { icon: BarChart3, label: "Reports", path: "/faculty/reports" },
  ],
  [UserRole.student]: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
    { icon: Calendar, label: "My Attendance", path: "/student/attendance" },
    { icon: BarChart3, label: "Reports", path: "/student/attendance" },
  ],
};

const roleColors = {
  [UserRole.admin]: "bg-purple-500/20 text-purple-300",
  [UserRole.faculty]: "bg-blue-500/20 text-blue-300",
  [UserRole.student]: "bg-emerald-500/20 text-emerald-300",
};

const roleIcons = {
  [UserRole.admin]: Shield,
  [UserRole.faculty]: Users,
  [UserRole.student]: GraduationCap,
};

export default function AppSidebar() {
  const { profile, logout } = useAuth();
  const { path } = useRouter();

  if (!profile) return null;

  const navItems = navByRole[profile.role] || [];
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const RoleIcon = roleIcons[profile.role];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0C1422] border-r border-[#223047] flex flex-col z-30">
      <div className="p-5 border-b border-[#223047]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-[#EAF0FF] font-bold text-base tracking-tight">
            AttendencePro
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = path === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-[#94A3B8] hover:text-[#EAF0FF] hover:bg-[#1e2d45]",
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#223047]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#111C2E] mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[#EAF0FF] text-xs font-semibold truncate">
              {profile.name}
            </p>
            <p className="text-[#94A3B8] text-[10px] truncate">
              {profile.email}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between px-1">
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full flex items-center gap-1",
              roleColors[profile.role],
            )}
          >
            <RoleIcon className="w-3 h-3" />
            {profile.role}
          </span>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1 text-[#94A3B8] hover:text-red-400 text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
