export function Card({ className = '', children }) {
  return (
    <div className={`glass-card border-white/5 bg-[#0a0c14]/40 backdrop-blur-md shadow-2xl ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ className = '', children }) {
  return <div className={`p-8 ${className}`}>{children}</div>
}

export function CardHeader({ className = '', children }) {
  return <div className={`p-8 pb-0 ${className}`}>{children}</div>
}

export function CardTitle({ className = '', children }) {
  return <h2 className={`text-2xl font-black tracking-tighter uppercase text-foreground ${className}`}>{children}</h2>
}

export function CardDescription({ className = '', children }) {
  return <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mt-2 ${className}`}>{children}</p>
}
