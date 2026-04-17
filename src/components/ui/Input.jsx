import React from 'react'

export const Input = React.forwardRef(
  ({ className = '', type = 'text', ...props }, ref) => (
    <input
      type={type}
      className={`flex h-12 w-full rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-2 text-sm shadow-sm placeholder:text-foreground/20 focus:outline-none focus:border-secondary/40 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  )
)

Input.displayName = 'Input'
