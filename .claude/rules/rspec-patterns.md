---
description: RSpec conventions — linear specs, factories, Inertia, anti-patterns
paths:
  - 'spec/**'
---

# RSpec Patterns Reference

Conventions for writing specs in this app. Read this before writing any spec.

Write only necessary specs. Do not aim for full coverage — coverage is a by-product, not a goal.

Do not test framework behaviour. Rails validation macros (`validates :name, presence: true`), Devise modules, and standard ActiveRecord associations are tested by their respective libraries — writing specs for them adds noise and breaks when the framework changes. Only test **custom logic**: methods you wrote, scopes with non-trivial conditions, callbacks with side-effects, and authorization rules.

Specs tell a story, top to bottom. Prefer repetition over cleverness — a failing test should be debuggable without scrolling.

---

## Rules

- Use **factories** with minimal required attributes. Traits for variation (`:admin`, `:premium`).
- **Inline `create`** inside `it` blocks by default. Prefer `build` over `create` when the database isn't needed.
- **`before` + `@ivar`** allowed only when setup is (a) needed by every `it` in the block, (b) boring scaffolding, not the subject of the test, and (c) noisy to inline.
- **No `let`, no `let!`, no `subject`.** Ever.
- **NO `shared_examples`, NO `shared_context`.** Ever. Not once. If you're reaching for them, write the tests out longhand.
- **Max 2 levels** of `describe`/`context` nesting.
- Multiple expectations per `it` are fine when they describe one scenario.
- Everything for a spec lives in one file. No `spec/support` modules that hide setup. Tiny visible helpers (`sign_in`) are fine.

## Mocking

- Use **`instance_double(SomeClass)`** — never plain `double("name")`.
- Real objects for your own domain code. Doubles at collaborator boundaries.
- HTTP: WebMock, fail loudly on unmocked requests.
- Jobs: `ActiveJob::TestHelper`. Mail: `ActionMailer::Base.deliveries`.
- If you're tempted to stub your own code, the design probably wants to be split.

## Inertia

Tag specs with `type: :request`.

- Assert on the **component and props**, not just HTTP status:
  ```ruby
  expect(inertia).to render_component("Settings/Users")
  expect(inertia).to have_props(user: hash_including(id: member.id, role: "admin"))
  ```
- Use `have_props` (partial) by default. Reserve `have_exact_props` for when you really mean it.
- Values must be exact literals — RSpec matchers (`be_present`, `include(...)`, etc.) do not work inside `have_props`. If the value is dynamic, drop the props assertion and rely on status + component name.
- Assert on **prop shape**, not equality with `as_json` output. Tests survive serializer swaps.
- Flash: `expect(inertia).to have_flash(notice: "...")`.
- Non-GET redirects must be **`status: :see_other`** (303). Assert it.
- After a redirect, use `follow_redirect!` then assert on the resulting Inertia response.
- Don't test React from Rails specs. Rails specs end at the props boundary; component tests live in JS-land.
- Toasts, clicks, navigation → **system specs**, not request specs.

## Example

```ruby
RSpec.describe "Settings::Users", type: :request do
  describe "PATCH /settings/users/:id" do
    context "as an admin" do
      before do
        @admin = create(:user, :admin)
        sign_in @admin
      end

      it "promotes another user to admin" do
        member = create(:user, role: "member")

        patch settings_user_path(member), params: { role: "admin" }

        expect(response).to redirect_to(settings_path)
        expect(member.reload.role).to eq("admin")
      end

      it "is forbidden from updating their own role" do
        patch settings_user_path(@admin), params: { role: "member" }

        expect(response).to have_http_status(:forbidden)
      end
    end

    it "forbids a non-admin from updating a role" do
      member = create(:user, role: "member")
      target = create(:user, role: "member")
      sign_in member

      patch settings_user_path(target), params: { role: "admin" }

      expect(response).to have_http_status(:forbidden)
    end
  end
end
```

## Anti-patterns

- `let`, `let!`, `subject`
- `shared_examples`, `shared_context` — **never**
- `spec/support` helpers that hide setup
- Nesting deeper than 2 levels
- Fat factories with surprise associations
- Plain `double("name")` instead of `instance_double`
- Stubbing your own domain code
- Extracting a `context` to DRY up two lines
- One-expectation-per-`it` dogma