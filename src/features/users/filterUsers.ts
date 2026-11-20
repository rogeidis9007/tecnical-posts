import type { User } from '../../api/types'

export function filterUsers(users: User[], query: string): User[] {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return users
  }

  return users.filter((user) => user.name.toLowerCase().includes(normalized))
}
