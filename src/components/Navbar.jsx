import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎮 VideoGameLibrary
        </Link>
      <div className="navbar-links">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}
        >
          <span>🎯</span> Home
        </Link>
        <Link 
          to="/collection" 
          className={location.pathname === '/collection' ? 'active' : ''}
        >
          <span>🎮</span> My Collection
        </Link>
        <Link 
          to="/explore" 
          className={location.pathname === '/explore' ? 'active' : ''}
        >
          <span>🔎</span> Explore
        </Link>
        <Link 
          to="/marketplace" 
          className={location.pathname === '/marketplace' ? 'active' : ''}
        >
          <span>🛒</span> Marketplace
        </Link>
        <Link 
          to="/activity" 
          className={location.pathname === '/activity' ? 'active' : ''}
        >
          <span>🔔</span> Activity
        </Link>
        <Link 
          to="/wishlist" 
          className={location.pathname === '/wishlist' ? 'active' : ''}
        >
          <span>⭐</span> Wishlist
        </Link>
        <div className="navbar-dropdown">
          <button className="navbar-dropdown-btn">
            <span>➕</span> Add Item
          </button>
          <div className="navbar-dropdown-content">
            <Link to="/add-game">
              <span>🎮</span> Add Game
            </Link>
            <Link to="/add-console">
              <span>🕹️</span> Add Console
            </Link>
          </div>
        </div>
      </div>
      </div>
    </nav>
  )
}

export default Navbar

