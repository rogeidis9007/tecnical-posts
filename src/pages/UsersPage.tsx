import { useEffect, useMemo, useState } from 'react'
import type { User } from '../api/types'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { slicePage } from '../features/pagination/paginate'
import { Pagination } from '../components/Pagination'
import { SearchInput } from '../components/SearchInput'
import { UserList } from '../components/UserList'
import { filterUsers } from '../features/users/filterUsers'
import { useUsers } from '../features/users/useUsers'

const PAGE_SIZE = 6

interface UsersPageProps {
  onSelectUser?: (user: User) => void
}

export function UsersPage({ onSelectUser }: UsersPageProps) {
  const { users, loading, error, retry } = useUsers()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => filterUsers(users, query), [users, query])

  // Al cambiar la búsqueda volvemos a la primera página
  useEffect(() => {
    setPage(1)
  }, [query])

  const pageItems = useMemo(
    () => slicePage(filtered, page, PAGE_SIZE),
    [filtered, page],
  )

  return (
    <section className="page page--home">
      <header className="hero">
        <p className="page__eyebrow">Directorio</p>
        <h1>Usuarios</h1>
        <p className="hero__lead">
          Explorá el equipo, buscá por nombre y abrí un perfil para ver o
          crear publicaciones.
        </p>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar por nombre"
        />
        {!loading && !error && (
          <p className="hero__meta" role="status">
            {filtered.length} de {users.length} usuarios
          </p>
        )}
      </header>

      <div className="list-region">
        {loading && <LoadingState message="Cargando usuarios..." />}

        {!loading && error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && (
          <>
            <UserList users={pageItems} onSelect={onSelectUser} />
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              totalItems={filtered.length}
              onPageChange={setPage}
              label="Paginación de usuarios"
            />
          </>
        )}
      </div>
    </section>
  )
}
