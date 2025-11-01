# 🎮 VideoGameLibrary

> **The ultimate platform for video game collectors!** Catalog your entire collection, connect with fellow enthusiasts, and turn your games into opportunities.

![Status](https://img.shields.io/badge/status-pre--mvp-yellow)
![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)

---

## 🌟 What is VideoGameLibrary?

VideoGameLibrary is a **social platform for video game collectors** that combines:

- 📚 **Collection Management** - Track all your games and consoles with detailed information
- 👥 **Social Features** - Browse collections, like profiles, follow collectors
- 💰 **Marketplace** - List items for sale or trade, discover rare finds
- 🔄 **Trading System** - Connect with collectors to swap games
- ⭐ **Wishlist** - Keep track of games you want
- 📊 **Analytics** - Track your collection value and statistics

Think **Discogs + Instagram for video games** with an integrated marketplace!

---

## ✨ Current Features

### ✅ Implemented

- 🎨 Beautiful, modern UI with glassmorphism effects
- 📱 Fully responsive design
- 🎮 Collection management (games & consoles)
- 🖼️ Auto-fetch game covers from Twitch API
- 👤 User profiles with detailed statistics
- 🔍 Explore other collectors' collections
- 🛒 Marketplace (browse items for sale/trade)
- 🔔 Activity feed
- ⭐ Wishlist functionality
- 📊 Export collection to Excel
- 🔄 Trade request UI (ready for backend)
- 💬 Social features (likes, follows structure)

### 🚧 Coming Soon (Phase 1)

- 🔐 User authentication (Google, Discord, Steam)
- 💾 Real database (replacing mock data)
- 💌 Trade request system with messaging
- ✅ Verified badge system
- ⭐ User ratings/reviews

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Twitch API credentials (for game images)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/MyVideoGameLibrary.git
cd MyVideoGameLibrary

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your Twitch API credentials to .env.local

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app!

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── GameCard.jsx
│   ├── ConsoleCard.jsx
│   ├── Navbar.jsx
│   └── TradeModal.jsx
├── pages/            # Page components
│   ├── Home.jsx
│   ├── MyCollection.jsx
│   ├── Profile.jsx
│   ├── Explore.jsx
│   ├── Marketplace.jsx
│   ├── Activity.jsx
│   └── Wishlist.jsx
├── data/             # Mock data (will be replaced with database)
│   ├── mockData.js
│   └── activityData.js
├── utils/            # Utility functions
│   ├── twitchAPI.js
│   └── exportToExcel.js
└── App.jsx           # Main app component
```

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_TWITCH_CLIENT_ID=your_client_id
VITE_TWITCH_CLIENT_SECRET=your_client_secret
```

For production (Vercel), add these in:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for detailed instructions.

---

## 📖 Documentation

- [ROADMAP.md](./ROADMAP.md) - Complete implementation roadmap
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Vercel deployment guide
- [TWITCH_CREDENTIALS.md](./TWITCH_CREDENTIALS.md) - Twitch API setup

---

## 🎯 Roadmap

### Phase 1: MVP Launch (0-3 months)
- User authentication
- Real database
- Trade request system
- Verified badges
- 100+ beta users

### Phase 2: Beta Growth (3-6 months)
- Gamification (XP, badges, levels)
- Premium features
- Enhanced marketplace
- Mobile app planning
- 1,000-2,000 users

### Phase 3: Public Launch (6-12 months)
- Mobile app (React Native)
- Barcode scanning
- AI image recognition
- 10,000+ users

See [ROADMAP.md](./ROADMAP.md) for full details.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **CSS3** - Styling with glassmorphism

### APIs & Services
- **Twitch API** - Game cover art and data
- **Vercel** - Hosting & deployment

### Future (Phase 1)
- **Supabase** or **Firebase** - Auth + Database
- **Stripe** - Payments (Phase 2)

---

## 🤝 Contributing

This is currently a personal project in MVP phase. Contributions welcome once we reach beta!

---

## 📝 License

This project is private. All rights reserved.

---

## 💬 Feedback & Support

For feedback or questions:
- Check [ROADMAP.md](./ROADMAP.md) for planned features
- Review [VERCEL_SETUP.md](./VERCEL_SETUP.md) for deployment issues

---

## 🎉 Acknowledgments

- Twitch API for game data
- Gaming community for inspiration
- All the collectors who will use this platform!

---

**Built with ❤️ for the gaming community**

