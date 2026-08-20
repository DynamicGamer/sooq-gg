import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase, fetchListings } from '../lib/supabase'
import MessagesInbox from '../components/MessagesInbox'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import { countryLabel } from '../lib/countries'

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

const GAMES_LIST = ['PUBG Mobile','Free Fire','Fortnite','Clash of Clans','Mobile Legends','Valorant','FIFA Mobile','Genshin Impact','Call of Duty Mobile','League of Legends','Steam Wallet','PlayStation']

export default function Dashboard() {
  const { t, isAr } = useLang()
  const { user } = useAuth()
  const td = t.dashboard
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'

  const [tab, setTab] = useState('listings')
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ game: '', category: 'topups', titleAr: '', titleEn: '', price: '', desc: '' })

  useEffect(() => {
    if (user) {
      const url = supabase.storage.from('avatars').getPublicUrl(user.id + '/avatar').data.publicUrl + '?t=' + Date.now()
      setAvatarUrl(url)
    }
  }, [user])

  useEffect(() => {
    fetchListings().then(data => {
      setListings(data.filter(l => l.seller_en === username).map(l => ({ ...l, typeEn: l.type_en, typeAr: l.type_ar, earnings: '0.00', status: 'active' })))
    })
  }, [])

  useEffect(() => {
    supabase.from('orders_with_listings').select('*').then(({ data }) => {
      if (data) setOrders(data)
    })
  }, [])

  if (!user) return <Navigate to="/auth" />

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
      country: user.user_metadata?.country || null,
      category: form.category,
    }
    const { error } = await supabase.from('listings').insert([newListing])
    if (error) {
      alert('Error: ' + error.message)
    } else {
      setListings(prev => [...prev, { ...newListing, typeEn: newListing.type_en, typeAr: newListing.type_ar, earnings: '0.00', status: 'active' }])
    setForm({ game: '', category: 'topups', titleAr: '', titleEn: '', price: '', desc: '' })
      setShowForm(false)
    }
  }

  const statsData = [
    { label: td.stats[0], value: `$${totalEarnings}`, icon: '💰', color: '#c9a84c' },
    { label: td.stats[1], value: orders.filter(o => o.status === 'pending').length, icon: '📦', color: '#3b82f6' },
    { label: td.stats[2], value: '4.9 ⭐', icon: '⭐', color: '#a78bfa' },
    { label: td.stats[3], value: `$${(totalEarnings * 0.9).toFixed(2)}`, icon: '💳', color: '#10b981' },
  ]

  const statusColor = { active: 'badge-green', pending: 'badge-gold', completed: 'badge-purple' }

  return (
    <div className="page-container">
      <Reveal style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1205 0%, #0f0c06 100%)',
        border: '1px solid rgba(201,168,76,0.25)', borderRadius: 'var(--radius-xl)',
        padding: '28px 28px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
      }}>
        <div style={{ position: 'absolute', top: '-70px', insetInlineEnd: '-70px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
          <label style={{ cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(201,168,76,0.5)', boxShadow: 'var(--glow-gold-soft)', background: 'linear-gradient(135deg, #c9a84c, #a07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#0c0a08', fontWeight: '800' }}>
              {avatarUrl ? <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : username?.[0]?.toUpperCase()}
            </div>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => { const file = e.target.files[0]; if (!file) return; await supabase.storage.from('avatars').remove([user.id + '/avatar']); await supabase.storage.from('avatars').upload(user.id + '/avatar', file); setAvatarUrl(supabase.storage.from('avatars').getPublicUrl(user.id + '/avatar').data.publicUrl + '?t=' + Date.now()) }} />
            <div style={{ position: 'absolute', bottom: 0, insetInlineEnd: 0, width: '18px', height: '18px', background: '#c9a84c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#0c0a08', fontWeight: '800', border: '2px solid #0f0c06' }}>+</div>
          </label>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>{td.title}</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{'Welcome back, ' + username}</p>
          </div>
        </div>
        <motion.button className="btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowForm(true)} style={{ position: 'relative' }}>{td.addListing}</motion.button>
      </Reveal>

      <RevealGroup style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {statsData.map(s => (
          <RevealItem key={s.label}>
            <div className="card" style={{ padding: '18px 16px', textAlign: 'center', borderTop: `2px solid ${s.color}` }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${s.color}18`, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', margin: '0 auto 10px' }}>{s.icon}</div>
              <div style={{ fontSize: '21px', fontWeight: '800', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      {showForm && (
        <div className="card" style={{ padding: '20px', marginBottom: '20px', border: '1px solid var(--accent-border)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>{td.addListing}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={{ width: '100%', padding: '8px 10px', fontSize: '12px' }}>
                <option value='topups'>Top-Ups</option>
                <option value='accounts'>Accounts</option>
                <option value='currency'>Currency</option>
                <option value='items'>Items</option>
                <option value='boosting'>Boosting</option>
                <option value='giftcards'>Gift Cards</option>
              </select>
            </div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>{td.game}</label>
              <select value={form.game} onChange={e => set('game', e.target.value)} style={{ width: '100%', padding: '8px 10px', fontSize: '12px' }}>
                <option value="">Select Game</option>
                {GAMES_LIST.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>{td.listingTitle} (AR)</label>
              <input value={form.titleAr} onChange={e => set('titleAr', e.target.value)} placeholder="e.g. 660 UC" style={{ width: '100%', padding: '8px 10px', fontSize: '12px' }} />
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

      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-lg)', width: 'fit-content' }}>
        {[
          { id: 'listings', label: td.tabListings, icon: '🎮' },
          { id: 'orders', label: td.tabOrders, icon: '📦' },
          { id: 'earnings', label: td.tabEarnings, icon: '💰' },
          { id: 'messages', label: 'Messages', icon: '💬' },
        ].map(tab_item => (
          <button key={tab_item.id} onClick={() => setTab(tab_item.id)} style={{
            padding: '8px 18px', borderRadius: 'var(--radius-md)', border: 'none',
            background: tab === tab_item.id ? 'linear-gradient(135deg, #c9a84c, #a07830)' : 'transparent',
            color: tab === tab_item.id ? '#0f0f0f' : 'var(--text-muted)',
            fontSize: '13px', fontWeight: '700', transition: 'all 0.15s', cursor: 'pointer',
            boxShadow: tab === tab_item.id ? 'var(--glow-gold-soft)' : 'none',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}><span>{tab_item.icon}</span>{tab_item.label}</button>
        ))}
      </div>

      {tab === 'listings' && (
        <RevealGroup style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {listings.length === 0 && (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎮</div>
              {isAr ? 'لا توجد عروض بعد' : 'No listings yet'}
            </div>
          )}
          {listings.map(l => (
            <RevealItem key={l.id}>
              <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(201,168,76,0.2)' }}>
                    <img src={GAME_IMAGES[l.game]} alt={l.game} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '13px', fontFamily: 'var(--font-display)' }}>{isAr ? l.typeAr : l.typeEn}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {l.game}{l.country && <span>· {countryLabel(l.country, isAr)}</span>}
                    </div>
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
                  <button className="btn-outline" style={{ padding: '5px 12px', fontSize: '11px' }}
                    onClick={async () => { await supabase.from('listings').delete().eq('id', l.id); setListings(prev => prev.filter(x => x.id !== l.id)) }}>
                    Delete
                  </button>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      {tab === 'orders' && (
        <RevealGroup style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {orders.length === 0 && (
            <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📦</div>
              {isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}
            </div>
          )}
          {orders.map(o => (
            <RevealItem key={o.id}>
              <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '13px', fontFamily: 'var(--font-display)' }}>{o.game ? o.game + ' - ' + o.type_en : o.grand_total} - ${o.grand_total}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{'Buyer: ' + (o.buyer_id?.slice(0,8) || '?') + '... - ' + new Date(o.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: '800', color: '#fff', fontFamily: 'var(--font-display)' }}>${o.grand_total}</span>
                  <span className={`badge ${statusColor[o.status] || 'badge-purple'}`}>{td.status?.[o.status] || o.status}</span>
                  {o.status === 'pending' && (
                    <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '11px' }}>{td.confirm}</button>
                  )}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      {tab === 'earnings' && (
        <Reveal className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{td.earnings}</div>
          <div className="text-glow" style={{ fontSize: '44px', fontWeight: '800', color: 'var(--green)', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>${totalEarnings}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Available balance for withdrawal (after 10% commission)
          </p>
          <button className="btn-primary" style={{ padding: '10px 28px' }}>{td.withdraw}</button>
        </Reveal>
      )}

      {tab === 'messages' && (
        <MessagesInbox username={username} isAr={isAr} />
      )}
    </div>
  )
}

