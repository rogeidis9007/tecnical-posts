import { getJson } from './client'
import type { User } from './types'

export function getUsers(): Promise<User[]> {
  return getJson<User[]>('/users')
}
