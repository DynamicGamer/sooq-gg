import { useState } from 'react'
import { GAMES, gameImageUrl } from '../lib/supabase'

// Some source images are extra-wide banners or wordmarks that lose readable text when
// force-cropped to fill a squarer card — show the whole image (letterboxed by the
// gradient background) instead of cropping them.
const CONTAIN_SLUGS = new Set(['roblox', 'stealbrainrot', 'honorofkings', 'wow', 'overwatch2'])

// Per-slug crop anchor overrides for images whose subject isn't centered (e.g. a logo
// mark sitting in the lower half of a square icon).
const POSITION_OVERRIDES = { xboxgamepass: 'center 65%' }

// Renders a game's real cover photo when available, otherwise falls back to a colored
// gradient + the game's emoji icon — so newly-added games look intentional, not broken,
// until real artwork is dropped into public/games/{slug}.jpg.
export default function GameThumb({ game: gameProp, style, emojiSize = '32px', objectPosition = 'center', children }) {
  const [failed, setFailed] = useState(false)
  const game = typeof gameProp === 'string' ? GAMES.find(g => g.name === gameProp) : gameProp
  const src = game ? gameImageUrl(game) : null
  const showPhoto = src && !failed
  const fit = game?.slug && CONTAIN_SLUGS.has(game.slug) ? 'contain' : 'cover'
  const position = (game?.slug && POSITION_OVERRIDES[game.slug]) || objectPosition

  return (
    <div style={{
      position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(145deg, ${game?.color || '#333'}55, ${game?.color || '#333'}22)`,
      ...style,
    }}>
      {showPhoto && fit === 'contain' && (
        // Blurred, scaled-up copy fills the letterbox space instead of leaving flat bars
        // (same trick Spotify/Apple Music use for mismatched cover art aspect ratios).
        <img src={src} alt="" aria-hidden="true" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          filter: 'blur(14px) brightness(0.55)', transform: 'scale(1.2)',
        }} />
      )}
      {showPhoto && (
        <img src={src} alt={game?.name} style={{
          position: fit === 'contain' ? 'relative' : 'static',
          width: '100%', height: '100%', objectFit: fit, objectPosition: position,
        }} onError={() => setFailed(true)} />
      )}
      {!showPhoto && <span style={{ fontSize: emojiSize, lineHeight: 1 }}>{game?.img || '🎮'}</span>}
      {children}
    </div>
  )
}
