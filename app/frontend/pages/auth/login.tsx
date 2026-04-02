import { Head, Form, Link } from '@inertiajs/react'
import { SpinningWheel } from '@/components/spinning-wheel'

export default function Login() {
  return (
    <div className="full-page flex items-center justify-center pb-48">
      <Head title="Sign in" />

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password</p>
        </div>

        <Form method="post" action="/users/sign_in" className="space-y-4">
          {({ errors, processing }) => (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="user[email]"
                  className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 ${errors.email ? 'border-destructive focus:ring-destructive/30' : 'border-input focus:ring-ring'}`}
                  required
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="user[password]"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Link href="/users/password/new" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing && <SpinningWheel />}
                Sign in
              </button>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
