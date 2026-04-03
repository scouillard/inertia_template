import { useForm } from '@inertiajs/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserIcon } from '@/components/user-icon'
import { SpinningWheel } from '@/components/spinning-wheel'
import type { UserRow, InvitationRow } from '@/types'

interface TeamTabProps {
  users: UserRow[]
  pending_invitations: InvitationRow[]
}

export function TeamTab({ users, pending_invitations }: TeamTabProps) {
  const form = useForm({ email: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.post('/invitations', {
      preserveState: true,
      onSuccess: () => form.reset(),
    })
  }

  return (
    <Card className="gap-0 p-0">
      <div className="divide-y divide-border">

        {/* ── Invite ── */}
        <div className="flex flex-col gap-3 px-4 py-4">
          <div>
            <p className="text-sm font-medium">Invite teammate</p>
            <p className="text-sm text-muted-foreground">Send an invitation to add someone to your team.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1 space-y-1">
              <input
                type="email"
                placeholder="email@example.com"
                value={form.data.email}
                onChange={(e) => form.setData('email', e.target.value)}
                className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 ${
                  form.errors.email
                    ? 'border-destructive focus:ring-destructive/30'
                    : 'border-input focus:ring-ring'
                }`}
              />
              {form.errors.email && (
                <p className="text-xs text-destructive">{form.errors.email}</p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={form.processing || !form.data.email}
              className="shrink-0 gap-2"
            >
              {form.processing && <SpinningWheel />}
              Send invite
            </Button>
          </form>
        </div>

        {/* ── Members ── */}
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3 px-4 py-3">
            <UserIcon name={user.name} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                user.role === 'admin'
                  ? 'bg-foreground text-background'
                  : 'bg-foreground/10 text-foreground'
              }`}
            >
              {user.role}
            </span>
          </div>
        ))}

        {/* ── Pending Invitations ── */}
        {pending_invitations.map((inv) => (
          <div key={inv.id} className="flex items-center gap-3 px-4 py-3">
            <span
              className="inline-flex shrink-0 select-none items-center justify-center rounded-full bg-muted font-bold text-muted-foreground"
              style={{ width: 36, height: 36, fontSize: 14 }}
            >
              ?
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-muted-foreground">{inv.email}</p>
            </div>
            <span className="shrink-0 rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs font-medium text-foreground">
              pending
            </span>
          </div>
        ))}

      </div>
    </Card>
  )
}
