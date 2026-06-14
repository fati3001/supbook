/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { bookService, authorService, reviewService } from '../services/api'
import BookCard from '../components/BookCard'
import AddBookModal from '../components/AddBookModal'
import Notification from '../components/Notification'
import Loader from '../components/Loader'

const LibraryPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    filterBooks()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books, search, statusFilter])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const res = await bookService.getAll()
      setBooks(res.data)
    } catch {
      showNotification('Erreur lors du chargement des livres', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filterBooks = () => {
    let result = [...books]
    if (search) {
      result = result.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter((b) => b.reading_status === statusFilter)
    }
    setFilteredBooks(result)
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: '', type: '' }), 3000)
  }

  const wait = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleAddBook = async (formData) => {
    try {
      let authorId = formData.author
      if (formData.newAuthorName) {
        const newAuthor = await authorService.create({ name: formData.newAuthorName })
        authorId = newAuthor.data.id
      }
      const bookData = {
        title: formData.title,
        cover_url: formData.cover_url,
        year: formData.year,
        reading_status: formData.reading_status,
        rating: formData.rating,
        author: authorId || null,
      }
      const newBook = await bookService.create(bookData)
      if (formData.reviewContent) {
        await reviewService.create({
          content: formData.reviewContent,
          book: newBook.data.id,
        })
      }
      setShowModal(false)
      showNotification('Livre ajouté avec succès !', 'success')
      await wait()
      await fetchBooks()
    } catch {
      showNotification("Erreur lors de l'ajout du livre", 'error')
    }
  }

  const handleUpdateBook = async (formData) => {
    try {
      let authorId = formData.author
      if (formData.newAuthorName) {
        const newAuthor = await authorService.create({ name: formData.newAuthorName })
        authorId = newAuthor.data.id
      }
      await bookService.update(selectedBook.documentId, {
        title: formData.title,
        cover_url: formData.cover_url,
        year: formData.year,
        reading_status: formData.reading_status,
        rating: formData.rating,
        author: authorId || null,
      })
      if (formData.reviewContent && selectedBook.review) {
        await reviewService.update(selectedBook.review.documentId, {
          content: formData.reviewContent,
        })
      } else if (formData.reviewContent && !selectedBook.review) {
        await reviewService.create({
          content: formData.reviewContent,
          book: selectedBook.documentId,
        })
      }
      setShowModal(false)
      setSelectedBook(null)
      showNotification('Livre modifié avec succès !', 'success')
      setBooks((prev) => prev.map((b) =>
        b.documentId === selectedBook.documentId
          ? {
              ...b,
              title: formData.title,
              cover_url: formData.cover_url,
              year: formData.year,
              reading_status: formData.reading_status,
              rating: formData.rating,
            }
          : b
      ))
      await wait()
      await fetchBooks()
    } catch {
      showNotification('Erreur lors de la modification', 'error')
    }
  }

  const handleDeleteBook = async (documentId) => {
    if (!window.confirm('Supprimer ce livre ?')) return
    try {
      await bookService.delete(documentId)
      showNotification('Livre supprimé', 'success')
      setBooks((prev) => prev.filter((b) => b.documentId !== documentId))
      await wait()
      await fetchBooks()
    } catch {
      showNotification('Erreur lors de la suppression', 'error')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const openAddModal = () => {
    setSelectedBook(null)
    setShowModal(true)
  }

  const openEditModal = (book) => {
    setSelectedBook(book)
    setShowModal(true)
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
      <main className="library-main">
        <div className="library-toolbar">
          <input
            type="text"
            placeholder="Rechercher un livre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous</option>
            <option value="to_read">À lire</option>
            <option value="reading">En cours</option>
            <option value="finished">Terminé</option>
          </select>
          <button className="btn-add" onClick={openAddModal}>
            + Ajouter un livre
          </button>
        </div>
        {!loading && filteredBooks.length === 0 && (
          <div className="empty-library">
            <p>📚 Votre bibliothèque est vide. Ajoutez votre premier livre !</p>
          </div>
        )}
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={() => handleDeleteBook(book.documentId)}
              onUpdate={openEditModal}
            />
          ))}
        </div>
      </main>
      {showModal && (
        <AddBookModal
          onClose={() => { setShowModal(false); setSelectedBook(null) }}
          onSubmit={selectedBook ? handleUpdateBook : handleAddBook}
          initialData={selectedBook}
        />
      )}
    </div>
  )
}

export default LibraryPage