import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SlideUpDetail } from "@/components/ui/slide-up"

export default function EventList() {
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState(null)

    const events = [
        { id: 1, title: "Summer Music Fest", desc: "Lễ hội âm nhạc mùa hè sôi động" },
        { id: 2, title: "Startup Expo 2025", desc: "Triển lãm khởi nghiệp công nghệ" },
    ]

    return (
        <div className="container mx-auto pt-10 pl-64 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {events.map((e) => (
                    <Card
                        key={e.id}
                        onClick={() => {
                            setSelected(e)
                            setOpen(true)
                        }}
                        className="cursor-pointer hover:shadow-lg transition"
                    >
                        <CardHeader>
                            <CardTitle>{e.title}</CardTitle>
                        </CardHeader>
                        <CardContent>{e.desc}</CardContent>
                    </Card>
                ))}

                <SlideUpDetail
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    title={selected?.title}
                >
                    <p>{selected?.desc}</p>
                    <p className="mt-3 text-sm text-gray-600">
                        Thời gian: 20/10/2025 — Địa điểm: Nhà hát lớn Hà Nội
                    </p>
                    <button
                        onClick={() => setOpen(false)}
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Đóng
                    </button>
                </SlideUpDetail>
            </div>
        </div>
    )
}
