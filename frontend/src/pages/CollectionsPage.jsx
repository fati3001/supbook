/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { collectionService, bookService } from '../services/api'
import Notification from '../components/Notification'
import Loader from '../components/Loader'

const CollectionsPage = () => {
  const { user, logout } = useAuth()
  const [collections, setCollections] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [newCollectionName, setNewCollectionName] = useState('')
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [selectedBookId, setSelectedBookId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [collectionsRes, booksRes] = await Promise.all([
        collectionService.getAll(),
        bookService.getAll(),
      ])
      setCollections(collectionsRes.data)
      setBooks(booksRes.data)
    } catch {
      showNotification('Erreur lors du chargement', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: '', type: '' }), 3000)
  }

  const handleCreateCollection = async (e) => {
    e.preventDefault()
    if (!newCollectionName.trim()) return
    try {
      await collectionService.create({
        name: newCollectionName,
      })
      setNewCollectionName('')
      await fetchData()
      showNotification('Collection créée !', 'success')
    } catch {
      showNotification('Erreur lors de la création', 'error')
    }
  }

  const handleDeleteCollection = async (documentId) => {
    if (!window.confirm('Supprimer cette collection ?')) return
    try {
      await collectionService.delete(documentId)
      setCollections((prev) => prev.filter((c) => c.documentId !== documentId))
      if (selectedCollection?.documentId === documentId) setSelectedCollection(null)
      showNotification('Collection supprimée', 'success')
    } catch {
      showNotification('Erreur lors de la suppression', 'error')
    }
  }

  const handleAddBookToCollection = async (e) => {
    e.preventDefault()
    if (!selectedBookId || !selectedCollection) return
    try {
      const currentBookIds = selectedCollection.books?.map((b) => b.id) || []
      await collectionService.update(selectedCollection.documentId, {
        books: [...currentBookIds, parseInt(selectedBookId)],
      })
      await fetchData()
      setSelectedBookId('')
      showNotification('Livre ajouté à la collection !', 'success')
    } catch {
      showNotification("Erreur lors de l'ajout", 'error')
    }
  }

  const handleRemoveBookFromCollection = async (bookId) => {
    try {
      const currentBookIds = selectedCollection.books
        ?.filter((b) => b.id !== bookId)
        .map((b) => b.id) || []
      await collectionService.update(selectedCollection.documentId, {
        books: currentBookIds,
      })
      await fetchData()
      showNotification('Livre retiré de la collection', 'success')
    } catch {
      showNotification('Erreur lors de la suppression', 'error')
    }
  }

  useEffect(() => {
    if (selectedCollection) {
      const updated = collections.find(
        (c) => c.documentId === selectedCollection.documentId
      )
      if (updated) setSelectedCollection(updated)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections])

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="library-container">
      {loading && <Loader />}
      <Notification message={notification.message} type={notification.type} />
      <header className="library-header">
        <h1>SupBook</h1>
        <nav className="header-nav">
          <Link to="/library" className="nav-link">Ma bibliothèque</Link>
          <Link to="/collections" className="nav-link">Collections</Link>
        </nav>
        <div className="header-right">
          <span>Bonjour, {user?.username}</span>
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      </header>
      <div className="collections-container">
        <div className="collections-sidebar">
          <h2>Mes Collections</h2>
          <form onSubmit={handleCreateCollection} className="create-collection-form">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Nouvelle collection..."
            />
            <button type="submit">+</button>
          </form>
          {collections.length === 0 && !loading && (
            <p className="empty-text">Aucune collection pour l'instant</p>
          )}
          <ul className="collections-list">
            {collections.map((col) => (
              <li
                key={col.id}
                className={`collection-item ${selectedCollection?.id === col.id ? 'active' : ''}`}
                onClick={() => setSelectedCollection(col)}
              >
                <span>{col.name}</span>
                <button
                  className="btn-delete-small"
                  onClick={(e) => { e.stopPropagation(); handleDeleteCollection(col.documentId) }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="collections-main">
          {!selectedCollection ? (
            <div className="empty-library">
              <p>📚 Sélectionnez une collection pour voir ses livres</p>
            </div>
          ) : (
            <>
              <h2>{selectedCollection.name}</h2>
              <form onSubmit={handleAddBookToCollection} className="add-book-form">
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                >
                  <option value="">-- Ajouter un livre --</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
                <button type="submit">Ajouter</button>
              </form>
              {selectedCollection.books?.length === 0 && (
                <p className="empty-text">Aucun livre dans cette collection</p>
              )}
              <div className="books-grid">
                {selectedCollection.books?.map((book) => (
                  <div key={book.id} className="book-card">
                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                    </div>
                    <div className="book-actions">
                      <button
                        className="btn-delete"
                        onClick={() => handleRemoveBookFromCollection(book.id)}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollectionsPage