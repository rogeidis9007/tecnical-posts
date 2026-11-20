import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getUsers } from '../api/users'
import { UsersPage } from './UsersPage'

vi.mock('../api/users', () => ({
  getUsers: vi.fn(),
}))

const mockedGetUsers = vi.mocked(getUsers)

const sampleUsers = [
  { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'leanne@example.com' },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'ervin@example.com',
  },
]

describe('UsersPage', () => {
  beforeEach(() => {
    mockedGetUsers.mockReset()
  })

  it('muestra la lista de usuarios después de cargar', async () => {
    mockedGetUsers.mockResolvedValue(sampleUsers)

    render(<UsersPage />)

    expect(screen.getByRole('status')).toHaveTextContent('Cargando usuarios...')

    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('filtra la lista por nombre', async () => {
    mockedGetUsers.mockResolvedValue(sampleUsers)

    render(<UsersPage />)
    await screen.findByText('Leanne Graham')

    const input = screen.getByLabelText('Buscar usuario por nombre')
    await userEvent.type(input, 'ervin')

    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument()
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
  })

  it('muestra el error con opción de reintentar', async () => {
    mockedGetUsers.mockRejectedValueOnce(new Error('network down'))
    mockedGetUsers.mockResolvedValueOnce(sampleUsers)

    render(<UsersPage />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('No se pudieron cargar los usuarios.')

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    })
    expect(mockedGetUsers).toHaveBeenCalledTimes(2)
  })
})
