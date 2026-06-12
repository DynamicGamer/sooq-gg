import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const CATS = ['topups','accounts','currency','items','boosting','giftcards']

export default function Navbar() {
  const { t, toggle, isAr } = useLang()
  const { user, signOut } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => { await signOut(); navigate('/') }

  return (
    <nav style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '58px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Left: logo + cats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{
            width: '30px', height: '30px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            borderRadius: '7px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '14px',
          }}>⚡</div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
            {t.logo}<span style={{ color: 'var(--accent)' }}>.gg</span>
          </span>
        </Link>

        <div className="hide-mobile" style={{ display: 'flex', gap: '2px' }}>
          {CATS.map(c => (
            <Link key={c} to={`/listings/${c}`} style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >{t.nav[c]}</Link>
          ))}
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        {/* Lang toggle */}
        <button onClick={toggle} style={{
          background: 'var(--accent-soft)', border: '1px solid var(--accent-border)',
          color: '#a78bfa', padding: '5px 12px', borderRadius: 'var(--radius-md)',
          fontSize: '12px', fontWeight: '700',
        }}>🌐 {t.langToggle}</button>

        {/* Cart */}
        <Link to="/cart" style={{ position: 'relative', padding: '5px 10px' }}>
          <span style={{ fontSize: '18px' }}>🛒</span>
          {count > 0 && (
            <span style={{
              position: 'absolute', top: '0', [isAr ? 'left' : 'right']: '0',
              background: 'var(--accent)', color: '#fff',
              width: '16px', height: '16px', borderRadius: '50%',
              fontSize: '9px', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{count}</span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" className="btn-outline" style={{ padding: '5px 12px', fontSize: '12px' }}>
              {t.nav.dashboard}
            </Link>
            <button onClick={handleLogout} className="btn-outline" style={{ padding: '5px 12px', fontSize: '12px' }}>
              {t.nav.logout}
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" className="btn-outline" style={{ padding: '5px 12px', fontSize: '12px' }}>
              {t.nav.login}
            </Link>
            <Link to="/auth?mode=register" className="btn-primary" style={{ padding: '5px 12px', fontSize: '12px' }}>
              {t.nav.startSelling}
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
