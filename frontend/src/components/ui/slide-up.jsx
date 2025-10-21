import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function SlideUpDetail({ isOpen, onClose, title, children, className }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay mờ nền */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Panel trượt lên */}
                    <motion.div
                        className={cn(
                            "fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg p-6 max-h-[85vh] overflow-y-auto",
                            className
                        )}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div>{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
