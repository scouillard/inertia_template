import { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getTheme, setTheme, type Theme } from '@/lib/theme'

type Tab = 'account' | 'appearance'

const tabs: { id: Tab; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'appearance', label: 'Appearance' },
  // { id: 'team', label: 'Team' },
]

export default function Show() {
  const [activeTab, setActiveTab] = useState<Tab>('account')
  const [theme, setThemeState] = useState<Theme>(() => getTheme())

  function handleThemeChange(next: Theme) {
    setThemeState(next)
    setTheme(next)
  }

  return (
    <div className="min-h-[calc(100svh-3.5rem)] px-4 py-8 sm:px-8 sm:py-12">
      <Head title="Settings" />

      <div className="mx-auto max-w-3xl">
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
                <div className="divide-y divide-border">

                  {/* ── Change Password ── */}
                  <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <div>
                      <p className="text-sm font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">Update the password associated with your account.</p>
                    </div>
                    <Button disabled className="shrink-0">Save changes</Button>
                  </div>

                  {/* Add new account settings here as additional divs */}

                </div>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card className="gap-0 p-0">
                <div className="divide-y divide-border">

                  {/* ── Theme ── */}
                  <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-sm text-muted-foreground">Choose your preferred color theme.</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        onClick={() => handleThemeChange('light')}
                      >
                        Light
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        onClick={() => handleThemeChange('dark')}
                      >
                        Dark
                      </Button>
                    </div>
                  </div>

                  {/* Add new appearance settings here as additional divs */}

                </div>
              </Card>
            )}

            {/* {activeTab === 'team' && (
              <Card className="gap-0 p-0">
                <div className="divide-y divide-border">
                </div>
              </Card>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}
