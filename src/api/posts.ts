import { getJson } from './client'
import type { Post } from './types'

export function getPostsByUser(userId: number): Promise<Post[]> {
  return getJson<Post[]>(`/posts?userId=${userId}`)
}
