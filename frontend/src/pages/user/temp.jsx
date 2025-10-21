import React from "react"
import MultiCarousel from "@/components/ui/MultiCarousel"

export default function CarouselExample() {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <MultiCarousel visibleCount={3}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-48 flex items-center justify-center bg-orange-400 text-white text-2xl font-bold m-1 rounded-lg"
                    >
                        {i + 1}
                    </div>
                ))}
            </MultiCarousel>
        </div>
    )
}
