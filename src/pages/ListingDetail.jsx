import { useState, useEffect } from 'react'
import Chat from '../components/Chat'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { GAMES, fetchListings } from '../lib/supabase'

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

const MOCK_REVIEWS = [
  { user: 'Ahmed_Jo', rating: 5, comment: 'سريع جداً وموثوق، أنصح بشدة', commentEn: 'Super fast and reliable, highly recommend', date: '2025-05-10' },
  { user: 'KSA_Gamer', rating: 5, comment: 'أفضل بائع في السوق', commentEn: 'Best seller on the market', date: '2025-05-08' },
  { user: 'UAE_Player', rating: 4, comment: 'خدمة ممتازة', commentEn: 'Excellent service', date: '2025-05-05' },
]

export default function ListingDetail() {
  const { id } = useParams()
  const { t, isAr } = useLang()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const tl = t.listing

  const [listing, setListing] = useState(null)
  const [qty, setQty] = useState(1)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    fetchListings().then(data => {
      setListing(data.find(l => l.id === id))
    })
  }, [id])

  if (!listing) return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
      <p>{isAr ? 'العرض غير موجود' : 'Listing not found'}</p>
      <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '16px' }}>
        {isAr ? 'العودة للرئيسية' : 'Go Home'}
      </Link>
    </div>
  )

  const game = GAMES.find(g => g.name === listing.game)

  const handleBuy = () => {
    addItem({ ...listing, name: isAr ? listing.type_ar : listing.type_en, qty })
    navigate('/cart')
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate(-1)} className="btn-outline" style={{ marginBottom: '20px', padding: '6px 14px', fontSize: '12px' }}>
        {tl.allListings}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>

        <div>
          <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                {game?.img || '🎮'}
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>
                  {isAr ? listing.type_ar : listing.type_en}
                </h1>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{listing.game}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: tl.rating, value: `⭐ ${listing.rating}/5` },
                { label: tl.sales, value: listing.sales.toLocaleString() },
                { label: tl.delivery, value: `⚡ ${listing.delivery_key === 'instant' ? tl.instant : tl.minutes}` },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '3px' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>{tl.description}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              {isAr ? listing.desc_ar : listing.desc_en}
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>{tl.reviews}</h3>
            {MOCK_REVIEWS.map((r, i) => (
              <div key={i} style={{ borderBottom: i < MOCK_REVIEWS.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', background: 'var(--accent-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#a78bfa', fontWeight: '700' }}>
                      {r.user[0]}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>{r.user}</span>
                  </div>
                  <div>
                    {'⭐'.repeat(r.rating)}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '8px' }}>{r.date}</span>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? r.comment : r.commentEn}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'sticky', top: '74px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#a78bfa', fontWeight: '700' }}>
                {(isAr ? listing.seller : listing.seller_en)[0]}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>{isAr ? listing.seller : listing.seller_en}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⭐ {listing.rating} · {listing.sales.toLocaleString()} {tl.sales}</div>
              </div>
              {listing.badge_key && (
                <span className={`badge ${listing.badge_key === 'vip' ? 'badge-purple' : 'badge-green'}`}>
                  {listing.badge_key === 'vip' ? t.vipSeller : t.trusted}
                </span>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>${listing.price}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tl.perUnit}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>{t.cart.qty}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button className="btn-outline" style={{ width: '32px', height: '32px', padding: 0, fontSize: '16px' }} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span style={{ fontWeight: '700', fontSize: '16px', minWidth: '24px', textAlign: 'center' }}>{qty}</span>
                <button className="btn-outline" style={{ width: '32px', height: '32px', padding: 0, fontSize: '16px' }} onClick={() => setQty(q => q + 1)}>+</button>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>= <strong style={{ color: '#fff' }}>${(parseFloat(listing.price) * qty).toFixed(2)}</strong></span>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', marginBottom: '8px' }} onClick={handleBuy}>
              {tl.buyNow}
            </button>
            <button className="btn-outline" style={{ width: '100%', padding: '11px', fontSize: '14px' }}
              onClick={() => addItem({ ...listing, name: isAr ? listing.type_ar : listing.type_en })}>
              {tl.addCart}
            </button>
            <button className="btn-outline" style={{ width: "100%", padding: "11px", fontSize: "14px", marginTop: "8px" }} onClick={() => setShowChat(true)}>
              {isAr ? "???? ??????" : "Message Seller"}
            </button>
            {showChat && listing && <Chat listingId={listing.id} sellerId={listing.seller_id} sellerName={isAr ? listing.seller : listing.seller_en} onClose={() => setShowChat(false)} />}
            <div style={{ marginTop: "14px", padding: "10px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", fontSize: "11px", color: "var(--text-muted)", textAlign: "center" }}>
        </div>
            <div style={{ marginTop: "14px", padding: "10px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", fontSize: "11px", color: "var(--text-muted)", textAlign: "center" }}>
              {t.cart.secure}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


