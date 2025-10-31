import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { mockUsers, mockGames, mockConsoles, currentUserId } from '../data/mockData'
import { getPopularGames } from '../utils/twitchAPI'
import './Home.css'

// Gaming character icons mapping
const gamingCharacters = [
  '🍄', '🦍', '⚔️', '🎯', '🌟', '🦊', '🔥', '⚡',
  '🎮', '👾', '🦎', '🐢', '⭐', '🎲', '🎪',
]

const getUserCharacter = (userId) => {
  const index = userId.charCodeAt(userId.length - 1) % gamingCharacters.length
  return gamingCharacters[index]
}

function Home() {
  const navigate = useNavigate()
  const [popularGames, setPopularGames] = useState([])
  const [featuredGames, setFeaturedGames] = useState([])
  const [loadingGames, setLoadingGames] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Get top 3 users by likes
  const featuredUsers = mockUsers
    .filter(user => user.id !== currentUserId)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3)

  // Calculate platform statistics
  const platformStats = mockGames.reduce((acc, game) => {
    acc[game.console] = (acc[game.console] || 0) + 1
    return acc
  }, {})

  const totalGamesInPlatform = mockUsers.reduce((sum, user) => sum + user.games.length, 0)
  const totalConsolesInPlatform = mockUsers.reduce((sum, user) => sum + user.consoles.length, 0)
  const totalUsers = mockUsers.length
  const totalLikes = mockUsers.reduce((sum, user) => sum + user.likes, 0)

  // Fetch popular games from Twitch API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoadingGames(true)
        const games = await getPopularGames(20)
        
        // Transform games for display
        const transformedGames = games.map(game => ({
          id: game.id,
          name: game.name,
          boxArtUrl: game.box_art_url ? game.box_art_url.replace('{width}x{height}', '500x700') : null,
          twitchId: game.id
        }))

        setPopularGames(transformedGames.slice(0, 12))
        setFeaturedGames(transformedGames.slice(0, 6)) // Top 6 for featured
      } catch (error) {
        console.error('Error fetching popular games:', error)
      } finally {
        setLoadingGames(false)
      }
    }

    fetchGames()
  }, [])

  // Recent activity (mock)
  const recentActivity = [
    { user: 'RetroGamer', action: 'added', item: 'Super Mario Odyssey', type: 'game', time: '2 hours ago' },
    { user: 'CollectionKing', action: 'added', item: 'PlayStation 5', type: 'console', time: '5 hours ago' },
    { user: 'PlayStationFan', action: 'liked', item: "GameMaster89's profile", type: 'profile', time: '1 day ago' }
  ]

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query.trim().length > 0) {
      const games = mockGames.filter(game => 
        game.title.toLowerCase().includes(query)
      ).slice(0, 5)

      const users = mockUsers.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.bio.toLowerCase().includes(query)
      ).slice(0, 3)

      setSearchResults({ games, users })
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
      setSearchResults([])
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="home">
      {/* Hero Section with Featured Games */}
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to GameLibrary</h1>
          <p className="hero-subtitle">
            Track your video game collection, discover new games, and connect with fellow collectors
          </p>
          
          {/* Search Bar */}
          <form className="home-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search games, consoles, or collectors..."
              value={searchQuery}
              onChange={handleSearch}
              className="home-search-input"
            />
            <button type="submit" className="home-search-btn">
              🔍
            </button>
          </form>
          {showSearchResults && searchQuery.trim() && (
            <div className="home-search-results">
              {searchResults.games.length > 0 && (
                <div className="search-results-section">
                  <h4>Games</h4>
                  {searchResults.games.map(game => (
                    <Link 
                      key={game.id} 
                      to="/add-game" 
                      state={{ prefillGame: { name: game.title, boxArtUrl: game.coverArt } }}
                      className="search-result-item"
                      onClick={() => setShowSearchResults(false)}
                    >
                      {game.coverArt && <img src={game.coverArt} alt={game.title} />}
                      <span>{game.title}</span>
                    </Link>
                  ))}
                </div>
              )}
              {searchResults.users.length > 0 && (
                <div className="search-results-section">
                  <h4>Collectors</h4>
                  {searchResults.users.map(user => (
                    <Link 
                      key={user.id} 
                      to={`/profile/${user.id}`}
                      className="search-result-item"
                      onClick={() => setShowSearchResults(false)}
                    >
                      <span className="search-result-avatar">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                      <span>{user.username}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="hero-actions">
            <Link to="/collection" className="btn btn-primary">
              View My Collection
            </Link>
            <Link to="/explore" className="btn btn-secondary">
              Explore Collections
            </Link>
          </div>
        </div>
        {featuredGames.length > 0 && (
          <div className="hero-games">
            {featuredGames.slice(0, 5).map((game, index) => (
              <div 
                key={game.id} 
                className="hero-game-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {game.boxArtUrl ? (
                  <img src={game.boxArtUrl} alt={game.name} />
                ) : (
                  <div className="hero-game-placeholder">
                    <span>🎮</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Games Section */}
      {featuredGames.length > 0 && (
        <div className="featured-games-section">
          <div className="section-header">
            <h2>🔥 Trending Games Right Now</h2>
            <p className="section-subtitle">Most popular games on Twitch</p>
          </div>
          {loadingGames ? (
            <div className="games-loading">
              <div className="loading-spinner"></div>
              <p>Loading games...</p>
            </div>
          ) : (
            <div className="featured-games-grid">
              {featuredGames.map((game) => (
                <Link
                  key={game.id}
                  to="/add-game"
                  className="featured-game-card"
                  state={{ prefillGame: game }}
                >
                  {game.boxArtUrl ? (
                    <div className="featured-game-image">
                      <img src={game.boxArtUrl} alt={game.name} />
                      <div className="featured-game-overlay">
                        <span className="add-game-icon">+</span>
                      </div>
                    </div>
                  ) : (
                    <div className="featured-game-placeholder">
                      <span>🎮</span>
                    </div>
                  )}
                  <div className="featured-game-info">
                    <h3>{game.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Platform Statistics */}
      <div className="platform-stats-section">
        <div className="section-header">
          <h2>Platform Overview</h2>
          <p className="section-subtitle">Most popular gaming platforms in our community</p>
        </div>
        <div className="platform-stats-grid">
          {Object.entries(platformStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([platform, count]) => (
              <div key={platform} className="platform-stat-card">
                <div className="platform-stat-icon">🎮</div>
                <div className="platform-stat-info">
                  <span className="platform-stat-name">{platform}</span>
                  <span className="platform-stat-count">{count} games</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Site Statistics */}
      <div className="site-stats">
        <div className="site-stat">
          <span className="site-stat-number">{totalUsers}</span>
          <span className="site-stat-label">Active Collectors</span>
        </div>
        <div className="site-stat">
          <span className="site-stat-number">{totalGamesInPlatform}</span>
          <span className="site-stat-label">Games Tracked</span>
        </div>
        <div className="site-stat">
          <span className="site-stat-number">{totalConsolesInPlatform}</span>
          <span className="site-stat-label">Consoles Tracked</span>
        </div>
        <div className="site-stat">
          <span className="site-stat-number">{totalLikes}</span>
          <span className="site-stat-label">Total Likes</span>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Track Your Collection</h3>
          <p>Keep an organized record of all your games and consoles in one place. Add details like condition, release date, and personal notes.</p>
          <ul className="feature-list">
            <li>Organize by platform</li>
            <li>Track condition and value</li>
            <li>Add personal notes</li>
          </ul>
        </div>
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Visit Profiles</h3>
          <p>Browse other collectors' libraries and see what they have. Discover new games and connect with like-minded enthusiasts.</p>
          <ul className="feature-list">
            <li>Explore collections</li>
            <li>See detailed stats</li>
            <li>Find rare items</li>
          </ul>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💝</div>
          <h3>Like & Trade</h3>
          <p>Show appreciation for great collections and connect with others for trading opportunities. Build your community.</p>
          <ul className="feature-list">
            <li>Like profiles</li>
            <li>Request trades</li>
            <li>Connect safely</li>
          </ul>
        </div>
      </div>

      {/* Discover More Games */}
      {popularGames.length > 0 && (
        <div className="discover-games-section">
          <div className="section-header">
            <h2>🎮 Discover More Games</h2>
            <p className="section-subtitle">Popular games you might want to add to your collection</p>
          </div>
          <div className="discover-games-grid">
            {popularGames.slice(6).map((game) => (
              <Link
                key={game.id}
                to="/add-game"
                className="discover-game-card"
                state={{ prefillGame: game }}
              >
                {game.boxArtUrl ? (
                  <div className="discover-game-image">
                    <img src={game.boxArtUrl} alt={game.name} />
                    <div className="discover-game-overlay">
                      <span>Add to Collection</span>
                    </div>
                  </div>
                ) : (
                  <div className="discover-game-placeholder">
                    <span>🎮</span>
                  </div>
                )}
                <div className="discover-game-info">
                  <h4>{game.name}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="section-header">
          <div>
            <h2>Recent Activity</h2>
            <p className="section-subtitle">Latest updates from our community</p>
          </div>
          <Link to="/activity" className="btn btn-secondary">
            View All Activity →
          </Link>
        </div>
        <div className="activity-list">
          {recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <span className="activity-icon">
                {activity.type === 'game' ? '🎮' : activity.type === 'console' ? '🕹️' : '❤️'}
              </span>
              <div className="activity-content">
                <span className="activity-text">
                  <strong>{activity.user}</strong> {activity.action} <strong>{activity.item}</strong>
                </span>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {featuredUsers.length > 0 && (
        <div className="featured-users">
          <h2>Featured Collectors</h2>
          <p className="featured-subtitle">Top collectors by community likes</p>
          <div className="featured-grid">
            {featuredUsers.map((user) => (
              <Link 
                key={user.id}
                to={`/profile/${user.id}`}
                className="featured-user-card"
              >
                    <div className="featured-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} />
                      ) : (
                        <div className="avatar-character-featured">
                          <span className="character-icon-featured">{getUserCharacter(user.id)}</span>
                        </div>
                      )}
                    </div>
                <div className="featured-user-info">
                  <h3>{user.username}</h3>
                  <p className="featured-bio">{user.bio}</p>
                  <div className="featured-stats">
                    <span>{user.games.length} games</span>
                    <span>•</span>
                    <span>{user.consoles.length} consoles</span>
                    <span>•</span>
                    <span>❤️ {user.likes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
