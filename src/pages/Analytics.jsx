import { useMemo } from 'react'
import { mockUsers, currentUserId, userPreferences } from '../data/mockData'
import './Analytics.css'

function Analytics() {
  const currentUser = mockUsers.find(u => u.id === currentUserId) || mockUsers[0]
  const games = currentUser.games || []
  const consoles = currentUser.consoles || []

  const analytics = useMemo(() => {
    // Collection Growth (simulated over time)
    const totalItems = games.length + consoles.length
    
    // Platform Distribution
    const platformDistribution = games.reduce((acc, game) => {
      acc[game.console] = (acc[game.console] || 0) + 1
      return acc
    }, {})

    // Genre Distribution
    const genreDistribution = games.reduce((acc, game) => {
      if (game.genre && Array.isArray(game.genre)) {
        game.genre.forEach(genre => {
          acc[genre] = (acc[genre] || 0) + 1
        })
      }
      return acc
    }, {})

    // Condition Distribution
    const conditionDistribution = games.reduce((acc, game) => {
      acc[game.condition] = (acc[game.condition] || 0) + 1
      return acc
    }, {})

    // Completion Status
    const completionStats = games.reduce((acc, game) => {
      const status = game.completionStatus || 'not-started'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    // Rating Analysis
    const ratedGames = games.filter(g => g.rating)
    const averageRating = ratedGames.length > 0
      ? (ratedGames.reduce((sum, g) => sum + g.rating, 0) / ratedGames.length).toFixed(1)
      : 0

    // Playtime Analysis
    const totalPlaytime = games.reduce((sum, game) => sum + (game.playtime || 0), 0)
    const averagePlaytime = games.length > 0 ? (totalPlaytime / games.length).toFixed(1) : 0
    const mostPlayed = games.length > 0 
      ? games.reduce((max, game) => (game.playtime || 0) > (max.playtime || 0) ? game : max)
      : null

    // Spending Analysis
    const totalSpent = games.reduce((sum, game) => sum + (game.purchasePrice || 0), 0)
    const averageSpent = games.length > 0 ? (totalSpent / games.length).toFixed(2) : 0
    
    // Value Analysis
    const totalValue = games.reduce((sum, game) => sum + (game.price || 0), 0) +
                      consoles.reduce((sum, console) => sum + (console.price || 0), 0)
    const estimatedValue = userPreferences[currentUserId]?.collectionValue || totalValue

    // Release Year Distribution
    const yearDistribution = games.reduce((acc, game) => {
      if (game.releaseDate) {
        const year = new Date(game.releaseDate).getFullYear()
        acc[year] = (acc[year] || 0) + 1
      }
      return acc
    }, {})

    // Publisher Distribution
    const publisherDistribution = games.reduce((acc, game) => {
      if (game.publisher) {
        acc[game.publisher] = (acc[game.publisher] || 0) + 1
      }
      return acc
    }, {})

    // Developer Distribution
    const developerDistribution = games.reduce((acc, game) => {
      if (game.developer) {
        acc[game.developer] = (acc[game.developer] || 0) + 1
      }
      return acc
    }, {})

    // Tags Analysis
    const tagFrequency = games.reduce((acc, game) => {
      if (game.tags && Array.isArray(game.tags)) {
        game.tags.forEach(tag => {
          acc[tag] = (acc[tag] || 0) + 1
        })
      }
      return acc
    }, {})

    // Format Distribution
    const formatDistribution = games.reduce((acc, game) => {
      const format = game.format || 'Physical'
      acc[format] = (acc[format] || 0) + 1
      return acc
    }, {})

    // Favorites Count
    const favoritesCount = games.filter(g => g.favorite).length

    // For Sale/Trade Stats
    const forSaleCount = games.filter(g => g.forSale).length
    const forTradeCount = games.filter(g => g.forTrade).length

    return {
      totalItems,
      platformDistribution,
      genreDistribution,
      conditionDistribution,
      completionStats,
      averageRating,
      totalPlaytime,
      averagePlaytime,
      mostPlayed,
      totalSpent,
      averageSpent,
      totalValue,
      estimatedValue,
      yearDistribution,
      publisherDistribution,
      developerDistribution,
      tagFrequency,
      formatDistribution,
      favoritesCount,
      forSaleCount,
      forTradeCount,
      ratedGamesCount: ratedGames.length
    }
  }, [games, consoles])

  const getMaxValue = (obj) => {
    return Math.max(...Object.values(obj), 1)
  }

  const formatValue = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>📊 Collection Analytics</h1>
        <p>Insights and statistics about your video game collection</p>
      </div>

      {/* Overview Stats */}
      <div className="analytics-section">
        <h2 className="section-title">📈 Overview</h2>
        <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">🎮</div>
            <div className="stat-value">{analytics.totalItems}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-card stat-card-success">
            <div className="stat-icon">💰</div>
            <div className="stat-value">{formatValue(analytics.estimatedValue)}</div>
            <div className="stat-label">Collection Value</div>
          </div>
          <div className="stat-card stat-card-info">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{analytics.favoritesCount}</div>
            <div className="stat-label">Favorites</div>
          </div>
          <div className="stat-card stat-card-warning">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{analytics.totalPlaytime}h</div>
            <div className="stat-label">Total Playtime</div>
          </div>
        </div>
      </div>

      {/* Financial Analysis */}
      <div className="analytics-section">
        <h2 className="section-title">💵 Financial Analysis</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💳</div>
            <div className="stat-value">{formatValue(analytics.totalSpent)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{formatValue(analytics.averageSpent)}</div>
            <div className="stat-label">Average per Game</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-value">
              {analytics.totalSpent > 0
                ? formatValue(analytics.estimatedValue - analytics.totalSpent)
                : formatValue(0)}
            </div>
            <div className="stat-label">Value Change</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-value">{analytics.forSaleCount}</div>
            <div className="stat-label">For Sale</div>
          </div>
        </div>
      </div>

      {/* Platform Distribution */}
      {Object.keys(analytics.platformDistribution).length > 0 && (
        <div className="analytics-section">
          <h2 className="section-title">🎮 Platform Distribution</h2>
          <div className="chart-container">
            {Object.entries(analytics.platformDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([platform, count]) => {
                const percentage = (count / analytics.totalItems * 100).toFixed(1)
                const maxValue = getMaxValue(analytics.platformDistribution)
                return (
                  <div key={platform} className="chart-bar-item">
                    <div className="chart-label">
                      <span>{platform}</span>
                      <span className="chart-value">{count} ({percentage}%)</span>
                    </div>
                    <div className="chart-bar">
                      <div
                        className="chart-bar-fill"
                        style={{ width: `${(count / maxValue) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Genre Distribution */}
      {Object.keys(analytics.genreDistribution).length > 0 && (
        <div className="analytics-section">
          <h2 className="section-title">🎨 Genre Distribution</h2>
          <div className="chart-container">
            {Object.entries(analytics.genreDistribution)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([genre, count]) => {
                const maxValue = getMaxValue(analytics.genreDistribution)
                return (
                  <div key={genre} className="chart-bar-item">
                    <div className="chart-label">
                      <span>{genre}</span>
                      <span className="chart-value">{count}</span>
                    </div>
                    <div className="chart-bar">
                      <div
                        className="chart-bar-fill chart-bar-genre"
                        style={{ width: `${(count / maxValue) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Completion Status */}
      {Object.keys(analytics.completionStats).length > 0 && (
        <div className="analytics-section">
          <h2 className="section-title">✅ Completion Status</h2>
          <div className="stats-grid-small">
            {Object.entries(analytics.completionStats).map(([status, count]) => (
              <div key={status} className="stat-card-small">
                <div className="stat-value-small">{count}</div>
                <div className="stat-label-small">
                  {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Analysis */}
      {analytics.ratedGamesCount > 0 && (
        <div className="analytics-section">
          <h2 className="section-title">⭐ Rating Analysis</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{analytics.averageRating}/10</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-value">{analytics.ratedGamesCount}</div>
              <div className="stat-label">Rated Games</div>
            </div>
          </div>
        </div>
      )}

      {/* Playtime Analysis */}
      {analytics.totalPlaytime > 0 && (
        <div className="analytics-section">
          <h2 className="section-title">⏱️ Playtime Analysis</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-value">{analytics.totalPlaytime}h</div>
              <div className="stat-label">Total Hours</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{analytics.averagePlaytime}h</div>
              <div className="stat-label">Average per Game</div>
            </div>
            {analytics.mostPlayed && (
              <div className="stat-card stat-card-featured">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">{analytics.mostPlayed.playtime || 0}h</div>
                <div className="stat-label">Most Played</div>
                <div className="stat-sublabel">{analytics.mostPlayed.title}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Publisher & Developer */}
      <div className="analytics-section-grid">
        {Object.keys(analytics.publisherDistribution).length > 0 && (
          <div className="analytics-subsection">
            <h3 className="subsection-title">🏢 Top Publishers</h3>
            <div className="list-stats">
              {Object.entries(analytics.publisherDistribution)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([publisher, count]) => (
                  <div key={publisher} className="list-stat-item">
                    <span className="list-stat-label">{publisher}</span>
                    <span className="list-stat-value">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {Object.keys(analytics.developerDistribution).length > 0 && (
          <div className="analytics-subsection">
            <h3 className="subsection-title">👨‍💻 Top Developers</h3>
            <div className="list-stats">
              {Object.entries(analytics.developerDistribution)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([developer, count]) => (
                  <div key={developer} className="list-stat-item">
                    <span className="list-stat-label">{developer}</span>
                    <span className="list-stat-value">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Condition Distribution */}
      {Object.keys(analytics.conditionDistribution).length > 0 && (
        <div className="analytics-section">
          <h2 className="section-title">📦 Condition Distribution</h2>
          <div className="chart-container">
            {Object.entries(analytics.conditionDistribution).map(([condition, count]) => {
              const maxValue = getMaxValue(analytics.conditionDistribution)
              return (
                <div key={condition} className="chart-bar-item">
                  <div className="chart-label">
                    <span>{condition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <span className="chart-value">{count}</span>
                  </div>
                  <div className="chart-bar">
                    <div
                      className="chart-bar-fill chart-bar-condition"
                      style={{ width: `${(count / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Format Distribution */}
      {Object.keys(analytics.formatDistribution).length > 0 && (
        <div className="analytics-section">
          <h2 className="section-title">💿 Format Distribution</h2>
          <div className="stats-grid">
            {Object.entries(analytics.formatDistribution).map(([format, count]) => (
              <div key={format} className="stat-card">
                <div className="stat-icon">{format === 'Physical' ? '📀' : '💾'}</div>
                <div className="stat-value">{count}</div>
                <div className="stat-label">{format}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Tags */}
      {Object.keys(analytics.tagFrequency).length > 0 && (
        <div className="analytics-section">
          <h2 className="section-title">🏷️ Most Used Tags</h2>
          <div className="tags-cloud">
            {Object.entries(analytics.tagFrequency)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 15)
              .map(([tag, count]) => {
                const maxCount = getMaxValue(analytics.tagFrequency)
                const size = Math.max(0.75, count / maxCount) * 1.5
                return (
                  <span
                    key={tag}
                    className="tag-cloud-item"
                    style={{ fontSize: `${size}rem` }}
                  >
                    {tag} ({count})
                  </span>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics

