import { useState } from 'react'
import { userPreferences, currentUserId } from '../data/mockData'
import './CustomCollections.css'

function CustomCollections({ games = [], onCollectionChange }) {
  const [collections, setCollections] = useState(
    userPreferences[currentUserId]?.customCollections || []
  )
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    icon: '📦',
    color: '#3b82f6'
  })

  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Yellow', value: '#fbbf24' },
  ]

  const iconOptions = ['📦', '⭐', '✅', '🎮', '💎', '🔥', '🌟', '🎯', '🏆', '💝', '🎪', '🎨']

  const handleCreateCollection = (e) => {
    e.preventDefault()
    if (!newCollection.name.trim()) return

    const collection = {
      id: `collection-${Date.now()}`,
      name: newCollection.name,
      description: newCollection.description,
      icon: newCollection.icon,
      color: newCollection.color
    }

    const updated = [...collections, collection]
    setCollections(updated)
    
    // Update user preferences (in real app, save to database)
    if (userPreferences[currentUserId]) {
      userPreferences[currentUserId].customCollections = updated
    }

    setNewCollection({ name: '', description: '', icon: '📦', color: '#3b82f6' })
    setShowCreateModal(false)
  }

  const handleDeleteCollection = (collectionId) => {
    if (collectionId === 'all') return // Can't delete default
    
    const updated = collections.filter(c => c.id !== collectionId)
    setCollections(updated)
    
    if (userPreferences[currentUserId]) {
      userPreferences[currentUserId].customCollections = updated
    }
    
    onCollectionChange?.('all') // Reset to all if deleted collection was selected
  }

  const getCollectionStats = (collectionId) => {
    if (collectionId === 'all') {
      return { count: games.length, value: games.reduce((sum, g) => sum + (g.price || 0), 0) }
    }
    const collectionGames = games.filter(g => g.collectionId === collectionId)
    return {
      count: collectionGames.length,
      value: collectionGames.reduce((sum, g) => sum + (g.price || 0), 0)
    }
  }

  return (
    <div className="custom-collections">
      <div className="collections-header">
        <h3>📁 Custom Collections</h3>
        <button
          className="btn-create-collection"
          onClick={() => setShowCreateModal(true)}
        >
          ➕ Create Collection
        </button>
      </div>

      <div className="collections-grid">
        <div className="collection-card collection-card-all">
          <div className="collection-icon">📦</div>
          <div className="collection-info">
            <h4>All Games</h4>
            <p>{getCollectionStats('all').count} games</p>
          </div>
          <div className="collection-value">
            ${getCollectionStats('all').value.toFixed(2)}
          </div>
        </div>

        {collections.map(collection => {
          const stats = getCollectionStats(collection.id)
          return (
            <div
              key={collection.id}
              className="collection-card"
              style={{ borderLeftColor: collection.color }}
            >
              <button
                className="collection-delete"
                onClick={() => handleDeleteCollection(collection.id)}
                title="Delete collection"
              >
                ×
              </button>
              <div className="collection-icon" style={{ backgroundColor: `${collection.color}20` }}>
                {collection.icon}
              </div>
              <div className="collection-info">
                <h4>{collection.name}</h4>
                <p>{collection.description || `${stats.count} games`}</p>
              </div>
              <div className="collection-value">
                ${stats.value.toFixed(2)}
              </div>
            </div>
          )
        })}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Collection</h3>
            <form onSubmit={handleCreateCollection}>
              <div className="form-group">
                <label>Collection Name *</label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  placeholder="e.g., My Favorites, Retro Games"
                  required
                  maxLength={50}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  placeholder="Optional description..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Icon</label>
                <div className="icon-selector">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option ${newCollection.icon === icon ? 'selected' : ''}`}
                      onClick={() => setNewCollection({ ...newCollection, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Color</label>
                <div className="color-selector">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      className={`color-option ${newCollection.color === color.value ? 'selected' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNewCollection({ ...newCollection, color: color.value })}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomCollections

