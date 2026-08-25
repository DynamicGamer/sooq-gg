import { useState } from 'react'
import { GAMES, gameImageUrl } from '../lib/supabase'

// Renders a game's real cover photo when available, otherwise falls back to a colored
// gradient + the game's emoji icon — so newly-added games look intentional, not broken,
// until real artwork is dropped into public/games/{slug}.jpg.
export default function GameThumb({ game: gameProp, style, emojiSize = '32px', children }) {
  const [failed, setFailed] = useState(false)
  const game = typeof gameProp === 'string' ? GAMES.find(g => g.name === gameProp) : gameProp
  const src = game ? gameImageUrl(game) : null
  const showPhoto = src && !failed

  return (
    <div style={{
      position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(145deg, ${game?.color || '#333'}55, ${game?.color || '#333'}22)`,
      ...style,
    }}>
      {showPhoto && (
        <img src={src} alt={game?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setFailed(true)} />
      )}
      {!showPhoto && <span style={{ fontSize: emojiSize, lineHeight: 1 }}>{game?.img || '🎮'}</span>}
      {children}
    </div>
  )
}
