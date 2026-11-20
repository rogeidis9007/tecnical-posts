import { useCallback, useEffect, useState } from 'react'
import { getCommentsByPost, type Comment } from '../../api/comments'

interface UseCommentsResult {
  comments: Comment[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useComments(postId: number, enabled: boolean): UseCommentsResult {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  useEffect(() => {
    if (!enabled) {
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getCommentsByPost(postId)
      .then((data) => {
        if (!cancelled) {
          setComments(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('No se pudieron cargar los comentarios.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [postId, enabled, reloadKey])

  return { comments, loading, error, reload }
}
