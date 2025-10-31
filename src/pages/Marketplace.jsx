import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { mockUsers, currentUserId } from '../data/mockData'
import GameCard from '../components/GameCard'
import ConsoleCard from '../components/ConsoleCard'
import TradeModal from '../components/TradeModal'
import './Marketplace.css'

function Marketplace() {
  const [filterType, setFilterType] = useState('all') // 'all', 'sale', 'trade'
  const [platformFilter, setPlatformFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent') // 'recent', 'price-low', 'price-high', 'title'
  const [searchTerm, setSearchTerm] = useState('')
  const [tradeModalOpen, setTradeModalOpen] = useState(false)
  const [selectedTradeItem, setSelectedTradeItem] = useState(null)
  const currentUser = mockUsers.find(u => u.id === currentUserId) || mockUsers[0]

  // Get all items for sale/trade from all users
  const allMarketplaceItems = useMemo(() => {
    const items = []
    
    mockUsers.forEach(user => {
      // Add games for sale/trade
      user.games.forEach(game => {
        if (game.forSale || game.forTrade) {
          items.push({
            ...game,
            owner: user,
            itemType: 'game'
          })
        }
      })
      
      // Add consoles for sale/trade
      user.consoles.forEach(console => {
        if (console.forSale || console.forTrade) {
          items.push({
            ...console,
            owner: user,
            itemType: 'console',
            title: console.name, // Normalize for display
            console: console.name
          })
        }
      })
    })
    
    return items
  }, [])

  // Get unique platforms
  const allPlatforms = useMemo(() => {
    const platforms = new Set()
    allMarketplaceItems.forEach(item => {
      if (item.console) platforms.add(item.console)
    })
    return Array.from(platforms).sort()
  }, [allMarketplaceItems])

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = [...allMarketplaceItems]

    // Filter by type (sale/trade)
    if (filterType === 'sale') {
      filtered = filtered.filter(item => item.forSale)
    } else if (filterType === 'trade') {
      filtered = filtered.filter(item => item.forTrade)
    }

    // Filter by platform
    if (platformFilter !== 'all') {
      filtered = filtered.filter(item => item.console === platformFilter)
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(term) ||
        item.name?.toLowerCase().includes(term) ||
        item.console?.toLowerCase().includes(term)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0)
        case 'price-high':
          return (b.price || 0) - (a.price || 0)
        case 'title':
          return (a.title || a.name).localeCompare(b.title || b.name)
        case 'recent':
        default:
          return 0 // Keep original order (already sorted by most recent)
      }
    })

    return filtered
  }, [allMarketplaceItems, filterType, platformFilter, sortBy, searchTerm])

  const stats = useMemo(() => {
    return {
      total: allMarketplaceItems.length,
      forSale: allMarketplaceItems.filter(i => i.forSale).length,
      forTrade: allMarketplaceItems.filter(i => i.forTrade).length,
      games: allMarketplaceItems.filter(i => i.itemType === 'game').length,
      consoles: allMarketplaceItems.filter(i => i.itemType === 'console').length
    }
  }, [allMarketplaceItems])

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <div>
          <h1>💰 Marketplace</h1>
          <p className="marketplace-subtitle">Browse games and consoles available for sale or trade</p>
        </div>
        <div className="marketplace-stats">
          <div className="marketplace-stat">
            <span className="stat-icon">📦</span>
            <div>
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Items</span>
            </div>
          </div>
          <div className="marketplace-stat">
            <span className="stat-icon">💰</span>
            <div>
              <span className="stat-number">{stats.forSale}</span>
              <span className="stat-label">For Sale</span>
            </div>
          </div>
          <div className="marketplace-stat">
            <span className="stat-icon">🔄</span>
            <div>
              <span className="stat-number">{stats.forTrade}</span>
              <span className="stat-label">For Trade</span>
            </div>
          </div>
        </div>
      </div>

      <div className="marketplace-filters">
        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input 
              type="text"
              className="filter-input"
              placeholder="Search games or consoles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Type</label>
            <select 
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="sale">For Sale Only</option>
              <option value="trade">For Trade Only</option>
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
        {filteredItems.length !== allMarketplaceItems.length && (
          <div className="filter-results">
            Showing {filteredItems.length} of {allMarketplaceItems.length} items
          </div>
        )}
      </div>

      <div className="marketplace-content">
        {filteredItems.length === 0 ? (
          <div className="empty-marketplace">
            <div className="empty-icon">🛒</div>
            <h2>No items found</h2>
            <p>{searchTerm || filterType !== 'all' || platformFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'No items available for sale or trade yet. Be the first to list something!'}
            </p>
            {(searchTerm || filterType !== 'all' || platformFilter !== 'all') && (
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('')
                  setFilterType('all')
                  setPlatformFilter('all')
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="marketplace-grid">
              {filteredItems.map((item) => (
                <div key={`${item.itemType}-${item.id}`} className="marketplace-item-wrapper">
                  <div className="marketplace-item-header">
                    <Link 
                      to={`/profile/${item.owner.id}`}
                      className="marketplace-owner"
                    >
                      <div className="owner-avatar-small">
                        {item.owner.avatar ? (
                          <img src={item.owner.avatar} alt={item.owner.username} />
                        ) : (
                          <span>{item.owner.username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <span className="owner-username">{item.owner.username}</span>
                    </Link>
                  </div>
                  {item.itemType === 'game' ? (
                    <GameCard 
                      game={item}
                      isOwn={item.owner.id === currentUserId}
                      showActions={false}
                    />
                  ) : (
                    <ConsoleCard 
                      console={item}
                      isOwn={item.owner.id === currentUserId}
                      showActions={false}
                    />
                  )}
                  <div className="marketplace-item-actions">
                    {item.forSale && item.price && (
                      <button 
                        className="btn btn-primary btn-block"
                        onClick={() => {
                          alert(`In a real app, this would process the purchase of ${item.title || item.name} for $${item.price}`)
                        }}
                      >
                        Buy Now - ${item.price}
                      </button>
                    )}
                    {item.forTrade && (
                      <button 
                        className="btn btn-secondary btn-block"
                        onClick={() => {
                          setSelectedTradeItem(item)
                          setTradeModalOpen(true)
                        }}
                      >
                        Request Trade
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <TradeModal
        isOpen={tradeModalOpen}
        onClose={() => {
          setTradeModalOpen(false)
          setSelectedTradeItem(null)
        }}
        item={selectedTradeItem}
        owner={selectedTradeItem?.owner}
        currentUser={currentUser}
      />
    </div>
  )
}

export default Marketplace

