import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { GAMES } from '../lib/supabase'

const GAME_IMAGES = {
  'PUBG Mobile': '/games/pubg.jpg',
  'Free Fire': '/games/freefire.jpg',
  'Fortnite': '/games/fortnite.jpg',
  'Clash of Clans': '/games/coc.jpg',
  'Mobile Legends': '/games/mlbb.jpg',
  'Valorant': '/games/valorant.jpg',
  'FIFA Mobile': '/games/fifa.jpg',
  'Genshin Impact': '/games/genshin.jpg',
  'Call of Duty Mobile': '/games/codm.jpg',
  'League of Legends': '/games/lol.jpg',
  'Steam Wallet': '/games/steam.jpg',
  'PlayStation': '/games/psn.jpg',
}

const CATS = ['topups','accounts','currency','items','boosting','giftcards']

export default function Navbar() {
  const { t, toggle, isAr } = useLang()
  const { user, signOut } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [hoveredCat, setHoveredCat] = useState(null)

  const handleLogout = async () => { await signOut(); navigate('/') }

  return (
    <nav style={{ background: 'rgba(12,10,8,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,168,76,0.12)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '62px', position: 'sticky', top: 0, zIndex: 100, direction: isAr ? 'rtl' : 'ltr' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #c9a84c, #a07830)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', boxShadow: '0 4px 12px rgba(201,168,76,0.4)' }}>⚡</div>
          <span style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>
            {t.logo}<span style={{ color: '#c9a84c' }}>.gg</span>
          </span>
        </Link>

        <div className="hide-mobile" style={{ display: 'flex', gap: '2px' }}>
          {CATS.map(c => (
            <div key={c} style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredCat(c)}
              onMouseLeave={() => setHoveredCat(null)}
            >
              <Link to={`/listings/${c}`} style={{
                color: location.pathname === `/listings/${c}` ? '#c9a84c' : '#9a8570',
                padding: '5px 11px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                background: location.pathname === `/listings/${c}` ? 'rgba(201,168,76,0.1)' : 'transparent',
                transition: 'all 0.15s',
                textDecoration: 'none',
                display: 'block',
                height: '62px',
                lineHeight: '62px',
              }}>{t.nav[c]}</Link>

              {/* DROPDOWN */}
              {hoveredCat === c && (
                <div style={{
                  position: 'absolute',
                  top: '62px',
                  left: isAr ? 'auto' : '0',
                  right: isAr ? '0' : 'auto',
                  background: 'rgba(15,12,8,0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '14px',
                  padding: '16px',
                  minWidth: '220px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                  zIndex: 200,
                }}>
                  <div style={{ fontSize: '10px', color: '#c9a84c', fontWeight: '800', letterSpacing: '1px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                    {t.nav[c]?.toUpperCase()}
                  </div>
                  {GAMES.slice(0, 8).map(game => (
                    <Link key={game.id} to={`/listings/${c}?game=${game.id}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.15s', color: '#d4c5a9' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.color = '#c9a84c' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4c5a9' }}
                    >
                      <span style={{ fontSize: '18px' }}>{game.img}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600' }}>{isAr ? game.nameAr : game.name}</div>
                      </div>
                    </Link>
                  ))}
                  <Link to={`/listings/${c}`} style={{ display: 'block', textAlign: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(201,168,76,0.1)', fontSize: '12px', color: '#c9a84c', fontWeight: '700', textDecoration: 'none' }}>
                    {isAr ? 'عرض الكل ←' : 'View All →'}
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={toggle} style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
          🌐 {t.langToggle}
        </button>

        <Link to="/cart" style={{ position: 'relative', padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '20px' }}>🛒</span>
          {count > 0 && (
            <span style={{ position: 'absolute', top: '0', [isAr ? 'left' : 'right']: '0', background: 'linear-gradient(135deg, #c9a84c, #a07830)', color: '#0c0a08', width: '17px', height: '17px', borderRadius: '50%', fontSize: '9px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/orders" style={{ color: '#9a8570', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(201,168,76,0.12)', background: 'rgba(201,168,76,0.04)', textDecoration: 'none' }}>
              {isAr ? 'طلباتي' : 'Orders'}
            </Link>
            <Link to="/dashboard" style={{ color: '#c9a84c', padding: '6px 14px', fontSize: '13px', fontWeight: '700', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '8px', background: 'rgba(201,168,76,0.08)', textDecoration: 'none' }}>
              {t.nav.dashboard}
            </Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#9a8570', fontSize: '13px', cursor: 'pointer', padding: '6px' }}>
              {t.nav.logout}
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" style={{ color: '#d4c5a9', padding: '7px 16px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', background: 'transparent', textDecoration: 'none' }}>
              {t.nav.login}
            </Link>
            <Link to="/auth?mode=register" style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)', color: '#0c0a08', padding: '7px 16px', fontSize: '13px', fontWeight: '800', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(201,168,76,0.3)' }}>
              {t.nav.startSelling}
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}



