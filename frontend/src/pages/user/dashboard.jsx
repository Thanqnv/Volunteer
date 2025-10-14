import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";

const getFeaturedEvents = async (e) => {
  const hightLightEvent = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/highlight`;
  try {
    const response = await fetch(loginApi, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    })
    if (!response.ok) {
      throw new Error("Lỗi khi tải sự kiện")
    }

    const data = await response.json()
    localStorage.setItem("token", data.token)
    router.push("/dashboard")
  } catch (error) {
    console.error("Lỗi tải sự kiện nổi bật", error)
    setIsErrorDialogOpen(true)
  }
}
const mockEvents = [
  {
    id: 1,
    title: "Tech Talk: AI Revolution",
    date: "2025-10-15",
    category: "Tech Talk",
    location: "Online",
    description: "Explore the latest advancements in AI technology.",
    image: "/images/ai-tech-talk.jpg",
  },
  {
    id: 2,
    title: "Workshop: Web Development",
    date: "2025-10-16",
    category: "Workshop",
    location: "Hà Nội",
    description: "Learn modern web development techniques.",
    image: "/images/web-workshop.jpg",
  },
  {
    id: 3,
    title: "Meetup: Startup Networking",
    date: "2025-10-17",
    category: "Meetup",
    location: "TP.HCM",
    description: "Connect with startup enthusiasts and investors.",
    image: "/images/startup-meetup.jpg",
  },
  {
    id: 4,
    title: "Webinar: Cloud Computing",
    date: "2025-10-18",
    category: "Webinar",
    location: "Online",
    description: "Dive into the world of cloud computing.",
    image: "/images/cloud-webinar.jpg",
  },
];

export default function EventShowcase() {
  const [filters, setFilters] = useState({ date: "all", category: "all", location: "all" });

  const filteredEvents = mockEvents.filter((event) => {
    return (
      (filters.date === "all" || event.date.includes(filters.date)) &&
      (filters.category === "all" || event.category === filters.category) &&
      (filters.location === "all" || event.location === filters.location)
    );
  });

  return (
    <div className="p-6">
      {/* Featured Events Slider */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Events</h2>
        <motion.div
          className="flex space-x-4 overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {mockEvents.slice(0, 3).map((event) => (
            <div key={event.id} className="min-w-[300px] rounded-2xl shadow-lg overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <p className="text-sm">{event.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Filter Bar */}
      <section className="mb-6">
        <div className="flex space-x-4">
          <Select onValueChange={(value) => setFilters((prev) => ({ ...prev, date: value }))}>
            <SelectTrigger className="w-40">Date</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="2025-10-15">Today</SelectItem>
              <SelectItem value="2025-10-16">This Week</SelectItem>
              <SelectItem value="2025-10-17">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}>
            <SelectTrigger className="w-40">Category</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="Webinar">Webinar</SelectItem>
              <SelectItem value="Tech Talk">Tech Talk</SelectItem>
              <SelectItem value="Meetup">Meetup</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}>
            <SelectTrigger className="w-40">Location</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Hà Nội">Hà Nội</SelectItem>
              <SelectItem value="TP.HCM">TP.HCM</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Events List */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}