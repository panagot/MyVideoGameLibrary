import { useState } from 'react'
import './GameCard.css'

function GameCard({ game, viewMode = 'grid', showActions = false, onToggleSale = null, onToggleTrade = null, isOwn = false }) {
  const [imageError, setImageError] = useState(false)

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
