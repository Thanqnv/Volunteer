import React, { useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";

import ManagerEventCard from "@/components/manager/ManagerEventCard";
import CreateEventModal from "@/components/manager/CreateEventModal";
import Tabs from "@/components/common/Tabs";
import SimpleAlert from "@/components/ui/SimpleAlert";
import { useManagerEvents } from "@/hooks/useManagerEvents";

const tabs = [
  { key: "managed", label: "Dự án do bạn quản lý" },
  { key: "pending", label: "Dự án chờ xét duyệt" },
];

export default function EventsIndexPage() {
  const router = useRouter();
  const {
    managedEvents,
    pendingEvents,
    loading,
    alert,
    handleDelete,
    handleSaveEvent,
    closeAlert,
  } = useManagerEvents();

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("managed");
  const [editingContext, setEditingContext] = useState(null);

  const displayedEvents =
    activeTab === "managed" ? managedEvents : pendingEvents;

  const editingEvent =
    editingContext && editingContext.tab === "managed"
      ? managedEvents[editingContext.index]
      : editingContext
        ? pendingEvents[editingContext.index]
        : null;

  const onEdit = (tab, index) => {
    setEditingContext({ tab, index });
    setShowModal(true);
  };

  const onSave = (newEvent) => {
    handleSaveEvent(newEvent, editingContext);
    if (editingContext) {
      setActiveTab(editingContext.tab);
    } else {
      setActiveTab("pending");
    }
    setShowModal(false);
    setEditingContext(null);
  };

  const buildActions = (tab, index) => {
    if (tab === "managed") {
      return [
        {
          label: "Thêm thông tin",
          icon: Plus,
          className: "text-[#2F80ED]",
          onClick: () => router.push(`/manager/events/${index}`),
        },
        {
          label: "Sửa",
          icon: Pencil,
          className: "text-[#F2994A]",
          onClick: () => onEdit("managed", index),
        },
        {
          label: "Xóa",
          icon: Trash2,
          className: "text-[#EB5757]",
          onClick: () => handleDelete("managed", index),
        },
      ];
    }

    return [
      {
        label: "Sửa",
        icon: Pencil,
        className: "text-[#F2994A]",
        onClick: () => onEdit("pending", index),
      },
      {
        label: "Xóa",
        icon: Trash2,
        className: "text-[#EB5757]",
        onClick: () => handleDelete("pending", index),
      },
    ];
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải danh sách dự án...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen w-screen overflow-hidden">
      {/* Lớp chứa toàn màn hình */}
      <div className="w-full min-h-screen pt-24 px-6 lg:px-10 flex flex-col items-center">
        {/* Giới hạn nội dung ở giữa (tuỳ chọn, có thể bỏ nếu muốn tràn hết) */}
        <div className="w-full max-w-[1400px]">
          <div className="h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
            {/* Nút tạo dự án */}
            <div className="flex justify-start mb-10 pl-96">
              <button
                onClick={() => {
                  setEditingContext(null);
                  setShowModal(true);
                }}
                className="bg-white hover:bg-gray-50 shadow-md px-8 py-6 rounded-lg border flex flex-col items-center justify-center transition"
              >
                <div className="text-5xl font-bold text-gray-700">+</div>
                <p className="text-xl font-semibold text-gray-800">Tạo dự án</p>
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-4">
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {/* Danh sách dự án */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-lg shadow-sm grid sm:grid-cols-2 md:grid-cols-3 gap-6 bg-transparent"
              >
                {displayedEvents.length > 0 ? (
                  displayedEvents.map((event, index) => (
                    <div key={`${event.title}-${index}`} className="space-y-3">
                      <ManagerEventCard
                        event={event}
                        tone={activeTab === "managed" ? "managed" : "pending"}
                        onCardClick={() =>
                          router.push(`/manager/events/${index}`)
                        }
                        actions={buildActions(activeTab, index)}
                        statusMessage={
                          activeTab === "pending"
                            ? "Chờ được xét duyệt"
                            : undefined
                        }
                      />
                      {activeTab === "pending" && (
                        <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-amber-800">
                          Dự án bạn tạo đang chờ admin VolunteerHub duyệt. Bạn
                          sẽ nhận được thông báo ngay khi có kết quả.
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center col-span-full italic">
                    Không có dự án nào trong danh sách.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal tạo / sửa */}
      {showModal && (
        <CreateEventModal
          onClose={() => {
            setShowModal(false);
            setEditingContext(null);
          }}
          onSave={onSave}
          initialData={editingEvent}
        />
      )}

      {/* Thông báo */}
      {alert && (
        <SimpleAlert
          type={alert.type}
          message={alert.message}
          onClose={closeAlert}
        />
      )}
    </div>
  );
}
