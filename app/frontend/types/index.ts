export type FlashData = {
  notice?: string
  alert?: string
}

export interface Notification {
  id: number
  message: string
  read_at: string | null
  created_at: string
}

export type SharedProps = {
  current_user: { id: number; email: string; name: string; provider: string | null; role: 'member' | 'admin' } | null
  unread_notifications_count: number
  notifications: Notification[]
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
  expires_at: string
  token: string
}
