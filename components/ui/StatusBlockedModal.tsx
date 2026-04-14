// components/ui/StatusBlockedModal.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { statusConfig } from '@/lib/site-status'
import type { StatusType } from '@/lib/site-status'

interface StatusBlockedModalProps {
    isOpen: boolean
    onClose: () => void
    siteStatus: StatusType
}

export function StatusBlockedModal({ isOpen, onClose, siteStatus }: StatusBlockedModalProps) {
    const current = statusConfig[siteStatus]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-md bg-bg-card border border-border-subtle rounded-2xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                            {/* Top accent bar colored by status */}
                            <div
                                className={`h-1 w-full ${siteStatus === 'unavailable'
                                    ? 'bg-red-400'
                                    : 'bg-yellow-400'
                                    }`}
                            />

                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        {/* Warning icon */}
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${siteStatus === 'unavailable'
                                                ? 'bg-red-400/10'
                                                : 'bg-yellow-400/10'
                                                }`}
                                        >
                                            <AlertTriangle
                                                className={`w-5 h-5 ${siteStatus === 'unavailable'
                                                    ? 'text-red-400'
                                                    : 'text-yellow-400'
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-[15px] font-semibold text-text-primary">
                                                {current.hireBlockedTitle}
                                            </h2>
                                            {/* Status badge */}
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${current.dotColor}`}
                                                />
                                                <span
                                                    className={`text-[11px] font-medium ${current.textColor}`}
                                                >
                                                    {current.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Close */}
                                    <button
                                        onClick={onClose}
                                        className="text-text-muted hover:text-text-primary transition-colors mt-0.5 shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Message */}
                                <p className="text-[13px] text-text-muted leading-relaxed mt-4">
                                    {current.hireBlockedMessage}
                                </p>

                                {/* Warning box */}
                                <div
                                    className={`flex items-start gap-2.5 mt-4 p-3 rounded-lg border ${siteStatus === 'unavailable'
                                        ? 'bg-red-400/5 border-red-400/20'
                                        : 'bg-yellow-400/5 border-yellow-400/20'
                                        }`}
                                >
                                    <AlertTriangle
                                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${siteStatus === 'unavailable'
                                            ? 'text-red-400'
                                            : 'text-yellow-400'
                                            }`}
                                    />
                                    <p
                                        className={`text-[11px] leading-relaxed ${siteStatus === 'unavailable'
                                            ? 'text-red-400/80'
                                            : 'text-yellow-400/80'
                                            }`}
                                    >
                                        {current.hireBlockedWarning}
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end mt-5">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-[13px] font-medium text-text-primary bg-white/[0.06] hover:bg-white/[0.09] border border-border-subtle rounded-lg transition-colors"
                                    >
                                        Got it
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}