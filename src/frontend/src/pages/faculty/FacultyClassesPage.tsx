import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Layout from "../../components/Layout";
import { useActor } from "../../hooks/useActor";
import {
  MOCK_CLASSES,
  getAttendanceBadge,
  getAttendanceBg,
} from "../../utils/helpers";

export default function FacultyClassesPage() {
  const { actor } = useActor();
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    subject: "",
    section: "",
    schedule: "",
  });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await actor?.createClass(
        form.name,
        form.subject,
        form.section,
        [],
        form.schedule,
      );
    } catch {}
    setClasses((c) => [
      ...c,
      { ...form, id: BigInt(Date.now()), students: 0, avg: 0 },
    ]);
    setSaving(false);
    setShowModal(false);
    setForm({ name: "", subject: "", section: "", schedule: "" });
  };

  const handleDelete = async (id: bigint) => {
    try {
      await actor?.deleteClass(id);
    } catch {}
    setClasses((c) => c.filter((x) => x.id !== id));
  };

  const fields = [
    { label: "Class Name", key: "name", id: "cls-name" },
    { label: "Subject", key: "subject", id: "cls-subject" },
    { label: "Section", key: "section", id: "cls-section" },
    { label: "Schedule", key: "schedule", id: "cls-schedule" },
  ];

  return (
    <Layout title="My Classes">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Create Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div
            key={String(cls.id)}
            className="bg-[#151F2E] border border-[#223047] rounded-xl p-5 hover:border-blue-500/40 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleDelete(cls.id)}
                  className="text-[#94A3B8] hover:text-red-400 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-[#EAF0FF] font-semibold mb-0.5">{cls.name}</h3>
            <p className="text-blue-400 text-sm mb-2">{cls.subject}</p>
            <div className="flex items-center gap-3 text-xs text-[#94A3B8] mb-3">
              <span>Section {cls.section}</span>
              <span>·</span>
              <span>{cls.students} students</span>
            </div>
            {cls.avg > 0 && (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#94A3B8]">Avg Attendance</span>
                  <span
                    className={`text-xs font-medium ${getAttendanceBadge(cls.avg)}`}
                  >
                    {cls.avg}%
                  </span>
                </div>
                <div className="w-full bg-[#223047] rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${getAttendanceBg(cls.avg)}`}
                    style={{ width: `${cls.avg}%` }}
                  />
                </div>
              </>
            )}
            <p className="text-[#94A3B8] text-xs mt-3">{cls.schedule}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151F2E] border border-[#223047] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-[#EAF0FF] font-semibold text-lg mb-5">
              Create New Class
            </h3>
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label
                    htmlFor={f.id}
                    className="text-[#94A3B8] text-xs mb-1 block"
                  >
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    className="w-full bg-[#0C1422] border border-[#223047] rounded-lg px-3 py-2 text-[#EAF0FF] text-sm outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-[#223047] rounded-lg text-[#94A3B8] text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create Class"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
