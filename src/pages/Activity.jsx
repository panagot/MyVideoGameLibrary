import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { mockUsers, currentUserId } from '../data/mockData'
import { mockActivities } from '../data/activityData'
import './Activity.css'

// Gaming character icons mapping
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

// Assign character icon to user based on their ID
const getUserCharacter = (userId) => {
  const index = userId.charCodeAt(userId.length - 1) % gamingCharacters.length
  return gamingCharacters[index]
}

function Activity() {
  const [filterType, setFilterType] = useState('all')

  const activities = useMemo(() => {
    let filtered = [...mockActivities]

    if (filterType === 'trades') {
      filtered = filtered.filter(a => a.type === 'listed_trade' || a.type === 'completed_trade')
    } else if (filterType === 'sales') {
      filtered = filtered.filter(a => a.type === 'listed_sale')
    } else if (filterType === 'collections') {
      filtered = filtered.filter(a => a.type === 'added_game' || a.type === 'added_console')
    } else if (filterType === 'social') {
      filtered = filtered.filter(a => a.type === 'liked_profile')
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [filterType])

  const getUserById = (userId) => {
    return mockUsers.find(u => u.id === userId || u.username.toLowerCase().replace(/\s+/g, '') === userId) || mockUsers[0]
  }

  const getActivityText = (activity) => {
    const parts = []
    switch (activity.type) {
      case 'added_game':
      case 'added_console':
        parts.push('added')
        if (activity.item) parts.push(activity.item)
        parts.push('to their collection')
        break
      case 'listed_sale':
        parts.push('listed')
        if (activity.item) parts.push(activity.item)
        parts.push('for sale')
        break
      case 'listed_trade':
        parts.push('listed')
        if (activity.item) parts.push(activity.item)
        parts.push('for trade')
        break
      case 'liked_profile':
        parts.push('liked')
        if (activity.target) parts.push(activity.target)
        parts.push("'s profile")
        break
      case 'completed_trade':
        parts.push('completed a trade with')
        if (activity.target) parts.push(activity.target)
        break
      case 'found_rare':
        parts.push('found a rare item:')
        if (activity.item) parts.push(activity.item)
        break
      default:
        parts.push(activity.action || 'did something')
        if (activity.item) parts.push(activity.item)
        if (activity.target) parts.push(activity.target)
    }
    return parts.join(' ')
  }

  return (
    <div className="activity-page">
      <div className="activity-header">
        <div>
          <h1>📰 Activity Feed</h1>
          <p className="activity-subtitle">Stay updated with the latest from the gaming community</p>
        </div>
        <div className="activity-stats-quick">
          <div className="quick-stat">
            <span className="quick-stat-number">{activities.length}</span>
            <span className="quick-stat-label">Recent Activities</span>
          </div>
        </div>
      </div>

      <div className="activity-filters">
        <button 
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All Activity
        </button>
        <button 
          className={`filter-btn ${filterType === 'collections' ? 'active' : ''}`}
          onClick={() => setFilterType('collections')}
        >
          📚 Collections
        </button>
        <button 
          className={`filter-btn ${filterType === 'sales' ? 'active' : ''}`}
          onClick={() => setFilterType('sales')}
        >
          💰 Sales
        </button>
        <button 
          className={`filter-btn ${filterType === 'trades' ? 'active' : ''}`}
          onClick={() => setFilterType('trades')}
        >
          🔄 Trades
        </button>
        <button 
          className={`filter-btn ${filterType === 'social' ? 'active' : ''}`}
          onClick={() => setFilterType('social')}
        >
          ❤️ Social
        </button>
      </div>

      <div className="activity-feed">
        {activities.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-icon">📭</div>
            <h2>No activity found</h2>
            <p>Try adjusting your filters or check back later!</p>
          </div>
        ) : (
          activities.map((activity) => {
            const user = getUserById(activity.userId)
            if (!user) return null
            
            return (
              <div key={activity.id} className="activity-item">
                <Link 
                  to={`/profile/${user.id}`}
                  className="activity-avatar"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <div className="avatar-character">
                      <span className="character-icon">{getUserCharacter(user.id)}</span>
                    </div>
                  )}
                </Link>
                <div className="activity-content">
                  <div className="activity-message">
                    <span className="activity-icon">{activity.icon}</span>
                    <span className="activity-text">
                      <Link to={`/profile/${user.id}`} className="activity-username">
                        {activity.username}
                      </Link>
                      {' '}
                      {getActivityText(activity).split(' ').map((word, idx, arr) => {
                        if (word === activity.item && activity.item) {
                          return <span key={idx} className="activity-item-name">{word} </span>
                        }
                        if (word === activity.target && activity.target && activity.target !== activity.username) {
                          const targetUser = getUserById(activity.target.toLowerCase().replace(/\s+/g, ''))
                          return (
                            <Link key={idx} to={`/profile/${targetUser.id}`} className="activity-target">
                              {word}{idx < arr.length - 1 ? ' ' : ''}
                            </Link>
                          )
                        }
                        return <span key={idx}>{word} </span>
                      })}
                    </span>
                  </div>
                  <div className="activity-footer">
                    <span className="activity-time">{activity.timeAgo}</span>
                    {activity.type === 'listed_sale' || activity.type === 'listed_trade' ? (
                      <Link to="/marketplace" className="activity-link">
                        View Marketplace →
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Activity

