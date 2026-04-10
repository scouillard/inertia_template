import { useState } from 'react'
import { router, useForm, usePage } from '@inertiajs/react'
import toast from 'react-hot-toast'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserIcon } from '@/components/user-icon'
import { SpinningWheel } from '@/components/spinning-wheel'
import type { SharedProps, UserRow, InvitationRow } from '@/types'

type View = 'list' | 'user' | 'confirm-delete'

interface TeamTabProps {
  users: UserRow[]
  pending_invitations: InvitationRow[]
}

export function TeamTab({ users, pending_invitations }: TeamTabProps) {
  const { current_user } = usePage<SharedProps>().props
  const [view, setView] = useState<View>('list')
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)
  const [currentRole, setCurrentRole] = useState<'member' | 'admin'>('member')
  const [updatingRole, setUpdatingRole] = useState(false)

  const inviteForm = useForm({ email: '' })

  function openUser(user: UserRow) {
    setSelectedUser(user)
    setCurrentRole(user.role)
    setView('user')
  }

  function handleRoleChange(value: 'member' | 'admin') {
    const previous = currentRole
    setCurrentRole(value)
    setUpdatingRole(true)

    router.patch(`/users/${selectedUser!.id}`, { role: value }, {
      preserveState: true,
      onSuccess: () => {
        setSelectedUser((u) => u ? { ...u, role: value } : u)
        setUpdatingRole(false)
      },
      onError: () => {
        setCurrentRole(previous)
        setUpdatingRole(false)
        toast.error('Failed to update role.')
      },
    })
  }

  function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault()
    inviteForm.post('/invitations', {
      preserveState: true,
      onSuccess: () => inviteForm.reset(),
    })
  }

  function handleDelete() {
    router.delete(`/users/${selectedUser!.id}`, {
      preserveState: true,
      onSuccess: () => {
        setSelectedUser(null)
        setView('list')
      },
    })
  }

  // ── Confirm delete card ──
  if (view === 'confirm-delete' && selectedUser) {
    return (
      <Card className="gap-0 p-0">
        <div className="divide-y divide-border">
          <div className="flex items-stretch gap-2 px-4 py-4">
            <button
              onClick={() => setView('user')}
              className="flex shrink-0 items-center self-stretch rounded-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Back"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={1.5} />
            </button>
            <UserIcon name={selectedUser.name} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{selectedUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">{selectedUser.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-4 py-4">
            <div>
              <p className="text-sm font-medium text-destructive">Delete {selectedUser.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Deleting this user will delete all their resources. This action is permanent and cannot be undone.
              </p>
            </div>
            <p className="text-sm font-medium">Are you sure?</p>
          </div>

          <div className="flex justify-end gap-2 px-4 py-4">
            <Button variant="outline" onClick={() => setView('user')}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, delete account
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // ── User card ──
  if (view === 'user' && selectedUser) {
    return (
      <Card className="gap-0 p-0">
        <div className="divide-y divide-border">
          {/* User info with back arrow */}
          <div className="flex items-stretch gap-2 px-4 py-4">
            <button
              onClick={() => setView('list')}
              className="flex shrink-0 items-center self-stretch rounded-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Back to team"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={1.5} />
            </button>
            <UserIcon name={selectedUser.name} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{selectedUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">{selectedUser.email}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <p className="text-sm font-medium">Role</p>
              <p className="text-sm text-muted-foreground">Control what this member can do.</p>
            </div>
            <Select value={currentRole} onValueChange={handleRoleChange} disabled={updatingRole}>
              <SelectTrigger className="w-32 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Danger zone */}
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <p className="text-sm font-medium text-destructive">Delete account</p>
              <p className="text-sm text-muted-foreground">
                Permanently remove this user and all their resources.
              </p>
            </div>
            <Button
              variant="destructive"
              className="shrink-0"
              onClick={() => setView('confirm-delete')}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // ── List ──
  return (
    <Card className="gap-0 p-0">
      <div className="divide-y divide-border">

        {/* Invite */}
        <div className="flex flex-col gap-3 px-4 py-4">
          <div>
            <p className="text-sm font-medium">Invite teammate</p>
            <p className="text-sm text-muted-foreground">Send an invitation to add someone to your team.</p>
          </div>
          <form onSubmit={handleInviteSubmit} className="flex gap-2">
            <div className="flex-1 space-y-1">
              <input
                type="email"
                placeholder="email@example.com"
                value={inviteForm.data.email}
                onChange={(e) => inviteForm.setData('email', e.target.value)}
                className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 ${
                  inviteForm.errors.email
                    ? 'border-destructive focus:ring-destructive/30'
                    : 'border-input focus:ring-ring'
                }`}
              />
              {inviteForm.errors.email && (
                <p className="text-xs text-destructive">{inviteForm.errors.email}</p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={inviteForm.processing || !inviteForm.data.email}
              className="shrink-0 gap-2"
            >
              {inviteForm.processing && <SpinningWheel />}
              Send invite
            </Button>
          </form>
        </div>

        {/* Members */}
        {users.map((user) => {
          const isSelf = user.id === current_user?.id
          return (
            <div
              key={user.id}
              className={`flex items-center gap-3 px-4 py-3 ${!isSelf ? 'cursor-pointer transition-colors hover:bg-foreground/5' : ''}`}
              onClick={!isSelf ? () => openUser(user) : undefined}
            >
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
          )
        })}

        {/* Pending invitations */}
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
