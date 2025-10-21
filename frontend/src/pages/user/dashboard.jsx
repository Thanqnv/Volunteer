import React, { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter, CardContent } from "@/components/ui/card";
import BasicPagination from "@/components/ui/pagination.jsx";

// EventCard Component
const EventCard = ({ event, onRegister, onCancel }) => {
  const [applied, setApplied] = useState(event.user_registration_status === "Applied");

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const now = new Date();
  const isClosed = new Date(event.registration_deadline) < now;

  const handleRegister = () => {
    setApplied(true);
    onRegister && onRegister(event.event_id);
  };

  const handleCancel = () => {
    setApplied(false);
    onCancel && onCancel(event.event_id);
  };

  return (
    <div className="relative max-w-md rounded-xl bg-gradient-to-r from-indigo-200 to-sky-300 pt-0 shadow-lg overflow-hidden">
      {/* Header hình ảnh */}
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.image || 'https://cdn.shadcnstudio.com/ss-assets/components/card/image-11.png'})` }}
      />

      <Card className="border-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold">{event.title}</CardTitle>
          <CardDescription className="flex flex-col gap-1 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" /> {event.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-4" />{" "}
              {formatDate(event.start_time)} - {formatDate(event.end_time)}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {event.description}
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Users className="size-4" />
            {event.current_volunteers || 0}/{event.max_volunteers || 0} người tham gia
          </div>

          <div className="mt-2">
            <Badge variant={isClosed ? "secondary" : "outline"}>
              Hạn đăng ký: {formatDate(event.registration_deadline)}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          {isClosed ? (
            <Button disabled variant="secondary" className="w-full">
              Đã đóng đăng ký
            </Button>
          ) : applied ? (
            <Button variant="destructive" className="w-full" onClick={handleCancel}>
              Hủy đăng ký
            </Button>
          ) : (
            <Button className="w-full" onClick={handleRegister}>
              Đăng ký tham gia
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default function EventShowcase() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    date: "all",
    category: "all",
    location: "all"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const eventsPerPage = 9;

  // Fetch Featured Events
  const getFeaturedEvents = async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/highlight`;
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tải sự kiện nổi bật");
      }

      const data = await response.json();
      setFeaturedEvents(data.events || data);
    } catch (error) {
      console.error("Lỗi tải sự kiện nổi bật:", error);
      setError(error.message);
    }
  };

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
      const dateMatch = filters.date === "all" ||
        (event.start_time && event.start_time.includes(filters.date));
      const categoryMatch = filters.category === "all" ||
        event.category === filters.category;
      const locationMatch = filters.location === "all" ||
        event.location === filters.location;

      return dateMatch && categoryMatch && locationMatch;
    });
    setFilteredEvents(filtered);
  }, [allEvents, filters]);

  // Initial Load
  useEffect(() => {
    getFeaturedEvents();
    getAllEvents(1);
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

      // Refresh events after registration
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

      // Refresh events after cancellation
      getAllEvents(currentPage);
    } catch (error) {
      console.error("Lỗi hủy đăng ký:", error);
    }
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
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Không có sự kiện nổi bật</p>
            )}
          </motion.div>
        </section>

        {/* Filter Bar */}
        <section className="mb-6">
          <div className="flex space-x-4">
            <Select onValueChange={(value) => setFilters((prev) => ({ ...prev, date: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="2025-10-21">Hôm nay</SelectItem>
                <SelectItem value="2025-10">Tuần này</SelectItem>
                <SelectItem value="2025">Tháng này</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Webinar">Webinar</SelectItem>
                <SelectItem value="Tech Talk">Tech Talk</SelectItem>
                <SelectItem value="Meetup">Meetup</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Địa điểm" />
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
    </div>
  );
}