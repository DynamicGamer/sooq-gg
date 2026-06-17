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
      background: 'rgba(15,15,15,0.97)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(201,168,76,0.12)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '62px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      direction: isAr ? 'rtl' : 'ltr',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #c9a84c, #a07830)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', boxShadow: '0 4px 12px rgba(201,168,76,0.4)' }}>⚡</div>
          <span style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>
            {t.logo}<span style={{ color: '#c9a84c' }}>.gg</span>
          </span>
        </Link>

        <div className="hide-mobile" style={{ display: 'flex', gap: '2px' }}>
          {CATS.map(c => (
            <Link key={c} to={`/listings/${c}`} style={{
              color: location.pathname === `/listings/${c}` ? '#c9a84c' : '#9a8570',
              padding: '5px 11px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              background: location.pathname === `/listings/${c}` ? 'rgba(201,168,76,0.1)' : 'transparent',
              transition: 'all 0.15s',
              textDecoration: 'none',
            }}
              onMouseEnter={e => { if (location.pathname !== `/listings/${c}`) { e.currentTarget.style.color = '#d4c5a9'; e.currentTarget.style.background = 'rgba(201,168,76,0.06)' } }}
              onMouseLeave={e => { if (location.pathname !== `/listings/${c}`) { e.currentTarget.style.color = '#9a8570'; e.currentTarget.style.background = 'transparent' } }}
            >{t.nav[c]}</Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={toggle} style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
          🌐 {t.langToggle}
        </button>

        <Link to="/cart" style={{ position: 'relative', padding: '6px 10px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '20px' }}>🛒</span>
          {count > 0 && (
            <span style={{ position: 'absolute', top: '0', [isAr ? 'left' : 'right']: '0', background: 'linear-gradient(135deg, #c9a84c, #a07830)', color: '#0c0a08', width: '17px', height: '17px', borderRadius: '50%', fontSize: '9px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/orders" style={{ color: '#9a8570', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(201,168,76,0.12)', background: 'rgba(201,168,76,0.04)', textDecoration: 'none' }}>
              {isAr ? 'طلباتي' : 'Orders'}
            </Link>
            <Link to="/dashboard" style={{ color: '#c9a84c', padding: '6px 14px', fontSize: '13px', fontWeight: '700', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '8px', background: 'rgba(201,168,76,0.08)', textDecoration: 'none' }}>
              {t.nav.dashboard}
            </Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#9a8570', fontSize: '13px', cursor: 'pointer', padding: '6px' }}>
              {t.nav.logout}
            </button>
          </>
        ) : (
          <>
            <Link to="/auth" style={{ color: '#d4c5a9', padding: '7px 16px', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', background: 'transparent', textDecoration: 'none' }}>
              {t.nav.login}
            </Link>
            <Link to="/auth?mode=register" style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)', color: '#0c0a08', padding: '7px 16px', fontSize: '13px', fontWeight: '800', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(201,168,76,0.3)' }}>
              {t.nav.startSelling}
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
