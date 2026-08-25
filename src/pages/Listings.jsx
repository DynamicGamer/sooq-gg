import { useState, useMemo, useEffect } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { GAMES, fetchListings } from '../lib/supabase'
import GameThumb from '../components/GameThumb'
import ListingCard from '../components/ListingCard'
import { RevealGroup, RevealItem } from '../components/Reveal'

const SORT_OPTIONS = (isAr) => [
  { val: 'default', label: isAr ? 'الافتراضي' : 'Default' },
  { val: 'price_asc', label: isAr ? 'السعر: الأقل أولاً' : 'Price: Low to High' },
  { val: 'price_desc', label: isAr ? 'السعر: الأعلى أولاً' : 'Price: High to Low' },
  { val: 'rating', label: isAr ? 'الأعلى تقييماً' : 'Top Rated' },
  { val: 'sales', label: isAr ? 'الأكثر مبيعاً' : 'Best Selling' },
]

export default function listings() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const { t, isAr } = useLang()
  const navigate = useNavigate()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedGame, setSelectedGame] = useState(searchParams.get('game') || 'all')
  const [sortBy, setSortBy] = useState('default')
  const [sortOpen, setSortOpen] = useState(false)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [listings, setListings] = useState([])
  const [gameSectionOpen, setGameSectionOpen] = useState(true)
  const [priceSectionOpen, setPriceSectionOpen] = useState(true)

  useEffect(() => {
    fetchListings().then(data => setListings(data))
  }, [])

  // Keep filters in sync when navigating here again with different ?game=/?q= (e.g. from the Browse menu)
  useEffect(() => {
    setSelectedGame(searchParams.get('game') || 'all')
    setSearch(searchParams.get('q') || '')
  }, [searchParams])

  const cats = [
    { id: 'all', label: isAr ? 'كل العروض' : 'All Listings', icon: '🔎' },
    { id: 'topups', label: t.nav.topups, icon: '⚡' },
    { id: 'accounts', label: t.nav.accounts, icon: '🎮' },
    { id: 'currency', label: t.nav.currency, icon: '💰' },
    { id: 'items', label: t.nav.items, icon: '⚔️' },
    { id: 'boosting', label: t.nav.boosting, icon: '🚀' },
    { id: 'giftcards', label: t.nav.giftcards, icon: '🎁' },
  ]

  const popularGames = useMemo(() => GAMES.filter(g => g.hot), [])
  const selectedGameObj = selectedGame !== 'all' ? GAMES.find(g => String(g.id) === String(selectedGame)) : null

  const filtered = useMemo(() => {
    let list = [...listings]
    if (category && category !== 'all') list = list.filter(l => l.category === category)
    if (selectedGameObj) list = list.filter(l => l.game === selectedGameObj.name)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(l =>
        l.type_en?.toLowerCase().includes(q) ||
        l.type_ar?.includes(search.trim()) ||
        l.game?.toLowerCase().includes(q)
      )
    }
    if (priceMin) list = list.filter(l => parseFloat(l.price) >= parseFloat(priceMin))
    if (priceMax) list = list.filter(l => parseFloat(l.price) <= parseFloat(priceMax))
    if (sortBy === 'price_asc') list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    if (sortBy === 'price_desc') list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'sales') list.sort((a, b) => b.sales - a.sales)
    return list
  }, [search, selectedGameObj, category, priceMin, priceMax, sortBy, listings])

  const sortOptions = SORT_OPTIONS(isAr)
  const activeSortLabel = sortOptions.find(o => o.val === sortBy)?.label

  return (
    <div className="page-container">
      {/* BREADCRUMB */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--accent)' }}>{isAr ? 'الرئيسية' : 'Home'}</Link>
        <span>›</span>
        <span>{cats.find(c => c.id === category)?.label || category}</span>
        {selectedGameObj && (<><span>›</span><span>{isAr ? selectedGameObj.nameAr : selectedGameObj.name}</span></>)}
      </div>

      {/* GAME CONTEXT HEADER */}
      {selectedGameObj && (
        <div className="card" style={{ padding: '16px 18px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <GameThumb game={selectedGameObj} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', flexShrink: 0 }} emojiSize="22px" />
          <div style={{ fontSize: '17px', fontWeight: '800', fontFamily: 'var(--font-display)', color: '#fff' }}>
            {isAr ? selectedGameObj.nameAr : selectedGameObj.name}
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginInlineStart: 'auto' }}>
            {cats.map(c => (
              <Link key={c.id} to={`/listings/${c.id}?game=${selectedGameObj.id}`} style={{
                padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: '12px',
                fontWeight: category === c.id ? '700' : '500',
                color: category === c.id ? 'var(--accent)' : 'var(--text-muted)',
                background: category === c.id ? 'var(--accent-soft)' : 'transparent',
              }}>{c.label}</Link>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORY TABS */}
      <div style={{ display: 'flex', gap: '7px', marginBottom: '18px', overflowX: 'auto', paddingBottom: '4px' }}>
        {cats.map(c => (
          <Link key={c.id} to={`/listings/${c.id}${selectedGameObj ? `?game=${selectedGameObj.id}` : ''}`} style={{
            background: category === c.id ? 'var(--accent)' : 'var(--bg-tertiary)',
            border: `1px solid ${category === c.id ? 'var(--accent)' : 'var(--border-hover)'}`,
            color: category === c.id ? '#fff' : 'var(--text-secondary)',
            padding: '7px 16px', borderRadius: 'var(--radius-md)', fontSize: '13px',
            fontWeight: category === c.id ? '700' : '400', whiteSpace: 'nowrap',
          }}>{c.icon} {c.label}</Link>
        ))}
      </div>

      {/* POPULAR GAMES QUICK FILTER */}
      {popularGames.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {isAr ? 'شائع:' : 'Popular:'}
          </span>
          {popularGames.map(g => (
            <button key={g.id} className={`chip ${String(selectedGame) === String(g.id) ? 'active' : ''}`}
              onClick={() => setSelectedGame(prev => String(prev) === String(g.id) ? 'all' : String(g.id))}
              style={{ whiteSpace: 'nowrap' }}
            >
              {isAr ? g.nameAr : g.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', alignItems: 'start' }}>

        {/* SIDEBAR FILTERS */}
        <div className="card hide-mobile" style={{ padding: '16px', position: 'sticky', top: '110px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '14px' }}>
            {isAr ? 'تصفية النتائج' : 'Filters'}
          </div>

          {/* Game filter */}
          <div style={{ marginBottom: '16px' }}>
            <button className="filter-section-toggle" style={{ marginBottom: gameSectionOpen ? '9px' : 0 }} onClick={() => setGameSectionOpen(o => !o)}>
              {isAr ? 'اللعبة' : 'Game'}
              <span style={{ transform: gameSectionOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', fontSize: '9px' }}>▾</span>
            </button>
            {gameSectionOpen && (
              <select value={selectedGame} onChange={e => setSelectedGame(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', fontSize: '12px' }}>
                <option value="all">{isAr ? 'كل الألعاب' : 'All Games'}</option>
                {GAMES.map(g => <option key={g.id} value={g.id}>{isAr ? g.nameAr : g.name}</option>)}
              </select>
            )}
          </div>

          {/* Price range */}
          <div style={{ marginBottom: '16px' }}>
            <button className="filter-section-toggle" style={{ marginBottom: priceSectionOpen ? '9px' : 0 }} onClick={() => setPriceSectionOpen(o => !o)}>
              {isAr ? 'نطاق السعر (USD)' : 'Price Range (USD)'}
              <span style={{ transform: priceSectionOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', fontSize: '9px' }}>▾</span>
            </button>
            {priceSectionOpen && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <input placeholder={isAr ? 'من' : 'Min'} value={priceMin} onChange={e => setPriceMin(e.target.value)} style={{ width: '50%', padding: '6px 8px', fontSize: '12px' }} type="number" />
                <input placeholder={isAr ? 'إلى' : 'Max'} value={priceMax} onChange={e => setPriceMax(e.target.value)} style={{ width: '50%', padding: '6px 8px', fontSize: '12px' }} type="number" />
              </div>
            )}
          </div>
        </div>

        {/* listings */}
        <div>
          {/* Search + count + sort */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isAr ? 'بحث في العروض...' : 'Search listings...'}
              style={{ flex: 1, minWidth: '160px', padding: '9px 14px', fontSize: '13px' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {filtered.length} {isAr ? 'عرض' : 'listings'}
            </span>
            <div style={{ position: 'relative' }}>
              <button className="dropdown-trigger" onClick={() => setSortOpen(o => !o)}>
                {isAr ? 'ترتيب:' : 'Sort:'} {activeSortLabel}
                <span style={{ fontSize: '9px', transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▾</span>
              </button>
              {sortOpen && (
                <div className="card" style={{ position: 'absolute', insetInlineEnd: 0, top: 'calc(100% + 6px)', zIndex: 50, padding: '6px', minWidth: '190px' }}>
                  {sortOptions.map(opt => (
                    <button key={opt.val} onClick={() => { setSortBy(opt.val); setSortOpen(false) }} style={{
                      display: 'block', width: '100%', textAlign: isAr ? 'right' : 'left', background: sortBy === opt.val ? 'var(--accent-soft)' : 'none',
                      border: 'none', color: sortBy === opt.val ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '12px', fontWeight: sortBy === opt.val ? '700' : '500',
                      padding: '8px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'inherit',
                    }}>{opt.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE FILTER CHIP */}
          {selectedGameObj && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{isAr ? 'مُفلتر حسب:' : 'Filtered by:'}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-pill)', padding: '4px 6px 4px 12px', fontSize: '12px', fontWeight: '700', color: 'var(--accent)' }}>
                {isAr ? selectedGameObj.nameAr : selectedGameObj.name}
                <button onClick={() => setSelectedGame('all')} style={{ background: 'rgba(201,168,76,0.2)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', color: 'var(--accent)', cursor: 'pointer', fontSize: '11px', lineHeight: 1 }}>✕</button>
              </span>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <div style={{ fontSize: '14px' }}>{isAr ? 'لا توجد نتائج' : 'No listings found'}</div>
            </div>
          ) : (
            <RevealGroup style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
              {filtered.map(l => (
                <RevealItem key={l.id}>
                  <ListingCard listing={l} />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </div>
    </div>
  )
}
