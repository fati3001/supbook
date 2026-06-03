import { useState, useEffect } from 'react'
import { authorService } from '../services/api'

const AddBookModal = ({ onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '')
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_url || '')
  const [year, setYear] = useState(initialData?.year || '')
  const [readingStatus, setReadingStatus] = useState(initialData?.reading_status || 'to_read')
  const [rating, setRating] = useState(initialData?.rating || 0)
  const [authorId, setAuthorId] = useState(initialData?.author?.id || '')
  const [newAuthorName, setNewAuthorName] = useState('')
  const [authors, setAuthors] = useState([])
  const [reviewContent, setReviewContent] = useState(initialData?.review?.content || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    authorService.getAll().then((res) => setAuthors(res.data)).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit({
      title,
      cover_url: coverUrl,
      year: year ? parseInt(year) : null,
      reading_status: readingStatus,
      rating: parseInt(rating),
      author: authorId || null,
      newAuthorName: newAuthorName || null,
      reviewContent: reviewContent || null,
    })
    setLoading(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? 'Modifier le livre' : 'Ajouter un livre'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du livre"
              required
            />
          </div>
          <div className="form-group">
            <label>URL de couverture</label>
            <input
              type="text"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label>Année de publication</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
            />
          </div>
          <div className="form-group">
            <label>Auteur existant</label>
            <select value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
              <option value="">-- Choisir un auteur --</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Ou nouvel auteur</label>
            <input
              type="text"
              value={newAuthorName}
              onChange={(e) => setNewAuthorName(e.target.value)}
              placeholder="Nom de l'auteur"
            />
          </div>
          <div className="form-group">
            <label>Statut de lecture</label>
            <select value={readingStatus} onChange={(e) => setReadingStatus(e.target.value)}>
              <option value="to_read">À lire</option>
              <option value="reading">En cours</option>
              <option value="finished">Terminé</option>
            </select>
          </div>
          <div className="form-group">
            <label>Note (0 à 5)</label>
            <input
              type="number"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Avis personnel</label>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="Votre avis sur ce livre..."
              rows={3}
            />
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookModal
