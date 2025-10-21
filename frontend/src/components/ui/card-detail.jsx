"use client"
import { useState } from "react"
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardFooter,
    CardContent
} from "@/components/ui/card"

// 🧩 Dữ liệu demo — sau này bạn có thể nhận từ props hoặc API
const eventData = {
    event_id: "b1a23f4c",
    title: "Chiến dịch Làm sạch bãi biển Đà Nẵng",
    description:
        "Cùng chung tay bảo vệ môi trường biển — thu gom rác thải, tuyên truyền ý thức bảo vệ môi trường và kết nối cộng đồng.",
    location: "Bãi biển Mỹ Khê, Đà Nẵng",
    start_time: "2025-10-25T08:00:00Z",
    end_time: "2025-10-25T17:00:00Z",
    registration_deadline: "2025-10-23T23:59:00Z",
    max_volunteers: 50,
    current_volunteers: 32,
    user_registration_status: null // 'Applied' | 'Cancelled' | null
}

const formatDate = dateStr => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
}

const EventCard = () => {
    const [applied, setApplied] = useState(
        eventData.user_registration_status === "Applied"
    )

    const now = new Date()
    const isClosed = new Date(eventData.registration_deadline) < now

    const handleRegister = () => {
        setApplied(true)
        // 🔧 Gọi API đăng ký ở đây
    }

    const handleCancel = () => {
        setApplied(false)
        // 🔧 Gọi API hủy đăng ký ở đây
    }

    return (
        <div className="relative max-w-md rounded-xl bg-gradient-to-r from-indigo-200 to-sky-300 pt-0 shadow-lg overflow-hidden">
            {/* Header hình ảnh */}
            <div className='h-48 bg-[url("https://cdn.shadcnstudio.com/ss-assets/components/card/image-11.png")] bg-cover bg-center' />

            <Card className="border-none">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">{eventData.title}</CardTitle>
                    <CardDescription className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-1">
                            <MapPinIcon className="size-4" /> {eventData.location}
                        </span>
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="size-4" />{" "}
                            {formatDate(eventData.start_time)} -{" "}
                            {formatDate(eventData.end_time)}
                        </span>
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {eventData.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-sm">
                        <UsersIcon className="size-4" />
                        {eventData.current_volunteers}/{eventData.max_volunteers} người tham
                        gia
                    </div>

                    <div className="mt-2">
                        <Badge variant={isClosed ? "secondary" : "outline"}>
                            Hạn đăng ký: {formatDate(eventData.registration_deadline)}
                        </Badge>
                    </div>
                </CardContent>

                <CardFooter className="justify-end">
                    {isClosed ? (
                        <Button disabled variant="secondary" className="w-full">
                            Đã đóng đăng ký
                        </Button>
                    ) : applied ? (
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={handleCancel}
                        >
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
    )
}

export default EventCard
