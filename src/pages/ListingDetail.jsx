import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { GAMES, fetchListings, supabase } from '../lib/supabase'
import CountryBadge from '../components/CountryBadge'
import GameThumb from '../components/GameThumb'
import Reveal from '../components/Reveal'

export default function ListingDetail() {
  const { id } = useParams()
  const { t, isAr } = useLang()
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const tl = t.listing

  const [listing, setListing] = useState(null)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetchListings().then(data => {
      setListing(data.find(l => l.id === id))
    })
    supabase.from('reviews').select('*').eq('listing_id', id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setReviews(data) })
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

        <Reveal>
          <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <GameThumb game={listing.game} style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', flexShrink: 0 }} emojiSize="24px" />
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

          {listing.images?.length > 0 && (
            <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
              <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: listing.images.length > 1 ? '10px' : 0, background: 'var(--bg-tertiary)' }}>
                <img src={listing.images[activeImage]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {listing.images.length > 1 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {listing.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)} style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', padding: 0, border: i === activeImage ? '2px solid var(--accent)' : '1px solid var(--border-hover)', cursor: 'pointer', flexShrink: 0 }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>{tl.description}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              {isAr ? listing.desc_ar : listing.desc_en}
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>{tl.reviews}</h3>
            {reviews.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{tl.noReviews}</p>
            )}
            {reviews.map((r, i) => (
              <div key={r.id} style={{ borderBottom: i < reviews.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', background: 'var(--accent-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#a78bfa', fontWeight: '700' }}>
                      {r.buyer_username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>{r.buyer_username}</span>
                  </div>
                  <div>
                    {'⭐'.repeat(r.rating)}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '8px' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {r.comment && <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal style={{ position: 'sticky', top: '74px' }} delay={0.1}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#a78bfa', fontWeight: '700' }}>
                {(isAr ? listing.seller : listing.seller_en)[0]}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {isAr ? listing.seller : listing.seller_en}
                  {listing.badge_key && <span className="verified-check">✓</span>}
                  {listing.country && <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}><CountryBadge code={listing.country} isAr={isAr} /></span>}
                </div>
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
            <button className="btn-outline" style={{ width: "100%", padding: "11px", fontSize: "14px", marginTop: "8px" }} onClick={() => {
              if (!user) { navigate('/auth'); return }
              const params = new URLSearchParams({
                tab: 'messages',
                listingId: listing.id,
                sellerId: listing.seller_id || '',
                sellerName: isAr ? listing.seller : listing.seller_en,
                sellerRating: listing.rating || '',
                sellerCountry: listing.country || '',
              })
              navigate(`/dashboard?${params.toString()}`)
            }}>
              {isAr ? "راسل البائع" : "Message Seller"}
            </button>
            <div style={{ marginTop: "14px", padding: "10px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", fontSize: "11px", color: "var(--text-muted)", textAlign: "center" }}>
              {t.cart.secure}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}


