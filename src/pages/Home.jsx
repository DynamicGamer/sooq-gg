import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { GAMES, LISTINGS } from '../lib/supabase'

// Using wsrv.nl as image proxy — works cross-origin everywhere
const img = (url) => `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=300&h=200&fit=cover&output=webp`

const GAME_IMAGES = {
  'PUBG Mobile':         img('https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg'),
  'Free Fire':           img('https://play-lh.googleusercontent.com/HIUapBg9JYMIWBbNaFRHNlS0aqAN8l-TM7XQtGl5y7_1PqPVAqzKRZ7dYP8ZjcHHdg'),
  'Fortnite':            img('https://cdn2.unrealengine.com/social-image-chapter4-s3-3840x2160-d35912cc25ad.jpg'),
  'Clash of Clans':      img('https://play-lh.googleusercontent.com/LByrur1mTCfaIdCcJCTXdMU0P5-O3HMo5rSGPDl2z5h7dBdZ6xhzUl2q5V77bWL0Yg'),
  'Mobile Legends':      img('https://play-lh.googleusercontent.com/qd2ooAWo_Liz6MicFxbH4VaCCqJOLJQmJXqRQXHiNFQmGPJhU7EvELxXn9kefW-Rea4'),
  'Valorant':            img('https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/66bf2fdd14f7fcad41487eca45d6ba3db89fd0b8-1920x1080.jpg'),
  'FIFA Mobile':         img('https://play-lh.googleusercontent.com/zQwHQZ4rjgUK52JTcU6APLZrFxBNcCzC1l7nLovf6JhS4EJZPUHwUaIEDKhV9rOMp80'),
  'Genshin Impact':      img('https://play-lh.googleusercontent.com/N-E_5XcmHv47v9c4DMnFWH1g8Y44UFaIgVpkiScGCqFnX8LIaW6vVFbPMlM9USulWA'),
  'Call of Duty Mobile': img('https://play-lh.googleusercontent.com/ikP5VGPKkqKBiSHlpfLJF8rCxIHPFsB3CjvzqYZEfhZ8VVlq0W_7QYHSWrIz7y9R_aJ'),
  'League of Legends':   img('https://cdn.cloudflare.steamstatic.com/steam/apps/2801580/header.jpg'),
  'Steam Wallet':        img('https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg'),
  'PlayStation':         img('https://upload.wikimedia.org/wikipedia/commons/4/4e/Playstation_logo_colour.svg'),
}

export default function Home() {
  const { t, isAr } = useLang()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('topups')

  const cats = [
    { id: 'topups',    label: t.nav.topups,    icon: '⚡' },
    { id: 'accounts',  label: t.nav.accounts,  icon: '🎮' },
    { id: 'currency',  label: t.nav.currency,  icon: '💰' },
    { id: 'items',     label: t.nav.items,     icon: '⚔️' },
    { id: 'boosting',  label: t.nav.boosting,  icon: '🚀' },
    { id: 'giftcards', label: t.nav.giftcards, icon: '🎁' },
  ]

  const filteredGames = GAMES.filter(g =>
    !search ||
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.nameAr.includes(search)
  )

  const getBadge = (key) => key === 'trusted' ? t.trusted : key === 'vip' ? t.vipSeller : null

  // Game colors for CSS gradient backgrounds
  const GAME_GRADIENTS = {
    'PUBG Mobile':         ['#f59e0b', '#92400e'],
    'Free Fire':           ['#10b981', '#065f46'],
    'Fortnite':            ['#6366f1', '#312e81'],
    'Clash of Clans':      ['#f97316', '#9a3412'],
    'Mobile Legends':      ['#8b5cf6', '#4c1d95'],
    'Valorant':            ['#ef4444', '#7f1d1d'],
    'FIFA Mobile':         ['#3b82f6', '#1e3a8a'],
    'Genshin Impact':      ['#06b6d4', '#164e63'],
    'Call of Duty Mobile': ['#84cc16', '#3f6212'],
    'League of Legends':   ['#c084fc', '#581c87'],
    'Steam Wallet':        ['#64748b', '#1e293b'],
    'PlayStation':         ['#1d4ed8', '#1e3a8a'],
  }

  return (
    <div style={{ background: '#08090f', fontFamily: isAr ? "'Cairo', sans-serif" : "'Rajdhani', 'Cairo', sans-serif" }}>

      {/* ═══════════ HERO ═══════════ */}
      <div style={{
        position: 'relative',
        minHeight: '580px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px 80px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* CSS-only animated background — no external images needed */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* Base dark */}
          <div style={{ position: 'absolute', inset: 0, background: '#08090f' }} />
          {/* Grid of colored panels simulating game covers */}
          <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', opacity: 0.4 }}>
            {[
              'linear-gradient(160deg, #f59e0b44, #92400e88)',
              'linear-gradient(160deg, #10b98144, #06564488)',
              'linear-gradient(160deg, #6366f144, #312e8188)',
              'linear-gradient(160deg, #ef444444, #7f1d1d88)',
              'linear-gradient(160deg, #8b5cf644, #4c1d9588)',
              'linear-gradient(160deg, #3b82f644, #1e3a8a88)',
            ].map((bg, i) => (
              <div key={i} style={{ background: bg, borderRight: '1px solid rgba(255,255,255,0.04)' }} />
            ))}
          </div>
          {/* Noise texture overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")', opacity: 0.4 }} />
          {/* Strong vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,9,15,0.6) 0%, rgba(8,9,15,0.1) 30%, rgba(8,9,15,0.2) 60%, rgba(8,9,15,1) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,9,15,0.8) 0%, transparent 15%, transparent 85%, rgba(8,9,15,0.8) 100%)' }} />
          {/* Purple center glow */}
          <div style={{ position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '600px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0.1) 40%, transparent 70%)', pointerEvents: 'none' }} />
          {/* Pink side glow */}
          <div style={{ position: 'absolute', top: '20%', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '10%', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        </div>

        {/* HERO CONTENT */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.45)', borderRadius: '100px', padding: '6px 20px', fontSize: '13px', color: '#c4b5fd', marginBottom: '28px', fontWeight: '600' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
            {isAr ? 'السوق الرقمي الأول للألعاب في المنطقة العربية' : '#1 Arabic Gaming Marketplace in MENA'}
          </div>

          <h1 style={{ fontSize: 'clamp(44px, 8vw, 90px)', fontWeight: '700', color: '#fff', lineHeight: '1.0', margin: '0 auto 22px', letterSpacing: isAr ? '0' : '-1px', fontFamily: isAr ? "'Cairo', sans-serif" : "'Rajdhani', sans-serif", textShadow: '0 2px 40px rgba(0,0,0,0.8)' }}>
            {isAr ? (
              <>اشتري وبع{' '}
                <span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>أي شيء</span>
                {' '}في الألعاب
              </>
            ) : (
              <>BUY & SELL{' '}
                <span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ANYTHING</span>
                {' '}IN GAMING
              </>
            )}
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '540px', margin: '0 auto 44px', lineHeight: '1.7' }}>
            {isAr
              ? 'شحن رصيد، حسابات، آيتمز، وبوستنق — مع حماية كاملة بنظام الضمان'
              : 'Top-ups, accounts, items & boosting — with full escrow buyer protection'}
          </p>

          {/* Search */}
          <div style={{ maxWidth: '640px', margin: '0 auto 20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '18px', display: 'flex', alignItems: 'center', padding: '7px 7px 7px 22px', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '18px', opacity: '0.5', flexShrink: 0, marginRight: '10px' }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && navigate(`/listings/topups?q=${search}`)}
                placeholder={isAr ? 'ابحث عن لعبة... PUBG، Free Fire، Valorant' : 'Search for a game... PUBG, Free Fire, Valorant'}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '16px', padding: '10px 0', fontFamily: 'inherit' }}
              />
              <button onClick={() => navigate(`/listings/topups?q=${search}`)}
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '13px', color: '#fff', padding: '14px 32px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(124,58,237,0.55)', flexShrink: 0 }}>
                {isAr ? 'بحث' : 'Search'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['PUBG Mobile', 'Free Fire', 'Valorant', 'Mobile Legends', 'Fortnite'].map(g => (
                <button key={g} onClick={() => navigate(`/listings/topups?q=${g}`)}
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px', padding: '5px 16px', fontSize: '13px', color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)'; e.currentTarget.style.background = 'rgba(124,58,237,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                >{g}</button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '640px', margin: '28px auto 0', background: 'rgba(0,0,0,0.35)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', overflow: 'hidden' }}>
            {[
              { value: '240K+', label: isAr ? 'صفقة مكتملة' : 'Deals Done', color: '#a78bfa' },
              { value: '8K+',   label: isAr ? 'بائع موثوق' : 'Trusted Sellers', color: '#34d399' },
              { value: '120+',  label: isAr ? 'لعبة' : 'Games', color: '#60a5fa' },
              { value: '22',    label: isAr ? 'دولة' : 'Countries', color: '#f472b6' },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: '1', minWidth: '100px', padding: '20px 8px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: s.color, fontFamily: isAr ? "'Cairo'" : "'Rajdhani'", lineHeight: '1', marginBottom: '5px' }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST BAR ── */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 24px', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
        {[
          { icon: '🛡️', text: isAr ? 'ضمان استرداد الأموال' : 'Money-back guarantee' },
          { icon: '⚡', text: isAr ? 'تسليم فوري' : 'Instant delivery' },
          { icon: '💎', text: isAr ? 'بائعون موثقون' : 'Verified sellers' },
          { icon: '🔒', text: isAr ? 'دفع آمن بالكريبتو' : 'Secure crypto escrow' },
        ].map(b => (
          <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
            <span style={{ fontSize: '16px' }}>{b.icon}</span><span>{b.text}</span>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 20px' }}>

        {/* ── CATEGORY TABS ── */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '44px', overflowX: 'auto', paddingBottom: '4px' }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
              background: activeCat === c.id ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeCat === c.id ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
              color: activeCat === c.id ? '#fff' : '#94a3b8',
              padding: '12px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: '700',
              whiteSpace: 'nowrap', transition: 'all 0.2s', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: activeCat === c.id ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
            }}>{c.icon} {c.label}</button>
          ))}
        </div>

        {/* ── GAMES GRID ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'", margin: 0 }}>
            {isAr ? '🎮 الألعاب الشائعة' : '🎮 POPULAR GAMES'}
          </h2>
          <Link to="/listings/topups" style={{ fontSize: '14px', color: '#7c3aed', fontWeight: '700', textDecoration: 'none' }}>
            {isAr ? 'عرض الكل ←' : 'View All →'}
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px', marginBottom: '56px' }}>
          {filteredGames.map(game => {
            const [c1, c2] = GAME_GRADIENTS[game.name] || ['#7c3aed', '#4f46e5']
            return (
              <Link key={game.id} to={`/listings/topups?game=${game.id}`} style={{
                display: 'block', borderRadius: '16px', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.07)', background: '#0d0e1a',
                transition: 'all 0.25s', textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = c1 + 'aa'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px ${c1}55` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Real game image */}
                <div style={{ height: '120px', position: 'relative', overflow: 'hidden', background: `linear-gradient(145deg, ${c1}55, ${c2}88)` }}>
                  <img
                    src={GAME_IMAGES[game.name]}
                    alt={game.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,14,26,0.95) 0%, transparent 60%)' }} />
                  {game.hot && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', borderRadius: '6px', fontSize: '9px', color: '#fff', padding: '3px 9px', fontWeight: '800', letterSpacing: '1px', boxShadow: '0 2px 8px rgba(239,68,68,0.6)' }}>HOT</div>
                  )}
                </div>

                <div style={{ padding: '12px 14px 16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '8px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>
                    {isAr ? game.nameAr : game.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '11px', color: c1, background: `${c1}18`, border: `1px solid ${c1}40`, borderRadius: '5px', padding: '2px 8px', fontWeight: '600' }}>
                      {isAr ? game.tagAr : game.tagEn}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 4px #10b981' }} />
                      {game.sellers} {isAr ? 'بائع' : ''}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* ── BEST DEALS ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'", margin: 0 }}>
            {isAr ? '⚡ أفضل العروض الآن' : '⚡ BEST DEALS RIGHT NOW'}
          </h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(isAr ? ['الأرخص', 'الأعلى تقييماً', 'الأكثر مبيعاً'] : ['Cheapest', 'Top Rated', 'Best Selling']).map(f => (
              <button key={f} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '56px' }}>
          {LISTINGS.map(l => {
            const badge = getBadge(l.badgeKey)
            const delivery = l.deliveryKey === 'instant' ? (isAr ? 'فوري' : 'Instant') : (isAr ? 'دقائق' : 'Minutes')
            const game = GAMES.find(g => g.name === l.game)
            const [gc1] = GAME_GRADIENTS[l.game] || ['#7c3aed', '#4f46e5']
            return (
              <div key={l.id}
                style={{ background: '#0d0e1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => navigate(`/listing/${l.id}`)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.45)'; e.currentTarget.style.background = '#10111f'; e.currentTarget.style.transform = 'translateX(3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#0d0e1a'; e.currentTarget.style.transform = 'translateX(0)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '180px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `linear-gradient(135deg, ${gc1}44, ${gc1}22)`, border: `1px solid ${gc1}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
                    {game?.img || '🎮'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '17px', color: '#fff', marginBottom: '3px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>
                      {isAr ? l.typeAr : l.typeEn}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{l.game}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '160px' }}>
                  <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: '#fff', fontWeight: '800', flexShrink: 0 }}>
                    {(isAr ? l.seller : l.sellerEn)[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: '700' }}>{isAr ? l.seller : l.sellerEn}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>⭐ {l.rating} · {l.sales.toLocaleString()} {isAr ? 'صفقة' : 'deals'}</div>
                  </div>
                  {badge && (
                    <div style={{ background: l.badgeKey === 'vip' ? 'rgba(124,58,237,0.15)' : 'rgba(16,185,129,0.12)', border: `1px solid ${l.badgeKey === 'vip' ? 'rgba(124,58,237,0.4)' : 'rgba(16,185,129,0.3)'}`, borderRadius: '6px', fontSize: '10px', color: l.badgeKey === 'vip' ? '#a78bfa' : '#34d399', padding: '2px 8px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                      {badge}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                    <div style={{ fontSize: '26px', fontWeight: '700', color: '#fff', lineHeight: '1', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>${l.price}</div>
                    <div style={{ fontSize: '11px', color: '#10b981', marginTop: '3px', fontWeight: '600' }}>⚡ {delivery}</div>
                  </div>
                  <button
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', color: '#fff', padding: '12px 22px', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', whiteSpace: 'nowrap', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(124,58,237,0.4)', transition: 'all 0.2s' }}
                    onClick={e => { e.stopPropagation(); addItem({ ...l, name: isAr ? l.typeAr : l.typeEn }) }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(124,58,237,0.6)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.4)' }}
                  >
                    {isAr ? 'شراء الآن' : 'Buy Now'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── HOW IT WORKS ── */}
        <div style={{ background: '#0d0e1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '52px 40px', marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '34px', fontWeight: '700', color: '#fff', marginBottom: '10px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'", margin: '0 0 10px' }}>
            {isAr ? 'كيف يعمل سوق.gg؟' : 'HOW SOOQ.GG WORKS'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '44px' }}>
            {isAr ? 'آمن، سريع، وسهل' : 'Safe, fast, and simple'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '28px' }}>
            {(isAr ? [
              { n: '١', title: 'اختر ما تريد', desc: 'ابحث من مئات الخيارات', icon: '🔍', color: '#7c3aed' },
              { n: '٢', title: 'اختر البائع', desc: 'قارن الأسعار والتقييمات', icon: '👤', color: '#ec4899' },
              { n: '٣', title: 'ادفع بأمان', desc: 'مبلغك محفوظ حتى تستلم', icon: '🛡️', color: '#3b82f6' },
              { n: '٤', title: 'استلم فوراً', desc: 'أغلب الطلبات في دقائق', icon: '⚡', color: '#10b981' },
            ] : [
              { n: '01', title: 'Choose', desc: 'Browse hundreds of listings', icon: '🔍', color: '#7c3aed' },
              { n: '02', title: 'Pick a Seller', desc: 'Compare prices & ratings', icon: '👤', color: '#ec4899' },
              { n: '03', title: 'Pay Safely', desc: 'Funds held in escrow', icon: '🛡️', color: '#3b82f6' },
              { n: '04', title: 'Receive', desc: 'Most orders in minutes', icon: '⚡', color: '#10b981' },
            ]).map(s => (
              <div key={s.n}>
                <div style={{ width: '70px', height: '70px', background: `${s.color}18`, border: `1px solid ${s.color}40`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 18px', boxShadow: `0 8px 28px ${s.color}25` }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: isAr ? '15px' : '24px', fontWeight: '700', color: s.color, marginBottom: '6px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'", letterSpacing: isAr ? '0' : '1px' }}>{s.n}</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '7px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SELLER CTA ── */}
        <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #1a0d33 0%, #0d1a30 100%)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: '24px', padding: '52px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '28px' }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '25%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <h3 style={{ fontSize: '34px', fontWeight: '700', color: '#fff', margin: '0 0 12px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>
              {isAr ? '💰 ابدأ البيع على سوق.gg' : '💰 START SELLING ON SOOQ.GG'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0, maxWidth: '440px', lineHeight: '1.7' }}>
              {isAr
                ? 'انضم لآلاف البائعين وابدأ كسب المال — مجاني تماماً بدون رسوم مسبقة'
                : 'Join thousands of sellers and earn real money — free to start, no upfront fees'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', position: 'relative' }}>
            <button style={{ background: 'transparent', border: '1px solid rgba(124,58,237,0.5)', color: '#a78bfa', padding: '15px 30px', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', fontFamily: 'inherit' }}>
              {isAr ? 'اعرف أكثر' : 'Learn More'}
            </button>
            <Link to="/auth?mode=register" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', padding: '15px 30px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 24px rgba(124,58,237,0.5)', fontFamily: 'inherit' }}>
              {isAr ? 'سجّل كبائع ←' : 'Register as Seller →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const GAME_GRADIENTS = {
  'PUBG Mobile':         ['#f59e0b', '#92400e'],
  'Free Fire':           ['#10b981', '#065f46'],
  'Fortnite':            ['#6366f1', '#312e81'],
  'Clash of Clans':      ['#f97316', '#9a3412'],
  'Mobile Legends':      ['#8b5cf6', '#4c1d95'],
  'Valorant':            ['#ef4444', '#7f1d1d'],
  'FIFA Mobile':         ['#3b82f6', '#1e3a8a'],
  'Genshin Impact':      ['#06b6d4', '#164e63'],
  'Call of Duty Mobile': ['#84cc16', '#3f6212'],
  'League of Legends':   ['#c084fc', '#581c87'],
  'Steam Wallet':        ['#64748b', '#1e293b'],
  'PlayStation':         ['#1d4ed8', '#1e3a8a'],
}
