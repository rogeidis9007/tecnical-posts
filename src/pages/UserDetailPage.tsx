import type { User } from '../api/types'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { PostForm } from '../components/PostForm'
import { PostList } from '../components/PostList'
import { usePosts } from '../features/posts/usePosts'

interface UserDetailPageProps {
  user: User
  onBack: () => void
}

export function UserDetailPage({ user, onBack }: UserDetailPageProps) {
  const { posts, loading, error, retry, addPost } = usePosts(user.id)

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
          <span className="material-symbols-outlined page__avatar" aria-hidden="true">
            person
          </span>
          <div>
            <h1>{user.name}</h1>
            <p className="page__subtitle">
              @{user.username} · {user.email}
            </p>
          </div>
        </div>
      </header>

      <PostForm onSubmitPost={addPost} />

      <div className="posts-section">
        <h2>Publicaciones</h2>

        {loading && <LoadingState message="Cargando publicaciones..." />}

        {!loading && error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && <PostList posts={posts} />}
      </div>
    </section>
  )
}
