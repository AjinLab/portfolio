'use client'

import { useState, useEffect, useRef, type FormEvent } from 'react'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export function Contact() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [toasts, setToasts] = useState<{id: number, msg: string, type: string}[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const heightWrapRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const [toastIdCounter, setToastIdCounter] = useState(0)

  function showToast(msg: string, type: 'ok' | 'err' | 'warn' | 'mint' = 'mint') {
    const id = toastIdCounter + 1
    setToastIdCounter(id)
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
  }

  const updateHeight = () => {
    if (!heightWrapRef.current) return
    const target = isFlipped ? backRef.current : frontRef.current
    if (target) {
      heightWrapRef.current.style.height = `${target.offsetHeight}px`
    }
  }

  useEffect(() => {
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [isFlipped, status])

  useEffect(() => {
    const timeout = setTimeout(updateHeight, 100)
    return () => clearTimeout(timeout)
  }, [])

  function flip(toFlipped: boolean) {
    if (isFlipped === toFlipped) return
    setIsFlipped(toFlipped)
  }

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFlipped) {
        flip(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFlipped])

  const ToastBox = () => (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map((t) => {
        const palette = {
          ok: { bg: 'rgba(74,222,128,0.1)', bd: 'rgba(74,222,128,0.25)', fg: '#4ade80' },
          err: { bg: 'rgba(248,113,113,0.1)', bd: 'rgba(248,113,113,0.25)', fg: '#f87171' },
          warn: { bg: 'rgba(250,204,21,0.1)', bd: 'rgba(250,204,21,0.25)', fg: '#facc15' },
          mint: { bg: 'rgba(45,212,191,0.1)', bd: 'rgba(45,212,191,0.25)', fg: '#2dd4bf' },
        }
        const p = palette[t.type as keyof typeof palette] || palette.mint
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
  )

  return (
    <section id="contact" className="py-14 sm:py-24 relative w-full overflow-hidden flex items-center justify-center p-4">
      <style>{`
        .ambient-orb { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; opacity: 0.35; }
        .card-shell { perspective: 1200px; }
        .card-height-wrap { transition: height 0.55s cubic-bezier(0.4, 0, 0.2, 1); overflow: visible; }
        .card-flipper { position: relative; width: 100%; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1); will-change: transform; }
        .card-flipper.flipped { transform: rotateY(180deg); }
        .card-face { position: absolute; top: 0; left: 0; width: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .card-back { transform: rotateY(180deg); }
        .tl { width: 11px; height: 11px; border-radius: 50%; cursor: pointer; transition: all 0.2s ease; position: relative; border: none; padding: 0; flex-shrink: 0; }
        .tl:hover { transform: scale(1.3); }
        .tl:focus-visible { outline: 2px solid #2dd4bf; outline-offset: 2px; }
        .tl-close { background: rgba(248,113,113,0.3); }
        .tl-close:hover { background: #f87171; box-shadow: 0 0 10px rgba(248,113,113,0.5); }
        .tl-clear { background: rgba(250,204,21,0.3); }
        .tl-clear:hover { background: #facc15; box-shadow: 0 0 10px rgba(250,204,21,0.5); }
        .tl-send { background: rgba(74,222,128,0.3); }
        .tl-send:hover { background: #4ade80; box-shadow: 0 0 10px rgba(74,222,128,0.5); }
        [data-tip] { position: relative; }
        [data-tip]:hover::after { content: attr(data-tip); position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); padding: 3px 8px; border-radius: 5px; font-family: monospace; font-size: 10px; white-space: nowrap; pointer-events: none; background: rgba(0,0,0,0.92); color: #e4e4e7; border: 1px solid rgba(255,255,255,0.1); z-index: 50; }
        .bar-surface { transition: border-color 0.3s, box-shadow 0.3s; }
        .bar-surface:hover { border-color: rgba(45,212,191,0.22); box-shadow: 0 0 40px rgba(45,212,191,0.06); }
        .shimmer-wrap { position: relative; overflow: hidden; }
        .shimmer-wrap::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(45,212,191,0.03), transparent); animation: shimmerSweep 5s ease-in-out infinite; pointer-events: none; }
        @keyframes shimmerSweep { 0%, 100% { left: -100%; } 50% { left: 140%; } }
        .expand-trigger { transition: all 0.25s ease; }
        .expand-trigger:hover { background: rgba(45,212,191,0.12); border-color: rgba(45,212,191,0.3); color: #2dd4bf; }
        @keyframes dotPulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
        .dot-pulse { animation: dotPulse 2.5s ease-in-out infinite; }
        @keyframes iconPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
        .icon-pulse { animation: iconPulse 3s ease-in-out infinite; }
        input:focus, textarea:focus { outline: none; }
        input::placeholder, textarea::placeholder { color: rgba(113,113,122,0.45); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.6s ease forwards; opacity: 0; }
        @keyframes toastIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-toast-enter { animation: toastIn 0.35s ease forwards; }
        @keyframes badgePop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        .badge-pop { animation: badgePop 0.4s ease forwards; }
      `}</style>
      
      <div className="ambient-orb" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(45,212,191,0.12),transparent 70%)', top: '-10%', left: '-8%' }}></div>
      <div className="ambient-orb" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(251,146,60,0.07),transparent 70%)', bottom: '-5%', right: '-5%' }}></div>

      <div className="w-full max-w-2xl mx-auto relative z-10 text-[#e4e4e7] font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="mb-6 flex items-center gap-3 animate-fade-up" style={{ animationDelay: '0s', animationFillMode: 'forwards' }}>
          <div className="w-1 h-6 rounded-full bg-[#2dd4bf]"></div>
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#71717a]">04 — Contact</span>
        </div>

        <div className="card-shell animate-fade-up" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
          <div ref={heightWrapRef} className="card-height-wrap">
            <div className={`card-flipper ${isFlipped ? 'flipped' : ''}`}>

              <div ref={frontRef} className="card-face">
                <div className="bar-surface shimmer-wrap rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] cursor-default">
                  <div className="flex items-center justify-between px-5 py-4 sm:py-[18px]">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(45,212,191,0.08)' }}>
                        <svg className="w-4 h-4 text-[#2dd4bf] icon-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2"/>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                        {!isFlipped && <span className="dot-pulse absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#2dd4bf]"></span>}
                      </div>
                      <div>
                        <p className="text-sm font-semibold transition-all duration-300 text-[#e4e4e7]">
                          {status === 'success' ? 'Message Sent' : 'Get in Touch'}
                        </p>
                        <p className="text-[11px] transition-all duration-300 text-[#71717a]">
                          {status === 'success' ? "Thanks! I'll get back to you soon" : 'Drop a message — I reply within 24h'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => flip(true)}
                      className="expand-trigger w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#71717a] flex-shrink-0"
                      aria-label="Open contact form"
                    >
                      <svg className="w-4 h-4 transition-transform duration-500" style={{ transform: isFlipped ? 'rotate(180deg)' : 'rotate(0deg)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div ref={backRef} className="card-face card-back">
                <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.35)' }}>
                  <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.07)]" style={{ background: 'rgba(24,24,31,0.4)' }}>
                    <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#71717a]">New Message</span>
                    <div className="flex items-center gap-2.5">
                      <button type="button" onClick={() => flip(false)} className="tl tl-close" data-tip="Close" aria-label="Close form"></button>
                      <button type="button" onClick={handleClear} className="tl tl-clear" data-tip="Clear" aria-label="Clear form"></button>
                      <button type="button" onClick={handleSubmit} className="tl tl-send" data-tip="Send" aria-label="Send message"></button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="px-5" noValidate>
                    <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.07)] py-2.5">
                      <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#71717a] w-14 shrink-0">To</span>
                      <span className="text-sm text-[#2dd4bf]">ajin.connect@gmail.com</span>
                    </div>

                    <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] py-2.5">
                      <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#71717a] w-14 shrink-0">From</span>
                      <input 
                        type="text" 
                        placeholder="Name *" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-transparent text-sm text-[#e4e4e7] focus:outline-none w-24 sm:w-36 transition-colors" 
                        style={{ caretColor: '#2dd4bf' }}
                      />
                      <span className="text-xs opacity-20 text-[#71717a]">&lt;</span>
                      <input 
                        type="email" 
                        placeholder="you@email.com *" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-transparent text-sm text-[#e4e4e7] focus:outline-none flex-1 min-w-0 transition-colors" 
                        style={{ caretColor: '#2dd4bf' }}
                      />
                      <span className="text-xs opacity-20 text-[#71717a]">&gt;</span>
                    </div>

                    <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.07)] py-2.5">
                      <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#71717a] w-14 shrink-0">Subject</span>
                      <input 
                        type="text" 
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="bg-transparent text-sm text-[#e4e4e7] focus:outline-none flex-1 transition-colors" 
                        style={{ caretColor: '#2dd4bf' }}
                      />
                    </div>

                    <textarea 
                      placeholder="Write your message..." 
                      required 
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="bg-transparent text-sm text-[#e4e4e7] focus:outline-none resize-none w-full py-3 leading-relaxed transition-colors"
                      style={{ caretColor: '#2dd4bf' }}
                    ></textarea>

                    <div className="flex items-center justify-between py-4 border-t border-[rgba(255,255,255,0.07)]">
                      <button 
                        type="submit" 
                        disabled={status === 'sending'}
                        className="bg-[#2dd4bf] text-[#08080d] font-semibold text-sm px-6 h-9 rounded-lg active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        style={{ boxShadow: '0 4px 16px rgba(45,212,191,0.15)' }}
                      >
                        <span>{status === 'sending' ? 'Sending…' : 'Send'}</span>
                        {status === 'sending' ? (
                          <svg className="w-3.5 h-3.5 spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="28 56" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18.166-8.215a.5.5 0 0 0 0-.904z"/>
                            <path d="M6 12h16"/>
                          </svg>
                        )}
                      </button>
                      <div className="text-sm font-medium">
                        {status === 'success' && (
                          <span className="text-[#4ade80] badge-pop inline-block">Sent ✓ — I'll reply soon</span>
                        )}
                        {status === 'error' && (
                          <span className="text-[#f87171] badge-pop inline-block">Failed to send message</span>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-[rgba(113,113,122,0.4)] font-mono animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          click the arrow to open &middot; traffic lights are interactive
        </p>

        <ToastBox />
      </div>
    </section>
  )
}