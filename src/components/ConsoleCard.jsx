import { useState, useEffect } from 'react'
import './ConsoleCard.css'

function ConsoleCard({ console, viewMode = 'grid', showActions = false, onToggleSale = null, onToggleTrade = null, isOwn = false }) {
  const [imageError, setImageError] = useState(false)

  // Reset image error when image URL changes
  useEffect(() => {
    setImageError(false)
  }, [console.image])

  if (viewMode === 'list') {
    return (
      <div className="console-card console-card-list">
        <div className="console-card-image-list">
          {console.image && !imageError ? (
            <img 
              src={console.image} 
              alt={console.name}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="console-card-placeholder">
              <span>🕹️</span>
            </div>
          )}
        </div>
        <div className="console-card-info-list">
          <div className="console-card-header-list">
            <h3 className="console-card-name">{console.name}</h3>
            {console.condition && (
              <span className={`console-card-condition condition-${console.condition}`}>
                {console.condition.replace('-', ' ')}
              </span>
            )}
          </div>
          <p className="console-card-manufacturer">{console.manufacturer}</p>
          {console.releaseDate && (
            <p className="console-card-date">Released: {new Date(console.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          )}
          {console.notes && (
            <p className="console-card-notes">{console.notes}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="console-card">
      <div className="console-card-image">
        {console.image && !imageError ? (
          <img 
            src={console.image} 
            alt={console.name}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="console-card-placeholder">
            <span>🕹️</span>
          </div>
        )}
        {(console.forSale || console.forTrade) && (
          <div className="console-card-badges">
            {console.forSale && (
              <span className="badge badge-sale">💰 FOR SALE {console.price ? `$${console.price}` : ''}</span>
            )}
            {console.forTrade && (
              <span className="badge badge-trade">🔄 FOR TRADE</span>
            )}
          </div>
        )}
      </div>
      <div className="console-card-info">
        <h3 className="console-card-name">{console.name}</h3>
        <p className="console-card-manufacturer">{console.manufacturer}</p>
        {console.condition && (
          <span className={`console-card-condition condition-${console.condition}`}>
            {console.condition.replace('-', ' ')}
          </span>
        )}
        {showActions && isOwn && (
          <div className="console-card-actions">
            <button 
              className={`action-btn ${console.forSale ? 'active' : ''}`}
              onClick={() => onToggleSale && onToggleSale(console.id)}
              title="Mark for Sale"
            >
              💰 {console.forSale ? 'Remove Sale' : 'Mark for Sale'}
            </button>
            <button 
              className={`action-btn ${console.forTrade ? 'active' : ''}`}
              onClick={() => onToggleTrade && onToggleTrade(console.id)}
              title="Mark for Trade"
            >
              🔄 {console.forTrade ? 'Remove Trade' : 'Mark for Trade'}
            </button>
          </div>
        )}
        {!isOwn && (console.forSale || console.forTrade) && (
          <div className="console-card-interactions">
            {console.forSale && (
              <button 
                className="btn btn-primary btn-small"
                onClick={() => window.location.href = '/marketplace'}
              >
                Buy Now
              </button>
            )}
            {console.forTrade && (
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

export default ConsoleCard
