'use client'

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

/** Toast color palettes. */
const toastPalette = {
  ok: { bg: 'rgba(74,222,128,0.1)', bd: 'rgba(74,222,128,0.25)', fg: '#4ade80' },
  err: { bg: 'rgba(248,113,113,0.1)', bd: 'rgba(248,113,113,0.25)', fg: '#f87171' },
  warn: { bg: 'rgba(250,204,21,0.1)', bd: 'rgba(250,204,21,0.25)', fg: '#facc15' },
  mint: { bg: 'rgba(61,214,200,0.1)', bd: 'rgba(61,214,200,0.25)', fg: '#3dd6c8' },
} as const

type ToastType = keyof typeof toastPalette

export function Contact() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: ToastType }[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const heightWrapRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  // ─── Bug 1 Fix: useRef for toast IDs — avoids stale closure ─────────────
  const toastIdRef = useRef(0)

  function showToast(msg: string, type: ToastType = 'mint') {
    const id = ++toastIdRef.current
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
  }

  // ─── Bug 2 Fix: useCallback for functions referenced in useEffect deps ──
  const updateHeight = useCallback(() => {
    if (!heightWrapRef.current) return
    const target = isFlipped ? backRef.current : frontRef.current
    if (target) {
      heightWrapRef.current.style.height = `${target.offsetHeight}px`
    }
  }, [isFlipped])

  const flip = useCallback(
    (toFlipped: boolean) => {
      if (isFlipped === toFlipped) return
      setIsFlipped(toFlipped)
    },
    [isFlipped]
  )

  useEffect(() => {
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [updateHeight, status])

  // Initial height measurement after mount
  useEffect(() => {
    const timeout = setTimeout(updateHeight, 100)
    return () => clearTimeout(timeout)
  }, [updateHeight])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFlipped) {
        flip(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFlipped, flip])

  function handleClear() {
    setFormData({ name: '', email: '', subject: '', message: '' })
    setStatus('idle')
    showToast('Form cleared', 'warn')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const name = formData.name.trim()
    const email = formData.email.trim()
    const message = formData.message.trim()

    let hasError = false
    if (!name || !email || !message) {
      showToast('Please fill required fields', 'err')
      hasError = true
    } else {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRe.test(email)) {
        showToast('Enter a valid email address', 'err')
        hasError = true
      }
    }

    if (hasError) return

    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus('success')
        showToast('Message sent successfully!', 'ok')
        setFormData({ name: '', email: '', subject: '', message: '' })

        setTimeout(() => {
          flip(false)
          setTimeout(() => setStatus('idle'), 900)
        }, 2500)
      } else {
        setStatus('error')
        showToast('Failed to send message', 'err')
      }
    } catch {
      setStatus('error')
      showToast('Failed to send message', 'err')
    }
  }

  return (
    <section
      id="contact"
      className="py-14 sm:py-24 relative w-full overflow-hidden flex items-center justify-center p-4"
    >
      {/* Bug 6 Fix: Removed inline <style> tag — all CSS now in globals.css */}

      {/* Ambient orbs */}
      <div
        className="ambient-orb"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle,rgba(61,214,200,0.12),transparent 70%)',
          top: '-10%',
          left: '-8%',
        }}
      />
      <div
        className="ambient-orb"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle,rgba(251,146,60,0.07),transparent 70%)',
          bottom: '-5%',
          right: '-5%',
        }}
      />

      {/* Bug 13 Fix: Using design-system font (font-sans = Inter) instead of Plus Jakarta Sans */}
      <div className="w-full max-w-2xl mx-auto relative z-10 text-text-primary font-sans">
        {/* Section header */}
        <div
          className="mb-6 flex items-center gap-3 animate-fade-up"
          style={{ animationDelay: '0s', animationFillMode: 'forwards' }}
        >
          <div className="w-1 h-6 rounded-full bg-teal" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-text-muted">
            04 — Contact
          </span>
        </div>

        {/* Card shell */}
        <div
          className="card-shell animate-fade-up"
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
        >
          <div ref={heightWrapRef} className="card-height-wrap">
            <div className={`card-flipper ${isFlipped ? 'flipped' : ''}`}>
              {/* ── Front Face ── */}
              <div ref={frontRef} className="card-face">
                <div className="bar-surface shimmer-wrap rounded-xl border border-border-subtle bg-bg-card cursor-default">
                  <div className="flex items-center justify-between px-5 py-4 sm:py-[18px]">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="relative w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(61,214,200,0.08)' }}
                      >
                        <svg
                          className="w-4 h-4 text-teal icon-pulse"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        {!isFlipped && (
                          <span className="dot-pulse absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold transition-all duration-300 text-text-primary">
                          {status === 'success' ? 'Message Sent' : 'Get in Touch'}
                        </p>
                        <p className="text-[11px] transition-all duration-300 text-text-muted">
                          {status === 'success'
                            ? "Thanks! I'll get back to you soon"
                            : 'Drop a message — I reply within 24h'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => flip(true)}
                      className="expand-trigger w-9 h-9 rounded-lg border border-border-subtle flex items-center justify-center text-text-muted flex-shrink-0"
                      aria-label="Open contact form"
                    >
                      <svg
                        className="w-4 h-4 transition-transform duration-500"
                        style={{
                          transform: isFlipped ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Back Face ── */}
              <div ref={backRef} className="card-face card-back">
                <div
                  className="rounded-xl border border-border-subtle bg-bg-card overflow-hidden"
                  style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.35)' }}
                >
                  {/* Header bar */}
                  <div
                    className="flex items-center justify-between px-5 py-3 border-b border-border-subtle"
                    style={{ background: 'rgba(22,27,34,0.4)' }}
                  >
                    <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-text-muted">
                      New Message
                    </span>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => flip(false)}
                        className="tl tl-close"
                        data-tip="Close"
                        aria-label="Close form"
                      />
                      <button
                        type="button"
                        onClick={handleClear}
                        className="tl tl-clear"
                        data-tip="Clear"
                        aria-label="Clear form"
                      />
                      {/* Bug 7 Fix: Submit via form attribute instead of onClick handler */}
                      <button
                        type="submit"
                        form="contact-form"
                        className="tl tl-send"
                        data-tip="Send"
                        aria-label="Send message"
                      />
                    </div>
                  </div>

                  {/* Form */}
                  <form id="contact-form" onSubmit={handleSubmit} className="px-5" noValidate>
                    {/* To */}
                    <div className="flex items-center gap-2 border-b border-border-subtle py-3">
                      <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-text-muted w-14 shrink-0">
                        To
                      </span>
                      <span className="text-sm text-teal px-2">ajin.connect@gmail.com</span>
                    </div>

                    {/* From */}
                    <div className="flex items-center gap-2 border-b border-border-subtle py-3">
                      <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-text-muted w-14 shrink-0">
                        From
                      </span>
                      <input
                        type="text"
                        placeholder="Name *"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-teal/50 focus:bg-white/5 rounded-md px-2 py-1.5 w-24 sm:w-32 transition-all"
                        style={{ caretColor: '#3dd6c8' }}
                      />
                      <span className="text-xs opacity-40 text-text-muted font-mono">&lt;</span>
                      <input
                        type="email"
                        placeholder="you@email.com *"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-teal/50 focus:bg-white/5 rounded-md px-2 py-1.5 flex-1 min-w-0 transition-all"
                        style={{ caretColor: '#3dd6c8' }}
                      />
                      <span className="text-xs opacity-40 text-text-muted font-mono">&gt;</span>
                    </div>

                    {/* Subject */}
                    <div className="flex items-center gap-2 border-b border-border-subtle py-3">
                      <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-text-muted w-14 shrink-0">
                        Subject
                      </span>
                      <input
                        type="text"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-teal/50 focus:bg-white/5 rounded-md px-2 py-1.5 flex-1 transition-all"
                        style={{ caretColor: '#3dd6c8' }}
                      />
                    </div>

                    {/* Message */}
                    <textarea
                      placeholder="Write your message..."
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-teal/50 focus:bg-white/5 rounded-md px-3 py-3 mt-4 resize-none w-full leading-relaxed transition-all"
                      style={{ caretColor: '#3dd6c8' }}
                    />

                    {/* Footer */}
                    <div className="flex items-center justify-between py-4 border-t border-border-subtle">
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="bg-teal text-bg-primary font-semibold text-sm px-6 h-9 rounded-lg active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        style={{ boxShadow: '0 4px 16px rgba(61,214,200,0.15)' }}
                      >
                        <span>{status === 'sending' ? 'Sending…' : 'Send'}</span>
                        {status === 'sending' ? (
                          <svg className="w-3.5 h-3.5 spin" viewBox="0 0 24 24" fill="none">
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeDasharray="28 56"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18.166-8.215a.5.5 0 0 0 0-.904z" />
                            <path d="M6 12h16" />
                          </svg>
                        )}
                      </button>
                      <div className="text-sm font-medium">
                        {status === 'success' && (
                          <span className="text-green-status badge-pop inline-block">
                            Sent ✓ — I&apos;ll reply soon
                          </span>
                        )}
                        {status === 'error' && (
                          <span className="text-red-400 badge-pop inline-block">
                            Failed to send message
                          </span>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Helper text */}
        <p
          className="mt-4 text-center text-[11px] text-text-faint font-mono animate-fade-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          click the arrow to open
        </p>

        {/* Bug 4 Fix: Toast notifications inlined directly — no component-inside-render */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
          {toasts.map((t) => {
            const p = toastPalette[t.type]
            return (
              <div
                key={t.id}
                className="font-mono text-xs px-4 py-2.5 rounded-lg border pointer-events-auto transition-all animate-toast-enter"
                style={{ background: p.bg, borderColor: p.bd, color: p.fg }}
              >
                {t.msg}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}