import { useCallback, useEffect, useState } from 'react'
import { getUsers } from '../../api/users'
import type { User } from '../../api/types'

interface UseUsersResult {
  users: User[]
  loading: boolean
  error: string | null
  retry: () => void
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)

    getUsers()
      .then((data) => {
        setUsers(data)
      })
      .catch(() => {
        // No exponemos el error crudo de red en la UI
        setError('No se pudieron cargar los usuarios.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { users, loading, error, retry: load }
}
