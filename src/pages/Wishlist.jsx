import { useState } from 'react'
import { Link } from 'react-router-dom'
import { userPreferences, currentUserId, mockUsers } from '../data/mockData'
import './Wishlist.css'

function Wishlist() {
  const [wishlist, setWishlist] = useState(userPreferences[currentUserId]?.wishlist || [])

  const handleRemoveFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id))
  }

  const handleAddGame = (gameTitle, console) => {
    const newItem = {
      id: `w${Date.now()}`,
      gameTitle,
      console,
      addedDate: new Date().toISOString().split('T')[0]
    }
    setWishlist([...wishlist, newItem])
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <h1>🌟 My Wishlist</h1>
          <p className="wishlist-subtitle">Track games and consoles you're looking for</p>
        </div>
        <div className="wishlist-stats">
          <div className="wishlist-stat">
            <span className="wishlist-stat-number">{wishlist.length}</span>
            <span className="wishlist-stat-label">Items</span>
          </div>
        </div>
      </div>

      <div className="wishlist-content">
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">📝</div>
            <h2>Your wishlist is empty</h2>
            <p>Start adding games you want to find or collect!</p>
            <div className="empty-actions">
              <Link to="/explore" className="btn btn-primary">
                Browse Games
              </Link>
              <Link to="/marketplace" className="btn btn-secondary">
                Check Marketplace
              </Link>
            </div>
          </div>
        ) : (
          <div className="wishlist-items">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className="wishlist-item-info">
                  <h3>{item.gameTitle}</h3>
                  <p className="wishlist-item-platform">{item.console}</p>
                  <span className="wishlist-item-date">
                    Added {new Date(item.addedDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="wishlist-item-actions">
                  <Link 
                    to={`/marketplace?search=${encodeURIComponent(item.gameTitle)}`}
                    className="btn btn-primary btn-small"
                  >
                    🔍 Find on Marketplace
                  </Link>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick add section */}
      <div className="wishlist-quick-add">
        <h3>Quick Add to Wishlist</h3>
        <div className="quick-add-form">
          <input
            type="text"
            placeholder="Game title..."
            className="quick-add-input"
            id="quickAddTitle"
          />
          <select className="quick-add-select" id="quickAddConsole">
            <option value="PlayStation 5">PlayStation 5</option>
            <option value="PlayStation 4">PlayStation 4</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
            <option value="Xbox Series X">Xbox Series X</option>
            <option value="Xbox One">Xbox One</option>
            <option value="PC">PC</option>
          </select>
          <button
            className="btn btn-primary"
            onClick={() => {
              const title = document.getElementById('quickAddTitle').value
              const console = document.getElementById('quickAddConsole').value
              if (title.trim()) {
                handleAddGame(title, console)
                document.getElementById('quickAddTitle').value = ''
              }
            }}
          >
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  )
}

export default Wishlist
