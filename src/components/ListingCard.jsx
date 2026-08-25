import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import CountryBadge from './CountryBadge'
import GameThumb from './GameThumb'

// Shared compact product-grid card used by both Home's "Best Deals" and the
// Listings results grid, so both pages render the same premium card instead
// of two hand-rolled versions drifting apart visually.
export default function ListingCard({ listing: l }) {
  const { t, isAr } = useLang()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const h = t.home

  const badge = l.badge_key === 'trusted' ? t.trusted : l.badge_key === 'vip' ? t.vipSeller : null
  const delivery = l.delivery_key === 'instant' ? h.instant : h.minutes
  const sellerName = isAr ? l.seller : l.seller_en

  return (
    <div className="card" style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
      onClick={() => navigate(`/listing/${l.id}`)}
    >
      <div style={{ height: '110px', position: 'relative' }}>
        {l.images?.[0] ? (
          <img src={l.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <GameThumb game={l.game} style={{ width: '100%', height: '100%' }} emojiSize="30px" objectPosition="center top" />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,16,9,0.9) 0%, transparent 55%)' }} />
        {badge && (
          <span className={`badge ${l.badge_key === 'vip' ? 'badge-purple' : 'badge-green'}`} style={{ position: 'absolute', top: '8px', insetInlineStart: '8px' }}>
            {badge}
          </span>
        )}
        <div style={{ position: 'absolute', bottom: '8px', insetInlineStart: '10px', fontSize: '11px', color: '#c9a84c', fontWeight: '700' }}>
          {l.game}
        </div>
      </div>

      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: '1.4' }}>
          {isAr ? l.type_ar : l.type_en}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '20px', height: '20px', background: 'var(--accent-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#a78bfa', fontWeight: '700', flexShrink: 0 }}>
            {sellerName?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}>
            {sellerName}
            {badge && <span className="verified-check">✓</span>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>⭐ {l.rating} · {l.sales?.toLocaleString()} {h.deals}</span>
          {l.country && <CountryBadge code={l.country} isAr={isAr} />}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-display)' }}>${l.price}</div>
            <div style={{ fontSize: '10px', color: 'var(--green)', fontWeight: '600' }}>⚡ {delivery}</div>
          </div>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}
            onClick={e => { e.stopPropagation(); addItem({ ...l, name: isAr ? l.type_ar : l.type_en }); navigate('/cart') }}
          >
            {h.buyNow}
          </button>
        </div>
      </div>
    </div>
  )
}
