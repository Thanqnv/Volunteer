import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import EventDetailLayout from "@/components/manager/event/EventDetailLayout";
import EventNotFound from "@/components/manager/event/EventNotFound";
import { useManagerEvent } from "@/hooks/useManagerEvent";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ManagerEventVolunteers() {
  const { event, eventId, isReady } = useManagerEvent();
  const [volunteers, setVolunteers] = useState(event?.volunteers ?? []);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (event) {
      setVolunteers(event.volunteers);
    }
  }, [event]);

  const filtered = useMemo(() => {
    if (!search) return volunteers;
    const keyword = search.toLowerCase();
    return volunteers.filter(
      (vol) =>
        vol.name.toLowerCase().includes(keyword) ||
        vol.role.toLowerCase().includes(keyword)
    );
  }, [volunteers, search]);

  if (!isReady) return null;

  if (!event || !eventId) {
    return <EventNotFound />;
  }

  return (
    <EventDetailLayout event={event} eventId={eventId} activeTab="volunteers">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sach tinh nguyen vien
            </h2>
            <p className="text-gray-500 text-sm">
              {volunteers.length} nguoi da duoc xac nhan
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tim theo ten hoac vai tro"
                className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
            <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-200 font-medium text-gray-700 hover:border-gray-300">
              Xuat danh sach
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((vol) => (
            <div
              key={vol.id}
              className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border border-gray-100 rounded-2xl p-4 hover:border-emerald-100 transition"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center uppercase">
                  {getInitials(vol.name)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{vol.name}</p>
                  <p className="text-sm text-gray-500">{vol.role}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div>
                  <p className="text-gray-500">Trang thai</p>
                  <p className="font-medium text-gray-900">{vol.status}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ngay tham gia</p>
                  <p className="font-medium text-gray-900">{vol.joinedAt}</p>
                </div>
                <div>
                  <p className="text-gray-500">Lien lac</p>
                  <p className="font-medium text-gray-900">{vol.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">So gio</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {vol.hours}h
                </p>
              </div>
            </div>
          ))}
          {!filtered.length && (
            <div className="text-center text-gray-500 py-10 border border-dashed border-gray-200 rounded-2xl">
              Khong co tinh nguyen vien phu hop voi tu khoa.
            </div>
          )}
        </div>
      </div>
    </EventDetailLayout>
  );
}
