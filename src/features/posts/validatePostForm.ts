export interface PostDraft {
  title: string
  body: string
}

export interface PostFormErrors {
  title?: string
  body?: string
}

const MAX_TITLE = 120

export function validatePostForm(draft: PostDraft): PostFormErrors {
  const errors: PostFormErrors = {}

  if (!draft.title.trim()) {
    errors.title = 'El título es obligatorio.'
  } else if (draft.title.trim().length > MAX_TITLE) {
    errors.title = `El título no puede superar ${MAX_TITLE} caracteres.`
  }

  if (!draft.body.trim()) {
    errors.body = 'El texto es obligatorio.'
  }

  return errors
}

export function hasErrors(errors: PostFormErrors): boolean {
  return Boolean(errors.title || errors.body)
}
