import { Head, usePage } from '@inertiajs/react'
import { version as react_version } from 'react'

import railsSvg from '/assets/rails.svg'
import inertiaSvg from '/assets/inertia.svg'
import reactSvg from '/assets/react.svg'

interface DashboardProps extends Record<string, unknown> {
  rails_version: string
  ruby_version: string
  rack_version: string
  inertia_rails_version: string
}

export default function Dashboard() {
  const { rails_version, ruby_version, rack_version, inertia_rails_version } = usePage<DashboardProps>().props
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Head title="Ruby on Rails + Inertia + React" />

      <nav className="flex items-center gap-4">
        <a href="https://rubyonrails.org" target="_blank">
          <img className="h-32 p-4" alt="Ruby on Rails Logo" src={railsSvg} />
        </a>
        <a href="https://inertia-rails.dev" target="_blank">
          <img className="h-32 p-4" src={inertiaSvg} alt="Inertia logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img className="h-32 p-4" src={reactSvg} alt="React logo" />
        </a>
      </nav>

      <p className="mt-8 text-sm text-muted-foreground">
        Edit <code>app/frontend/pages/dashboard.tsx</code> and save to test HMR.
      </p>

      <ul className="mt-8 flex gap-2 text-sm text-muted-foreground list-none">
        <li>Rails {rails_version}</li>
        <li>·</li>
        <li>Ruby {ruby_version}</li>
        <li>·</li>
        <li>Rack {rack_version}</li>
        <li>·</li>
        <li>Inertia Rails {inertia_rails_version}</li>
        <li>·</li>
        <li>React {react_version}</li>
      </ul>
    </div>
  )
}
