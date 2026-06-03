import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
    // eslint-disable-next-line react-hooks/immutability
    fetchBooks()
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    filterBooks()
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
        user: user.id,
      }
      const newBook = await bookService.create(bookData)
      if (formData.reviewContent) {
        await reviewService.create({
          content: formData.reviewContent,
          book: newBook.data.id,
          users_permissions_user: user.id,
        })
      }
      await fetchBooks()
      setShowModal(false)
      showNotification('Livre ajouté avec succès !', 'success')
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
      await bookService.update(selectedBook.id, {
        title: formData.title,
        cover_url: formData.cover_url,
        year: formData.year,
        reading_status: formData.reading_status,
        rating: formData.rating,
        author: authorId || null,
      })
      if (formData.reviewContent && selectedBook.review) {
        await reviewService.update(selectedBook.review.id, {
          content: formData.reviewContent,
        })
      } else if (formData.reviewContent && !selectedBook.review) {
        await reviewService.create({
          content: formData.reviewContent,
          book: selectedBook.id,
          users_permissions_user: user.id,
        })
      }
      await fetchBooks()
      setShowModal(false)
      setSelectedBook(null)
      showNotification('Livre modifié avec succès !', 'success')
    } catch {
      showNotification('Erreur lors de la modification', 'error')
    }
  }

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Supprimer ce livre ?')) return
    try {
      await bookService.delete(id)
      setBooks((prev) => prev.filter((b) => b.id !== id))
      showNotification('Livre supprimé', 'success')
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
              onDelete={handleDeleteBook}
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