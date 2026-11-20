import { totalPages } from '../features/pagination/paginate'

interface PaginationProps {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  label: string
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  label,
}: PaginationProps) {
  const pages = totalPages(totalItems, pageSize)

  if (pages <= 1) {
    return null
  }

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  return (
    <nav className="pagination" aria-label={label}>
      <button
        type="button"
        className="button button--ghost"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          chevron_left
        </span>
        Anterior
      </button>

      <span className="pagination__status" aria-live="polite">
        {from}–{to} de {totalItems} · pág. {page} de {pages}
      </span>

      <button
        type="button"
        className="button button--ghost"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
      >
        Siguiente
        <span className="material-symbols-outlined" aria-hidden="true">
          chevron_right
        </span>
      </button>
    </nav>
  )
}
