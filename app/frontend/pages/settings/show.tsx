import { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Tab = 'account'

const tabs: { id: Tab; label: string }[] = [
  { id: 'account', label: 'Account' },
  // { id: 'team', label: 'Team' },
]

export default function Show() {
  const [activeTab, setActiveTab] = useState<Tab>('account')

  return (
    <div className="min-h-[calc(100svh-3.5rem)] px-8 py-12">
      <Head title="Settings" />

      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences.</p>
        </div>

        <div className="flex gap-10">
          <nav className="w-44 shrink-0">
            <ul className="space-y-0.5">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-foreground/10 text-foreground font-semibold'
                        : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground font-medium'
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex-1 space-y-4 min-w-0">
            {activeTab === 'account' && (
              <>
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update the password associated with your account.</CardDescription>
                  </CardHeader>
                  <CardContent className="py-6">
                    {/* Change password form goes here */}
                  </CardContent>
                  <CardFooter>
                    <Button disabled>Save changes</Button>
                  </CardFooter>
                </Card>

                {/* Add more Cards here for additional account settings */}
              </>
            )}

            {/* {activeTab === 'team' && (
              <>
              </>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}
