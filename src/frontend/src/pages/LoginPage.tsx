import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { UserRole } from "../backend";
import { useAuth } from "../context/AuthContext";

const CREDENTIALS = [
  {
    username: "DON LEE",
    password: "password-king",
    profile: {
      name: "DON LEE",
      email: "donlee@attendancepro.com",
      role: UserRole.admin,
      facultyId: undefined as string | undefined,
      studentId: undefined as string | undefined,
      department: "Administration",
    },
  },
  {
    username: "ROBERT LANGER",
    password: "password-r1234",
    profile: {
      name: "ROBERT LANGER",
      email: "robert.langer@college.edu",
      role: UserRole.faculty,
      facultyId: "FAC001" as string | undefined,
      studentId: undefined as string | undefined,
      department: "Computer Science",
    },
  },
  {
    username: "GAUTHAM",
    password: "password-ramram",
    profile: {
      name: "GAUTHAM",
      email: "gautham@student.edu",
      role: UserRole.student,
      facultyId: undefined as string | undefined,
      studentId: "STU001" as string | undefined,
      department: "Computer Science",
    },
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const match = CREDENTIALS.find(
      (c) =>
        c.username.toLowerCase() === username.trim().toLowerCase() &&
        c.password === password.trim(),
    );
    if (!match) {
      setError("Invalid username or password");
      return;
    }
    setLoading(true);
    try {
      await login(match.profile);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 mb-4 shadow-lg shadow-blue-500/30">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#EAF0FF] tracking-tight">
            RANGERZZZ
          </h1>
          <p className="text-[#94A3B8] mt-1 text-sm">
            Attendance Management System
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#151F2E] border border-[#223047] rounded-2xl p-7 shadow-2xl">
          <h2 className="text-[#EAF0FF] font-semibold text-lg mb-5">
            Sign In to Your Portal
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="text-[#94A3B8] text-xs font-medium mb-1.5 block uppercase tracking-wider"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                data-ocid="login.input"
                className="w-full bg-[#0B1220] border border-[#223047] rounded-xl px-4 py-3 text-[#EAF0FF] text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 placeholder-[#3D5070] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-[#94A3B8] text-xs font-medium mb-1.5 block uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  data-ocid="login.input"
                  className="w-full bg-[#0B1220] border border-[#223047] rounded-xl px-4 py-3 pr-11 text-[#EAF0FF] text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 placeholder-[#3D5070] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#EAF0FF] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                data-ocid="login.error_state"
                className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              data-ocid="login.submit_button"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-[#4A6080] text-xs mt-5">
            DON LEE / ROBERT LANGER / GAUTHAM — use password-king,
            password-r1234, or password-ramram
          </p>
        </div>

        <p className="text-center text-[#4A6080] text-xs mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
