import { AlertTriangle, Bell, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "alert",
    title: "Low Attendance Alert",
    message: "Carlos Rivera dropped to 58% in CS-501 ML",
    time: "2 min ago",
    read: false,
    severity: "red",
  },
  {
    id: 2,
    type: "alert",
    title: "Low Attendance Alert",
    message: "Alex Thompson at 62% in CS-401 Algorithms",
    time: "15 min ago",
    read: false,
    severity: "amber",
  },
  {
    id: 3,
    type: "alert",
    title: "Low Attendance Alert",
    message: "Emily Davis dropped to 68% in CS-401 Algorithms",
    time: "1 hr ago",
    read: false,
    severity: "amber",
  },
  {
    id: 4,
    type: "info",
    title: "OTP Sent",
    message: "OTP alert dispatched to GAUTHAM for Mathematics",
    time: "2 hr ago",
    read: true,
    severity: "blue",
  },
  {
    id: 5,
    type: "info",
    title: "Attendance Marked",
    message: "ROBERT LANGER marked attendance for CS-401",
    time: "3 hr ago",
    read: true,
    severity: "green",
  },
];

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const dismiss = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const severityStyles: Record<string, string> = {
    red: "bg-red-500/10 border-red-500/30 text-red-400",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    green: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  };

  const dotStyles: Record<string, string> = {
    red: "bg-red-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    green: "bg-emerald-500",
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-lg bg-[#151F2E] border border-[#223047] flex items-center justify-center text-[#94A3B8] hover:text-[#EAF0FF] transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-[#0C1422] border border-[#223047] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#223047]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="text-[#EAF0FF] font-semibold text-sm">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-[#3a4a62] mx-auto mb-2" />
                <p className="text-[#94A3B8] text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-[#1a2538] last:border-0 transition-colors ${
                    n.read ? "opacity-60" : "bg-[#111C2E]"
                  }`}
                >
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dotStyles[n.severity]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${severityStyles[n.severity]}`}
                      >
                        {n.type === "alert" ? (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Alert
                          </span>
                        ) : (
                          n.title
                        )}
                      </span>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-[#EAF0FF] text-xs leading-snug">
                      {n.message}
                    </p>
                    <p className="text-[#4a5a72] text-[10px] mt-1">{n.time}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(n.id)}
                    className="text-[#4a5a72] hover:text-[#94A3B8] flex-shrink-0 mt-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-[#223047]">
              <button
                type="button"
                onClick={() => setNotifications([])}
                className="text-[#94A3B8] hover:text-red-400 text-xs transition-colors"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
