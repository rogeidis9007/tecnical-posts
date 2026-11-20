import { getJson } from './client'

export interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

export function getCommentsByPost(postId: number): Promise<Comment[]> {
  return getJson<Comment[]>(`/comments?postId=${postId}`)
}
