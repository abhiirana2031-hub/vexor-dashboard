export function Button({ 
  className = '', 
  children, 
  variant = 'default',
  size = 'md',
  ...props 
}) {
  const variants = {
    default: 'futuristic-button',
    destructive: 'bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20',
    outline: 'border border-white/10 bg-white/[0.02] text-foreground hover:bg-white/[0.05] hover:border-secondary/40',
    ghost: 'text-foreground/60 hover:text-foreground hover:bg-white/[0.05]',
  }

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-sm',
  }

  const isFuturistic = variant === 'default';

  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-widest transition-all duration-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${!isFuturistic ? variants[variant] : ''} ${isFuturistic ? 'futuristic-button' : ''} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {isFuturistic && <div className="btn-glow" />}
    </button>
  )
}
