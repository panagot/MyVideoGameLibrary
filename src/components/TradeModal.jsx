import { useState } from 'react'
import './TradeModal.css'

function TradeModal({ isOpen, onClose, item, owner, currentUser }) {
  const [selectedItems, setSelectedItems] = useState([])
  const [message, setMessage] = useState('')
  const [step, setStep] = useState(1) // 1: select items, 2: message, 3: confirm

  if (!isOpen || !item) return null

  // Get user's items available for trade
  const userTradeItems = [
    ...(currentUser?.games || []).map(g => ({ ...g, itemType: 'game' })).filter(g => g.forTrade || !g.forSale),
    ...(currentUser?.consoles || []).map(c => ({ ...c, itemType: 'console', title: c.name, console: c.name })).filter(c => c.forTrade || !c.forSale)
  ]

  const handleItemToggle = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSubmit = () => {
    // In a real app, this would send a trade request to the backend
    console.log('Trade Request:', {
      requestedItem: item,
      owner: owner,
      offeredItems: selectedItems,
      message: message
    })
    alert('Trade request sent! In a real app, this would notify the owner.')
    onClose()
    // Reset form
    setSelectedItems([])
    setMessage('')
    setStep(1)
  }

  return (
    <div className="trade-modal-overlay" onClick={onClose}>
      <div className="trade-modal" onClick={(e) => e.stopPropagation()}>
        <div className="trade-modal-header">
          <h2>🔄 Request Trade</h2>
          <button className="trade-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="trade-modal-content">
          {/* Request Info */}
          <div className="trade-request-info">
            <div className="trade-request-item">
              <h3>You're requesting:</h3>
              <div className="request-item-card">
                {item.coverArt || item.boxArtUrl ? (
                  <img 
                    src={item.coverArt || item.boxArtUrl} 
                    alt={item.title || item.name}
                    className="request-item-image"
                  />
                ) : (
                  <div className="request-item-placeholder">
                    <span>{item.itemType === 'game' ? '🎮' : '🕹️'}</span>
                  </div>
                )}
                <div className="request-item-info">
                  <h4>{item.title || item.name}</h4>
                  <p>{item.console || item.manufacturer}</p>
                  {item.condition && (
                    <span className={`condition-badge condition-${item.condition}`}>
                      {item.condition.replace('-', ' ')}
                    </span>
                  )}
                </div>
              </div>
              <p className="request-from">
                From: <strong>{owner?.username}</strong>
              </p>
            </div>
          </div>

          {/* Step 1: Select Your Items */}
          {step === 1 && (
            <div className="trade-step">
              <h3>Select items to offer in trade:</h3>
              <div className="trade-items-grid">
                {userTradeItems.length === 0 ? (
                  <div className="no-trade-items">
                    <p>You don't have any items marked for trade.</p>
                    <p className="hint">Go to your collection to mark items for trade!</p>
                  </div>
                ) : (
                  userTradeItems.map(tradeItem => (
                    <div 
                      key={`${tradeItem.itemType}-${tradeItem.id}`}
                      className={`trade-item-option ${selectedItems.includes(tradeItem.id) ? 'selected' : ''}`}
                      onClick={() => handleItemToggle(tradeItem.id)}
                    >
                      {tradeItem.coverArt || tradeItem.boxArtUrl || tradeItem.image ? (
                        <img 
                          src={tradeItem.coverArt || tradeItem.boxArtUrl || tradeItem.image} 
                          alt={tradeItem.title || tradeItem.name}
                        />
                      ) : (
                        <div className="trade-item-placeholder">
                          <span>{tradeItem.itemType === 'game' ? '🎮' : '🕹️'}</span>
                        </div>
                      )}
                      <div className="trade-item-info">
                        <h5>{tradeItem.title || tradeItem.name}</h5>
                        <p>{tradeItem.console || tradeItem.manufacturer}</p>
                      </div>
                      <div className="trade-item-check">
                        {selectedItems.includes(tradeItem.id) && '✓'}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {selectedItems.length > 0 && (
                <div className="trade-step-footer">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setStep(2)}
                  >
                    Continue ({selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Add Message */}
          {step === 2 && (
            <div className="trade-step">
              <h3>Add a message (optional):</h3>
              <textarea
                className="trade-message-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'd like to trade for your item. Here's what I can offer..."
                rows="5"
              />
              <div className="trade-step-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setStep(3)}
                >
                  Review Trade Request
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="trade-step">
              <h3>Review your trade request:</h3>
              <div className="trade-summary">
                <div className="trade-summary-section">
                  <h4>You're requesting:</h4>
                  <div className="summary-item">
                    <strong>{item.title || item.name}</strong>
                    <span>from {owner?.username}</span>
                  </div>
                </div>
                <div className="trade-summary-section">
                  <h4>You're offering:</h4>
                  {selectedItems.map(itemId => {
                    const tradeItem = userTradeItems.find(i => i.id === itemId)
                    return tradeItem ? (
                      <div key={itemId} className="summary-item">
                        <strong>{tradeItem.title || tradeItem.name}</strong>
                      </div>
                    ) : null
                  })}
                </div>
                {message && (
                  <div className="trade-summary-section">
                    <h4>Your message:</h4>
                    <p className="summary-message">{message}</p>
                  </div>
                )}
              </div>
              <div className="trade-step-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Send Trade Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TradeModal

