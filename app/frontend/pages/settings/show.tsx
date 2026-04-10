import { useState } from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SpinningWheel } from '@/components/spinning-wheel'
import { getTheme, setTheme, type Theme } from '@/lib/theme'
import { TeamTab } from './components/team-tab'
import type { SharedProps, UserRow, InvitationRow } from '@/types'

type Tab = 'general' | 'account' | 'team'

const allTabs: { id: Tab; label: string; adminOnly?: boolean }[] = [
  { id: 'general', label: 'General' },
  { id: 'account', label: 'Account' },
  { id: 'team', label: 'Team', adminOnly: true },
]

export default function Show() {
  const { users, pending_invitations, current_user } = usePage<SharedProps & { users: UserRow[]; pending_invitations: InvitationRow[] }>().props
  const [activeTab, setActiveTab] = useState<Tab>('general')

  const tabs = allTabs.filter((tab) => !tab.adminOnly || current_user?.role === 'admin')
  const [theme, setThemeState] = useState<Theme>(() => getTheme())
  const [editingPassword, setEditingPassword] = useState(false)
  const passwordForm = useForm({ current_password: '', password: '', password_confirmation: '' })

  function handleThemeChange(next: Theme) {
    setThemeState(next)
    setTheme(next)
  }

  return (
    <div className="mx-auto max-w-3xl w-full">
      <Head title="Settings" />
      <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences.</p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
          <nav className="shrink-0 sm:w-44">
            <ul className="flex gap-1 overflow-x-auto pb-1 sm:flex-col sm:space-y-0.5 sm:overflow-visible sm:pb-0">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors sm:w-full sm:text-left ${
                      activeTab === tab.id
                        ? 'bg-foreground text-background font-semibold'
                        : 'text-muted-foreground hover:bg-foreground/10 hover:text-foreground font-medium'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex-1 min-w-0">
            {activeTab === 'account' && (
              <Card className="gap-0 p-0">
                {editingPassword ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      passwordForm.patch('/account/password', { preserveState: false })
                    }}
                  >
                    <div className="divide-y divide-border">
                      <div className="flex flex-col gap-4 px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingPassword(false)}
                            className="flex shrink-0 items-center self-stretch rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Back"
                          >
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={22} strokeWidth={1.5} />
                          </button>
                          <div>
                            <p className="text-sm font-medium">Change Password</p>
                            <p className="text-sm text-muted-foreground">Enter your current and new password.</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium">Current password</label>
                          <input
                            type="password"
                            autoComplete="current-password"
                            value={passwordForm.data.current_password}
                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                            className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 ${
                              passwordForm.errors.current_password
                                ? 'border-destructive focus:ring-destructive/30'
                                : 'border-input focus:ring-ring'
                            }`}
                          />
                          {passwordForm.errors.current_password && (
                            <p className="text-xs text-destructive">{passwordForm.errors.current_password}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium">New password</label>
                          <input
                            type="password"
                            autoComplete="new-password"
                            value={passwordForm.data.password}
                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                            className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 ${
                              passwordForm.errors.password
                                ? 'border-destructive focus:ring-destructive/30'
                                : 'border-input focus:ring-ring'
                            }`}
                          />
                          {passwordForm.errors.password && (
                            <p className="text-xs text-destructive">{passwordForm.errors.password}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium">Confirm new password</label>
                          <input
                            type="password"
                            autoComplete="new-password"
                            value={passwordForm.data.password_confirmation}
                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                            className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 ${
                              passwordForm.errors.password_confirmation
                                ? 'border-destructive focus:ring-destructive/30'
                                : 'border-input focus:ring-ring'
                            }`}
                          />
                          {passwordForm.errors.password_confirmation && (
                            <p className="text-xs text-destructive">{passwordForm.errors.password_confirmation}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 px-4 py-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingPassword(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={passwordForm.processing} className="gap-2">
                          {passwordForm.processing && <SpinningWheel />}
                          Save changes
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="divide-y divide-border">
                    <div className="flex items-center justify-between gap-4 px-4 py-4">
                      <div>
                        <p className="text-sm font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">Update the password associated with your account.</p>
                      </div>
                      <Button variant="outline" className="shrink-0" onClick={() => setEditingPassword(true)} disabled={!!current_user?.provider}>
                        Edit
                      </Button>
                    </div>

                    {/* Add new account settings here as additional divs */}
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'general' && (
              <Card className="gap-0 p-0">
                <div className="divide-y divide-border">

                  {/* ── Theme ── */}
                  <div className="flex items-center justify-between gap-4 px-4 py-4">
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-sm text-muted-foreground">Choose your preferred color theme.</p>
                    </div>
                    <Select value={theme} onValueChange={(v) => handleThemeChange(v as Theme)}>
                      <SelectTrigger className="w-32 shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Add new appearance settings here as additional divs */}

                </div>
              </Card>
            )}

            {activeTab === 'team' && <TeamTab users={users} pending_invitations={pending_invitations} />}
          </div>
        </div>
    </div>
  )
}
