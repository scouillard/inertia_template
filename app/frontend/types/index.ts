export type FlashData = {
  notice?: string
  alert?: string
}

export type SharedProps = {
  current_user: { id: number; email: string; name: string; provider: string | null } | null
}

export interface UserRow {
  id: number
  name: string
  email: string
  role: 'member' | 'admin'
}

export interface InvitationRow {
  id: number
  email: string
  created_at: string
}
