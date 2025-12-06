"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldX, ExternalLink, RefreshCw, X, AlertTriangle } from "lucide-react"

/**
 * AccessDeniedPopup - Popup แสดงเมื่อผู้ใช้ยังไม่ได้เข้าร่วม Discord Server
 * 
 * @param {boolean} isOpen - แสดง/ซ่อน popup
 * @param {function} onClose - ปิด popup (optional)
 * @param {function} onRetry - ลองใหม่
 * @param {string} serverName - ชื่อ Discord Server (default: "Rank1 City")
 * @param {string} discordInviteUrl - URL เชิญเข้า Discord (default: discord.gg/rank1city)
 * @param {boolean} showCloseButton - แสดงปุ่มปิดหรือไม่ (default: false)
 */
export default function AccessDeniedPopup({
    isOpen = false,
    onClose,
    onRetry,
    serverName = "Rank1 City",
    discordInviteUrl = "https://discord.gg/rank1city",
    showCloseButton = false,
}) {
    const [isLoading, setIsLoading] = useState(false)

    const handleRetry = async () => {
        setIsLoading(true)
        if (onRetry) {
            await onRetry()
        }
        setTimeout(() => setIsLoading(false), 1500)
    }

    const handleJoinDiscord = () => {
        window.open(discordInviteUrl, "_blank")
    }

    // Prevent body scroll when popup is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                        onClick={showCloseButton ? onClose : undefined}
                    />

                    {/* Popup Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            duration: 0.3
                        }}
                        className="fixed left-1/2 top-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-red-500/10">

                            {/* Glow Effect */}
                            <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />
                            <div className="absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-red-400/30 blur-2xl" />

                            {/* Close Button */}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}

                            {/* Content */}
                            <div className="relative px-6 py-8 text-center sm:px-8">

                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        delay: 0.1,
                                        damping: 15,
                                        stiffness: 200
                                    }}
                                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 ring-4 ring-red-500/20"
                                >
                                    <ShieldX className="h-10 w-10 text-red-400" />
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="mb-2 text-2xl font-bold text-white sm:text-3xl"
                                >
                                    Access Denied
                                </motion.h2>

                                {/* Subtitle */}
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-6 text-slate-400"
                                >
                                    ไม่มีสิทธิ์เข้าถึง
                                </motion.p>

                                {/* Message Box */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
                                        <p className="text-left text-sm leading-relaxed text-slate-300">
                                            คุณจำเป็นต้องเข้าร่วม Discord Server ของ{" "}
                                            <span className="font-semibold text-primary">&quot;{serverName}&quot;</span>{" "}
                                            ก่อน จึงจะสามารถใช้งานระบบนี้ได้
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col gap-3 sm:flex-row"
                                >
                                    {/* Join Discord Button */}
                                    <button
                                        onClick={handleJoinDiscord}
                                        className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#5865F2] px-6 py-3 font-semibold text-white transition-all hover:bg-[#4752C4] hover:shadow-lg hover:shadow-[#5865F2]/25"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                        </svg>
                                        เข้าร่วม Discord
                                        <ExternalLink className="h-4 w-4 opacity-70" />
                                    </button>

                                    {/* Retry Button */}
                                    <button
                                        onClick={handleRetry}
                                        disabled={isLoading}
                                        className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 font-semibold text-white transition-all hover:border-slate-600 hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                                        {isLoading ? 'กำลังตรวจสอบ...' : 'ลองใหม่'}
                                    </button>
                                </motion.div>

                                {/* Help Text */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-4 text-xs text-slate-500"
                                >
                                    หลังจากเข้าร่วม Discord แล้ว กดปุ่ม &quot;ลองใหม่&quot; เพื่อยืนยัน
                                </motion.p>
                            </div>

                            {/* Bottom Gradient Line */}
                            <div className="h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
