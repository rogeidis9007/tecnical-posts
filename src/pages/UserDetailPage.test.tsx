import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getPostsByUser } from '../api/posts'
import type { User } from '../api/types'
import { UserDetailPage } from './UserDetailPage'

vi.mock('../api/posts', () => ({
  getPostsByUser: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
}))

vi.mock('../api/comments', () => ({
  getCommentsByPost: vi.fn(),
}))

const mockedGetPosts = vi.mocked(getPostsByUser)

const user: User = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'leanne@example.com',
}

const samplePosts = [
  { userId: 1, id: 1, title: 'Primera publicación', body: 'Contenido de prueba' },
  { userId: 1, id: 2, title: 'Segunda publicación', body: 'Más contenido' },
]

describe('UserDetailPage', () => {
  beforeEach(() => {
    mockedGetPosts.mockReset()
    mockedGetPosts.mockResolvedValue(samplePosts)
  })

  it('muestra las publicaciones del usuario', async () => {
    render(<UserDetailPage user={user} onBack={() => {}} />)

    expect(await screen.findByText('Primera publicación')).toBeInTheDocument()
    expect(screen.getByText('Segunda publicación')).toBeInTheDocument()
    expect(mockedGetPosts).toHaveBeenCalledWith(1)
  })

  it('no agrega una publicación si el formulario está vacío', async () => {
    render(<UserDetailPage user={user} onBack={() => {}} />)
    await screen.findByText('Primera publicación')

    await userEvent.click(screen.getByRole('button', { name: /publicar/i }))

    expect(
      await screen.findByText('El título es obligatorio.'),
    ).toBeInTheDocument()
    expect(screen.getByText('El texto es obligatorio.')).toBeInTheDocument()
    expect(screen.queryByText('Nueva publicación local')).not.toBeInTheDocument()
  })

  it('agrega la nueva publicación al inicio de la lista', async () => {
    render(<UserDetailPage user={user} onBack={() => {}} />)
    await screen.findByText('Primera publicación')

    await userEvent.type(
      screen.getByLabelText('Título'),
      'Nueva publicación local',
    )
    await userEvent.type(
      screen.getByLabelText('Texto'),
      'Texto creado desde el formulario',
    )
    await userEvent.click(screen.getByRole('button', { name: /publicar/i }))

    expect(await screen.findByText('Nueva publicación local')).toBeInTheDocument()

    const titles = screen.getAllByRole('heading', { level: 3 })
    expect(titles[0]).toHaveTextContent('Nueva publicación local')
    expect(screen.getByLabelText('Título')).toHaveValue('')
    expect(screen.getByLabelText('Texto')).toHaveValue('')
  })

  it('muestra error si fallan las publicaciones', async () => {
    mockedGetPosts.mockRejectedValueOnce(new Error('boom'))

    render(<UserDetailPage user={user} onBack={() => {}} />)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudieron cargar las publicaciones.',
    )
  })

  it('elimina una publicación tras confirmar', async () => {
    const { deletePost } = await import('../api/posts')
    vi.mocked(deletePost).mockResolvedValue({})

    render(<UserDetailPage user={user} onBack={() => {}} />)
    await screen.findByText('Primera publicación')

    await userEvent.click(
      screen.getByRole('button', { name: 'Eliminar Primera publicación' }),
    )

    const confirmButtons = screen
      .getAllByRole('button', { name: 'Eliminar' })
      .filter(
        (button) =>
          button.textContent === 'Eliminar' ||
          button.textContent === 'Eliminando...',
      )
    await userEvent.click(confirmButtons[0])

    expect(await screen.findByText('Segunda publicación')).toBeInTheDocument()
    expect(screen.queryByText('Primera publicación')).not.toBeInTheDocument()
    expect(deletePost).toHaveBeenCalledWith(1)
  })

  it('abre y cierra los comentarios de un post', async () => {
    const { getCommentsByPost } = await import('../api/comments')
    vi.mocked(getCommentsByPost).mockResolvedValue([
      {
        postId: 1,
        id: 1,
        name: 'Elaine',
        email: 'elaine@example.com',
        body: 'Buen post',
      },
    ])

    render(<UserDetailPage user={user} onBack={() => {}} />)
    await screen.findByText('Primera publicación')

    const [firstPost] = screen.getAllByRole('listitem')
    await userEvent.click(
      within(firstPost).getByRole('button', { name: /ver comentarios/i }),
    )

    expect(await screen.findByText('Buen post')).toBeInTheDocument()
    expect(getCommentsByPost).toHaveBeenCalledWith(1)
  })
})
