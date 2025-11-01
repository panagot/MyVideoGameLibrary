import { useState } from 'react'
import './GameCard.css'

function GameCard({ game, viewMode = 'grid', showActions = false, onToggleSale = null, onToggleTrade = null, isOwn = false }) {
  const [imageError, setImageError] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  if (viewMode === 'list') {
    return (
      <div className="game-card game-card-list">
        <div className="game-card-image-list">
          {game.coverArt && !imageError ? (
            <img 
              src={game.coverArt} 
              alt={game.title}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="game-card-placeholder">
              <span>🎮</span>
            </div>
          )}
        </div>
        <div className="game-card-info-list">
          <div className="game-card-header-list">
            <h3 className="game-card-title">{game.title}</h3>
            {game.condition && (
              <span className={`game-card-condition condition-${game.condition}`}>
                {game.condition.replace('-', ' ')}
              </span>
            )}
          </div>
          <p className="game-card-console">{game.console}</p>
          {game.releaseDate && (
            <p className="game-card-date">Released: {new Date(game.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          )}
          {game.notes && (
            <p className="game-card-notes">{game.notes}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="game-card">
      <div className="game-card-image">
        {(game.coverArt || game.boxArtUrl) && !imageError ? (
          <img 
            src={game.coverArt || game.boxArtUrl} 
            alt={game.title}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="game-card-placeholder">
            <span>🎮</span>
            <p>{game.title}</p>
          </div>
        )}
        {(game.forSale || game.forTrade) && (
          <div className="game-card-badges">
            {game.forSale && (
              <span className="badge badge-sale">💰 FOR SALE {game.price ? `$${game.price}` : ''}</span>
            )}
            {game.forTrade && (
              <span className="badge badge-trade">🔄 FOR TRADE</span>
            )}
          </div>
        )}
      </div>
      <div className="game-card-info">
        <div className="game-card-header-info">
          <h3 className="game-card-title">{game.title}</h3>
          {game.favorite && <span className="favorite-badge" title="Favorite">⭐</span>}
          {game.rating && (
            <span className="rating-badge" title={`Rating: ${game.rating}/10`}>
              {game.rating}/10 ⭐
            </span>
          )}
        </div>
        <p className="game-card-console">{game.console}</p>
        {game.publisher && (
          <p className="game-card-meta">Publisher: {game.publisher}</p>
        )}
        {game.developer && (
          <p className="game-card-meta">Developer: {game.developer}</p>
        )}
        {game.condition && (
          <span className={`game-card-condition condition-${game.condition}`}>
            {game.condition.replace('-', ' ')}
          </span>
        )}
        
        {/* Tags Display */}
        {game.tags && Array.isArray(game.tags) && game.tags.length > 0 && (
          <div className="game-card-tags">
            {game.tags.slice(0, 4).map((tag, index) => (
              <span key={index} className="game-tag">{tag}</span>
            ))}
            {game.tags.length > 4 && (
              <span className="game-tag-more">+{game.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Genre Display */}
        {game.genre && Array.isArray(game.genre) && game.genre.length > 0 && (
          <div className="game-card-genre">
            {game.genre.map((g, index) => (
              <span key={index} className="genre-tag">{g}</span>
            ))}
          </div>
        )}

        {/* Photo Gallery Indicator */}
        {game.photos && Array.isArray(game.photos) && game.photos.length > 1 && (
          <div className="photo-gallery-indicator" onClick={() => setShowPhotoGallery(true)}>
            <span>📸 {game.photos.length} photos</span>
          </div>
        )}
        
        {/* View More Details Button */}
        {isOwn && (
          <button 
            className="view-details-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '▼ View Less' : '▶ View More'}
          </button>
        )}

        {/* Detailed Information Panel */}
        {showDetails && isOwn && (
          <div className="game-details-panel">
            <div className="details-header">
              <span className="details-icon">📋</span>
              <h4 className="details-title">Game Details</h4>
            </div>
            <div className="details-grid">
              {game.hasOriginalBox !== undefined && (
                <div className={`detail-card ${game.hasOriginalBox ? 'detail-card-success' : ''}`}>
                  <div className="detail-icon-wrapper">
                    <span className="detail-icon-large">📦</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Original Box</span>
                    <span className={`detail-value-badge ${game.hasOriginalBox ? 'badge-yes' : 'badge-no'}`}>
                      {game.hasOriginalBox ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                </div>
              )}
              {game.hasManual !== undefined && (
                <div className={`detail-card ${game.hasManual ? 'detail-card-success' : ''}`}>
                  <div className="detail-icon-wrapper">
                    <span className="detail-icon-large">📖</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Manual</span>
                    <span className={`detail-value-badge ${game.hasManual ? 'badge-yes' : 'badge-no'}`}>
                      {game.hasManual ? '✓ Included' : '✗ Not Included'}
                    </span>
                  </div>
                </div>
              )}
              {game.edition && (
                <div className="detail-card detail-card-info">
                  <div className="detail-icon-wrapper">
                    <span className="detail-icon-large">🏆</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Edition</span>
                    <span className="detail-value-text">{game.edition}</span>
                  </div>
                </div>
              )}
              {game.format && (
                <div className="detail-card detail-card-info">
                  <div className="detail-icon-wrapper">
                    <span className="detail-icon-large">💿</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Format</span>
                    <span className={`detail-value-badge ${game.format === 'Physical' ? 'badge-physical' : 'badge-digital'}`}>
                      {game.format}
                    </span>
                  </div>
                </div>
              )}
              {game.sealed !== undefined && (
                <div className={`detail-card ${game.sealed ? 'detail-card-premium' : ''}`}>
                  <div className="detail-icon-wrapper">
                    <span className="detail-icon-large">🔒</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Sealed</span>
                    <span className={`detail-value-badge ${game.sealed ? 'badge-premium' : 'badge-no'}`}>
                      {game.sealed ? '✓ Sealed' : '✗ Opened'}
                    </span>
                  </div>
                </div>
              )}
              {game.purchaseDate && (
                <div className="detail-card detail-card-date">
                  <div className="detail-icon-wrapper">
                    <span className="detail-icon-large">📅</span>
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Purchase Date</span>
                    <span className="detail-value-text">{new Date(game.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              )}
                  {game.purchasePrice !== undefined && (
                    <div className="detail-card detail-card-price">
                      <div className="detail-icon-wrapper">
                        <span className="detail-icon-large">💰</span>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Purchase Price</span>
                        <span className="detail-value-price">${game.purchasePrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  {game.region && (
                    <div className="detail-card detail-card-info">
                      <div className="detail-icon-wrapper">
                        <span className="detail-icon-large">🌍</span>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Region</span>
                        <span className="detail-value-text">{game.region}</span>
                      </div>
                    </div>
                  )}
                  {game.publisher && (
                    <div className="detail-card detail-card-info">
                      <div className="detail-icon-wrapper">
                        <span className="detail-icon-large">🏢</span>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Publisher</span>
                        <span className="detail-value-text">{game.publisher}</span>
                      </div>
                    </div>
                  )}
                  {game.developer && (
                    <div className="detail-card detail-card-info">
                      <div className="detail-icon-wrapper">
                        <span className="detail-icon-large">👨‍💻</span>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Developer</span>
                        <span className="detail-value-text">{game.developer}</span>
                      </div>
                    </div>
                  )}
                  {game.rating && (
                    <div className="detail-card detail-card-premium">
                      <div className="detail-icon-wrapper">
                        <span className="detail-icon-large">⭐</span>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Your Rating</span>
                        <span className="detail-value-text">{game.rating}/10 ⭐</span>
                      </div>
                    </div>
                  )}
                  {game.completionStatus && (
                    <div className="detail-card detail-card-info">
                      <div className="detail-icon-wrapper">
                        <span className="detail-icon-large">
                          {game.completionStatus === 'completed' || game.completionStatus === 'completed-100' ? '✅' : 
                           game.completionStatus === 'in-progress' ? '🔄' : '⏸️'}
                        </span>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Status</span>
                        <span className="detail-value-text">
                          {game.completionStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </div>
                  )}
                  {game.playtime > 0 && (
                    <div className="detail-card detail-card-info">
                      <div className="detail-icon-wrapper">
                        <span className="detail-icon-large">⏱️</span>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Playtime</span>
                        <span className="detail-value-text">{game.playtime} hours</span>
                      </div>
                    </div>
                  )}
                  {game.barcode && (
                    <div className="detail-card detail-card-info">
                      <div className="detail-icon-wrapper">
                        <span className="detail-icon-large">📊</span>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Barcode/UPC</span>
                        <span className="detail-value-text">{game.barcode}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

        {/* Photo Gallery Modal */}
        {showPhotoGallery && game.photos && game.photos.length > 0 && (
          <div className="photo-gallery-modal" onClick={() => setShowPhotoGallery(false)}>
            <div className="photo-gallery-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="photo-gallery-close"
                onClick={() => setShowPhotoGallery(false)}
              >
                ×
              </button>
              <div className="photo-gallery-main">
                <img
                  src={game.photos[selectedPhotoIndex]}
                  alt={`${game.title} - Photo ${selectedPhotoIndex + 1}`}
                />
              </div>
              {game.photos.length > 1 && (
                <>
                  <button
                    className="photo-gallery-nav photo-gallery-prev"
                    onClick={() => setSelectedPhotoIndex((prev) => 
                      prev === 0 ? game.photos.length - 1 : prev - 1
                    )}
                  >
                    ‹
                  </button>
                  <button
                    className="photo-gallery-nav photo-gallery-next"
                    onClick={() => setSelectedPhotoIndex((prev) => 
                      prev === game.photos.length - 1 ? 0 : prev + 1
                    )}
                  >
                    ›
                  </button>
                  <div className="photo-gallery-thumbnails">
                    {game.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className={selectedPhotoIndex === index ? 'active' : ''}
                        onClick={() => setSelectedPhotoIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {showActions && isOwn && (
          <div className="game-card-actions">
            <button 
              className={`action-btn ${game.forSale ? 'active' : ''}`}
              onClick={() => onToggleSale && onToggleSale(game.id)}
              title="Mark for Sale"
            >
              💰 {game.forSale ? 'Remove Sale' : 'Mark for Sale'}
            </button>
            <button 
              className={`action-btn ${game.forTrade ? 'active' : ''}`}
              onClick={() => onToggleTrade && onToggleTrade(game.id)}
              title="Mark for Trade"
            >
              🔄 {game.forTrade ? 'Remove Trade' : 'Mark for Trade'}
            </button>
          </div>
        )}
        {!isOwn && (game.forSale || game.forTrade) && (
          <div className="game-card-interactions">
            {game.forSale && (
              <button 
                className="btn btn-primary btn-small"
                onClick={() => window.location.href = '/marketplace'}
              >
                Buy Now
              </button>
            )}
            {game.forTrade && (
              <button 
                className="btn btn-secondary btn-small"
                onClick={() => window.location.href = '/marketplace'}
              >
                Request Trade
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GameCard
