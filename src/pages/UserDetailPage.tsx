import { useMemo, useState } from 'react'
import type { User } from '../api/types'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { slicePage } from '../features/pagination/paginate'
import { Pagination } from '../components/Pagination'
import { PostForm } from '../components/PostForm'
import { PostList } from '../components/PostList'
import { usePosts } from '../features/posts/usePosts'

const PAGE_SIZE = 5

interface UserDetailPageProps {
  user: User
  onBack: () => void
}

export function UserDetailPage({ user, onBack }: UserDetailPageProps) {
  const { posts, loading, error, retry, addPost, editPost, removePost } =
    usePosts(user.id)
  const [page, setPage] = useState(1)

  const pagePosts = useMemo(
    () => slicePage(posts, page, PAGE_SIZE),
    [posts, page],
  )

  function handleAddPost(draft: Parameters<typeof addPost>[0]) {
    // El post nuevo queda arriba: volvemos a la primera página
    setPage(1)
    addPost(draft)
  }

  async function handleRemovePost(id: number) {
    const ok = await removePost(id)

    // Si la página se quedó vacía (había 1 item), retrocedemos
    if (ok && pagePosts.length === 1 && page > 1) {
      setPage(page - 1)
    }

    return ok
  }

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <section className="page">
      <header className="page__header">
        <button type="button" className="button button--ghost" onClick={onBack}>
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
          Volver
        </button>
        <div className="page__title-row">
          <span className="page__avatar" aria-hidden="true">
            {initials}
          </span>
          <div>
            <p className="page__eyebrow">Perfil</p>
            <h1>{user.name}</h1>
            <p className="page__subtitle">
              @{user.username} · {user.email}
            </p>
          </div>
        </div>
      </header>

      <PostForm onSubmitPost={handleAddPost} />

      <div className="posts-section">
        <div className="section-heading">
          <h2>Publicaciones</h2>
          <span className="count-badge">{posts.length}</span>
        </div>

        {loading && <LoadingState message="Cargando publicaciones..." />}

        {!loading && error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && (
          <>
            <PostList
              posts={pagePosts}
              onEdit={editPost}
              onDelete={handleRemovePost}
            />
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              totalItems={posts.length}
              onPageChange={setPage}
              label="Paginación de publicaciones"
            />
          </>
        )}
      </div>
    </section>
  )
}
