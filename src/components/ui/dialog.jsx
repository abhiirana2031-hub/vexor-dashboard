import { X } from 'lucide-react'

export function Dialog({ open, onOpenChange, children }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-8 pointer-events-none">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity pointer-events-auto"
              onClick={() => onOpenChange(false)}
            />
            <div className="relative z-10 w-full pointer-events-auto">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function DialogContent({ className = '', children, ...props }) {
  return (
    <div
      className={`glass-card border-white/5 bg-[#0a0c14]/95 shadow-2xl relative max-w-2xl w-full mx-auto ${className}`}
      role="dialog"
      aria-modal="true"
      {...props}
    >
      {children}
    </div>
  )
}

export function DialogHeader({ className = '', children }) {
  return <div className={`px-8 py-6 border-b border-white/5 ${className}`}>{children}</div>
}

export function DialogTitle({ className = '', children }) {
  return <h3 className={`text-2xl font-black tracking-tighter uppercase text-foreground ${className}`}>{children}</h3>
}

export function DialogDescription({ className = '', children }) {
  return <p className={`mt-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 ${className}`}>{children}</p>
}

export function DialogFooter({ className = '', children }) {
  return <div className={`px-8 py-6 sm:flex sm:flex-row-reverse gap-4 border-t border-white/5 bg-white/[0.01] ${className}`}>{children}</div>
}

export function DialogClose({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`absolute right-6 top-6 text-foreground/40 hover:text-secondary transition-colors ${className}`}
    >
      <X className="h-5 w-5" />
    </button>
  )
}
