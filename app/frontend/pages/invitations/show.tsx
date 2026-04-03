import { Head, Form, usePage } from '@inertiajs/react'
import { SpinningWheel } from '@/components/spinning-wheel'

interface InvitationShowProps {
  email: string
  token: string
}

export default function Show() {
  const { email, token } = usePage<InvitationShowProps>().props

  return (
    <div className="full-page flex items-center justify-center pb-48">
      <Head title="Accept invitation" />

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            You've been invited. Set up your account below.
          </p>
        </div>

        <Form method="patch" action={`/invitations/${token}`} className="space-y-4">
          {({ errors, processing }) => (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Your name</label>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 ${
                    errors.name
                      ? 'border-destructive focus:ring-destructive/30'
                      : 'border-input focus:ring-ring'
                  }`}
                  required
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 ${
                    errors.password
                      ? 'border-destructive focus:ring-destructive/30'
                      : 'border-input focus:ring-ring'
                  }`}
                  required
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Confirm password</label>
                <input
                  type="password"
                  name="password_confirmation"
                  autoComplete="new-password"
                  className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 ${
                    errors.password_confirmation
                      ? 'border-destructive focus:ring-destructive/30'
                      : 'border-input focus:ring-ring'
                  }`}
                  required
                />
                {errors.password_confirmation && (
                  <p className="text-xs text-destructive">{errors.password_confirmation}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {processing && <SpinningWheel />}
                Create account
              </button>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
