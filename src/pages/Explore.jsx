import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { mockUsers, currentUserId } from '../data/mockData'
import './Explore.css'

// Gaming character icons mapping
const gamingCharacters = [
  '🍄', '🦍', '⚔️', '🎯', '🌟', '🦊', '🔥', '⚡',
  '🎮', '👾', '🦎', '🐢', '⭐', '🎲', '🎪',
]

const getUserCharacter = (userId) => {
  const index = userId.charCodeAt(userId.length - 1) % gamingCharacters.length
  return gamingCharacters[index]
}

function Explore() {
  // Filter out current user and show others
  const featuredUsers = mockUsers.filter(user => user.id !== currentUserId)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  
  // Get all unique platforms from all users
  const allPlatforms = useMemo(() => {
    const platforms = new Set()
    featuredUsers.forEach(user => {
      user.games.forEach(game => platforms.add(game.console))
    })
    return Array.from(platforms).sort()
  }, [featuredUsers])
  
  let displayUsers = featuredUsers
  
  // Search filter
  if (searchTerm) {
    displayUsers = featuredUsers.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.games.some(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }
  
  // Platform filter
  if (platformFilter !== 'all') {
    displayUsers = displayUsers.filter(user =>
      user.games.some(game => game.console === platformFilter)
    )
  }
  
  // Sort filter
  if (filterType === 'popular') {
    displayUsers = [...displayUsers].sort((a, b) => b.likes - a.likes)
  } else if (filterType === 'large') {
    displayUsers = [...displayUsers].sort((a, b) => 
      (b.games.length + b.consoles.length) - (a.games.length + a.consoles.length)
    )
  } else if (filterType === 'newest') {
    displayUsers = [...displayUsers].sort((a, b) => 
      new Date(b.joinedDate) - new Date(a.joinedDate)
    )
  }
  
  // Availability filter
  if (availabilityFilter === 'forsale') {
    displayUsers = displayUsers.filter(user =>
      user.games.some(g => g.forSale) || user.consoles.some(c => c.forSale)
    )
  } else if (availabilityFilter === 'fortrade') {
    displayUsers = displayUsers.filter(user =>
      user.games.some(g => g.forTrade) || user.consoles.some(c => c.forTrade)
    )
  }

  // Calculate aggregate statistics
  const totalGames = featuredUsers.reduce((sum, user) => sum + user.games.length, 0)
  const totalConsoles = featuredUsers.reduce((sum, user) => sum + user.consoles.length, 0)
  const totalLikes = featuredUsers.reduce((sum, user) => sum + user.likes, 0)
  const avgCollectionSize = featuredUsers.length > 0 
    ? Math.round((totalGames + totalConsoles) / featuredUsers.length)
    : 0

  return (
    <div className="explore">
      <div className="explore-header">
        <h1>Explore Collections</h1>
        <p className="explore-subtitle">Discover games and consoles from other collectors around the platform</p>
      </div>

      {/* Statistics Bar */}
      <div className="explore-stats">
        <div className="explore-stat">
          <span className="explore-stat-number">{featuredUsers.length}</span>
          <span className="explore-stat-label">Collectors</span>
        </div>
        <div className="explore-stat">
          <span className="explore-stat-number">{totalGames}</span>
          <span className="explore-stat-label">Games Tracked</span>
        </div>
        <div className="explore-stat">
          <span className="explore-stat-number">{totalConsoles}</span>
          <span className="explore-stat-label">Consoles Tracked</span>
        </div>
        <div className="explore-stat">
          <span className="explore-stat-number">{avgCollectionSize}</span>
          <span className="explore-stat-label">Avg Collection Size</span>
        </div>
        <div className="explore-stat">
          <span className="explore-stat-number">{totalLikes}</span>
          <span className="explore-stat-label">Total Likes ❤️</span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="explore-filters-section">
        <div className="explore-filters">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input 
              type="text" 
              placeholder="Search by username, bio, or game..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select 
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Collections</option>
              <option value="popular">Most Popular (Likes)</option>
              <option value="large">Largest Collections</option>
              <option value="newest">Newest Members</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Platform</label>
            <select 
              className="filter-select"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
            >
              <option value="all">All Platforms</option>
              {allPlatforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select 
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Collections</option>
              <option value="popular">Most Popular (Likes)</option>
              <option value="large">Largest Collections</option>
              <option value="newest">Newest Members</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Availability</label>
            <select 
              className="filter-select"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="forsale">Has Items for Sale</option>
              <option value="fortrade">Has Items for Trade</option>
            </select>
          </div>
        </div>
        {displayUsers.length !== featuredUsers.length && (
          <div className="filter-results">
            Showing {displayUsers.length} of {featuredUsers.length} collectors
          </div>
        )}
      </div>

      <div className="explore-content">
        {displayUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>No collections found</h2>
            <p>{searchTerm || platformFilter !== 'all' ? 'Try adjusting your filters' : 'Be the first to share your collection!'}</p>
            {(searchTerm || platformFilter !== 'all') && (
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('')
                  setPlatformFilter('all')
                  setFilterType('all')
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="users-grid">
              {displayUsers.map((user) => {
                const topPlatforms = Object.entries(
                  user.games.reduce((acc, game) => {
                    acc[game.console] = (acc[game.console] || 0) + 1
                    return acc
                  }, {})
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 2)
                  .map(([platform]) => platform)

                return (
                  <Link 
                    key={user.id} 
                    to={`/profile/${user.id}`}
                    className="user-card"
                  >
                    <div className="user-card-header">
                          <div className="user-avatar">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.username} />
                            ) : (
                              <div className="avatar-character-explore">
                                <span className="character-icon-explore">{getUserCharacter(user.id)}</span>
                              </div>
                            )}
                          </div>
                      <div className="user-likes-badge">
                        ❤️ {user.likes}
                      </div>
                    </div>
                    <div className="user-info">
                      <h3>{user.username}</h3>
                      <p className="user-bio">{user.bio}</p>
                      <div className="user-stats">
                        <div className="user-stat-item">
                          <span className="stat-icon">🎮</span>
                          <span className="stat-text">{user.games.length} {user.games.length === 1 ? 'game' : 'games'}</span>
                        </div>
                        <div className="user-stat-item">
                          <span className="stat-icon">🕹️</span>
                          <span className="stat-text">{user.consoles.length} {user.consoles.length === 1 ? 'console' : 'consoles'}</span>
                        </div>
                      </div>
                      {topPlatforms.length > 0 && (
                        <div className="user-platforms">
                          <span className="platforms-label">Top Platforms:</span>
                          <div className="platform-tags">
                            {topPlatforms.map(platform => (
                              <span key={platform} className="platform-tag">{platform}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {user.joinedDate && (
                        <div className="user-joined">
                          Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Explore
