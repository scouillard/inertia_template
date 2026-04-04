import { Link, router, usePage } from '@inertiajs/react'
import { Settings01Icon } from '@hugeicons/core-free-icons'
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

export default function Navbar() {
  const { current_user } = usePage<SharedProps>().props

  function handleSignOut() {
    router.delete('/users/sign_out')
  }

  const homeHref = current_user ? '/' : '/users/sign_in'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-6 border-b border-white/10 bg-black">
      <Link href={homeHref} className="text-white font-semibold tracking-tight">MyApp</Link>

      {current_user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none">
              <UserIcon name={current_user.name} size={32} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
              {current_user.email}
            </DropdownMenuItem>
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
      )}
    </nav>
  )
}
