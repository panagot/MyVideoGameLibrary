// Twitch API Utilities
// IMPORTANT: Client Secret should NEVER be used directly in frontend code
// For production, create a backend API proxy to handle the secret securely

const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID || '86vlcsmj0e9q2xbwl088f97i4hnu6y'
const TWITCH_API_BASE = 'https://api.twitch.tv/helix'

// Cache for access tokens
let cachedToken = null
let tokenExpiry = null

/**
 * Get App Access Token using Client Credentials Grant
 * NOTE: This requires a backend proxy in production!
 * The Client Secret should NEVER be exposed in frontend code
 */
async function getAppAccessToken() {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken
  }

  try {
    // ⚠️ WARNING: In production, this should be done on a backend server!
    // The Client Secret should NEVER be in frontend code
    const clientSecret = import.meta.env.VITE_TWITCH_CLIENT_SECRET

    if (!clientSecret) {
      console.warn('Twitch Client Secret not found. API calls may be limited.')
      return null
    }

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`)
    }

    const data = await response.json()
    cachedToken = data.access_token
    // Set expiry 5 minutes before actual expiry for safety
    tokenExpiry = Date.now() + (data.expires_in - 300) * 1000

    return cachedToken
  } catch (error) {
    console.error('Error getting Twitch access token:', error)
    return null
  }
}

/**
 * Search for games on Twitch
 * @param {string} query - Game name to search for
 * @param {number} limit - Maximum number of results (default: 20)
 * @returns {Promise<Array>} Array of game objects
 */
export async function searchGames(query, limit = 20) {
  if (!query || query.trim().length < 2) {
    return []
  }

  try {
    const accessToken = await getAppAccessToken()

    if (!accessToken) {
      console.warn('No access token available. Using limited API access.')
      // Fallback: Some endpoints work without auth, but limited
      return []
    }

    const response = await fetch(
      `${TWITCH_API_BASE}/games?name=${encodeURIComponent(query)}&first=${limit}`,
      {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, clear cache and retry once
        cachedToken = null
        tokenExpiry = null
        return searchGames(query, limit)
      }
      throw new Error(`Twitch API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error searching games on Twitch:', error)
    return []
  }
}

/**
 * Get game details by ID
 * @param {string} gameId - Twitch game ID
 * @returns {Promise<Object|null>} Game object or null
 */
export async function getGameById(gameId) {
  if (!gameId) return null

  try {
    const accessToken = await getAppAccessToken()

    if (!accessToken) {
      return null
    }

    const response = await fetch(
      `${TWITCH_API_BASE}/games?id=${gameId}`,
      {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Twitch API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data && data.data.length > 0 ? data.data[0] : null
  } catch (error) {
    console.error('Error fetching game from Twitch:', error)
    return null
  }
}

/**
 * Search for games by name and get cover art URLs
 * Twitch doesn't provide cover art directly, but we can use IGDB API
 * For now, this returns basic game info
 */
export async function searchGamesWithCovers(query, limit = 20) {
  const games = await searchGames(query, limit)
  
  // Transform to match our game format
  return games.map(game => ({
    id: game.id,
    title: game.name,
    // Twitch API doesn't provide cover art directly
    // We'd need IGDB API for that (separate service)
    coverArt: null,
    twitchId: game.id,
    boxArtUrl: game.box_art_url ? game.box_art_url.replace('{width}x{height}', '500x700') : null
  }))
}

/**
 * Get popular games from Twitch
 */
export async function getPopularGames(limit = 20) {
  try {
    const accessToken = await getAppAccessToken()

    if (!accessToken) {
      return []
    }

    // Get top games (by viewership)
    const response = await fetch(
      `${TWITCH_API_BASE}/games/top?first=${limit}`,
      {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Twitch API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching popular games:', error)
    return []
  }
}

/**
 * Get game box art from Twitch API by game name
 * @param {string} gameName - Game title/name to search for
 * @returns {Promise<string|null>} Box art URL or null
 */
export async function getGameImageByName(gameName) {
  if (!gameName || gameName.trim().length < 2) {
    return null
  }

  try {
    const games = await searchGames(gameName, 5)
    
    if (games.length === 0) {
      return null
    }

    // Try to find exact match first
    const exactMatch = games.find(g => 
      g.name.toLowerCase() === gameName.toLowerCase()
    )
    
    const game = exactMatch || games[0]
    
    if (game.box_art_url) {
      // Return high quality box art (use larger size for better quality)
      return game.box_art_url.replace('{width}x{height}', '500x700')
    }
    
    return null
  } catch (error) {
    console.error(`Error fetching image for game "${gameName}":`, error)
    return null
  }
}

