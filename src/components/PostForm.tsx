import { useState } from 'react'
import type { PostDraft, PostFormErrors } from '../features/posts/validatePostForm'
import {
  hasErrors,
  validatePostForm,
} from '../features/posts/validatePostForm'

interface PostFormProps {
  onSubmitPost: (draft: PostDraft) => void
}

const emptyDraft: PostDraft = { title: '', body: '' }

export function PostForm({ onSubmitPost }: PostFormProps) {
  const [draft, setDraft] = useState<PostDraft>(emptyDraft)
  const [errors, setErrors] = useState<PostFormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function updateField(field: keyof PostDraft, value: string) {
    const next = { ...draft, [field]: value }
    setDraft(next)

    // Si ya se intentó enviar, revalidamos en vivo
    if (submitted) {
      setErrors(validatePostForm(next))
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validation = validatePostForm(draft)
    setErrors(validation)
    setSubmitted(true)

    if (hasErrors(validation)) {
      return
    }

    onSubmitPost(draft)
    setDraft(emptyDraft)
    setErrors({})
    setSubmitted(false)
  }

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <h2>Nueva publicación</h2>

      <div className="form-field">
        <label htmlFor="post-title">Título</label>
        <input
          id="post-title"
          name="title"
          type="text"
          value={draft.title}
          onChange={(event) => updateField('title', event.target.value)}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'post-title-error' : undefined}
        />
        {errors.title && (
          <p id="post-title-error" className="field-error" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="post-body">Texto</label>
        <textarea
          id="post-body"
          name="body"
          rows={4}
          value={draft.body}
          onChange={(event) => updateField('body', event.target.value)}
          aria-invalid={Boolean(errors.body)}
          aria-describedby={errors.body ? 'post-body-error' : undefined}
        />
        {errors.body && (
          <p id="post-body-error" className="field-error" role="alert">
            {errors.body}
          </p>
        )}
      </div>

      <button type="submit" className="button button--primary">
        <span className="material-symbols-outlined" aria-hidden="true">
          add_circle
        </span>
        Publicar
      </button>
    </form>
  )
}
