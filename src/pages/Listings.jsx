import { useState, useMemo, useEffect } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { GAMES, fetchListings } from '../lib/supabase'

export default function listings() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const { t, isAr } = useLang()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const h = t.home

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedGame, setSelectedGame] = useState(searchParams.get('game') || 'all')
  const [sortBy, setSortBy] = useState('default')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
const [activeCat, setActiveCat] = useState(category || 'topups')
const [listings, setListings] = useState([])

useEffect(() => {
  fetchListings().then(data => setListings(data))
}, [])

  const cats = [
    { id: 'topups', label: t.nav.topups, icon: '⚡' },
    { id: 'accounts', label: t.nav.accounts, icon: '🎮' },
    { id: 'currency', label: t.nav.currency, icon: '💰' },
    { id: 'items', label: t.nav.items, icon: '⚔️' },
    { id: 'boosting', label: t.nav.boosting, icon: '🚀' },
    { id: 'giftcards', label: t.nav.giftcards, icon: '🎁' },
  ]

  const getBadge = (key) => key === 'trusted' ? t.trusted : key === 'vip' ? t.vipSeller : null

  const filtered = useMemo(() => {
    let list = [...listings]
    if (search) list = list.filter(l => (isAr ? l.typeAr : l.typeEn).toLowerCase().includes(search.toLowerCase()) || l.game.toLowerCase().includes(search.toLowerCase()))
    if (selectedGame !== 'all') list = list.filter(l => l.gameId === parseInt(selectedGame))
    if (priceMin) list = list.filter(l => parseFloat(l.price) >= parseFloat(priceMin))
    if (priceMax) list = list.filter(l => parseFloat(l.price) <= parseFloat(priceMax))
    if (sortBy === 'price_asc') list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    if (sortBy === 'price_desc') list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'sales') list.sort((a, b) => b.sales - a.sales)
    return list
  }, [search, selectedGame, priceMin, priceMax, sortBy, isAr])

  return (
    <div className="page-container">
      {/* BREADCRUMB */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--accent)' }}>{isAr ? 'الرئيسية' : 'Home'}</Link>
        <span>›</span>
        <span>{cats.find(c => c.id === category)?.label || category}</span>
      </div>

      {/* CATEGORY TABS */}
      <div style={{ display: 'flex', gap: '7px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {cats.map(c => (
          <Link key={c.id} to={`/listings/${c.id}`} style={{
            background: category === c.id ? 'var(--accent)' : 'var(--bg-tertiary)',
            border: `1px solid ${category === c.id ? 'var(--accent)' : 'var(--border-hover)'}`,
            color: category === c.id ? '#fff' : 'var(--text-secondary)',
            padding: '7px 16px', borderRadius: 'var(--radius-md)', fontSize: '13px',
            fontWeight: category === c.id ? '700' : '400', whiteSpace: 'nowrap',
          }}>{c.icon} {c.label}</Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', alignItems: 'start' }}>

        {/* SIDEBAR FILTERS */}
        <div className="card hide-mobile" style={{ padding: '16px', position: 'sticky', top: '74px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '14px' }}>
            {isAr ? 'تصفية النتائج' : 'Filters'}
          </div>

          {/* Game filter */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '7px', fontWeight: '600' }}>
              {isAr ? 'اللعبة' : 'Game'}
            </div>
            <select value={selectedGame} onChange={e => setSelectedGame(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', fontSize: '12px' }}>
              <option value="all">{isAr ? 'كل الألعاب' : 'All Games'}</option>
              {GAMES.map(g => <option key={g.id} value={g.id}>{isAr ? g.nameAr : g.name}</option>)}
            </select>
          </div>

          {/* Price range */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '7px', fontWeight: '600' }}>
              {isAr ? 'نطاق السعر (USD)' : 'Price Range (USD)'}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input placeholder={isAr ? 'من' : 'Min'} value={priceMin} onChange={e => setPriceMin(e.target.value)} style={{ width: '50%', padding: '6px 8px', fontSize: '12px' }} type="number" />
              <input placeholder={isAr ? 'إلى' : 'Max'} value={priceMax} onChange={e => setPriceMax(e.target.value)} style={{ width: '50%', padding: '6px 8px', fontSize: '12px' }} type="number" />
            </div>
          </div>

          {/* Sort */}
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '7px', fontWeight: '600' }}>
              {isAr ? 'ترتيب حسب' : 'Sort By'}
            </div>
            {[
              { val: 'default', label: isAr ? 'الافتراضي' : 'Default' },
              { val: 'price_asc', label: isAr ? 'السعر: الأقل أولاً' : 'Price: Low to High' },
              { val: 'price_desc', label: isAr ? 'السعر: الأعلى أولاً' : 'Price: High to Low' },
              { val: 'rating', label: isAr ? 'الأعلى تقييماً' : 'Top Rated' },
              { val: 'sales', label: isAr ? 'الأكثر مبيعاً' : 'Best Selling' },
            ].map(opt => (
              <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginBottom: '6px', cursor: 'pointer', color: sortBy === opt.val ? 'var(--accent)' : 'var(--text-secondary)' }}>
                <input type="radio" name="sort" value={opt.val} checked={sortBy === opt.val} onChange={() => setSortBy(opt.val)} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* listings */}
        <div>
          {/* Search + count */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isAr ? 'بحث في العروض...' : 'Search listings...'}
              style={{ flex: 1, padding: '9px 14px', fontSize: '13px' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {filtered.length} {isAr ? 'عرض' : 'listings'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <div style={{ fontSize: '14px' }}>{isAr ? 'لا توجد نتائج' : 'No listings found'}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filtered.map(l => {
                const badge = getBadge(l.badgeKey)
                const delivery = l.deliveryKey === 'instant' ? h.instant : h.minutes
                return (
                  <div key={l.id} className="card" style={{
                    padding: '14px 18px', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}
                    onClick={() => navigate(`/listing/${l.id}`)}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-border)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '160px' }}>
                      <div style={{ width: '38px', height: '38px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        {GAMES.find(g => g.name === l.game)?.img || '🎮'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13px' }}>{isAr ? l.typeAr : l.typeEn}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l.game}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flex: 1, minWidth: '150px' }}>
                      <div style={{ width: '30px', height: '30px', background: 'var(--accent-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#a78bfa', fontWeight: '700' }}>
                        {(isAr ? l.seller : l.sellerEn)[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '600' }}>{isAr ? l.seller : l.sellerEn}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>⭐ {l.rating} · {l.sales.toLocaleString()} {h.deals}</div>
                      </div>
                      {badge && <span className={`badge ${l.badgeKey === 'vip' ? 'badge-purple' : 'badge-green'}`}>{badge}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div>
                        <div style={{ fontSize: '17px', fontWeight: '800', color: '#fff' }}>${l.price}</div>
                        <div style={{ fontSize: '10px', color: 'var(--green)' }}>⚡ {delivery}</div>
                      </div>
                      <button className="btn-primary" style={{ padding: '7px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}
                        onClick={e => { e.stopPropagation(); addItem({ ...l, name: isAr ? l.typeAr : l.typeEn }) }}
                      >{h.buyNow}</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
