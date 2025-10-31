import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { mockUsers, currentUserId, userPreferences } from '../data/mockData'
import GameCard from '../components/GameCard'
import ConsoleCard from '../components/ConsoleCard'
import { exportCollectionToExcel } from '../utils/exportToExcel'
import { getGameImageByName } from '../utils/twitchAPI'
import './MyCollection.css'

function MyCollection() {
  const currentUser = mockUsers.find(u => u.id === currentUserId) || mockUsers[0]
  const [games, setGames] = useState(currentUser.games || [])
  const [consoles, setConsoles] = useState(currentUser.consoles || [])
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('title')
  const [consoleFilter, setConsoleFilter] = useState('all')
  const [conditionFilter, setConditionFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [imageLoading, setImageLoading] = useState({})

  // Auto-fetch images from Twitch API for games without cover art (only on initial load)
  useEffect(() => {
    const fetchMissingImages = async () => {
      const initialGames = currentUser.games || []
      const gamesToUpdate = initialGames.filter(game => !game.coverArt && !game.boxArtUrl)
      
      if (gamesToUpdate.length === 0) return

      setImageLoading(prev => {
        const newState = { ...prev }
        gamesToUpdate.forEach(game => {
          newState[game.id] = true
        })
        return newState
      })

      const updatePromises = gamesToUpdate.map(async (game) => {
        try {
          const imageUrl = await getGameImageByName(game.title)
          if (imageUrl) {
            setGames(prevGames => 
              prevGames.map(g => 
                g.id === game.id ? { ...g, coverArt: imageUrl, boxArtUrl: imageUrl } : g
              )
            )
          }
        } catch (error) {
          console.error(`Error fetching image for ${game.title}:`, error)
        } finally {
          setImageLoading(prev => {
            const newState = { ...prev }
            delete newState[game.id]
            return newState
          })
        }
      })

      await Promise.all(updatePromises)
    }

    fetchMissingImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

      // Calculate statistics
      const stats = useMemo(() => {
        const allConsoles = [...new Set(games.map(g => g.console))]
        const conditionCounts = games.reduce((acc, game) => {
          acc[game.condition] = (acc[game.condition] || 0) + 1
          return acc
        }, {})

        const consoleCounts = games.reduce((acc, game) => {
          acc[game.console] = (acc[game.console] || 0) + 1
          return acc
        }, {})

        // Count unique game titles (allowing duplicates on different platforms)
        const uniqueGameTitles = new Set(games.map(g => g.title.toLowerCase()))
        const duplicateGames = games.filter((game, index, self) => 
          self.findIndex(g => g.title.toLowerCase() === game.title.toLowerCase() && g.id !== game.id) !== -1
        )
        const gamesWithDuplicates = new Set(duplicateGames.map(g => g.title.toLowerCase()))

        const totalItems = games.length + consoles.length
        const oldestGame = games.length > 0 ? games.reduce((oldest, game) => 
          new Date(game.releaseDate) < new Date(oldest.releaseDate) ? game : oldest
        ) : null

        const newestGame = games.length > 0 ? games.reduce((newest, game) => 
          new Date(game.releaseDate) > new Date(newest.releaseDate) ? game : newest
        ) : null

        // Calculate collection value
        const gamesValue = games.reduce((sum, game) => sum + (game.price || 0), 0)
        const consolesValue = consoles.reduce((sum, console) => sum + (console.price || 0), 0)
        const totalValue = gamesValue + consolesValue
        const estimatedValue = userPreferences[currentUserId]?.collectionValue || totalValue

        return {
          totalGames: games.length,
          totalConsoles: consoles.length,
          totalItems,
          uniqueConsoles: allConsoles.length,
          uniqueGameTitles: uniqueGameTitles.size,
          gamesWithDuplicates: gamesWithDuplicates.size, // Games that appear on multiple platforms
          conditionCounts,
          consoleCounts,
          oldestGame,
          newestGame,
          estimatedValue,
          avgCondition: Object.keys(conditionCounts).length > 0 
            ? Object.keys(conditionCounts).reduce((sum, cond) => {
                const weights = { excellent: 5, 'very-good': 4, good: 3, fair: 2, poor: 1 }
                return sum + (weights[cond] || 0) * conditionCounts[cond]
              }, 0) / games.length 
            : 0
        }
      }, [games, consoles])

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let filtered = [...games]

    // Filter by console
    if (consoleFilter !== 'all') {
      filtered = filtered.filter(g => g.console === consoleFilter)
    }

    // Filter by condition
    if (conditionFilter !== 'all') {
      filtered = filtered.filter(g => g.condition === conditionFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'releaseDate':
          return new Date(b.releaseDate) - new Date(a.releaseDate)
        case 'console':
          return a.console.localeCompare(b.console)
        case 'condition':
          const order = { excellent: 5, 'very-good': 4, good: 3, fair: 2, poor: 1 }
          return (order[b.condition] || 0) - (order[a.condition] || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [games, consoleFilter, conditionFilter, sortBy])

  const filteredConsoles = useMemo(() => {
    let filtered = [...consoles]
    if (sortBy === 'title') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'releaseDate') {
      filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    }
    return filtered
  }, [consoles, sortBy])

  const allConsoles = [...new Set(games.map(g => g.console))]

  const handleExportToExcel = () => {
    try {
      exportCollectionToExcel(games, consoles, currentUser.username)
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      alert('Failed to export collection. Please try again.')
    }
  }

  const handleToggleGameSale = (gameId) => {
    setGames(games.map(game => 
      game.id === gameId 
        ? { ...game, forSale: !game.forSale, price: !game.forSale ? (game.price || 0) : null }
        : game
    ))
  }

  const handleToggleGameTrade = (gameId) => {
    setGames(games.map(game => 
      game.id === gameId 
        ? { ...game, forTrade: !game.forTrade }
        : game
    ))
  }

  const handleToggleConsoleSale = (consoleId) => {
    setConsoles(consoles.map(console => 
      console.id === consoleId 
        ? { ...console, forSale: !console.forSale, price: !console.forSale ? (console.price || 0) : null }
        : console
    ))
  }

  const handleToggleConsoleTrade = (consoleId) => {
    setConsoles(consoles.map(console => 
      console.id === consoleId 
        ? { ...console, forTrade: !console.forTrade }
        : console
    ))
  }

  const userPrefs = userPreferences[currentUserId] || {}
  const personalQuote = userPrefs.personalQuote || ''

  return (
    <div className="my-collection">
      {/* Personal Quote Section */}
      {personalQuote && (
        <div className="collection-quote">
          <div className="quote-content">
            <span className="quote-icon">💬</span>
            <p className="quote-text">{personalQuote}</p>
          </div>
        </div>
      )}

      <div className="collection-header">
        <div>
          <h1>My Collection</h1>
          <p className="collection-subtitle">Manage and organize your gaming collection</p>
        </div>
        <div className="collection-header-actions">
          <button 
            onClick={handleExportToExcel}
            className="btn btn-primary export-btn"
            title="Export collection to Excel"
          >
            <span className="export-icon">📊</span>
            Export to Excel
          </button>
        </div>
            <div className="collection-stats">
              <div className="stat">
                <span className="stat-number">{stats.totalGames}</span>
                <span className="stat-label">Games</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.totalConsoles}</span>
                <span className="stat-label">Consoles</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.totalItems}</span>
                <span className="stat-label">Total Items</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.uniqueConsoles}</span>
                <span className="stat-label">Platforms</span>
              </div>
              {stats.gamesWithDuplicates > 0 && (
                <div className="stat stat-collector">
                  <span className="stat-number">{stats.gamesWithDuplicates}</span>
                  <span className="stat-label">Multi-Platform</span>
                </div>
              )}
              <div className="stat stat-value">
                <span className="stat-number">${stats.estimatedValue.toFixed(2)}</span>
                <span className="stat-label">Collection Value</span>
              </div>
            </div>
      </div>

      {/* Filters and Controls - Moved to top for better access */}
      <div className="collection-controls">
        <div className="collection-filters">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All Items ({stats.totalItems})
          </button>
          <button 
            className={filter === 'games' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('games')}
          >
            Games ({stats.totalGames})
          </button>
          <button 
            className={filter === 'consoles' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('consoles')}
          >
            Consoles ({stats.totalConsoles})
          </button>
        </div>

        {filter !== 'consoles' && (
          <div className="game-filters">
            <select 
              className="filter-select"
              value={consoleFilter}
              onChange={(e) => setConsoleFilter(e.target.value)}
            >
              <option value="all">All Platforms</option>
              {allConsoles.map(console => (
                <option key={console} value={console}>{console}</option>
              ))}
            </select>
            <select 
              className="filter-select"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
            >
              <option value="all">All Conditions</option>
              <option value="excellent">Excellent</option>
              <option value="very-good">Very Good</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        )}

        <div className="collection-sort">
          <select 
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Sort by Title</option>
            <option value="releaseDate">Sort by Release Date</option>
            {filter !== 'consoles' && <option value="console">Sort by Platform</option>}
            {filter !== 'consoles' && <option value="condition">Sort by Condition</option>}
          </select>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⬜
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      <div className="collection-content">
        {games.length === 0 && consoles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2>Your collection is empty</h2>
            <p>Start building your collection by adding games and consoles!</p>
            <div className="empty-actions">
              <Link to="/add-game" className="btn btn-primary">Add Your First Game</Link>
              <Link to="/add-console" className="btn btn-secondary">Add Your First Console</Link>
            </div>
          </div>
        ) : (
          <>
            {(filter === 'all' || filter === 'games') && (
              <section className="collection-section">
                <div className="collection-section-header">
                  <div className="section-header">
                    <h2>🎮 Games Collection</h2>
                    <span className="section-count">{filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}</span>
                  </div>
                </div>
                {filteredGames.length === 0 ? (
                  <div className="collection-section-content">
                    <p className="empty-message">No games match your filters. Try adjusting them!</p>
                  </div>
                ) : (
                  <div className={`collection-section-content ${viewMode === 'grid' ? 'items-grid' : 'items-list'}`}>
                    {filteredGames.map((game, index) => (
                      <GameCard 
                        key={game.id} 
                        game={game} 
                        viewMode={viewMode}
                        showActions={true}
                        isOwn={true}
                        onToggleSale={handleToggleGameSale}
                        onToggleTrade={handleToggleGameTrade}
                        style={{ animationDelay: `${index * 0.05}s` }} 
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
            {(filter === 'all' || filter === 'consoles') && (
              <section className="collection-section">
                <div className="collection-section-header">
                  <div className="section-header">
                    <h2>🕹️ Consoles Collection</h2>
                    <span className="section-count">{filteredConsoles.length} {filteredConsoles.length === 1 ? 'console' : 'consoles'}</span>
                  </div>
                </div>
                {filteredConsoles.length === 0 ? (
                  <div className="collection-section-content">
                    <p className="empty-message">No consoles in your collection yet</p>
                  </div>
                ) : (
                  <div className={`collection-section-content ${viewMode === 'grid' ? 'items-grid' : 'items-list'}`}>
                    {filteredConsoles.map((consoleItem, index) => (
                      <ConsoleCard 
                        key={consoleItem.id} 
                        console={consoleItem} 
                        viewMode={viewMode}
                        showActions={true}
                        isOwn={true}
                        onToggleSale={handleToggleConsoleSale}
                        onToggleTrade={handleToggleConsoleTrade}
                        style={{ animationDelay: `${index * 0.05}s` }} 
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>

      {/* Statistics Dashboard - Moved to bottom */}
      {stats.totalGames > 0 && (
        <div className="stats-dashboard">
          <div className="stats-section">
            <h3>Collection Breakdown</h3>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <span className="breakdown-label">Games by Platform</span>
                <div className="breakdown-bars">
                  {Object.entries(stats.consoleCounts).map(([console, count]) => (
                    <div key={console} className="breakdown-bar">
                      <span className="bar-label">{console}</span>
                      <div className="bar-container">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${(count / stats.totalGames) * 100}%` }}
                        >
                          <span className="bar-value">{count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Games by Condition</span>
                <div className="condition-list">
                  {Object.entries(stats.conditionCounts).map(([condition, count]) => (
                    <div key={condition} className="condition-item">
                      <span className="condition-name">{condition.replace('-', ' ')}</span>
                      <span className="condition-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="stats-section">
            <h3>Collection Highlights</h3>
            <div className="highlights">
              {stats.oldestGame && (
                <div className="highlight">
                  <span className="highlight-label">Oldest Game</span>
                  <span className="highlight-value">{stats.oldestGame.title}</span>
                  <span className="highlight-date">{new Date(stats.oldestGame.releaseDate).getFullYear()}</span>
                </div>
              )}
              {stats.newestGame && (
                <div className="highlight">
                  <span className="highlight-label">Newest Game</span>
                  <span className="highlight-value">{stats.newestGame.title}</span>
                  <span className="highlight-date">{new Date(stats.newestGame.releaseDate).getFullYear()}</span>
                </div>
              )}
              <div className="highlight">
                <span className="highlight-label">Average Condition</span>
                <span className="highlight-value">
                  {stats.avgCondition >= 4.5 ? 'Excellent' : 
                   stats.avgCondition >= 3.5 ? 'Very Good' :
                   stats.avgCondition >= 2.5 ? 'Good' :
                   stats.avgCondition >= 1.5 ? 'Fair' : 'Poor'}
                </span>
                <span className="highlight-date">{stats.avgCondition.toFixed(1)}/5.0</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyCollection
