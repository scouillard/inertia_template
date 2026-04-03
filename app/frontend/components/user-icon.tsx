const COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-blue-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-pink-500',
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0].slice(0, 2).toUpperCase()
}

function getColor(name: string): string {
  return COLORS[name.length % COLORS.length]
}

interface UserIconProps {
  name: string
  size?: number
}

export function UserIcon({ name, size = 32 }: UserIconProps) {
  const initials = getInitials(name)
  const colorClass = getColor(name)

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-white font-semibold select-none ${colorClass}`}
      style={{ width: size, height: size, fontSize: size * 0.375 }}
      aria-label={name}
    >
      {initials}
    </span>
  )
}
