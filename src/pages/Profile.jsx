import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase, fetchListings } from '../lib/supabase'

export default function Profile() {
  const { isAr } = useLang()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'

  useEffect(() => {
    if (!user) { navigate('/auth'); return }
    const url = supabase.storage.from('avatars').getPublicUrl(user.id + '/avatar').data.publicUrl + '?t=' + Date.now()
    setAvatarUrl(url)
    fetchListings().then(data => setListings(data.filter(l => l.seller_en === username)))
    supabase.from('orders_with_listings').select('*').then(({ data }) => { if (data) setOrders(data) })
  }, [user])

  if (!user) return null

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', direction: isAr ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>

        <div className="card" style={{ padding: '32px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <label style={{ cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(201,168,76,0.4)', background: 'linear-gradient(135deg, #c9a84c, #a07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', color: '#0c0a08', fontWeight: '800' }}>
              {avatarUrl ? <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} /> : username?.[0]?.toUpperCase()}
            </div>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
              const file = e.target.files[0]
              if (!file) return
              await supabase.storage.from('avatars').remove([user.id + '/avatar'])
              await supabase.storage.from('avatars').upload(user.id + '/avatar', file)
              setAvatarUrl(supabase.storage.from('avatars').getPublicUrl(user.id + '/avatar').data.publicUrl + '?t=' + Date.now())
            }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '26px', height: '26px', background: '#c9a84c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#0c0a08' }}>+</div>
          </label>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>{username}</div>
            <div style={{ fontSize: '14px', color: '#9a8570', marginBottom: '12px' }}>{user.email}</div>
            <div style={{ fontSize: '12px', color: '#c9a84c' }}>{isAr ? 'انقر على الصورة لتغييرها' : 'Click picture to change'}</div>
          </div>
          <button onClick={async () => { await signOut(); navigate('/') }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            {isAr ? 'تسجيل خروج' : 'Log Out'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: isAr ? 'عروضي' : 'My Listings', value: listings.length, color: '#c9a84c' },
            { label: isAr ? 'طلباتي' : 'My Orders', value: orders.length, color: '#10b981' },
            { label: isAr ? 'التقييم' : 'Rating', value: '4.9', color: '#c9a84c' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: s.color, marginBottom: '6px' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#9a8570' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }}>{isAr ? 'معلومات الحساب' : 'Account Info'}</h3>
          {[
            { label: isAr ? 'البريد الإلكتروني' : 'Email', value: user.email },
            { label: isAr ? 'اسم المستخدم' : 'Username', value: username },
            { label: isAr ? 'تاريخ الانضمام' : 'Member Since', value: new Date(user.created_at).toLocaleDateString() },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
              <span style={{ color: '#9a8570', fontSize: '14px' }}>{item.label}</span>
              <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '10px 20px' }}>
            {isAr ? 'لوحة التحكم' : 'Dashboard'}
          </button>
          <button onClick={() => navigate('/orders')} className="btn-outline" style={{ padding: '10px 20px' }}>
            {isAr ? 'طلباتي' : 'My Orders'}
          </button>
        </div>

      </div>
    </div>
  )
}