import { Link, router, usePage } from '@inertiajs/react'
import { Settings01Icon, Notification01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { UserIcon } from '@/components/user-icon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { SharedProps } from '@/types'

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function Navbar() {
  const { current_user, unread_notifications_count, notifications } = usePage<SharedProps>().props

  function handleSignOut() {
    router.delete('/users/sign_out')
  }

  function handleNotificationsOpen(open: boolean) {
    if (open && unread_notifications_count > 0) {
      router.patch('/notifications/mark_all_read', {}, { preserveScroll: true })
    }
  }

  const homeHref = current_user ? '/' : '/users/sign_in'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 sm:px-6 border-b border-white/10 bg-black">
      <Link href={homeHref} className="text-white font-semibold tracking-tight">MyApp</Link>

      {current_user && (
        <div className="flex items-center gap-4">
          <DropdownMenu onOpenChange={handleNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <button className="relative outline-none text-white/70 hover:text-white transition-colors">
                <HugeiconsIcon icon={Notification01Icon} size={20} />
                {unread_notifications_count > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-1.5 py-1 text-sm font-semibold text-foreground">
                Notifications
              </div>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="px-1.5 py-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex flex-col gap-0.5 px-1.5 py-1.5 rounded-md ${n.read_at ? '' : 'bg-foreground/5'}`}
                    >
                      <p className="text-sm leading-snug">{n.message}</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(n.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full outline-none">
                <UserIcon name={current_user.name} size={32} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => router.visit('/settings')} className="flex items-center gap-2">
                <HugeiconsIcon icon={Settings01Icon} size={14} />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleSignOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  )
}
