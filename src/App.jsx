import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MyCollection from './pages/MyCollection'
import Profile from './pages/Profile'
import Explore from './pages/Explore'
import Marketplace from './pages/Marketplace'
import Activity from './pages/Activity'
import Wishlist from './pages/Wishlist'
import Analytics from './pages/Analytics'
import AddGame from './pages/AddGame'
import AddConsole from './pages/AddConsole'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<MyCollection />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/add-game" element={<AddGame />} />
            <Route path="/add-console" element={<AddConsole />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
