import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { GAMES, LISTINGS } from '../lib/supabase'

const GAME_IMAGES = {
  'PUBG Mobile': 'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg',
  'Free Fire': 'https://upload.wikimedia.org/wikipedia/en/8/8e/Free_Fire_Logo.png',
  'Fortnite': 'https://cdn2.unrealengine.com/fortnite-og-1920x1080-1920x1080-8ccf9e96c7fc.jpg',
  'Clash of Clans': 'https://upload.wikimedia.org/wikipedia/en/2/20/Clash_of_Clans_2012_Logo.png',
  'Mobile Legends': 'https://upload.wikimedia.org/wikipedia/en/9/9d/Mobile_Legends_Bang_Bang.png',
  'Valorant': 'https://upload.wikimedia.org/wikipedia/en/f/fc/Valorant_cover.jpg',
  'FIFA Mobile': 'https://upload.wikimedia.org/wikipedia/en/e/e0/FIFA_Mobile_cover.jpg',
  'Genshin Impact': 'https://upload.wikimedia.org/wikipedia/en/2/2d/Genshin_Impact_cover.jpg',
  'Call of Duty Mobile': 'https://upload.wikimedia.org/wikipedia/en/1/19/Call_of_Duty_Mobile_cover_art.png',
  'League of Legends': 'https://upload.wikimedia.org/wikipedia/en/1/13/League_of_legends_s10_key_art.jpg',
  'Steam Wallet': 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
  'PlayStation': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Playstation_logo_colour.svg',
}

export default function Home() {
  const { t, isAr } = useLang()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const h = t.home
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
    <div style={{ background: '#0a0b0f' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a0533 40%, #0d1b2a 100%)',
        padding: '72px 24px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Glow orbs */}
        <div style={{ position:'absolute', top:'-100px', left:'20%', width:'400px', height:'400px', background:'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'-60px', right:'15%', width:'300px', height:'300px', background:'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'50%', width:'500px', height:'300px', background:'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', transform:'translateX(-50%)', pointerEvents:'none' }} />

        {/* Badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.4)', borderRadius:'100px', padding:'6px 18px', fontSize:'13px', color:'#c4b5fd', marginBottom:'24px', fontWeight:'600' }}>
          <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#a78bfa', display:'inline-block', animation:'pulse 2s infinite' }} />
          {isAr ? '🔥 السوق الرقمي الأول للألعاب في المنطقة العربية' : '🔥 The #1 Arabic Gaming Marketplace in MENA'}
        </div>

        <h1 style={{ fontSize:'clamp(36px, 6vw, 72px)', fontWeight:'900', color:'#fff', lineHeight:'1.1', maxWidth:'800px', margin:'0 auto 20px', letterSpacing:'-1px' }}>
          {isAr ? (
            <>اشتري وبع <span style={{ background:'linear-gradient(135deg, #7c3aed, #ec4899, #3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>أي شيء</span> في الألعاب</>
          ) : (
            <>Buy & Sell <span style={{ background:'linear-gradient(135deg, #7c3aed, #ec4899, #3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Anything</span> In Gaming</>
          )}
        </h1>

        <p style={{ color:'#94a3b8', fontSize:'18px', maxWidth:'560px', margin:'0 auto 36px', lineHeight:'1.7', fontWeight:'400' }}>
          {isAr ? 'شحن رصيد، حسابات، آيتمز، وبوستنق — أسعار تنافسية مع حماية كاملة للمشتري بنظام الضمان' : 'Top-ups, accounts, items & boosting — with full escrow buyer protection'}
        </p>

        {/* Search */}
        <div style={{ maxWidth:'580px', margin:'0 auto 48px', position:'relative' }}>
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'16px', display:'flex', alignItems:'center', padding:'6px 6px 6px 20px', backdropFilter:'blur(10px)' }}>
            <span style={{ fontSize:'18px', marginRight:'10px', opacity:'0.5' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && navigate(`/listings/topups?q=${search}`)}
              placeholder={isAr ? 'ابحث عن لعبة... PUBG، Free Fire، Valorant' : 'Search for a game... PUBG, Free Fire, Valorant'}
              style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:'15px', padding:'8px 0' }}
            />
            <button onClick={() => navigate(`/listings/topups?q=${search}`)}
              style={{ background:'linear-gradient(135deg, #7c3aed, #6d28d9)', border:'none', borderRadius:'12px', color:'#fff', padding:'12px 24px', fontSize:'14px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap' }}>
              {isAr ? 'بحث' : 'Search'}
            </button>
          </div>
          <div style={{ display:'flex', gap:'8px', marginTop:'12px', justifyContent:'center', flexWrap:'wrap' }}>
            {['PUBG Mobile','Free Fire','Valorant','Mobile Legends'].map(g => (
              <button key={g} onClick={() => navigate(`/listings/topups?q=${g}`)}
                style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'100px', padding:'4px 14px', fontSize:'12px', color:'#94a3b8', cursor:'pointer' }}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:'0', maxWidth:'640px', margin:'0 auto' }}>
          {[
            { value:'240K+', label: isAr ? 'صفقة مكتملة' : 'Completed Deals', icon:'✅' },
            { value:'8K+',   label: isAr ? 'بائع موثوق' : 'Trusted Sellers', icon:'🛡️' },
            { value:'120+',  label: isAr ? 'لعبة مدعومة' : 'Games Supported', icon:'🎮' },
            { value:'22',    label: isAr ? 'دولة' : 'Countries', icon:'🌍' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex:'1', minWidth:'120px', padding:'16px 8px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', textAlign:'center' }}>
              <div style={{ fontSize:'26px', fontWeight:'900', color:'#fff', marginBottom:'4px' }}>{s.value}</div>
              <div style={{ fontSize:'12px', color:'#64748b' }}>{s.icon} {s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TRUST BAR ──────────────────────────────────────── */}
      <div style={{ background:'#0d0f17', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'14px 24px', display:'flex', justifyContent:'center', gap:'40px', flexWrap:'wrap' }}>
        {[
          { icon:'🛡️', text: isAr ? 'ضمان استرداد الأموال' : 'Money-back guarantee' },
          { icon:'⚡', text: isAr ? 'تسليم فوري' : 'Instant delivery' },
          { icon:'💎', text: isAr ? 'بائعون موثقون فقط' : 'Verified sellers only' },
          { icon:'🕐', text: isAr ? 'دعم عربي ٢٤/٧' : '24/7 Arabic support' },
        ].map(b => (
          <div key={b.text} style={{ display:'flex', alignItems:'center', gap:'7px', fontSize:'13px', color:'#64748b', fontWeight:'500' }}>
            <span>{b.icon}</span><span>{b.text}</span>
          </div>
        ))}
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'40px 20px' }}>

        {/* ── CATEGORY TABS ──────────────────────────────── */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'36px', overflowX:'auto', paddingBottom:'4px' }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
              background: activeCat === c.id ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeCat === c.id ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
              color: activeCat === c.id ? '#fff' : '#94a3b8',
              padding:'10px 20px', borderRadius:'12px', fontSize:'14px',
              fontWeight: activeCat === c.id ? '700' : '500',
              whiteSpace:'nowrap', transition:'all 0.2s', cursor:'pointer',
              boxShadow: activeCat === c.id ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
            }}>{c.icon} {c.label}</button>
          ))}
        </div>

        {/* ── GAMES GRID ─────────────────────────────────── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
          <h2 style={{ fontSize:'22px', fontWeight:'800', color:'#fff' }}>🎮 {isAr ? 'الألعاب الشائعة' : 'Popular Games'}</h2>
          <Link to="/listings/topups" style={{ fontSize:'13px', color:'#7c3aed', fontWeight:'600' }}>{isAr ? 'عرض الكل ←' : 'View All →'}</Link>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(155px, 1fr))', gap:'12px', marginBottom:'48px' }}>
          {filteredGames.map(game => (
            <Link key={game.id} to={`/listings/topups?game=${game.id}`} style={{
              display:'block',
              background:'linear-gradient(145deg, #13151f, #1a1d2e)',
              border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:'16px',
              overflow:'hidden',
              cursor:'pointer',
              transition:'all 0.2s',
              textDecoration:'none',
              position:'relative',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='rgba(124,58,237,0.5)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='none' }}
            >
              {/* Game image banner */}
              <div style={{ height:'80px', background:`linear-gradient(135deg, ${game.color}33, ${game.color}11)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${game.color}22, transparent)` }} />
                <span style={{ position:'relative', zIndex:1 }}>{game.img}</span>
                {game.hot && (
                  <div style={{ position:'absolute', top:'8px', left:'8px', background:'linear-gradient(135deg, #ef4444, #dc2626)', borderRadius:'6px', fontSize:'9px', color:'#fff', padding:'2px 7px', fontWeight:'800', letterSpacing:'0.5px' }}>HOT</div>
                )}
              </div>
              <div style={{ padding:'10px 12px 12px' }}>
                <div style={{ fontSize:'13px', fontWeight:'700', color:'#fff', marginBottom:'5px', lineHeight:'1.3' }}>{isAr ? game.nameAr : game.name}</div>
                <div style={{ display:'inline-block', fontSize:'10px', color:game.color, background:`${game.color}20`, border:`1px solid ${game.color}40`, borderRadius:'5px', padding:'2px 7px', marginBottom:'6px' }}>
                  {isAr ? game.tagAr : game.tagEn}
                </div>
                <div style={{ fontSize:'11px', color:'#475569', display:'flex', alignItems:'center', gap:'4px' }}>
                  <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#10b981', display:'inline-block' }} />
                  {game.sellers} {isAr ? 'بائع' : 'sellers'}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── BEST DEALS ─────────────────────────────────── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
          <h2 style={{ fontSize:'22px', fontWeight:'800', color:'#fff' }}>⚡ {isAr ? 'أفضل العروض الآن' : 'Best Deals Right Now'}</h2>
          <div style={{ display:'flex', gap:'6px' }}>
            {(isAr ? ['الأرخص','الأعلى تقييماً','الأكثر مبيعاً'] : ['Cheapest','Top Rated','Best Selling']).map(f => (
              <button key={f} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#64748b', padding:'5px 12px', borderRadius:'8px', cursor:'pointer', fontSize:'12px' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'48px' }}>
          {LISTINGS.map(l => {
            const badge = getBadge(l.badgeKey)
            const delivery = l.deliveryKey === 'instant' ? (isAr ? 'فوري' : 'Instant') : (isAr ? 'دقائق' : 'Minutes')
            const game = GAMES.find(g => g.name === l.game)
            return (
              <div key={l.id}
                style={{ background:'linear-gradient(145deg, #13151f, #1a1d2e)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'14px', flexWrap:'wrap', cursor:'pointer', transition:'all 0.2s' }}
                onClick={() => navigate(`/listing/${l.id}`)}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'; e.currentTarget.style.background='linear-gradient(145deg, #16182a, #1e2035)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.background='linear-gradient(145deg, #13151f, #1a1d2e)' }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'12px', flex:1, minWidth:'160px' }}>
                  <div style={{ width:'46px', height:'46px', background:`linear-gradient(135deg, ${game?.color || '#7c3aed'}33, ${game?.color || '#7c3aed'}11)`, borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', border:`1px solid ${game?.color || '#7c3aed'}30`, flexShrink:0 }}>
                    {game?.img || '🎮'}
                  </div>
                  <div>
                    <div style={{ fontWeight:'700', fontSize:'15px', color:'#fff', marginBottom:'2px' }}>{isAr ? l.typeAr : l.typeEn}</div>
                    <div style={{ fontSize:'12px', color:'#64748b' }}>{l.game}</div>
                  </div>
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:'10px', flex:1, minWidth:'160px' }}>
                  <div style={{ width:'34px', height:'34px', background:'linear-gradient(135deg, #7c3aed33, #4f46e533)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', color:'#a78bfa', fontWeight:'800', flexShrink:0 }}>
                    {(isAr ? l.seller : l.sellerEn)[0]}
                  </div>
                  <div>
                    <div style={{ fontSize:'13px', color:'#e2e8f0', fontWeight:'600' }}>{isAr ? l.seller : l.sellerEn}</div>
                    <div style={{ fontSize:'11px', color:'#64748b' }}>⭐ {l.rating} · {l.sales.toLocaleString()} {isAr ? 'صفقة' : 'deals'}</div>
                  </div>
                  {badge && (
                    <div style={{ background: l.badgeKey === 'vip' ? 'rgba(124,58,237,0.15)' : 'rgba(16,185,129,0.12)', border:`1px solid ${l.badgeKey === 'vip' ? 'rgba(124,58,237,0.4)' : 'rgba(16,185,129,0.3)'}`, borderRadius:'6px', fontSize:'10px', color: l.badgeKey === 'vip' ? '#a78bfa' : '#34d399', padding:'2px 8px', fontWeight:'700', whiteSpace:'nowrap' }}>
                      {badge}
                    </div>
                  )}
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                    <div style={{ fontSize:'22px', fontWeight:'900', color:'#fff', lineHeight:'1' }}>${l.price}</div>
                    <div style={{ fontSize:'11px', color:'#10b981', marginTop:'3px', fontWeight:'600' }}>⚡ {delivery}</div>
                  </div>
                  <button className="btn-primary"
                    style={{ padding:'10px 18px', fontSize:'13px', whiteSpace:'nowrap', borderRadius:'10px', background:'linear-gradient(135deg, #7c3aed, #6d28d9)', border:'none', boxShadow:'0 4px 14px rgba(124,58,237,0.35)' }}
                    onClick={e => { e.stopPropagation(); addItem({ ...l, name: isAr ? l.typeAr : l.typeEn }) }}>
                    {isAr ? 'شراء الآن' : 'Buy Now'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── HOW IT WORKS ───────────────────────────────── */}
        <div style={{ background:'linear-gradient(145deg, #13151f, #1a1d2e)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'40px', marginBottom:'32px', textAlign:'center' }}>
          <h2 style={{ fontSize:'26px', fontWeight:'900', color:'#fff', marginBottom:'8px' }}>
            {isAr ? 'كيف يعمل سوق.gg؟' : 'How does Sooq.gg work?'}
          </h2>
          <p style={{ color:'#64748b', fontSize:'15px', marginBottom:'36px' }}>
            {isAr ? 'آمن، سريع، وسهل — للمشتري والبائع' : 'Safe, fast, and simple — for buyers and sellers'}
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'24px' }}>
            {(isAr ? [
              { n:'١', title:'اختر ما تريد', desc:'ابحث من مئات الخيارات', icon:'🔍' },
              { n:'٢', title:'اختر البائع', desc:'قارن الأسعار والتقييمات', icon:'👤' },
              { n:'٣', title:'ادفع بأمان', desc:'مبلغك محفوظ حتى تستلم', icon:'🛡️' },
              { n:'٤', title:'استلم فوراً', desc:'أغلب الطلبات في دقائق', icon:'⚡' },
            ] : [
              { n:'1', title:'Choose What You Want', desc:'Browse hundreds of options', icon:'🔍' },
              { n:'2', title:'Pick a Seller', desc:'Compare prices & ratings', icon:'👤' },
              { n:'3', title:'Pay Securely', desc:'Funds held in escrow', icon:'🛡️' },
              { n:'4', title:'Receive Instantly', desc:'Most orders in minutes', icon:'⚡' },
            ]).map((s, i) => (
              <div key={s.n}>
                <div style={{ width:'56px', height:'56px', background:`linear-gradient(135deg, ${['#7c3aed','#ec4899','#3b82f6','#10b981'][i]}22, ${['#7c3aed','#ec4899','#3b82f6','#10b981'][i]}11)`, border:`1px solid ${['#7c3aed','#ec4899','#3b82f6','#10b981'][i]}40`, borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', margin:'0 auto 14px' }}>
                  {s.icon}
                </div>
                <div style={{ fontSize:'11px', color:['#a78bfa','#f472b6','#60a5fa','#34d399'][i], fontWeight:'800', marginBottom:'5px', letterSpacing:'1px', textTransform:'uppercase' }}>
                  {isAr ? 'خطوة' : 'Step'} {s.n}
                </div>
                <div style={{ fontSize:'15px', fontWeight:'700', color:'#fff', marginBottom:'6px' }}>{s.title}</div>
                <div style={{ fontSize:'13px', color:'#64748b', lineHeight:'1.6' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SELLER CTA ─────────────────────────────────── */}
        <div style={{ background:'linear-gradient(135deg, #1e1040 0%, #0f1a30 50%, #1a0d33 100%)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:'20px', padding:'36px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'20px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', background:'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', pointerEvents:'none' }} />
          <div>
            <h3 style={{ fontSize:'24px', fontWeight:'900', color:'#fff', margin:'0 0 8px' }}>
              {isAr ? '💰 ابدأ البيع على سوق.gg' : '💰 Start Selling on Sooq.gg'}
            </h3>
            <p style={{ color:'#94a3b8', fontSize:'14px', margin:0, maxWidth:'400px', lineHeight:'1.7' }}>
              {isAr ? 'انضم لآلاف البائعين وابدأ كسب المال من ألعابك — مجاني تماماً، بدون رسوم مسبقة' : 'Join thousands of sellers and earn real money from gaming — free to start, no upfront fees'}
            </p>
          </div>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', position:'relative' }}>
            <button style={{ background:'transparent', border:'1px solid rgba(124,58,237,0.5)', color:'#a78bfa', padding:'12px 24px', borderRadius:'12px', cursor:'pointer', fontSize:'14px', fontWeight:'600' }}>
              {isAr ? 'اعرف أكثر' : 'Learn More'}
            </button>
            <Link to="/auth?mode=register" style={{ background:'linear-gradient(135deg, #7c3aed, #6d28d9)', border:'none', color:'#fff', padding:'12px 24px', borderRadius:'12px', cursor:'pointer', fontSize:'14px', fontWeight:'700', textDecoration:'none', display:'inline-block', boxShadow:'0 4px 20px rgba(124,58,237,0.4)' }}>
              {isAr ? 'سجّل كبائع ←' : 'Register as Seller →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
