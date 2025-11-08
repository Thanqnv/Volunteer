import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, UserCheck, UserX } from "lucide-react";
import EventDetailLayout from "@/components/manager/event/EventDetailLayout";
import EventNotFound from "@/components/manager/event/EventNotFound";
import { useManagerEvent } from "@/hooks/useManagerEvent";

const defaultEvaluations = (event) =>
  event?.volunteers.reduce((acc, vol) => {
    acc[vol.id] = "pending";
    return acc;
  }, {}) ?? {};

export default function ManagerEventCompletion() {
  const { event, eventId, isReady } = useManagerEvent();
  const [evaluations, setEvaluations] = useState(() =>
    defaultEvaluations(event)
  );
  const [notes, setNotes] = useState({});
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    if (event) {
      setEvaluations(defaultEvaluations(event));
      setNotes({});
      setSavedAt(null);
    }
  }, [event]);

  const stats = useMemo(() => {
    const values = Object.values(evaluations);
    const completed = values.filter((value) => value === "completed").length;
    const pending = values.filter((value) => value !== "completed").length;
    return { completed, pending };
  }, [evaluations]);

  const handleEvaluate = (volId, value) => {
    setEvaluations((prev) => ({ ...prev, [volId]: value }));
  };

  const handleSave = () => {
    setSavedAt(new Date().toLocaleTimeString("vi-VN"));
  };

  if (!isReady) return null;

  if (!event || !eventId) {
    return <EventNotFound />;
  }

  return (
    <EventDetailLayout event={event} eventId={eventId} activeTab="completion">
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh gia hoan thanh
          </h2>
          <p className="text-gray-500 text-sm">
            Danh dau tinh nguyen vien hoan thanh nhiem vu hoac can ho tro bo sung.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 flex items-center gap-3">
            <UserCheck className="w-10 h-10 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-500">Da hoan thanh</p>
              <p className="text-2xl font-semibold text-emerald-700">
                {stats.completed} nguoi
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5 flex items-center gap-3">
            <UserX className="w-10 h-10 text-amber-600" />
            <div>
              <p className="text-sm text-gray-500">Can theo doi</p>
              <p className="text-2xl font-semibold text-amber-700">
                {stats.pending} nguoi
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {event.volunteers.map((vol) => {
            const status = evaluations[vol.id] || "pending";
            return (
              <div
                key={vol.id}
                className="border border-gray-100 rounded-2xl p-5 space-y-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{vol.name}</p>
                    <p className="text-sm text-gray-500">{vol.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEvaluate(vol.id, "completed")}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition ${
                        status === "completed"
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-gray-200 text-gray-600 hover:border-emerald-300"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Hoan thanh
                    </button>
                    <button
                      onClick={() => handleEvaluate(vol.id, "pending")}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition ${
                        status === "pending"
                          ? "bg-amber-100 border-amber-200 text-amber-700"
                          : "border-gray-200 text-gray-600 hover:border-amber-300"
                      }`}
                    >
                      Can ho tro
                    </button>
                  </div>
                </div>
                <textarea
                  value={notes[vol.id] || ""}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [vol.id]: e.target.value }))
                  }
                  placeholder="Ghi chu danh gia, hanh dong tiep theo..."
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  rows={3}
                />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border border-dashed border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <ClipboardCheck className="w-5 h-5 text-emerald-500" />
            {savedAt
              ? `Da luu danh gia luc ${savedAt}`
              : "Chua luu danh gia gan day."}
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
          >
            Luu danh gia
          </button>
        </div>
      </div>
    </EventDetailLayout>
  );
}
