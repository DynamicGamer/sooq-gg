import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { supabase, GAMES } from '../lib/supabase'

const CATS = ['topups','accounts','currency','items','boosting','giftcards']

const GAME_ICON_SLUG = {
  'PUBG Mobile': 'pubg', 'Free Fire': 'freefire', 'Fortnite': 'fortnite', 'Clash of Clans': 'coc',
  'Mobile Legends': 'mlbb', 'Valorant': 'valorant', 'FIFA Mobile': 'fifa', 'Genshin Impact': 'genshin',
  'Call of Duty Mobile': 'codm', 'League of Legends': 'lol', 'Steam Wallet': 'steam', 'PlayStation': 'psn',
}

export default function Navbar() {
  const { t, toggle, isAr } = useLang()
  const { user, signOut } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [openCat, setOpenCat] = useState(null)
  const [menuSearch, setMenuSearch] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null)
  const closeTimer = useRef(null)

  const openMenu = (c) => { clearTimeout(closeTimer.current); setOpenCat(c); setMenuSearch('') }
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setOpenCat(null), 250) }

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const popularGames = GAMES.filter(g => g.hot)
  const visibleGames = menuSearch.trim()
    ? GAMES.filter(g => g.name.toLowerCase().includes(menuSearch.trim().toLowerCase()) || g.nameAr.includes(menuSearch.trim()))
    : GAMES

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'

  useEffect(() => {
    if (user) {
      const url = supabase.storage.from('avatars').getPublicUrl(user.id + '/avatar').data.publicUrl + '?t=' + Date.now()
      setAvatarUrl(url)
    }
  }, [user])

  const handleLogout = async () => { await signOut(); navigate('/') }

  return (
    <nav style={{ background: 'rgba(12,10,8,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,168,76,0.12)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '62px', position: 'sticky', top: 0, zIndex: 100, direction: isAr ? 'rtl' : 'ltr' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src="/logo.svg" alt="SooqGG" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
          <span style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#ffffff' }}>Sooq</span><span style={{ color: '#c9a84c' }}>GG</span>
          </span>
        </Link>

        <div className="hide-mobile" style={{ display: 'flex', height: '62px' }}>
          {CATS.map(c => (
            <div key={c} style={{ position: 'relative', height: '100%' }}
              onMouseEnter={() => openMenu(c)}
              onMouseLeave={scheduleClose}
            >
              <Link to={`/listings/${c}`} style={{
                display: 'flex', alignItems: 'center', height: '100%', padding: '0 12px',
                color: openCat === c ? '#c9a84c' : '#9a8570',
                background: openCat === c ? 'rgba(201,168,76,0.1)' : 'transparent',
                fontSize: '13px', fontWeight: '600', textDecoration: 'none', transition: 'all 0.15s',
              }}>
                {t.nav[c]}
              </Link>

              {openCat === c && (
                <div style={{ position: 'absolute', top: '62px', insetInlineStart: 0, width: '300px', background: 'rgba(15,12,8,0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '14px', padding: '14px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', zIndex: 200 }}>
                  <input
                    autoFocus
                    value={menuSearch}
                    onChange={e => setMenuSearch(e.target.value)}
                    placeholder={isAr ? 'ابحث عن لعبة...' : 'Search for game...'}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '12px', marginBottom: '12px' }}
                  />

                  {!menuSearch.trim() && popularGames.length > 0 && (
                    <>
                      <div style={{ fontSize: '10px', color: '#c9a84c', fontWeight: '800', letterSpacing: '1px', marginBottom: '8px' }}>
                        {isAr ? 'الألعاب الشائعة' : 'POPULAR GAMES'}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '12px' }}>
                        {popularGames.map(game => (
                          <Link key={game.id} to={`/listings/${c}?game=${game.id}`} onClick={() => setOpenCat(null)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '8px', textDecoration: 'none', color: '#d4c5a9' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.color = '#c9a84c' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4c5a9' }}
                          >
                            <img src={`/games/${GAME_ICON_SLUG[game.name]}.jpg`} alt={game.name} style={{ width: '24px', height: '24px', borderRadius: '5px', objectFit: 'cover', flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
                            <div style={{ fontSize: '12px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isAr ? game.nameAr : game.name}</div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}

                  <div style={{ fontSize: '10px', color: '#c9a84c', fontWeight: '800', letterSpacing: '1px', marginBottom: '8px', paddingTop: menuSearch.trim() ? 0 : '8px', borderTop: menuSearch.trim() ? 'none' : '1px solid rgba(201,168,76,0.1)' }}>
                    {isAr ? 'كل الألعاب' : 'ALL GAMES'}
                  </div>
                  <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {visibleGames.map(game => (
                      <Link key={game.id} to={`/listings/${c}?game=${game.id}`} onClick={() => setOpenCat(null)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 8px', borderRadius: '8px', textDecoration: 'none', color: '#d4c5a9' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.color = '#c9a84c' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4c5a9' }}
                      >
                        <img src={`/games/${GAME_ICON_SLUG[game.name]}.jpg`} alt={game.name} style={{ width: '26px', height: '26px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
                        <div style={{ fontSize: '13px', fontWeight: '600' }}>{isAr ? game.nameAr : game.name}</div>
                      </Link>
                    ))}
                    {visibleGames.length === 0 && (
                      <div style={{ fontSize: '12px', color: '#6b5a45', textAlign: 'center', padding: '12px 0' }}>{isAr ? 'لا توجد نتائج' : 'No games found'}</div>
                    )}
                  </div>

                  <Link to={`/listings/${c}`} onClick={() => setOpenCat(null)} style={{ display: 'block', textAlign: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(201,168,76,0.1)', fontSize: '12px', color: '#c9a84c', fontWeight: '700', textDecoration: 'none' }}>
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
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(201,168,76,0.4)', background: 'linear-gradient(135deg, #c9a84c, #a07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#0c0a08', fontWeight: '800', cursor: 'pointer' }}>
                {avatarUrl ? <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} /> : username?.[0]?.toUpperCase()}
              </div>
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