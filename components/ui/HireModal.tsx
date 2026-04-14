'use client'

import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2 } from 'lucide-react'

interface HireModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

const workTypes = [
  'Internship',
  'Freelance / Contract',
  'Open Source Collaboration',
  'Research Project',
  'Full-time Position',
  'Other',
]

export function HireModal({ isOpen, onClose }: HireModalProps) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [formData, setFormData] = useState({
    workType: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  function resetForm() {
    setFormData({ workType: '', name: '', email: '', phone: '', message: '' })
    setStatus('idle')
  }

  function handleClose() {
    onClose()
    // Reset after the exit animation
    setTimeout(resetForm, 300)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return

    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Hire — ${formData.workType || 'General'}`,
          message: [
            formData.phone ? `Phone / Contact: ${formData.phone}` : '',
            formData.message,
          ]
            .filter(Boolean)
            .join('\n\n'),
        }),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClasses =
    'bg-bg-primary border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-teal transition-colors w-full'

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
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-bg-card border border-border-subtle rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success state */}
            {status === 'success' ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-green-status/15 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-5 h-5 text-green-status" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Message sent!
                </h3>
                <p className="text-sm text-text-muted mt-2">
                  I&apos;ll get back to you within a couple of days.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 w-full bg-white/5 border border-border-subtle text-text-primary text-sm py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">
                      Let&apos;s work together
                    </h3>
                    <p className="text-sm text-text-muted mt-1">
                      Tell me about your project or opportunity
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-1 text-text-muted hover:text-text-primary transition-colors -mt-1 -mr-1"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Fields */}
                <div className="space-y-4 mt-5">
                  {/* Work Type */}
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-1.5">
                      Work Type
                    </label>
                    <div className="relative">
                      <select
                        value={formData.workType}
                        onChange={(e) =>
                          setFormData({ ...formData, workType: e.target.value })
                        }
                        className={`${inputClasses} appearance-none cursor-pointer pr-10`}
                      >
                        <option value="" disabled>
                          Select a work type
                        </option>
                        {workTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-faint">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M3 4.5L6 7.5L9 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={inputClasses}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={inputClasses}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-1.5">
                      Phone / Contact Details
                    </label>
                    <input
                      type="text"
                      placeholder="Your phone or contact info"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={inputClasses}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-1.5">
                      Message
                    </label>
                    <textarea
                      placeholder="Tell me about your project or opportunity"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className={`${inputClasses} resize-none`}
                    />
                  </div>
                </div>

                {/* Error */}
                {status === 'error' && (
                  <p className="text-sm text-red-400 mt-3">
                    Something went wrong. Please try again or email me directly.
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-white/5 border border-border-subtle text-text-primary text-sm py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex-1 bg-teal text-bg-primary font-semibold text-sm py-2.5 rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-teal/20 active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
