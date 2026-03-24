import { UserRole } from "./backend";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import UsersPage from "./pages/admin/UsersPage";
import FacultyClassesPage from "./pages/faculty/FacultyClassesPage";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyReportsPage from "./pages/faculty/FacultyReportsPage";
import MarkAttendancePage from "./pages/faculty/MarkAttendancePage";
import StudentAttendancePage from "./pages/student/StudentAttendancePage";
import StudentDashboard from "./pages/student/StudentDashboard";
import { RouterProvider, useRouter } from "./router";

function AppRoutes() {
  const { path, navigate } = useRouter();
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#94A3B8] text-sm">Loading AttendancePro...</p>
        </div>
      </div>
    );
  }

  if (!profile && path !== "/login") {
    navigate("/login");
    return null;
  }

  if (profile && path === "/login") {
    if (profile.role === UserRole.admin) navigate("/admin");
    else if (profile.role === UserRole.faculty) navigate("/faculty");
    else navigate("/student");
    return null;
  }

  if (path === "/login") return <LoginPage />;
  if (path === "/admin") return <AdminDashboard />;
  if (path === "/admin/users") return <UsersPage />;
  if (path === "/admin/reports") return <AdminReportsPage />;
  if (path === "/faculty") return <FacultyDashboard />;
  if (path === "/faculty/classes") return <FacultyClassesPage />;
  if (path === "/faculty/attendance") return <MarkAttendancePage />;
  if (path === "/faculty/reports") return <FacultyReportsPage />;
  if (path === "/student") return <StudentDashboard />;
  if (path === "/student/attendance") return <StudentAttendancePage />;

  // Default redirect
  if (profile) {
    if (profile.role === UserRole.admin) navigate("/admin");
    else if (profile.role === UserRole.faculty) navigate("/faculty");
    else navigate("/student");
  } else {
    navigate("/login");
  }
  return null;
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </RouterProvider>
  );
}
