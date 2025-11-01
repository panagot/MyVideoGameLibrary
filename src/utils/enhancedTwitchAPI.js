// Enhanced Twitch API utilities with additional game data fetching
// Note: Twitch API has limited metadata. For full details (publisher, developer, genre),
// you'd need IGDB API. This provides a fallback structure.

import { getGameById, searchGames, getAppAccessToken } from './twitchAPI'

/**
 * Get enhanced game details including metadata
 * Note: Twitch API doesn't provide publisher/developer/genre.
 * This is a placeholder structure. For production, integrate IGDB API.
 */
export async function getEnhancedGameDetails(gameName) {
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
    
    // Enhanced structure - in production, fetch from IGDB API
    const enhanced = {
      twitchId: game.id,
      name: game.name,
      boxArtUrl: game.box_art_url ? game.box_art_url.replace('{width}x{height}', '500x700') : null,
      // These would come from IGDB API in production:
      publisher: null, // Would fetch from IGDB
      developer: null, // Would fetch from IGDB
      genre: [], // Would fetch from IGDB
      releaseDate: null, // Would fetch from IGDB
      // For now, return basic Twitch data
    }

    return enhanced
  } catch (error) {
    console.error(`Error fetching enhanced details for "${gameName}":`, error)
    return null
  }
}

/**
 * Attempt to infer genre from game name (simple fallback)
 * In production, use IGDB API for accurate data
 */
export function inferGenreFromName(gameName) {
  const name = gameName.toLowerCase()
  const genres = []

  // Simple keyword matching (fallback only)
  if (name.includes('racing') || name.includes('need for speed') || name.includes('gran turismo')) {
    genres.push('Racing')
  }
  if (name.includes('shooter') || name.includes('call of duty') || name.includes('battlefield')) {
    genres.push('Shooter')
  }
  if (name.includes('adventure') || name.includes('zelda') || name.includes('uncharted')) {
    genres.push('Adventure')
  }
  if (name.includes('rpg') || name.includes('role') || name.includes('final fantasy') || name.includes('elder scrolls')) {
    genres.push('RPG')
  }
  if (name.includes('platformer') || name.includes('mario') || name.includes('sonic')) {
    genres.push('Platformer')
  }
  if (name.includes('sports') || name.includes('fifa') || name.includes('madden')) {
    genres.push('Sports')
  }
  if (name.includes('strategy') || name.includes('civilization') || name.includes('xcom')) {
    genres.push('Strategy')
  }
  if (name.includes('fighting') || name.includes('street fighter') || name.includes('mortal kombat')) {
    genres.push('Fighting')
  }
  if (name.includes('puzzle') || name.includes('tetris') || name.includes('portal')) {
    genres.push('Puzzle')
  }
  if (name.includes('horror') || name.includes('resident evil') || name.includes('silent hill')) {
    genres.push('Horror')
  }

  return genres.length > 0 ? genres : ['Action'] // Default to Action if no match
}

/**
 * Get popular games with enhanced details
 */
export async function getPopularGamesEnhanced(limit = 20) {
  try {
    const accessToken = await getAppAccessToken()
    if (!accessToken) return []

    const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID || '86vlcsmj0e9q2xbwl088f97i4hnu6y'
    const TWITCH_API_BASE = 'https://api.twitch.tv/helix'

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
    return (data.data || []).map(game => ({
      id: game.id,
      name: game.name,
      boxArtUrl: game.box_art_url ? game.box_art_url.replace('{width}x{height}', '500x700') : null,
      twitchId: game.id,
      // Infer genre as fallback
      genre: inferGenreFromName(game.name),
    }))
  } catch (error) {
    console.error('Error fetching popular games:', error)
    return []
  }
}

