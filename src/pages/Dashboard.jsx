import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase, fetchListings } from '../lib/supabase'

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
import MessagesInbox from '../components/MessagesInbox'
import { useState as useStateMsg, useEffect as useEffectMsg } from 'react'

const MOCK_ORDERS = []

const GAMES_LIST = ['PUBG Mobile','Free Fire','Fortnite','Clash of Clans','Mobile Legends','Valorant','FIFA Mobile','Genshin Impact']

export default function Dashboard() {
  const { t, isAr } = useLang()
  const { user } = useAuth()
  const td = t.dashboard
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'








  const [tab, setTab] = useState('listings')
  const [listings, setListings] = useState([])
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ game: '', titleAr: '', titleEn: '', price: '', desc: '' })
  if (!user) return <Navigate to="/auth" />
    useEffect(() => {
  const url = supabase.storage.from('avatars').getPublicUrl(user.id + '/avatar').data.publicUrl + '?t=' + Date.now()
  setAvatarUrl(url)
}, [user])

      useEffect(() => {
    fetchListings().then(data => {
      setListings(data.map(l => ({ ...l, typeEn: l.type_en, typeAr: l.type_ar, earnings: '0.00', status: 'active' })))
    })
  }, [])

  const [orders, setOrders] = useState([])

      useEffect(() => {
    supabase.from('orders_with_listings').select('*').then(({ data }) => {
      if (data) setOrders(data)
    })
  }, [])

  const totalEarnings = listings.reduce((s, l) => s + parseFloat(l.earnings || 0), 0).toFixed(2)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleAddListing = async () => {
    if (!form.game || !form.price) return alert('Please select a game and enter a price')
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
      delivery_key: 'instant',
      desc_ar: form.desc,
      desc_en: form.desc,
    }
    const { error } = await supabase.from('listings').insert([newListing])
    if (error) {
      alert('Error: ' + error.message)
    } else {
      setListings(prev => [...prev, { ...newListing, typeEn: newListing.type_en, typeAr: newListing.type_ar, earnings: '0.00', status: 'active' }])
      setForm({ game: '', titleAr: '', titleEn: '', price: '', desc: '' })
      setShowForm(false)
    }
  }

  const statsData = [
    { label: td.stats[0], value: `$${totalEarnings}`, icon: '💰' },
    { label: td.stats[1], value: orders.filter(o => o.status === 'pending').length, icon: '📦' },
    { label: td.stats[2], value: '4.9 ⭐', icon: '⭐' },
    { label: td.stats[3], value: `$${(totalEarnings * 0.9).toFixed(2)}`, icon: '💳' },
  ]

  const statusColor = { active: 'badge-green', pending: 'badge-gold', completed: 'badge-purple' }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
<label style={{ cursor: 'pointer', position: 'relative' }}>
  <div style={{ width: '52px', height: '52px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(201,168,76,0.4)', background: 'linear-gradient(135deg, #c9a84c, #a07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#0c0a08', fontWeight: '800' }}>
    {avatarUrl ? <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : username?.[0]?.toUpperCase()}
  </div>
  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => { const file = e.target.files[0]; if (!file) return; await supabase.storage.from('avatars').upload(user.id + '/avatar', file, { upsert: true }); setAvatarUrl(supabase.storage.from('avatars').getPublicUrl(user.id + '/avatar').data.publicUrl + '?t=' + Date.now() + '?t=' + Date.now()) }} />
  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', background: '#c9a84c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#0c0a08' }}>+</div>
</label>
          <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{td.title}</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {isAr ? `مرحباً، ${username}` : `Welcome back, ${username}`}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>{td.addListing}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {statsData.map(s => (
          <div key={s.label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

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

      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        {[
          { id: 'listings', label: td.tabListings },
          { id: 'orders', label: td.tabOrders },
          { id: 'earnings', label: td.tabEarnings },
          { id: 'messages', label: isAr ? 'Messages' : 'Messages' },
        ].map(tab_item => (
          <button key={tab_item.id} onClick={() => setTab(tab_item.id)} style={{ padding: '7px 18px', borderRadius: 'calc(var(--radius-md) - 2px)', border: 'none', background: tab === tab_item.id ? 'var(--accent)' : 'transparent', color: tab === tab_item.id ? '#fff' : 'var(--text-muted)', fontSize: '13px', fontWeight: '700', transition: 'all 0.15s' }}>{tab_item.label}</button>
        ))}
      </div>
      {tab === 'listings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {listings.map(l => (
            <div key={l.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}><img src={GAME_IMAGES[l.game]} alt={l.game} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none' }} /></div>
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
                <span className={`badge ${statusColor[l.status] || 'badge-purple'}`}>{td.status?.[l.status] || l.status}</span>
                <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '11px' }}
                  onClick={() => setListings(prev => prev.filter(x => x.id !== l.id))}>
                  {isAr ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {orders.map(o => (
            <div key={o.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "13px" }}>{o.game ? o.game + "   " + o.type_en : o.grand_total}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{isAr ? "???????:" : "Buyer:"} {o.buyer_id?.slice(0,8)}...   {new Date(o.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: "800", color: "#fff" }}>${o.grand_total}</span>
                <span className={`badge ${statusColor[o.status] || 'badge-purple'}`}>{td.status?.[o.status] || o.status}</span>
                {o.status === 'pending' && (
                  <button className="btn-primary" style={{ padding: '5px 12px', fontSize: '11px' }}>{td.confirm}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
      {tab === 'messages' && (
        <MessagesInbox username={username} isAr={isAr} />
      )}
    </div>
  )
}










