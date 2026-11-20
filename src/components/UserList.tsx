import type { User } from '../api/types'

interface UserListProps {
  users: User[]
  onSelect?: (user: User) => void
}

export function UserList({ users, onSelect }: UserListProps) {
  if (users.length === 0) {
    return (
      <p className="empty-message" role="status">
        No hay usuarios que coincidan con la búsqueda.
      </p>
    )
  }

  return (
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id}>
          <button
            type="button"
            className="user-card"
            onClick={() => onSelect?.(user)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              person
            </span>
            <span className="user-card__text">
              <strong>{user.name}</strong>
              <small>
                @{user.username} · {user.email}
              </small>
            </span>
            <span
              className="material-symbols-outlined user-card__chevron"
              aria-hidden="true"
            >
              chevron_right
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
