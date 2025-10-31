import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { mockUsers, currentUserId } from '../data/mockData'
import GameCard from '../components/GameCard'
import ConsoleCard from '../components/ConsoleCard'
import TradeModal from '../components/TradeModal'
import './Profile.css'

// Gaming character icons mapping (same as Activity page)
const gamingCharacters = [
  '🍄', // Mario
  '🦍', // Donkey Kong
  '⚔️', // Link/Zelda
  '🎯', // Samus
  '🌟', // Star (general gaming)
  '🦊', // Fox McCloud
  '🔥', // Fire (gaming theme)
  '⚡', // Lightning (gaming theme)
  '🎮', // Controller
  '👾', // Space Invader
  '🦎', // Yoshi
  '🐢', // Koopa
  '⭐', // Star (alternate)
  '🎲', // Dice (gaming)
  '🎪', // Gaming theme
]

const getUserCharacter = (userId) => {
  const index = userId.charCodeAt(userId.length - 1) % gamingCharacters.length
  return gamingCharacters[index]
}

function Profile() {
  const { userId } = useParams()
  const user = mockUsers.find(u => u.id === userId) || mockUsers[0]
  const currentUser = mockUsers.find(u => u.id === currentUserId) || mockUsers[0]
  const isOwnProfile = userId === currentUserId
  const [tradeModalOpen, setTradeModalOpen] = useState(false)
  const [selectedTradeItem, setSelectedTradeItem] = useState(null)

  // Calculate detailed stats
  const stats = {
    totalItems: user.games.length + user.consoles.length,
    uniquePlatforms: [...new Set(user.games.map(g => g.console))].length,
    gameConditions: user.games.reduce((acc, game) => {
      acc[game.condition] = (acc[game.condition] || 0) + 1
      return acc
    }, {}),
    platformDistribution: user.games.reduce((acc, game) => {
      acc[game.console] = (acc[game.console] || 0) + 1
      return acc
    }, {}),
    oldestGame: user.games.length > 0 ? user.games.reduce((oldest, game) => 
      new Date(game.releaseDate) < new Date(oldest.releaseDate) ? game : oldest
    ) : null,
    newestGame: user.games.length > 0 ? user.games.reduce((newest, game) => 
      new Date(game.releaseDate) > new Date(newest.releaseDate) ? game : newest
    ) : null
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getDaysAgo = (dateString) => {
    const days = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24))
    if (days < 30) return `${days} days ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} years ago`
  }

  return (
    <div className="profile">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <div className="avatar-character-large">
                  <span className="character-icon-large">{getUserCharacter(user.id)}</span>
                </div>
              )}
            </div>
        <div className="profile-info">
          <div className="profile-header-top">
            <div>
              <h1>{user.username}</h1>
              <p className="profile-bio">{user.bio}</p>
            </div>
            {user.joinedDate && (
              <div className="profile-joined">
                <span className="joined-label">Member since</span>
                <span className="joined-date">{formatDate(user.joinedDate)}</span>
                <span className="joined-ago">({getDaysAgo(user.joinedDate)})</span>
              </div>
            )}
          </div>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-value">{user.games.length}</span>
              <span className="stat-label">Games</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{user.consoles.length}</span>
              <span className="stat-label">Consoles</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{stats.totalItems}</span>
              <span className="stat-label">Total Items</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{stats.uniquePlatforms}</span>
              <span className="stat-label">Platforms</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{user.likes}</span>
              <span className="stat-label">Likes ❤️</span>
            </div>
          </div>
        </div>
        {!isOwnProfile && (
          <div className="profile-actions">
            <button className="btn btn-primary">Like Profile ❤️</button>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                // Open marketplace to see items for trade
                window.location.href = '/marketplace'
              }}
            >
              View Items for Trade
            </button>
          </div>
        )}
      </div>

      {/* Collection Insights */}
      {user.games.length > 0 && (
        <div className="profile-insights">
          <h3>Collection Insights</h3>
          <div className="insights-grid">
            {stats.oldestGame && (
              <div className="insight-card">
                <span className="insight-icon">📅</span>
                <div className="insight-content">
                  <span className="insight-label">Oldest Game</span>
                  <span className="insight-value">{stats.oldestGame.title}</span>
                  <span className="insight-sub">{new Date(stats.oldestGame.releaseDate).getFullYear()}</span>
                </div>
              </div>
            )}
            {stats.newestGame && (
              <div className="insight-card">
                <span className="insight-icon">🆕</span>
                <div className="insight-content">
                  <span className="insight-label">Newest Game</span>
                  <span className="insight-value">{stats.newestGame.title}</span>
                  <span className="insight-sub">{new Date(stats.newestGame.releaseDate).getFullYear()}</span>
                </div>
              </div>
            )}
            <div className="insight-card">
              <span className="insight-icon">🎮</span>
              <div className="insight-content">
                <span className="insight-label">Top Platform</span>
                <span className="insight-value">
                  {Object.keys(stats.platformDistribution).length > 0
                    ? Object.entries(stats.platformDistribution).sort((a, b) => b[1] - a[1])[0][0]
                    : 'N/A'}
                </span>
                <span className="insight-sub">
                  {Object.keys(stats.platformDistribution).length > 0
                    ? `${Object.entries(stats.platformDistribution).sort((a, b) => b[1] - a[1])[0][1]} games`
                    : ''}
                </span>
              </div>
            </div>
            <div className="insight-card">
              <span className="insight-icon">⭐</span>
              <div className="insight-content">
                <span className="insight-label">Average Condition</span>
                <span className="insight-value">
                  {Object.keys(stats.gameConditions).length > 0
                    ? Object.entries(stats.gameConditions).sort((a, b) => {
                        const order = { excellent: 5, 'very-good': 4, good: 3, fair: 2, poor: 1 }
                        return (order[b[0]] || 0) - (order[a[0]] || 0)
                      })[0][0].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                    : 'N/A'}
                </span>
                <span className="insight-sub">Most common</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platform Breakdown */}
      {Object.keys(stats.platformDistribution).length > 0 && (
        <div className="platform-breakdown">
          <h3>Games by Platform</h3>
          <div className="platform-bars">
            {Object.entries(stats.platformDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([platform, count]) => (
                <div key={platform} className="platform-bar">
                  <div className="platform-bar-header">
                    <span className="platform-name">{platform}</span>
                    <span className="platform-count">{count} {count === 1 ? 'game' : 'games'}</span>
                  </div>
                  <div className="platform-bar-container">
                    <div 
                      className="platform-bar-fill"
                      style={{ width: `${(count / user.games.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="profile-content">
        {/* Items for Sale/Trade Summary */}
        {(user.games.some(g => g.forSale || g.forTrade) || user.consoles.some(c => c.forSale || c.forTrade)) && (
          <div className="sale-trade-summary">
            <h3>💰 Items Available</h3>
            <div className="sale-trade-stats">
              <div className="sale-trade-stat">
                <span className="stat-icon">💰</span>
                <span className="stat-value">
                  {user.games.filter(g => g.forSale).length + user.consoles.filter(c => c.forSale).length}
                </span>
                <span className="stat-label">For Sale</span>
              </div>
              <div className="sale-trade-stat">
                <span className="stat-icon">🔄</span>
                <span className="stat-value">
                  {user.games.filter(g => g.forTrade).length + user.consoles.filter(c => c.forTrade).length}
                </span>
                <span className="stat-label">For Trade</span>
              </div>
            </div>
          </div>
        )}

        <div className="profile-section">
          <div className="section-header">
            <h2>Games Collection</h2>
            <span className="section-count">{user.games.length} {user.games.length === 1 ? 'game' : 'games'}</span>
          </div>
          {user.games.length === 0 ? (
            <p className="empty-message">No games in collection yet</p>
          ) : (
            <>
              <div className="items-grid">
                {user.games.map((game) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    isOwn={isOwnProfile}
                    showActions={false}
                  />
                ))}
              </div>
              {!isOwnProfile && (
                <TradeModal
                  isOpen={tradeModalOpen}
                  onClose={() => {
                    setTradeModalOpen(false)
                    setSelectedTradeItem(null)
                  }}
                  item={selectedTradeItem}
                  owner={user}
                  currentUser={currentUser}
                />
              )}
            </>
          )}
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2>Consoles Collection</h2>
            <span className="section-count">{user.consoles.length} {user.consoles.length === 1 ? 'console' : 'consoles'}</span>
          </div>
          {user.consoles.length === 0 ? (
            <p className="empty-message">No consoles in collection yet</p>
          ) : (
            <div className="items-grid">
              {user.consoles.map((consoleItem) => (
                <ConsoleCard 
                  key={consoleItem.id} 
                  console={consoleItem}
                  isOwn={isOwnProfile}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
