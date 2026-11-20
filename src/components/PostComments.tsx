import { useState } from 'react'
import { useComments } from '../features/posts/useComments'
import { ErrorState } from './ErrorState'
import { LoadingState } from './LoadingState'

interface PostCommentsProps {
  postId: number
}

export function PostComments({ postId }: PostCommentsProps) {
  const [open, setOpen] = useState(false)
  const { comments, loading, error, reload } = useComments(postId, open)

  return (
    <div className="comments">
      <button
        type="button"
        className="button button--ghost comments__toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {open ? 'expand_less' : 'chat_bubble_outline'}
        </span>
        {open ? 'Ocultar comentarios' : 'Ver comentarios'}
      </button>

      {open && (
        <div className="comments__panel">
          {loading && <LoadingState message="Cargando comentarios..." />}

          {!loading && error && (
            <ErrorState message={error} onRetry={reload} />
          )}

          {!loading && !error && comments.length === 0 && (
            <p className="empty-message" role="status">
              Este post no tiene comentarios.
            </p>
          )}

          {!loading && !error && comments.length > 0 && (
            <ul className="comment-list">
              {comments.map((comment) => (
                <li key={comment.id} className="comment-card">
                  <div className="comment-card__head">
                    <span
                      className="comment-card__avatar"
                      aria-hidden="true"
                    >
                      {comment.name
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </span>
                    <div>
                      <strong>{comment.name}</strong>
                      <small>{comment.email}</small>
                    </div>
                  </div>
                  <p className="comment-card__body">{comment.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
