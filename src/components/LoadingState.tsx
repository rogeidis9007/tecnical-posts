export function LoadingState({ message }: { message?: string }) {
  return (
    <div className="status-block" role="status">
      <span className="material-symbols-outlined spinning" aria-hidden="true">
        progress_activity
      </span>
      <p>{message ?? 'Cargando...'}</p>
    </div>
  )
}
