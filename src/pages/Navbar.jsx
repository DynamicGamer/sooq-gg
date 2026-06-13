import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const CATS = ['topups','accounts','currency','items','boosting','giftcards']

export default function Navbar() {
  const { t, toggle, isAr } = useLang()
  const { user, signOut } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => { await signOut(); navigate('/') }

  return (
    <nav style={{
      background: 'rgba(10,11,15,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '62px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo + Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}>⚡</div>
          <span style={{ fontSize: '20px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>
            {t.logo}<span style={{ color: '#7c3aed' }}>.gg</span>
          </span>
        </Link>

        <div className="hide-mobile" style={{ display: 'flex', gap: '2px' }}>
          {CATS.map(c => (
            <Link key={c} to={`/listings/${c}`} style={{
              color: location.pathname === `/listings/${c}` ? '#a78bfa' : '#64748b',
              padding: '5px 11px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              background: location.pathname === `/listings/${c}` ? 'rgba(124,58,237,0.12)' : 'transparent',
              transition: 'all 0.15s',
              textDecoration: 'none',
            }}
              onMouseEnter={e => { if (location.pathname !== `/listings/${c}`) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' } }}
              onMouseLeave={e => { if (location.pathname !== `/listings/${c}`) { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' } }}
            >{t.nav[c]}</Link>
          ))}
        </div>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={toggle} style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
          🌐 {t.langToggle}
        </button>

        <Link to="/cart" style={{ position: 'relative', padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '20px' }}>🛒</span>
          {count > 0 && (
            <span style={{ position: 'absolute', top: '0', [isAr ? 'left' : 'right']: '0', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#fff', width: '17px', height: '17px', borderRadius: '50%', fontSize: '9px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/orders" style={{ color: '#64748b', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
              {isAr ? 'طلباتي' : 'Orders'}
            </Link>
            <Link to="/dashboard" className="btn-outline" style={{ padding: '6px 14px', fontSize: '13px' }}>
              {t.nav.dashboard}
            </Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '13px', cursor: 'pointer', padding: '6px' }}>
              {t.nav.logout}
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" className="btn-outline" style={{ padding: '7px 16px', fontSize: '13px' }}>
              {t.nav.login}
            </Link>
            <Link to="/auth?mode=register" className="btn-primary" style={{ padding: '7px 16px', fontSize: '13px' }}>
              {t.nav.startSelling}
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
