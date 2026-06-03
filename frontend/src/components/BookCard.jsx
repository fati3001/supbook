const BookCard = ({ book, onDelete, onUpdate }) => {
  const { id, title, cover_url, year, reading_status, rating, author, review } = book

  const statusLabels = {
    to_read: 'À lire',
    reading: 'En cours',
    finished: 'Terminé',
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
    ))
  }

  return (
    <div className="book-card">
      {cover_url ? (
        <img src={cover_url} alt={title} className="book-cover" />
      ) : (
        <div className="book-cover-placeholder">📚</div>
      )}
      <div className="book-info">
        <h3 className="book-title">{title}</h3>
        {author && <p className="book-author">{author.name}</p>}
        {year && <p className="book-year">{year}</p>}
        <span className={`book-status status-${reading_status}`}>
          {statusLabels[reading_status]}
        </span>
        {rating > 0 && (
          <div className="book-rating">{renderStars(rating)}</div>
        )}
        {review && (
          <p className="book-review">"{review.content}"</p>
        )}
      </div>
      <div className="book-actions">
        <button
          className="btn-edit"
          onClick={() => onUpdate(book)}
        >
          Modifier
        </button>
        <button
          className="btn-delete"
          onClick={() => onDelete(id)}
        >
          Supprimer
        </button>
      </div>
    </div>
  )
}

export default BookCard
