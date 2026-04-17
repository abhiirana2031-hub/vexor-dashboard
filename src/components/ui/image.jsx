export function Image({ className = '', ...props }) {
  return (
    <img
      className={`max-w-full h-auto ${className}`}
      {...props}
    />
  )
}
