import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { GAMES, fetchListings } from '../lib/supabase'

const GAME_IMAGES = {
  'PUBG Mobile':         '/games/pubg.jpg',
  'Free Fire':           '/games/freefire.jpg',
  'Fortnite':            '/games/fortnite.jpg',
  'Clash of Clans':      '/games/coc.jpg',
  'Mobile Legends':      '/games/mlbb.jpg',
  'Valorant':            '/games/valorant.jpg',
  'FIFA Mobile':         '/games/fifa.jpg',
  'Genshin Impact':      '/games/genshin.jpg',
  'Call of Duty Mobile': '/games/codm.jpg',
  'League of Legends':   '/games/lol.jpg',
  'Steam Wallet':        '/games/steam.jpg',
  'PlayStation':         '/games/psn.jpg',
}

const CATEGORIES = [
  { id: 'topups',    icon: '⚡', label: 'Top-Ups',    labelAr: 'شحن رصيد' },
  { id: 'accounts',  icon: '🎮', label: 'Accounts',   labelAr: 'حسابات' },
  { id: 'currency',  icon: '💰', label: 'Currency',   labelAr: 'عملات' },
  { id: 'items',     icon: '⚔️', label: 'Items',      labelAr: 'آيتمز' },
  { id: 'boosting',  icon: '🚀', label: 'Boosting',   labelAr: 'بوستنق' },
  { id: 'giftcards', icon: '🎁', label: 'Gift Cards', labelAr: 'بطاقات هدايا' },
]

export default function Home() {
  const { t, isAr } = useLang()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [listings, setListings] = useState([])

  useEffect(() => {
    fetchListings().then(data => setListings(data))
  }, [])

  const filteredGames = GAMES.filter(g =>
    !search ||
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.nameAr.includes(search)
  )

  const getBadge = (key) => key === 'trusted' ? t.trusted : key === 'vip' ? t.vipSeller : null

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', fontFamily: isAr ? "'Cairo', sans-serif" : "'Rajdhani', 'Cairo', sans-serif", direction: isAr ? 'rtl' : 'ltr' }}>

      {/* HERO */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '60px 24px 50px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(/desert.jpg) center/cover no-repeat' }} />
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(201,168,76,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to top, rgba(201,168,76,0.08) 0%, transparent 100%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: isAr ? 'clamp(32px, 5vw, 60px)' : 'clamp(40px, 6vw, 72px)', fontWeight: '800', color: '#ffffff', lineHeight: isAr ? '1.4' : '1.1', marginBottom: '16px', fontFamily: isAr ? "'Cairo', sans-serif" : "'Rajdhani', sans-serif", letterSpacing: isAr ? '0' : '-1px' }}>
            {isAr ? (<>اشتري وبع{' '}<span style={{ background: 'linear-gradient(135deg, #c9a84c, #f5d485, #c9a84c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>أي شيء</span>{' '}في الألعاب</>) : (<>BUY & SELL{' '}<span style={{ background: 'linear-gradient(135deg, #c9a84c, #f5d485, #c9a84c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ANYTHING</span>{' '}IN GAMING</>)}
          </h1>
          <p style={{ color: '#d4c5a9', fontSize: '17px', marginBottom: '36px', lineHeight: '1.7' }}>
            {isAr ? 'شحن رصيد، حسابات، آيتمز، وبوستنق — مع حماية كاملة بنظام الضمان' : 'Top-ups, accounts, items & boosting — with full escrow buyer protection'}
          </p>

          <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '6px 6px 6px 18px', backdropFilter: 'blur(20px)' }}>
            <span style={{ fontSize: '18px', opacity: 0.5, marginRight: '10px' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && navigate(`/listings/topups?q=${search}`)} placeholder={isAr ? 'ابحث عن لعبة...' : 'Search for a game... PUBG, Free Fire, Valorant'} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontSize: '15px', padding: '10px 0', fontFamily: 'inherit' }} />
            <button onClick={() => navigate(`/listings/topups?q=${search}`)} style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)', border: 'none', borderRadius: '10px', color: '#0f0f0f', padding: '12px 28px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(201,168,76,0.4)' }}>
              {isAr ? 'بحث' : 'Search'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['PUBG Mobile', 'Free Fire', 'Valorant', 'Mobile Legends', 'Fortnite'].map(g => (
              <button key={g} onClick={() => navigate(`/listings/topups?q=${g}`)} style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '100px', padding: '5px 16px', fontSize: '13px', color: '#d4c5a9', cursor: 'pointer', fontFamily: 'inherit' }}>{g}</button>
            ))}
          </div>
        </div>
      </div>

      {/* TRUST BAR */}
      <div style={{ background: "rgba(201,168,76,0.05)", borderTop: "1px solid rgba(201,168,76,0.15)", borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "28px 24px", display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
        {[
          { icon: "shield", title: "Money-back Guarantee", desc: "Your purchases are always protected" },
          { icon: "bolt", title: "Instant Delivery", desc: "Most orders delivered in minutes" },
          { icon: "check", title: "Verified Sellers", desc: "Every seller is verified by us" },
          { icon: "lock", title: "Secure Payments", desc: "Crypto escrow keeps funds safe" },
        ].map(b => (
          <div key={b.title} style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: "200px" }}>
            <div style={{ width: "44px", height: "44px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {b.icon === "shield" ? "?" : b.icon === "bolt" ? "Z" : b.icon === "check" ? "V" : "L"}
              "?"
              "?"
              "?"
              "?"
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff", marginBottom: "2px" }}>{b.title}</div>
              <div style={{ fontSize: "12px", color: "#9a8570" }}>{b.desc}</div>
            </div>
          </div>
        ))}
      </div>

        {/* POPULAR GAMES */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'", margin: 0 }}>{isAr ? '🎮 الألعاب الشائعة' : '🎮 POPULAR GAMES'}</h2>
            <Link to="/listings/topups" style={{ fontSize: '13px', color: '#c9a84c', fontWeight: '700' }}>{isAr ? 'عرض الكل ←' : 'View All →'}</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
            {filteredGames.map(game => (
              <Link key={game.id} to={`/listings/topups?game=${game.id}`} style={{ display: 'block', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.1)', background: '#141009', transition: 'all 0.25s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ height: '120px', position: 'relative', overflow: 'hidden', background: `linear-gradient(145deg, ${game.color}55, ${game.color}22)` }}>
                  <img src={GAME_IMAGES[game.name]} alt={game.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} onError={e => { e.target.style.display = 'none' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,16,9,0.95) 0%, transparent 60%)' }} />
                  {game.hot && <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'linear-gradient(135deg, #c9a84c, #a07830)', borderRadius: '5px', fontSize: '9px', color: '#0f0f0f', padding: '2px 8px', fontWeight: '800' }}>HOT</div>}
                </div>
                <div style={{ padding: '12px 14px 14px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>{isAr ? game.nameAr : game.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '11px', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '5px', padding: '2px 8px', fontWeight: '600' }}>{isAr ? game.tagAr : game.tagEn}</div>
                    <div style={{ fontSize: '11px', color: '#9a8570', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />{game.sellers}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* BEST DEALS */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'", margin: 0 }}>{isAr ? '⚡ أفضل العروض الآن' : '⚡ BEST DEALS RIGHT NOW'}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {listings.map(l => {
              const badge = getBadge(l.badge_key)
              const delivery = l.delivery_key === 'instant' ? (isAr ? 'فوري' : 'Instant') : (isAr ? 'دقائق' : 'Minutes')
              const game = GAMES.find(g => g.name === l.game)
              return (
                <div key={l.id} style={{ background: 'linear-gradient(145deg, #141009, #1c1610)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: '14px', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => navigate(`/listing/${l.id}`)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; e.currentTarget.style.transform = 'translateX(3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; e.currentTarget.style.transform = 'translateX(0)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '180px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)', flexShrink: 0 }}>
              {b.icon === "shield" ? "?" : b.icon === "bolt" ? "Z" : b.icon === "check" ? "V" : "L"}
                      <img src={GAME_IMAGES[l.game]} alt={l.game} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '16px', color: '#ffffff', marginBottom: '3px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>{isAr ? l.type_ar : l.type_en}</div>
                      <div style={{ fontSize: '12px', color: '#9a8570' }}>{l.game}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '160px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #c9a84c, #a07830)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#0f0f0f', fontWeight: '800', flexShrink: 0 }}>
              {b.icon === "shield" ? "?" : b.icon === "bolt" ? "Z" : b.icon === "check" ? "V" : "L"}
                      {(isAr ? l.seller : l.seller_en)?.[0] || '?'}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: '700' }}>{isAr ? l.seller : l.seller_en}</div>
                      <div style={{ fontSize: '11px', color: '#9a8570' }}>⭐ {l.rating} · {l.sales?.toLocaleString()} {isAr ? 'صفقة' : 'deals'}</div>
                    </div>
                    {badge && <div style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '5px', fontSize: '10px', color: '#c9a84c', padding: '2px 8px', fontWeight: '700' }}>{badge}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', lineHeight: '1', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>${l.price}</div>
                      <div style={{ fontSize: '11px', color: '#10b981', marginTop: '3px', fontWeight: '600' }}>⚡ {delivery}</div>
                    </div>
                    <button style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)', border: 'none', color: '#0f0f0f', padding: '11px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '800', whiteSpace: 'nowrap', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(201,168,76,0.35)', transition: 'all 0.2s' }}
                      onClick={e => { e.stopPropagation(); addItem({ ...l, name: isAr ? l.type_ar : l.type_en }) }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                    >{isAr ? 'شراء الآن' : 'Buy Now'}</button>
                  </div>
                </div>
              )
            })}
            {listings.length === 0 && (
              <div style={{ background: 'linear-gradient(145deg, #141009, #1c1610)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: '14px', padding: '48px', textAlign: 'center', color: '#9a8570' }}>
                {isAr ? 'لا توجد عروض حالياً' : 'No listings yet — be the first seller!'}
              </div>
            )}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ background: 'linear-gradient(145deg, #141009, #1c1610)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '20px', padding: '48px 40px', marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>{isAr ? 'كيف يعمل سوق.gg؟' : 'HOW SOOQ.GG WORKS'}</h2>
          <p style={{ color: '#9a8570', fontSize: '15px', marginBottom: '40px' }}>{isAr ? 'آمن، سريع، وسهل' : 'Safe, fast, and simple'}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px' }}>
            {(isAr ? [
              { n: '١', title: 'اختر ما تريد', desc: 'ابحث من مئات الخيارات', icon: '🔍', color: '#c9a84c' },
              { n: '٢', title: 'اختر البائع', desc: 'قارن الأسعار والتقييمات', icon: '👤', color: '#10b981' },
              { n: '٣', title: 'ادفع بأمان', desc: 'مبلغك محفوظ حتى تستلم', icon: '🛡️', color: '#3b82f6' },
              { n: '٤', title: 'استلم فوراً', desc: 'أغلب الطلبات في دقائق', icon: '⚡', color: '#c9a84c' },
            ] : [
              { n: '01', title: 'Choose', desc: 'Browse hundreds of listings', icon: '🔍', color: '#c9a84c' },
              { n: '02', title: 'Pick a Seller', desc: 'Compare prices & ratings', icon: '👤', color: '#10b981' },
              { n: '03', title: 'Pay Safely', desc: 'Funds held in escrow', icon: '🛡️', color: '#3b82f6' },
              { n: '04', title: 'Receive', desc: 'Most orders in minutes', icon: '⚡', color: '#c9a84c' },
            ]).map(s => (
              <div key={s.n}>
                <div style={{ width: '60px', height: '60px', background: `${s.color}15`, border: `1px solid ${s.color}35`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px' }}>{s.icon}</div>
                <div style={{ fontSize: isAr ? '14px' : '22px', fontWeight: '700', color: s.color, marginBottom: '5px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>{s.n}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '6px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: '#9a8570', lineHeight: '1.6' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SELLER CTA */}
        <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #1a1205 0%, #0f0c06 100%)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '20px', padding: '48px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: '0 0 10px', fontFamily: isAr ? "'Cairo'" : "'Rajdhani'" }}>{isAr ? '💰 ابدأ البيع على سوق.gg' : '💰 START SELLING ON SOOQ.GG'}</h3>
            <p style={{ color: '#d4c5a9', fontSize: '15px', margin: 0, maxWidth: '400px', lineHeight: '1.7' }}>{isAr ? 'انضم لآلاف البائعين وابدأ كسب المال — مجاناً تماماً بدون رسوم مسبقة' : 'Join thousands of sellers and earn real money — free to start, no upfront fees'}</p>
          </div>
          <Link to="/auth?mode=register" style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)', color: '#0f0f0f', padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '800', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 20px rgba(201,168,76,0.4)', fontFamily: 'inherit' }}>
            {isAr ? 'سجّل كبائع ←' : 'Register as Seller →'}
          </Link>
        </div>

      </div>
    </div>
  )
}



