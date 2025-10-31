import React, { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import BasicPagination from "@/components/ui/pagination.jsx";
import EventCard from "@/components/ui/card-detail.jsx";
import SlideUpDetail from "@/components/ui/slide-up.jsx";
import SearchBar from "@/components/ui/search-bar";

export default function EventShowcase() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "all",
    location: "all",
    search: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const eventsPerPage = 9;

  // Add state for slide-up visibility and event details
  const [isSlideUpOpen, setIsSlideUpOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);


  // Fetch All Events with Pagination
  const getAllEvents = async (page = 1) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events?page=${page}&limit=${eventsPerPage}`;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách sự kiện");
      }

      const data = await response.json();
      setAllEvents(data.events || data.data || []);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / eventsPerPage));
    } catch (error) {
      console.error("Lỗi tải danh sách sự kiện:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Events
  useEffect(() => {
    const filtered = allEvents.filter((event) => {
      // Date range filter
      let dateMatch = true;
      if (filters.startDate || filters.endDate) {
        const eventDate = new Date(event.start_time);
        if (filters.startDate && filters.endDate) {
          const start = new Date(filters.startDate);
          const end = new Date(filters.endDate);
          dateMatch = eventDate >= start && eventDate <= end;
        } else if (filters.startDate) {
          const start = new Date(filters.startDate);
          dateMatch = eventDate >= start;
        } else if (filters.endDate) {
          const end = new Date(filters.endDate);
          dateMatch = eventDate <= end;
        }
      }

      const categoryMatch = filters.category === "all" ||
        event.category === filters.category;
      const locationMatch = filters.location === "all" ||
        event.location === filters.location;

      // Text search filter (title, description, location)
      const q = (filters.search || "").toLowerCase().trim();
      const text = [event.title, event.description, event.location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const searchMatch = q === "" || text.includes(q);

      return dateMatch && categoryMatch && locationMatch && searchMatch;
    });
    setFilteredEvents(filtered);
  }, [allEvents, filters]);

  // Test hiển thị sự kiện khi không có API 
  useEffect(() => {
    // MOCK 10 sự kiện để test UI
    const mockEvents = [
      { event_id: '1', title: 'Workshop React', start_time: '2025-10-21', category: 'Workshop', location: 'Hà Nội', description: 'Học React cơ bản', registered: false },
      { event_id: '2', title: 'Webinar AI', start_time: '2025-10-22', category: 'Webinar', location: 'Online', description: 'Cập nhật AI mới', registered: true },
      { event_id: '3', title: 'Tech Talk Cloud', start_time: '2025-10-23', category: 'Tech Talk', location: 'TP.HCM', description: 'Xu hướng Cloud', registered: false },
      { event_id: '4', title: 'Meetup Dev', start_time: '2025-10-29', category: 'Meetup', location: 'Đà Nẵng', description: 'Giao lưu Dev', registered: false },
      { event_id: '5', title: 'Workshop Next.js', start_time: '2025-11-01', category: 'Workshop', location: 'Hà Nội', description: 'Nâng cao với Next.js', registered: true },
      { event_id: '6', title: 'Webinar DevOps', start_time: '2025-10-25', category: 'Webinar', location: 'Online', description: 'DevOps cho dự án lớn', registered: false },
      { event_id: '7', title: 'Tech Talk GraphQL', start_time: '2025-10-21', category: 'Tech Talk', location: 'TP.HCM', description: 'API hiện đại', registered: false },
      { event_id: '8', title: 'Meetup Tester', start_time: '2025-10-24', category: 'Meetup', location: 'Hà Nội', description: 'Cộng đồng tester', registered: false },
      { event_id: '9', title: 'Workshop UI/UX', start_time: '2025-10-28', category: 'Workshop', location: 'Đà Nẵng', description: 'Thiết kế trải nghiệm', registered: true },
      { event_id: '10', title: 'Tech Talk Mobile', start_time: '2025-10-30', category: 'Tech Talk', location: 'TP.HCM', description: 'Phát triển app di động', registered: false },
      { event_id: '11', title: 'Workshop React', start_time: '2025-10-21', category: 'Workshop', location: 'Hà Nội', description: 'Học React cơ bản', registered: false },
      { event_id: '12', title: 'Webinar AI', start_time: '2025-10-22', category: 'Webinar', location: 'Online', description: 'Cập nhật AI mới', registered: true },
      { event_id: '13', title: 'Tech Talk Cloud', start_time: '2025-10-23', category: 'Tech Talk', location: 'TP.HCM', description: 'Xu hướng Cloud', registered: false },
      { event_id: '14', title: 'Meetup Dev', start_time: '2025-10-29', category: 'Meetup', location: 'Đà Nẵng', description: 'Giao lưu Dev', registered: false },
      { event_id: '15', title: 'Workshop Next.js', start_time: '2025-11-01', category: 'Workshop', location: 'Hà Nội', description: 'Nâng cao với Next.js', registered: true },
      { event_id: '16', title: 'Webinar DevOps', start_time: '2025-10-25', category: 'Webinar', location: 'Online', description: 'DevOps cho dự án lớn', registered: false },
      { event_id: '17', title: 'Tech Talk GraphQL', start_time: '2025-10-21', category: 'Tech Talk', location: 'TP.HCM', description: 'API hiện đại', registered: false },
      { event_id: '18', title: 'Meetup Tester', start_time: '2025-10-24', category: 'Meetup', location: 'Hà Nội', description: 'Cộng đồng tester', registered: false },
      { event_id: '19', title: 'Workshop UI/UX', start_time: '2025-10-28', category: 'Workshop', location: 'Đà Nẵng', description: 'Thiết kế trải nghiệm', registered: true },
      { event_id: '20', title: 'Tech Talk Mobile', start_time: '2025-10-30', category: 'Tech Talk', location: 'TP.HCM', description: 'Phát triển app di động', registered: false }
    ];
    setFeaturedEvents(mockEvents);
    setAllEvents(mockEvents);
  }, []);

  // Handle Page Change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    getAllEvents(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Register
  const handleRegister = async (eventId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi đăng ký sự kiện");
      }

      getAllEvents(currentPage);
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
    }
  };

  // Handle Cancel Registration
  const handleCancelRegistration = async (eventId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi hủy đăng ký");
      }

      getAllEvents(currentPage);
    } catch (error) {
      console.error("Lỗi hủy đăng ký:", error);
    }
  };

  // Function to handle event card click
  const handleEventClick = async (eventId) => {
    console.log("Clicked event ID:", eventId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch event details");
      }
      const eventDetails = await response.json();
      setSelectedEvent(eventDetails);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setSelectedEvent({
        title: "Error",
        description: "Unable to fetch event details. Please try again later.",
        location: "N/A",
        start_time: "N/A",
        category: "N/A",
      });
    } finally {
      setIsSlideUpOpen(true);
    }
  };

  // Function to close the slide-up
  const closeSlideUp = () => {
    setIsSlideUpOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="container mx-auto pt-10 pl-64 space-y-6">
      <div className="p-6">
        {/* Featured Events Slider */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Sự kiện nổi bật</h2>
          <motion.div
            className="flex space-x-4 overflow-x-auto pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {featuredEvents.length > 0 ? (
              featuredEvents.slice(0, 10).map((event) => (
                <div key={event.event_id} className="min-w-[350px]">
                  <EventCard
                    event={event}
                    onRegister={handleRegister}
                    onCancel={handleCancelRegistration}
                    onClick={() => handleEventClick(event.event_id)} // Add onClick handler
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Không có sự kiện nổi bật</p>
            )}
          </motion.div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Sự kiện nhiều tương tác 🔥</h2>
          <motion.div
            className="flex space-x-4 overflow-x-auto pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {featuredEvents.length > 0 ? (
              featuredEvents.slice(0, 10).map((event) => (
                <div key={event.event_id} className="min-w-[350px]">
                  <EventCard
                    event={event}
                    onRegister={handleRegister}
                    onCancel={handleCancelRegistration}
                    onClick={() => handleEventClick(event.event_id)} // Add onClick handler
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Không có sự kiện nhiều tương tác</p>
            )}
          </motion.div>
        </section>

        {/* Filter Bar */}
        <section className="mb-6">
          <div className="flex flex-wrap items-end gap-4">
            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <label className="text-sm text-muted-foreground mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-muted-foreground mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {(filters.startDate || filters.endDate) && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, startDate: "", endDate: "" }))}
                  className="mt-6 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Xóa
                </button>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-muted-foreground mb-1">Thể loại</label>
              <Select onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Môi trường">Môi trường</SelectItem>
                  <SelectItem value="Giáo dục">Giáo dục</SelectItem>
                  <SelectItem value="Cộng đồng">Cộng đồng</SelectItem>
                  <SelectItem value="Y tế">Y tế</SelectItem>
                  <SelectItem value="Văn hóa">Văn hóa</SelectItem>
                  <SelectItem value="Cộng đồng và xã hội">Cộng đồng và xã hội</SelectItem>
                  <SelectItem value="Công nghệ và truyền thông xã hội">Công nghệ và truyền thông xã hội</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-muted-foreground mb-1">Địa điểm</label>
              <Select onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                  <SelectItem value="TP.HCM">TP.HCM</SelectItem>
                  <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Bar inline with filters */}
            <div className="flex-1 min-w-[260px]">
              <SearchBar
                className="w-full"
                placeholder="Tìm kiếm theo tên sự kiện"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                onSearch={(value) => setFilters((prev) => ({ ...prev, search: value }))}
                size="large"
              />
            </div>
          </div>
        </section>
        
        {/* Events List */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Tất cả sự kiện</h2>
          {isLoading ? (
            <div className="text-center py-10">
              <p>Đang tải...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>Lỗi: {error}</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.event_id}
                  event={event}
                  onRegister={handleRegister}
                  onCancel={handleCancelRegistration}
                  onClick={() => handleEventClick(event.event_id)} // Add onClick handler
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Không tìm thấy sự kiện</p>
            </div>
          )}
        </section>
      </div>

      {/* Pagination */}
      {!isLoading && filteredEvents.length > 0 && (
        <div className="flex justify-center my-6">
          <BasicPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Event Details Slide-up */}
      {isSlideUpOpen && (
        <SlideUpDetail
          isOpen={isSlideUpOpen}
          onClose={closeSlideUp}
          title={selectedEvent?.title}
          description={selectedEvent?.description}
          variant="phone"
        >
          <div>
            <p><strong>Location:</strong> {selectedEvent?.location}</p>
            <p><strong>Start Time:</strong> {selectedEvent?.start_time}</p>
            <p><strong>Category:</strong> {selectedEvent?.category}</p>
          </div>
        </SlideUpDetail>
      )}
    </div>
  );
}