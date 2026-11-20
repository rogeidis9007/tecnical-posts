import type { User } from '../api/types'

interface UserListProps {
  users: User[]
  onSelect?: (user: User) => void
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
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
    <ul className="user-grid">
      {users.map((user, index) => (
        <li
          key={user.id}
          style={{ '--stagger': `${index * 35}ms` } as React.CSSProperties}
        >
          <button
            type="button"
            className="user-card"
            onClick={() => onSelect?.(user)}
          >
            <span className="user-card__avatar" aria-hidden="true">
              {initialsOf(user.name)}
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
