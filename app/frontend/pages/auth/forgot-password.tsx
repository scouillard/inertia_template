import { Head, Form, Link, usePage } from '@inertiajs/react'
import { SpinningWheel } from '@/components/spinning-wheel'

export default function ForgotPassword() {
  const { sent, errors } = usePage<{ sent?: boolean; errors?: { email?: string } }>().props

  if (sent) {
    return (
      <div className="flex flex-1 items-center justify-center pb-36">
        <Head title="Check your inbox" />

        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Check your inbox</h1>
          <p className="text-sm text-muted-foreground">
            If that email is registered, you'll receive reset instructions shortly.
          </p>
          <Link href="/users/sign_in" className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center pb-36">
      <Head title="Forgot password" />

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Forgot password?</h1>
          <p className="text-sm text-muted-foreground">Enter your email and we'll send you reset instructions.</p>
        </div>

        <Form method="post" action="/users/password" className="space-y-4">
          {({ processing }) => (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="user[email]"
                  className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 ${errors?.email ? 'border-destructive focus:ring-destructive/30' : 'border-input focus:ring-ring'}`}
                  required
                />
                {errors?.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing && <SpinningWheel />}
                Send reset instructions
              </button>
            </>
          )}
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/users/sign_in" className="hover:text-foreground underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
