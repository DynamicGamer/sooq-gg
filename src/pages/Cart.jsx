import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import GameThumb from '../components/GameThumb'

export default function Cart() {
  const { t, isAr } = useLang()
  const { items, removeItem, updateQty, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const tc = t.cart
  const fee = total * 0.07
  const grandTotal = total + fee

  const handleCheckout = () => {
    if (!user) { navigate('/auth'); return }
    navigate('/checkout')
  }

  if (items.length === 0) return (
    <Reveal className="page-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛒</div>
      <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>{tc.empty}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{tc.emptyDesc}</p>
      <Link to="/listings/topups" className="btn-primary">{tc.browseShopping}</Link>
    </Reveal>
  )

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>{tc.title}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>

        <RevealGroup style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map(item => (
            <RevealItem key={item.id}>
            <div className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <GameThumb game={item.game} style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', flexShrink: 0 }} emojiSize="20px" />
              <div style={{ flex: 1, minWidth: '140px' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '3px' }}>{item.name || (isAr ? item.typeAr : item.typeEn)}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.game}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="btn-outline" style={{ width: '28px', height: '28px', padding: 0 }} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                <button className="btn-outline" style={{ width: '28px', height: '28px', padding: 0 }} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
              <div style={{ fontWeight: '800', fontSize: '16px', color: '#fff', minWidth: '60px', textAlign: 'center', fontFamily: 'var(--font-display)' }}>
                ${(parseFloat(item.price) * item.qty).toFixed(2)}
              </div>
              <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer', padding: '4px' }}>🗑️</button>
            </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal style={{ position: 'sticky', top: '74px' }} delay={0.1}>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>{tc.summary}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{tc.subtotal}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'عمولة المنصة (7%)' : 'Platform fee (7%)'}</span>
                <span>${fee.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px', marginBottom: '20px' }}>
              <span>{tc.total}</span>
              <span style={{ color: 'var(--accent)' }}>${grandTotal.toFixed(2)}</span>
            </div>

            <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '12px', color: '#a78bfa', marginBottom: '16px' }}>
              🛡️ {isAr ? 'الدفع محمي بنظام الضمان — أموالك محفوظة حتى تؤكد استلام طلبك' : 'Payment protected by escrow — funds held until you confirm delivery'}
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px' }} onClick={handleCheckout}>
              {tc.checkout} ←
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
