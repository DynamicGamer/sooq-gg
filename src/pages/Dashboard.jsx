import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase, fetchListings } from '../lib/supabase'

const MOCK_LISTINGS = [
  { id: 'ml1', game: 'PUBG Mobile', typeAr: '660 UC', typeEn: '660 UC', price: '3.20', status: 'active', sales: 12, earnings: '38.40' },
  { id: 'ml2', game: 'Free Fire',   typeAr: '520 ماسة', typeEn: '520 Diamonds', price: '2.80', status: 'active', sales: 7, earnings: '19.60' },
]
const MOCK_ORDERS = [
  { id: 'o1', buyer: 'Ahmed_JO', item: '660 UC', qty: 2, total: '6.40', status: 'pending', date: '2025-06-10' },
  { id: 'o2', buyer: 'KSA_Player', item: '520 Diamonds', qty: 1, total: '2.80', status: 'completed', date: '2025-06-09' },
]

const GAMES_LIST = ['PUBG Mobile','Free Fire','Fortnite','Clash of Clans','Mobile Legends','Valorant','FIFA Mobile','Genshin Impact']

export default function Dashboard() {
  const { t, isAr } = useLang()
  const { user } = useAuth()
  const td = t.dashboard

  const [tab, setTab] = useState('listings')
  const [listings, setListings] = useState([])

  useEffect(() => {
    fetchListings().then(data => {
      setListings(data.filter(l => l.seller_en === username).map(l => ({ ...l, typeEn: l.type_en, typeAr: l.type_ar, earnings: "0.00", status: "active" })))
    })
  }, [])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ game: '', titleAr: '', titleEn: '', price: '', qty: '', desc: '' })

  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User'
  if (!user) return <Navigate to="/auth" />
  const totalEarnings = listings.reduce((s, l) => s + parseFloat(l.earnings), 0).toFixed(2)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleAddListing = async () => {
    if (!form.game || !form.price) return
    const newListing = {
      id: `l${Date.now()}`,
      game_id: 0,
      game: form.game,
      type_en: form.titleEn || form.titleAr,
      type_ar: form.titleAr || form.titleEn,
      price: form.price,
      seller: username,
      seller_en: username,
      rating: 5.0,
      sales: 0,
      badge_key: null,
      delivery_key: "instant",
      desc_ar: form.desc,
      desc_en: form.desc,
    }
    const { error } = await supabase.from("listings").insert([newListing])
    console.log("error:", error)
    console.log("newListing:", JSON.stringify(newListing))
    if (!error) {
      setListings(prev => [...prev, { ...newListing, earnings: "0.00", status: "active" }])
      setForm({ game: "", titleAr: "", titleEn: "", price: "", qty: "", desc: "" })
      setShowForm(false)
    } else {
      alert("Error: " + error.message)
    }
  }

  const statsData = [
    { label: td.stats[0], value: `$${totalEarnings}`, icon: '💰' },
    { label: td.stats[1], value: MOCK_ORDERS.filter(o => o.status === 'pending').length, icon: '📦' },
    { label: td.stats[2], value: '4.9 ⭐', icon: '⭐' },
    { label: td.stats[3], value: `$${(totalEarnings * 0.9).toFixed(2)}`, icon: '💳' },
  ]

  const statusColor = { active: 'badge-green', pending: 'badge-gold', completed: 'badge-purple' }

  return (
    <div className="page-container">
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{td.title}</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {isAr ? `مرحباً، ${username}` : `Welcome back, ${username}`}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>{td.addListing}</button>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {statsData.map(s => (
          <div key={s.label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ADD LISTING FORM */}
      {showForm && (
        <div className="card" style={{ padding: '20px', marginBottom: '20px', border: '1px solid var(--accent-border)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>{td.addListing}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>{td.game}</label>
              <select value={form.game} onChange={e => set('game', e.target.value)} style={{ width: '100%', padding: '8px 10px', fontSize: '12px' }}>
                <option value="">{isAr ? 'اختر اللعبة' : 'Select Game'}</option>
                {GAMES_LIST.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>{td.listingTitle} (AR)</label>
              <input value={form.titleAr} onChange={e => set('titleAr', e.target.value)} placeholder="مثال: 660 UC" style={{ width: '100%', padding: '8px 10px', fontSize: '12px' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>{td.listingTitle} (EN)</label>
              <input value={form.titleEn} onChange={e => set('titleEn', e.target.value)} placeholder="e.g. 660 UC" style={{ width: '100%', padding: '8px 10px', fontSize: '12px' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>{td.price} (USD)</label>
              <input type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="3.99" style={{ width: '100%', padding: '8px 10px', fontSize: '12px' }} />
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>{td.description}</label>
            <textarea value={form.desc} onChange={e => set('desc', e.target.value)} rows={3} style={{ width: '100%', padding: '8px 10px', fontSize: '12px', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-primary" onClick={handleAddListing}>{td.saveListing}</button>
            <button className="btn-outline" onClick={() => setShowForm(false)}>{td.cancelBtn}</button>
          </div>
        </div>
      )}

      {/* TABS */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        {[
          { id: 'listings', label: td.tabListings },
          { id: 'orders', label: td.tabOrders },
          { id: 'earnings', label: td.tabEarnings },
        ].map(tab_item => (
          <button key={tab_item.id} onClick={() => setTab(tab_item.id)} style={{
            padding: '7px 18px', borderRadius: 'calc(var(--radius-md) - 2px)', border: 'none',
            background: tab === tab_item.id ? 'var(--accent)' : 'transparent',
            color: tab === tab_item.id ? '#fff' : 'var(--text-muted)',
            fontSize: '13px', fontWeight: '700', transition: 'all 0.15s',
          }}>{tab_item.label}</button>
        ))}
      </div>

      {/* LISTINGS TAB */}
      {tab === 'listings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {listings.map(l => (
            <div key={l.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎮</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '13px' }}>{isAr ? l.typeAr : l.typeEn}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l.game}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>${l.price}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{td.price}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>{l.sales}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.home.deals}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--green)' }}>${l.earnings}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{td.earnings}</div>
                </div>
                <span className={`badge ${statusColor[l.status] || 'badge-purple'}`}>{td.status[l.status]}</span>
                <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '11px' }}
                  onClick={() => setListings(prev => prev.filter(x => x.id !== l.id))}>
                  {isAr ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {MOCK_ORDERS.length === 0
            ? <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>{td.noOrders}</div>
            : MOCK_ORDERS.map(o => (
              <div key={o.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '13px' }}>{o.item} × {o.qty}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isAr ? 'المشتري:' : 'Buyer:'} {o.buyer} · {o.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: '800', color: '#fff' }}>${o.total}</span>
                  <span className={`badge ${statusColor[o.status] || 'badge-purple'}`}>{td.status[o.status]}</span>
                  {o.status === 'pending' && (
                    <button className="btn-primary" style={{ padding: '5px 12px', fontSize: '11px' }}>{td.confirm}</button>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* EARNINGS TAB */}
      {tab === 'earnings' && (
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{td.earnings}</div>
          <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--green)', marginBottom: '20px' }}>${totalEarnings}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {isAr ? 'الرصيد المتاح للسحب (بعد عمولة 10%)' : 'Available balance for withdrawal (after 10% commission)'}
          </p>
          <button className="btn-primary" style={{ padding: '10px 28px' }}>{td.withdraw}</button>
        </div>
      )}
    </div>
  )
}






