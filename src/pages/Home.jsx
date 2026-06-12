import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { GAMES, LISTINGS } from '../lib/supabase'

export default function Home() {
  const { t, isAr } = useLang()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const h = t.home
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('topups')

  const cats = [
    { id: 'topups', label: t.nav.topups, icon: '⚡' },
    { id: 'accounts', label: t.nav.accounts, icon: '🎮' },
    { id: 'currency', label: t.nav.currency, icon: '💰' },
    { id: 'items', label: t.nav.items, icon: '⚔️' },
    { id: 'boosting', label: t.nav.boosting, icon: '🚀' },
    { id: 'giftcards', label: t.nav.giftcards, icon: '🎁' },
  ]

  const filteredGames = GAMES.filter(g =>
    !search ||
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.nameAr.includes(search)
  )

  const getBadge = (key) => key === 'trusted' ? t.trusted : key === 'vip' ? t.vipSeller : null

  return (
    <div>
      {/* HERO */}
      <div style={{
        background: 'linear-gradient(180deg, #13101f 0%, var(--bg-primary) 100%)',
        padding: '52px 24px 40px', textAlign: 'center',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'inline-block', background: 'var(--accent-soft)',
          border: '1px solid var(--accent-border)', borderRadius: '20px',
          padding: '4px 14px', fontSize: '11px', color: '#a78bfa',
          marginBottom: '18px', fontWeight: '700',
        }}>{h.badge}</div>

        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 46px)', fontWeight: '800',
          color: '#fff', lineHeight: '1.2', maxWidth: '650px', margin: '0 auto 14px',
        }}>
          {h.h1a}{' '}
          <span style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {h.h1b}
          </span>{' '}
          {h.h1c}
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '480px', margin: '0 auto 28px', lineHeight: '1.7' }}>
          {h.sub}
        </p>

        <div style={{ maxWidth: '540px', margin: '0 auto', position: 'relative' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate(`/listings/topups?q=${search}`)}
            placeholder={h.searchPlaceholder}
            style={{ width: '100%', padding: isAr ? '13px 18px 13px 105px' : '13px 105px 13px 18px', fontSize: '13px', borderRadius: '11px' }}
          />
          <button
            onClick={() => navigate(`/listings/topups?q=${search}`)}
            className="btn-primary"
            style={{ position: 'absolute', [isAr ? 'left' : 'right']: '7px', top: '50%', transform: 'translateY(-50%)', padding: '7px 16px', fontSize: '13px' }}
          >{h.searchBtn}</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '28px', marginTop: '40px' }}>
          {h.stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.icon} {s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUST BAR */}
      <div style={{
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
        padding: '12px 24px', display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap',
      }}>
        {h.trust.map(b => (
          <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>{b.icon}</span><span>{b.text}</span>
          </div>
        ))}
      </div>

      <div className="page-container">
        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: '7px', marginBottom: '22px', overflowX: 'auto', paddingBottom: '4px' }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
              background: activeCat === c.id ? 'var(--accent)' : 'var(--bg-tertiary)',
              border: `1px solid ${activeCat === c.id ? 'var(--accent)' : 'var(--border-hover)'}`,
              color: activeCat === c.id ? '#fff' : 'var(--text-secondary)',
              padding: '7px 16px', borderRadius: 'var(--radius-md)', fontSize: '13px',
              fontWeight: activeCat === c.id ? '700' : '400', whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}>{c.icon} {c.label}</button>
          ))}
        </div>

        {/* GAMES GRID */}
        <div className="section-header">
          <span className="section-title">{h.popularGames}</span>
          <Link to="/listings/topups" className="section-link">{h.viewAll}</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '36px' }}>
          {filteredGames.map(g => (
            <Link key={g.id} to={`/listings/topups?game=${g.id}`} style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '14px 10px',
              textAlign: 'center', position: 'relative', transition: 'all 0.15s', display: 'block',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = '#13101f' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
            >
              {g.hot && (
                <span className="badge badge-purple" style={{ position: 'absolute', top: '7px', [isAr ? 'right' : 'left']: '7px' }}>HOT</span>
              )}
              <div style={{ fontSize: '28px', marginBottom: '7px' }}>{g.img}</div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {isAr ? g.nameAr : g.name}
              </div>
              <div style={{ fontSize: '10px', color: g.color, background: `${g.color}18`, border: `1px solid ${g.color}35`, borderRadius: '4px', padding: '2px 5px', display: 'inline-block', marginBottom: '5px' }}>
                {isAr ? g.tagAr : g.tagEn}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{g.sellers} {h.sellers}</div>
            </Link>
          ))}
        </div>

        {/* BEST DEALS */}
        <div className="section-header">
          <span className="section-title">{h.bestDeals}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {h.filters.map(f => (
              <button key={f} className="btn-outline" style={{ padding: '3px 9px', fontSize: '11px' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '36px' }}>
          {LISTINGS.map(l => {
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

        {/* HOW IT WORKS */}
        <div className="card" style={{ padding: '28px', marginBottom: '28px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>{h.howTitle}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '28px' }}>{h.howSub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
            {h.steps.map(s => (
              <div key={s.n}>
                <div style={{ width: '44px', height: '44px', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 10px' }}>{s.icon}</div>
                <div style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: '700', marginBottom: '4px' }}>{h.step} {s.n}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '5px' }}>{s.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-soft) 0%, #13101f 100%)',
          border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-xl)',
          padding: '28px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px' }}>{h.ctaTitle}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>{h.ctaSub}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn-outline">{h.ctaLearn}</button>
            <Link to="/auth?mode=register" className="btn-primary">{h.ctaReg}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
