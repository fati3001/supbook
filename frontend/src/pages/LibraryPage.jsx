import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

const LibraryPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="library-container">
      <header className="library-header">
        <h1>SupBook</h1>
        <div className="header-right">
          <span>Bonjour, {user?.username}</span>
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      </header>
      <main className="library-main">
        <p>Ma bibliothèque arrive bientôt...</p>
      </main>
    </div>
  )
}

export default LibraryPage
