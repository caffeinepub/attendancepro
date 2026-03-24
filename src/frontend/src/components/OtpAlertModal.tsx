import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Mail, X } from "lucide-react";

type OtpAlertModalProps = {
  open: boolean;
  onClose: () => void;
  students: Array<{ name: string; attendance: number; email?: string }>;
  otp: string;
};

export default function OtpAlertModal({
  open,
  onClose,
  students,
  otp,
}: OtpAlertModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="bg-[#151F2E] border border-[#223047] text-[#EAF0FF] max-w-md rounded-2xl"
        data-ocid="otp_alert.dialog"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <DialogTitle className="text-[#EAF0FF] text-lg font-bold">
              OTP Attendance Alert Sent
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* OTP Badge */}
        <div className="flex items-center justify-center my-3">
          <div className="px-6 py-3 bg-teal-500/15 border border-teal-500/40 rounded-2xl flex flex-col items-center gap-1">
            <span className="text-teal-300 text-xs uppercase tracking-widest font-semibold">
              One-Time Password
            </span>
            <span className="text-teal-300 text-3xl font-mono font-bold tracking-[0.3em]">
              {otp}
            </span>
          </div>
        </div>

        <p className="text-[#94A3B8] text-sm text-center mb-3">
          The following students have been alerted{" "}
          <span className="text-amber-400 font-medium">
            (attendance &lt; 80%)
          </span>
          :
        </p>

        {/* Student list */}
        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {students.map((s) => {
            const email =
              s.email ??
              `${s.name.toLowerCase().replace(/\s+/g, "")}@student.edu`;
            return (
              <div
                key={s.name}
                className="flex items-center gap-3 p-3 bg-[#0B1220] border border-[#223047] rounded-xl"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {s.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#EAF0FF] text-sm font-medium">{s.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3 text-[#94A3B8]" />
                    <p className="text-[#94A3B8] text-xs truncate">
                      OTP sent to: {email}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold flex-shrink-0 ${
                    s.attendance < 65 ? "text-red-400" : "text-amber-400"
                  }`}
                >
                  {s.attendance}%
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-[#4A6080] text-xs text-center mt-1">
          This OTP has been sent to the student&apos;s registered email address
        </p>

        <div className="flex justify-end pt-1">
          <Button
            onClick={onClose}
            data-ocid="otp_alert.close_button"
            className="bg-[#223047] hover:bg-[#2D3F5A] text-[#EAF0FF] border border-[#2D3F5A] px-5"
          >
            <X className="w-4 h-4 mr-1.5" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
