interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="search-input">
      <span className="material-symbols-outlined" aria-hidden="true">
        search
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? 'Buscar...'}
        aria-label="Buscar usuario por nombre"
      />
    </div>
  )
}
