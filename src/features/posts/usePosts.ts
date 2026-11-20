import { useCallback, useEffect, useState } from 'react'
import { getPostsByUser } from '../../api/posts'
import type { Post } from '../../api/types'
import type { PostDraft } from './validatePostForm'

interface UsePostsResult {
  posts: Post[]
  loading: boolean
  error: string | null
  retry: () => void
  addPost: (draft: PostDraft) => void
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

  return { posts, loading, error, retry: load, addPost }
}
