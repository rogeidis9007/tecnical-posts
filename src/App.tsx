import { useState } from 'react'
import type { User } from './api/types'
import { UserDetailPage } from './pages/UserDetailPage'
import { UsersPage } from './pages/UsersPage'
import './App.css'

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  if (selectedUser) {
    return (
      <main className="app">
        <UserDetailPage
          user={selectedUser}
          onBack={() => setSelectedUser(null)}
        />
      </main>
    )
  }

  return (
    <main className="app">
      <UsersPage onSelectUser={setSelectedUser} />
    </main>
  )
}

export default App
