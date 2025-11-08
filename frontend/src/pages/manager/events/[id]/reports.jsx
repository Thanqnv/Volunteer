import { CheckCircle2, FileText } from "lucide-react";
import EventDetailLayout from "@/components/manager/event/EventDetailLayout";
import EventNotFound from "@/components/manager/event/EventNotFound";
import { useManagerEvent } from "@/hooks/useManagerEvent";

export default function ManagerEventReports() {
  const { event, eventId, isReady } = useManagerEvent();

  if (!isReady) return null;

  if (!event || !eventId) {
    return <EventNotFound />;
  }

  const totalHours = event.volunteers.reduce(
    (sum, vol) => sum + (vol.hours || 0),
    0
  );

  return (
    <EventDetailLayout event={event} eventId={eventId} activeTab="reports">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Bao cao & thong ke
            </h2>
            <p className="text-gray-500 text-sm">
              Cap nhat theo thoi gian thuc tu he thong VolunteerHub
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800">
            <FileText className="w-4 h-4" />
            Xem bao cao chi tiet
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-4 rounded-2xl bg-emerald-50">
            <p className="text-sm text-gray-500">Tien do</p>
            <p className="text-3xl font-semibold text-emerald-700">
              {event.report.progress}%
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50">
            <p className="text-sm text-gray-500">Tong gio dong gop</p>
            <p className="text-3xl font-semibold text-blue-700">{totalHours}</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50">
            <p className="text-sm text-gray-500">Diem hai long</p>
            <p className="text-3xl font-semibold text-amber-700">
              {event.report.satisfaction}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-100">
            <p className="text-sm text-gray-500">Su co</p>
            <p className="text-3xl font-semibold text-gray-800">
              {event.report.incidents}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-gray-100 rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Diem nhan gan day
            </p>
            <ul className="space-y-3">
              {event.report.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-gray-100 rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-900 mb-4">
              File bao cao
            </p>
            <div className="space-y-3">
              {event.report.files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between gap-4 border border-gray-100 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      Cap nhat {file.updated}
                    </p>
                  </div>
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                    Tai xuong
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EventDetailLayout>
  );
}
