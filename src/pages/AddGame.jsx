import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { searchGamesWithCovers } from '../utils/twitchAPI'
import { getEnhancedGameDetails, inferGenreFromName } from '../utils/enhancedTwitchAPI'
import { userPreferences, currentUserId } from '../data/mockData'
import TagsInput from '../components/TagsInput'
import PhotoUpload from '../components/PhotoUpload'
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
    coverArt: '',
    // Enhanced fields
    publisher: '',
    developer: '',
    genre: [],
    tags: [],
    photos: [],
    collectionId: 'all',
    rating: null,
    completionStatus: 'not-started',
    playtime: 0,
    barcode: '',
    favorite: false,
    // Existing detailed fields
    hasOriginalBox: true,
    hasManual: true,
    edition: 'Standard',
    format: 'Physical',
    sealed: false,
    purchaseDate: '',
    purchasePrice: null,
    region: 'NTSC-U'
  })
  
  const [fetchingDetails, setFetchingDetails] = useState(false)
  const allTags = userPreferences[currentUserId]?.allTags || []

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

  const handleSelectGame = async (game) => {
    setFormData(prev => ({
      ...prev,
      title: game.title,
      coverArt: game.boxArtUrl || game.coverArt || '',
      photos: game.boxArtUrl ? [game.boxArtUrl] : []
    }))
    setShowResults(false)
    setGameSearchResults([])
    
    // Try to fetch enhanced details from API
    if (game.title) {
      setFetchingDetails(true)
      try {
        const enhanced = await getEnhancedGameDetails(game.title)
        if (enhanced) {
          setFormData(prev => ({
            ...prev,
            publisher: enhanced.publisher || prev.publisher,
            developer: enhanced.developer || prev.developer,
            genre: enhanced.genre && enhanced.genre.length > 0 ? enhanced.genre : inferGenreFromName(game.title),
            releaseDate: enhanced.releaseDate || prev.releaseDate
          }))
        } else {
          // Fallback: infer genre from name
          setFormData(prev => ({
            ...prev,
            genre: inferGenreFromName(game.title)
          }))
        }
      } catch (error) {
        console.error('Error fetching enhanced details:', error)
        // Fallback to genre inference
        setFormData(prev => ({
          ...prev,
          genre: inferGenreFromName(game.title)
        }))
      } finally {
        setFetchingDetails(false)
      }
    }
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

        {fetchingDetails && (
          <div className="form-loading">
            <span>🔍 Fetching game details from API...</span>
          </div>
        )}

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
          <label>Photos (Multiple Images)</label>
          <PhotoUpload
            photos={formData.photos}
            onChange={(photos) => setFormData({ ...formData, photos })}
            maxPhotos={10}
          />
          <small className="form-hint">Upload multiple photos of your game: front cover, back cover, disc, manual, etc.</small>
        </div>

        {/* Enhanced Fields Section */}
        <div className="form-section-divider">
          <span>Enhanced Details</span>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="publisher">Publisher</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="e.g., Nintendo, Sony, Microsoft"
            />
          </div>

          <div className="form-group">
            <label htmlFor="developer">Developer</label>
            <input
              type="text"
              id="developer"
              name="developer"
              value={formData.developer}
              onChange={handleChange}
              placeholder="e.g., Nintendo EPD, FromSoftware"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <TagsInput
            tags={formData.genre}
            allTags={['Action', 'Adventure', 'RPG', 'Shooter', 'Platformer', 'Racing', 'Sports', 'Strategy', 'Fighting', 'Puzzle', 'Horror', 'Indie', 'Open World', 'Souls-like', 'Roguelike', 'Simulation']}
            onChange={(tags) => setFormData({ ...formData, genre: tags })}
            placeholder="Add genres (e.g., Action, RPG, Adventure)..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Custom Tags</label>
          <TagsInput
            tags={formData.tags}
            allTags={allTags}
            onChange={(tags) => setFormData({ ...formData, tags })}
            placeholder="Add custom tags (e.g., open-world, difficult, favorite)..."
          />
          <small className="form-hint">Press Enter to add a tag. Tags help you organize and find games.</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rating">Personal Rating</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating || ''}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value ? parseInt(e.target.value) : null })}
            >
              <option value="">Not rated</option>
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                <option key={num} value={num}>{num}/10 ⭐</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="completionStatus">Completion Status</label>
            <select
              id="completionStatus"
              name="completionStatus"
              value={formData.completionStatus}
              onChange={handleChange}
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="completed-100">100% Completed</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="playtime">Playtime (Hours)</label>
            <input
              type="number"
              id="playtime"
              name="playtime"
              value={formData.playtime}
              onChange={(e) => setFormData({ ...formData, playtime: parseInt(e.target.value) || 0 })}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="barcode">Barcode/UPC</label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.favorite}
              onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
            />
            <span>⭐ Mark as Favorite</span>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="collectionId">Custom Collection</label>
          <select
            id="collectionId"
            name="collectionId"
            value={formData.collectionId}
            onChange={handleChange}
          >
            <option value="all">All Games (Default)</option>
            {userPreferences[currentUserId]?.customCollections?.map(collection => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
          <small className="form-hint">Organize your games into custom collections</small>
        </div>

        {/* Detailed Information Section */}
        <div className="form-section-divider">
          <span>Physical Details</span>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="edition">Edition</label>
            <select
              id="edition"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
            >
              <option value="Standard">Standard</option>
              <option value="Collector's Edition">Collector's Edition</option>
              <option value="Deluxe Edition">Deluxe Edition</option>
              <option value="Limited Edition">Limited Edition</option>
              <option value="Special Edition">Special Edition</option>
              <option value="Greatest Hits">Greatest Hits</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="format">Format</label>
            <select
              id="format"
              name="format"
              value={formData.format}
              onChange={handleChange}
            >
              <option value="Physical">Physical</option>
              <option value="Digital">Digital</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="purchaseDate">Purchase Date</label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="purchasePrice">Purchase Price ($)</label>
            <input
              type="number"
              id="purchasePrice"
              name="purchasePrice"
              value={formData.purchasePrice || ''}
              onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || null })}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="region">Region</label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
          >
            <option value="NTSC-U">NTSC-U (North America)</option>
            <option value="NTSC-J">NTSC-J (Japan)</option>
            <option value="PAL">PAL (Europe/Australia)</option>
            <option value="N/A">N/A (Digital)</option>
          </select>
        </div>

        <div className="form-row-checkboxes">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.hasOriginalBox}
              onChange={(e) => setFormData({ ...formData, hasOriginalBox: e.target.checked })}
            />
            <span>📦 Has Original Box</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.hasManual}
              onChange={(e) => setFormData({ ...formData, hasManual: e.target.checked })}
            />
            <span>📖 Has Manual</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.sealed}
              onChange={(e) => setFormData({ ...formData, sealed: e.target.checked })}
            />
            <span>🔒 Sealed/Unopened</span>
          </label>
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

