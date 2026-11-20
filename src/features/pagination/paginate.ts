export function slicePage<T>(
  items: T[],
  page: number,
  pageSize: number,
): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function totalPages(count: number, pageSize: number): number {
  if (pageSize <= 0) {
    return 1
  }
  return Math.max(1, Math.ceil(count / pageSize))
}
