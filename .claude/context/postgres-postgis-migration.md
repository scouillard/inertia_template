# PostgreSQL + PostGIS Migration

## Status: Planned

This template is being migrated from SQLite3 to PostgreSQL with PostGIS support.

---

## Local Dev Philosophy

**Native PG, no Docker Compose for dev.** Install PostgreSQL + PostGIS once on the machine. Each project gets its own database on the shared server.

The key insight: the pain with Docker Compose in dev is not aliases — it's that `rails console` / `rails dbconsole` require `docker exec` into the container. With native PG, these just work.

```bash
# Ubuntu/Debian one-time setup:
sudo apt install postgresql-16 postgresql-16-postgis-3

# macOS one-time setup:
brew install postgresql@16 postgis
```

`database.yml` defaults to `ENV["USER"]` as the PG username so peer auth works out of the box on Linux and Homebrew macOS. No `.env` file needed for typical dev setups.

## Database Architecture

**Single database per environment** — no multi-DB.

- `inertia_template_development`
- `inertia_template_test`
- `inertia_template_production`

Solid Cache, Solid Queue, Solid Cable all use the primary database connection. The multi-database SQLite pattern (separate files for each component) is not needed with PostgreSQL.

## Key Gems

```ruby
gem "pg", "~> 1.5"
gem "activerecord-postgis-adapter", "~> 10.0"
```

Adapter in `database.yml`: `postgis` (not `postgresql`).

## PostGIS Extension

Enabled via migration — must be the first migration (earliest timestamp):

```ruby
class EnablePostgis < ActiveRecord::Migration[8.1]
  def change
    enable_extension "postgis"
  end
end
```

## Kamal 2 Production Setup

Postgres accessory uses `postgis/postgis:16-3.4` image (official, includes PostGIS pre-installed).

App container reaches PG at hostname `inertia_template-postgres` (Kamal Docker network naming: `{service}-{accessory}`).

Port bound to loopback only: `"127.0.0.1:5432:5432"` — not publicly exposed.

**Deploy workflow:**
```bash
kamal app exec --primary "bin/rails db:migrate"
kamal deploy
```

**Secrets pattern:** `POSTGRES_PASSWORD` (for the PG container) and `DB_PASSWORD` (for the app container) are aliased to the same value in `.kamal/secrets`.

## Environment Variables

| Var | Default | Used in |
|---|---|---|
| `DB_HOST` | `localhost` | `database.yml` |
| `DB_PORT` | `5432` | `database.yml` |
| `DB_USERNAME` | `$USER` | `database.yml` |
| `DB_PASSWORD` | `""` | `database.yml` |
| `DB_NAME` | `inertia_template_production` | `database.yml` (production) |
| `POSTGRES_PASSWORD` | — | Kamal postgres accessory container |
| `DB_PASSWORD` | — | Kamal app container (= POSTGRES_PASSWORD) |
