import { useCallback, useEffect, useState } from 'react'
import { deletePost, getPostsByUser, updatePost } from '../../api/posts'
import type { Post } from '../../api/types'
import type { PostDraft } from './validatePostForm'

interface UsePostsResult {
  posts: Post[]
  loading: boolean
  error: string | null
  retry: () => void
  addPost: (draft: PostDraft) => void
  editPost: (id: number, draft: PostDraft) => Promise<boolean>
  removePost: (id: number) => Promise<boolean>
}

export function usePosts(userId: number): UsePostsResult {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)

    getPostsByUser(userId)
      .then((data) => {
        setPosts(data)
      })
      .catch(() => {
        setError('No se pudieron cargar las publicaciones.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  // JSONPlaceholder no persiste: el alta vive solo en memoria
  const addPost = useCallback(
    (draft: PostDraft) => {
      setPosts((current) => {
        const nextId =
          current.reduce((max, post) => Math.max(max, post.id), 0) + 1

        const newPost: Post = {
          userId,
          id: nextId,
          title: draft.title.trim(),
          body: draft.body.trim(),
        }

        return [newPost, ...current]
      })
    },
    [userId],
  )

  const editPost = useCallback(
    async (id: number, draft: PostDraft): Promise<boolean> => {
      const current = posts.find((post) => post.id === id)
      if (!current) {
        return false
      }

      const next: Post = {
        ...current,
        title: draft.title.trim(),
        body: draft.body.trim(),
      }

      try {
        // Emulamos el PUT; si falla la red no tocamos la lista
        await updatePost(next)
      } catch {
        return false
      }

      setPosts((list) => list.map((post) => (post.id === id ? next : post)))
      return true
    },
    [posts],
  )

  const removePost = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await deletePost(id)
      } catch {
        return false
      }

      setPosts((list) => list.filter((post) => post.id !== id))
      return true
    },
    [],
  )

  return { posts, loading, error, retry: load, addPost, editPost, removePost }
}
