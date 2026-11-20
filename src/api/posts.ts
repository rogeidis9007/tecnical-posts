import { deleteJson, getJson, putJson } from './client'
import type { Post } from './types'

export function getPostsByUser(userId: number): Promise<Post[]> {
  return getJson<Post[]>(`/posts?userId=${userId}`)
}

// JSONPlaceholder acepta PUT/DELETE pero no persiste: usamos la respuesta
// solo para validar que la petición salió bien y luego aplicamos el cambio local.
export function updatePost(post: Post): Promise<Post> {
  return putJson<Post>(`/posts/${post.id}`, post)
}

export function deletePost(id: number): Promise<unknown> {
  return deleteJson<unknown>(`/posts/${id}`)
}
