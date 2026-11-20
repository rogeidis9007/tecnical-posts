import { useMemo, useState } from 'react'
import type { User } from '../api/types'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { SearchInput } from '../components/SearchInput'
import { UserList } from '../components/UserList'
import { filterUsers } from '../features/users/filterUsers'
import { useUsers } from '../features/users/useUsers'

interface UsersPageProps {
  onSelectUser?: (user: User) => void
}

export function UsersPage({ onSelectUser }: UsersPageProps) {
  const { users, loading, error, retry } = useUsers()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => filterUsers(users, query), [users, query])

  return (
    <section className="page">
      <header className="page__header">
        <h1>Usuarios</h1>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar por nombre"
        />
      </header>

      {loading && <LoadingState message="Cargando usuarios..." />}

      {!loading && error && <ErrorState message={error} onRetry={retry} />}

      {!loading && !error && <UserList users={filtered} onSelect={onSelectUser} />}
    </section>
  )
}
