import type { Post } from '../api/types'

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="empty-message" role="status">
        Este usuario todavía no tiene publicaciones.
      </p>
    )
  }

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-card">
          <div className="post-card__header">
            <span className="material-symbols-outlined" aria-hidden="true">
              article
            </span>
            <h3>{post.title}</h3>
          </div>
          <p className="post-card__body">{post.body}</p>
        </li>
      ))}
    </ul>
  )
}
