import { useState } from 'react'
import './GameCard.css'

function GameCard({ game, viewMode = 'grid', showActions = false, onToggleSale = null, onToggleTrade = null, isOwn = false }) {
  const [imageError, setImageError] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

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
        <h3 className="game-card-title">{game.title}</h3>
        <p className="game-card-console">{game.console}</p>
        {game.condition && (
          <span className={`game-card-condition condition-${game.condition}`}>
            {game.condition.replace('-', ' ')}
          </span>
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
