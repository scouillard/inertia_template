import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserIcon } from '@/components/user-icon'
import type { UserRow } from '@/types'

interface TeamTabProps {
  users: UserRow[]
}

export function TeamTab({ users }: TeamTabProps) {
  const [inviteEmail, setInviteEmail] = useState('')

  return (
    <Card className="gap-0 p-0">
      <div className="divide-y divide-border">

        {/* ── Invite ── */}
        <div className="flex flex-col gap-3 px-4 py-4">
          <div>
            <p className="text-sm font-medium">Invite teammate</p>
            <p className="text-sm text-muted-foreground">Send an invitation to add someone to your team.</p>
          </div>
          {/* TODO: wire up invite submission when mailer is added */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="email@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
            <Button type="button" size="lg" disabled className="shrink-0">
              Send invite
            </Button>
          </div>
        </div>

        {/* ── Members ── */}
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 px-4 py-3"
          >
            <UserIcon name={user.name} size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
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

      </div>
    </Card>
  )
}
