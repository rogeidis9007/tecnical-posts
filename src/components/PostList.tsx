import { useState } from 'react'
import type { Post } from '../api/types'
import type { PostDraft } from '../features/posts/validatePostForm'
import {
  hasErrors,
  validatePostForm,
} from '../features/posts/validatePostForm'
import { PostComments } from './PostComments'

interface PostListProps {
  posts: Post[]
  onEdit?: (id: number, draft: PostDraft) => Promise<boolean>
  onDelete?: (id: number) => Promise<boolean>
}

export function PostList({ posts, onEdit, onDelete }: PostListProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<PostDraft>({ title: '', body: '' })
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({})
  const [actionError, setActionError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (posts.length === 0) {
    return (
      <p className="empty-message" role="status">
        Este usuario todavía no tiene publicaciones.
      </p>
    )
  }

  function startEdit(post: Post) {
    setEditingId(post.id)
    setConfirmingId(null)
    setActionError(null)
    setErrors({})
    setDraft({ title: post.title, body: post.body })
  }

  function cancelEdit() {
    setEditingId(null)
    setErrors({})
    setActionError(null)
  }

  async function saveEdit(id: number) {
    const validation = validatePostForm(draft)
    setErrors(validation)
    if (hasErrors(validation) || !onEdit) {
      return
    }

    setBusy(true)
    setActionError(null)
    const ok = await onEdit(id, draft)
    setBusy(false)

    if (ok) {
      setEditingId(null)
    } else {
      setActionError('No se pudo guardar el cambio. Intentá de nuevo.')
    }
  }

  async function confirmDelete(id: number) {
    if (!onDelete) {
      return
    }

    setBusy(true)
    setActionError(null)
    const ok = await onDelete(id)
    setBusy(false)

    if (ok) {
      setConfirmingId(null)
    } else {
      setActionError('No se pudo eliminar la publicación.')
      setConfirmingId(null)
    }
  }

  return (
    <>
      {actionError && (
        <p className="inline-alert" role="alert">
          {actionError}
        </p>
      )}

      <ul className="post-list">
        {posts.map((post, index) => (
          <li
            key={post.id}
            className="post-card"
            style={{ '--stagger': `${index * 40}ms` } as React.CSSProperties}
          >
            {editingId === post.id ? (
              <div className="post-edit">
                <div className="form-field">
                  <label htmlFor={`edit-title-${post.id}`}>Título</label>
                  <input
                    id={`edit-title-${post.id}`}
                    type="text"
                    value={draft.title}
                    onChange={(event) =>
                      setDraft({ ...draft, title: event.target.value })
                    }
                    aria-invalid={Boolean(errors.title)}
                  />
                  {errors.title && (
                    <p className="field-error" role="alert">
                      {errors.title}
                    </p>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor={`edit-body-${post.id}`}>Texto</label>
                  <textarea
                    id={`edit-body-${post.id}`}
                    rows={3}
                    value={draft.body}
                    onChange={(event) =>
                      setDraft({ ...draft, body: event.target.value })
                    }
                    aria-invalid={Boolean(errors.body)}
                  />
                  {errors.body && (
                    <p className="field-error" role="alert">
                      {errors.body}
                    </p>
                  )}
                </div>
                <div className="post-card__actions">
                  <button
                    type="button"
                    className="button button--primary"
                    onClick={() => saveEdit(post.id)}
                    disabled={busy}
                  >
                    {busy ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={cancelEdit}
                    disabled={busy}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="post-card__header">
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                  >
                    article
                  </span>
                  <h3>{post.title}</h3>
                  <div className="post-card__icons">
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Editar ${post.title}`}
                      onClick={() => startEdit(post)}
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                      >
                        edit
                      </span>
                    </button>
                    <button
                      type="button"
                      className="icon-button icon-button--danger"
                      aria-label={`Eliminar ${post.title}`}
                      onClick={() => {
                        setConfirmingId(post.id)
                        setEditingId(null)
                        setActionError(null)
                      }}
                      disabled={busy}
                    >
                      <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                      >
                        delete
                      </span>
                    </button>
                  </div>
                </div>

                <p className="post-card__body">{post.body}</p>

                {confirmingId === post.id && (
                  <div className="confirm-bar" role="alertdialog" aria-label="Confirmar eliminación">
                    <span>¿Eliminar esta publicación?</span>
                    <div className="post-card__actions">
                      <button
                        type="button"
                        className="button button--danger"
                        onClick={() => confirmDelete(post.id)}
                        disabled={busy}
                      >
                        {busy ? 'Eliminando...' : 'Eliminar'}
                      </button>
                      <button
                        type="button"
                        className="button button--ghost"
                        onClick={() => setConfirmingId(null)}
                        disabled={busy}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {confirmingId !== post.id && editingId !== post.id && (
                  <PostComments postId={post.id} />
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
