import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { searchGamesWithCovers } from '../utils/twitchAPI'
import './AddGame.css'

function AddGame() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    title: '',
    console: '',
    releaseDate: '',
    condition: 'excellent',
    notes: '',
    coverArt: ''
  })

  // Pre-fill form if game data is passed from Home page
  useEffect(() => {
    if (location.state?.prefillGame) {
      const game = location.state.prefillGame
      setFormData(prev => ({
        ...prev,
        title: game.name || game.title || '',
        coverArt: game.boxArtUrl || game.coverArt || ''
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [gameSearchResults, setGameSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchTimeoutRef = useRef(null)
  const searchContainerRef = useRef(null)

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleGameSearch = async (query) => {
    if (query.length < 2) {
      setGameSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    setShowResults(true)

    try {
      const results = await searchGamesWithCovers(query)
      setGameSearchResults(results)
    } catch (error) {
      console.error('Error searching games:', error)
      setGameSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleTitleChange = (e) => {
    const value = e.target.value
    setFormData({
      ...formData,
      title: value
    })

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleGameSearch(value)
    }, 300)
  }

  const handleSelectGame = (game) => {
    setFormData({
      ...formData,
      title: game.title,
      coverArt: game.boxArtUrl || game.coverArt || ''
    })
    setShowResults(false)
    setGameSearchResults([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement game addition logic
    console.log('Adding game:', formData)
    // After successful addition, navigate to collection
    navigate('/collection')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="add-game">
      <div className="form-header">
        <h1>Add New Game</h1>
        <p>Add a game to your collection</p>
      </div>

      <form onSubmit={handleSubmit} className="game-form">
        <div className="form-note">
          <span className="note-icon">💡</span>
          <span>Tip: You can add the same game on different platforms! For example, if you own "Elden Ring" on both Xbox and PlayStation, you can add each copy separately.</span>
        </div>
        <div className="form-group form-group-search" ref={searchContainerRef}>
          <label htmlFor="title">Game Title *</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              onFocus={() => formData.title.length >= 2 && setShowResults(true)}
              required
              placeholder="Start typing to search games..."
              autoComplete="off"
            />
            {isSearching && <span className="search-spinner">🔍</span>}
          </div>
          {showResults && gameSearchResults.length > 0 && (
            <div className="search-results">
              {gameSearchResults.map((game) => (
                <div
                  key={game.id || game.twitchId}
                  className="search-result-item"
                  onClick={() => handleSelectGame(game)}
                >
                  {game.boxArtUrl && (
                    <img src={game.boxArtUrl} alt={game.title} className="search-result-image" />
                  )}
                  <span className="search-result-title">{game.title}</span>
                </div>
              ))}
            </div>
          )}
          {showResults && !isSearching && gameSearchResults.length === 0 && formData.title.length >= 2 && (
            <div className="search-results search-results-empty">
              <p>No games found. You can still add it manually.</p>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="console">Console/Platform *</label>
          <input
            type="text"
            id="console"
            name="console"
            value={formData.console}
            onChange={handleChange}
            required
            placeholder="e.g., PlayStation 5, Nintendo Switch"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="releaseDate">Release Date</label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="condition">Condition</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
            >
              <option value="excellent">Excellent</option>
              <option value="very-good">Very Good</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="coverArt">Cover Art URL</label>
          <input
            type="url"
            id="coverArt"
            name="coverArt"
            value={formData.coverArt}
            onChange={handleChange}
            placeholder="https://example.com/game-cover.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Any additional notes about this game..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/collection')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Game
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddGame

