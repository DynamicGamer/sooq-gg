import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { GAMES, LISTINGS } from '../lib/supabase'

const GAME_COVERS = {
  'PUBG Mobile':          'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg',
  'Free Fire':            'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Free_Fire_Logo.png/250px-Free_Fire_Logo.png',
  'Fortnite':             'https://cdn2.unrealengine.com/fortnite-og-1920x1080-1920x1080-8ccf9e96c7fc.jpg',
  'Clash of Clans':       'https://upload.wikimedia.org/wikipedia/en/thumb/2/20/Clash_of_Clans_2012_Logo.png/220px-Clash_of_Clans_2012_Logo.png',
  'Mobile Legends':       'https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/Mobile_Legends_Bang_Bang.png/220px-Mobile_Legends_Bang_Bang.png',
  'Valorant':             'https://cdn.cloudflare.steamstatic.com/steam/apps/2694490/header.jpg',
  'FIFA Mobile':          'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/FIFA_Mobile_cover.jpg/220px-FIFA_Mobile_cover.jpg',
  'Genshin Impact':       'https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Genshin_Impact_cover.jpg/220px-Genshin_Impact_cover.jpg',
  'Call of Duty Mobile':  'https://upload.wikimedia.org/wikipedia/en/thumb/1/19/Call_of_Duty_Mobile_cover_art.png/220px-Call_of_Duty_Mobile_cover_art.png',
  'League of Legends':    'https://cdn.cloudflare.steamstatic.com/steam/apps/2801580/header.jpg',
  'Steam Wallet':         'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/240px-Steam_icon_logo.svg.png',
  'PlayStation':          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Playstation_logo_colour.svg/240px-Playstation_logo_colour.svg.png',
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

  return (
    <div style={{ background: '#080910', fontFamily: isAr ? "'Cairo', sans-serif" : "'Rajdhani', 'Cairo', sans-serif" }}>

      {/* ── HERO ── */}
      <div style={{
        position: 'relative',
        minHeight: '520px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 60px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Background image collage */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', height: '100%', opacity: 0.15 }}>
            {['PUBG Mobile','Free Fire','Fortnite','Valorant'].map(name => (
              <div key={name} style={{ backgroundImage: `url(${GAME_COVERS[name]})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(2px)' }} />
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,9,16,0.7) 0%, rgba(8,9,16,0.5) 40%, rgba(8,9,16,0.95) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 65%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.5)', borderRadius: '100px', padding: '6px 20px', fontSize: '13px', color: '#c4b5fd', marginBottom: '28px', fontWeight: '600', letterSpacing: '0.5px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
            {isAr ? 'السوق الرقمي الأول للألعاب في المنطقة العربية' : '#1 Arabic Gaming Marketplace in MENA'}
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: '700', color: '#fff', lineHeight: '1.05', maxWidth: '850px', margin: '0 auto 20px', letterSpacing: isAr ? '0' : '-1px', fontFamily: isAr ? "'Cairo', sans-serif" : "'Rajdhani', sans-serif" }}>
            {isAr ? (
              <>
                اشتري وبع{' '}
                <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>أي شيء</span>
                {' '}في الألعاب
              </>
            ) : (
              <>
                BUY & SELL{' '}
                <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ANYTHING</span>
                {' '}IN GAMING
              </>
            )}
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '520px', margin: '0 auto 40px', lineHeight: '1.7' }}>
            {isAr
              ? 'شحن رصيد، حسابات، آيتمز، وبوستنق — مع حماية كاملة بنظام الضمان'
              : 'Top-ups, accounts, items & boosting — with full escrow protection'}
          </p>

          {/* Search bar */}
          <div style={{ maxWidth: '600px', margin: '0 auto 20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', display: 'flex', alignItems: 'center', padding: '6px 6px 6px 20px', backdropFilter: 'blur(20px)' }}>
              <span style={{ fontSize: '18px', marginRight: '10px', opacity: '0.5', flexShrink: 0 }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && navigate(`/listings/topups?q=${search}`)}
                placeholder={isAr ? 'ابحث عن لعبة...' : 'Search for a game...'}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '16px', padding: '8px 0', fontFamily: 'inherit' }}
              />
              <button onClick={() => navigate(`/listings/topups?q=${search}`)}
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '12px', color: '#fff', padding: '13px 28px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
                {isAr ? 'بحث' : 'Search'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['PUBG Mobile', 'Free Fire', 'Valorant', 'Mobile Legends', 'Fortnite'].map(g => (
                <button key={g} onClick={() => navigate(`/listings/topups?q=${g}`)}
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px', padding: '4px 14px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0', flexWrap: 'wrap', maxWidth: '640px', margin: '24px auto 0' }}>
            {[
              { value: '240K+', label: isAr ? 'صفقة مكتملة' : 'Deals Done' },
              { value: '8K+',   label: isAr ? 'بائع موثوق' : 'Trusted Sellers' },
              { value: '120+',  label: isAr ? 'لعبة' : 'Games' },
              { value: '22',    label: isAr ? 'دولة' : 'Countries' },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: '1', minWidth: '100px', padding: '12px 8px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST BAR ── */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 24px', display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        {[
          { icon: '🛡️', text: isAr ? 'ضمان استرداد الأموال' : 'Money-back guarantee' },
          { icon: '⚡', text: isAr ? 'تسليم فوري' : 'Instant delivery' },
          { icon: '💎', text: isAr ? 'بائعون موثقون' : 'Verified sellers' },
          { icon: '🔒', text: isAr ? 'دفع آمن بالكريبتو' : 'Secure crypto payment' },
        ].map(b => (
          <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
            <span>{b.icon}</span><span>{b.text}</span>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

        {/* ── CATEGORY TABS ── */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '4px' }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
              background: activeCat === c.id ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeCat === c.id ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
              color: activeCat === c.id ? '#fff' : '#94a3b8',
              padding: '10px 22px', borderRadius: '12px',
              fontSize: '15px', fontWeight: '700',
              whiteSpace: 'nowrap', transition: 'all 0.2s', cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: activeCat === c.id ? '0 4px 20px rgba(124,58,237,0.35)' : 'none',
            }}>{c.icon} {c.label}</button>
          ))}
        </div>

        {/* ── GAMES GRID ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>
            {isAr ? '🎮 الألعاب الشائعة' : '🎮 POPULAR GAMES'}
          </h2>
          <Link to="/listings/topups" style={{ fontSize: '14px', color: '#7c3aed', fontWeight: '700', textDecoration: 'none' }}>
            {isAr ? 'عرض الكل ←' : 'View All →'}
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '14px', marginBottom: '52px' }}>
          {filteredGames.map(game => (
            <Link key={game.id} to={`/listings/topups?game=${game.id}`} style={{
              display: 'block', borderRadius: '16px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.07)',
              transition: 'all 0.25s', textDecoration: 'none',
              background: '#0f1018',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = `${game.color}80`; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${game.color}40` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {/* Game image */}
              <div style={{ height: '110px', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${game.color}33, #0f1018)` }}>
                <img
                  src={GAME_COVERS[game.name]}
                  alt={game.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.85 }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,16,24,1) 0%, rgba(15,16,24,0) 60%)' }} />
                {game.hot && (
                  <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', borderRadius: '6px', fontSize: '9px', color: '#fff', padding: '2px 8px', fontWeight: '800', letterSpacing: '1px' }}>HOT</div>
                )}
              </div>

              <div style={{ padding: '10px 14px 14px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '5px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>
                  {isAr ? game.nameAr : game.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '11px', color: game.color, background: `${game.color}18`, border: `1px solid ${game.color}35`, borderRadius: '5px', padding: '2px 7px' }}>
                    {isAr ? game.tagAr : game.tagEn}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    {game.sellers}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── BEST DEALS ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>
            {isAr ? '⚡ أفضل العروض الآن' : '⚡ BEST DEALS RIGHT NOW'}
          </h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(isAr ? ['الأرخص', 'الأعلى تقييماً', 'الأكثر مبيعاً'] : ['Cheapest', 'Top Rated', 'Best Selling']).map(f => (
              <button key={f} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '52px' }}>
          {LISTINGS.map(l => {
            const badge = getBadge(l.badgeKey)
            const delivery = l.deliveryKey === 'instant' ? (isAr ? 'فوري' : 'Instant') : (isAr ? 'دقائق' : 'Minutes')
            const game = GAMES.find(g => g.name === l.game)
            return (
              <div key={l.id}
                style={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => navigate(`/listing/${l.id}`)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.background = '#131525' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#0f1018' }}
              >
                {/* Game image + name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '180px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${game?.color || '#7c3aed'}40`, flexShrink: 0, background: `${game?.color || '#7c3aed'}22` }}>
                    <img src={GAME_COVERS[l.game]} alt={l.game} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#fff', marginBottom: '3px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>
                      {isAr ? l.typeAr : l.typeEn}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{l.game}</div>
                  </div>
                </div>

                {/* Seller info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '160px' }}>
                  <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff', fontWeight: '800', flexShrink: 0 }}>
                    {(isAr ? l.seller : l.sellerEn)[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: '700' }}>{isAr ? l.seller : l.sellerEn}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>⭐ {l.rating} · {l.sales.toLocaleString()} {isAr ? 'صفقة' : 'deals'}</div>
                  </div>
                  {badge && (
                    <div style={{ background: l.badgeKey === 'vip' ? 'rgba(124,58,237,0.15)' : 'rgba(16,185,129,0.12)', border: `1px solid ${l.badgeKey === 'vip' ? 'rgba(124,58,237,0.4)' : 'rgba(16,185,129,0.3)'}`, borderRadius: '6px', fontSize: '10px', color: l.badgeKey === 'vip' ? '#a78bfa' : '#34d399', padding: '2px 8px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                      {badge}
                    </div>
                  )}
                </div>

                {/* Price + buy */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff', lineHeight: '1', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>${l.price}</div>
                    <div style={{ fontSize: '11px', color: '#10b981', marginTop: '3px', fontWeight: '600' }}>⚡ {delivery}</div>
                  </div>
                  <button
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', color: '#fff', padding: '11px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(124,58,237,0.35)', transition: 'all 0.2s' }}
                    onClick={e => { e.stopPropagation(); addItem({ ...l, name: isAr ? l.typeAr : l.typeEn }) }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {isAr ? 'شراء الآن' : 'Buy Now'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── HOW IT WORKS ── */}
        <div style={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '48px 40px', marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '8px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>
            {isAr ? 'كيف يعمل سوق.gg؟' : 'HOW SOOQ.GG WORKS'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '40px' }}>
            {isAr ? 'آمن، سريع، وسهل — للمشتري والبائع' : 'Safe, fast, and simple — for buyers and sellers'}
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
                <div style={{ width: '64px', height: '64px', background: `${s.color}18`, border: `1px solid ${s.color}40`, borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', boxShadow: `0 8px 24px ${s.color}20` }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: isAr ? '14px' : '22px', fontWeight: '700', color: s.color, marginBottom: '6px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'", letterSpacing: isAr ? '0' : '1px' }}>{s.n}</div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '6px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SELLER CTA ── */}
        <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #1a0d33 0%, #0d1a30 100%)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '24px', padding: '44px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <h3 style={{ fontSize: '30px', fontWeight: '700', color: '#fff', margin: '0 0 10px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>
              {isAr ? '💰 ابدأ البيع على سوق.gg' : '💰 START SELLING ON SOOQ.GG'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0, maxWidth: '420px', lineHeight: '1.7' }}>
              {isAr
                ? 'انضم لآلاف البائعين وابدأ كسب المال — مجاني تماماً بدون رسوم مسبقة'
                : 'Join thousands of sellers and earn real money — free to start, no upfront fees'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', position: 'relative' }}>
            <button style={{ background: 'transparent', border: '1px solid rgba(124,58,237,0.5)', color: '#a78bfa', padding: '14px 28px', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', fontFamily: 'inherit' }}>
              {isAr ? 'اعرف أكثر' : 'Learn More'}
            </button>
            <Link to="/auth?mode=register" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 24px rgba(124,58,237,0.45)', fontFamily: 'inherit' }}>
              {isAr ? 'سجّل كبائع ←' : 'Register as Seller →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
