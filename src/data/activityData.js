// Activity Feed Data
// This simulates real-time activity from users

import { mockUsers } from './mockData'

export const generateActivity = () => {
  const activities = []
  // Use actual user IDs from mockData
  const users = mockUsers.map(u => ({ id: u.id, username: u.username }))
  const actions = [
    { type: 'added_game', icon: '🎮', verb: 'added', template: '{user} added {item} to their collection' },
    { type: 'added_console', icon: '🕹️', verb: 'added', template: '{user} added {item} to their collection' },
    { type: 'listed_sale', icon: '💰', verb: 'listed', template: '{user} listed {item} for sale' },
    { type: 'listed_trade', icon: '🔄', verb: 'listed', template: '{user} listed {item} for trade' },
    { type: 'liked_profile', icon: '❤️', verb: 'liked', template: '{user} liked {target}\'s profile' },
    { type: 'completed_trade', icon: '✅', verb: 'completed', template: '{user} completed a trade with {target}' },
    { type: 'found_rare', icon: '💎', verb: 'found', template: '{user} found a rare item: {item}' }
  ]

  const games = [
    'The Legend of Zelda: Breath of the Wild',
    'Elden Ring',
    'Super Mario Odyssey',
    'God of War Ragnarök',
    'Hades',
    'Horizon Forbidden West',
    'Stardew Valley',
    'Final Fantasy VII Remake'
  ]

  const consoles = ['PlayStation 5', 'Nintendo Switch', 'Xbox Series X']

  // Generate activities from last 24 hours
  const now = Date.now()
  for (let i = 0; i < 30; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)]
    const user = users[Math.floor(Math.random() * users.length)]
    const target = users[Math.floor(Math.random() * users.length)]
    
    let item = ''
    if (action.type === 'added_game' || action.type === 'listed_sale' || action.type === 'listed_trade') {
      item = games[Math.floor(Math.random() * games.length)]
    } else if (action.type === 'added_console') {
      item = consoles[Math.floor(Math.random() * consoles.length)]
    }

    const hoursAgo = Math.random() * 24
    const timestamp = new Date(now - hoursAgo * 60 * 60 * 1000)

    activities.push({
      id: `activity_${i}`,
      userId: user.id,
      username: user.username,
      type: action.type,
      icon: action.icon,
      action: action.verb,
      item: item || null,
      target: action.type === 'liked_profile' || action.type === 'completed_trade' ? target.username : null,
      timestamp: timestamp.toISOString(),
      timeAgo: getTimeAgo(timestamp)
    })
  }

  return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}

export const mockActivities = generateActivity()

