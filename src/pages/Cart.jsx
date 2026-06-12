import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { t, isAr } = useLang()
  const { items, removeItem, updateQty, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const tc = t.cart
  const [payMethod, setPayMethod] = useState(0)
  const [ordered, setOrdered] = useState(false)

  const fee = total * 0.05
  const grandTotal = total + fee

  const handleCheckout = () => {
    if (!user) { navigate('/auth'); return }
    setOrdered(true)
    clearCart()
  }

  if (ordered) return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
      <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>
        {isAr ? 'تم الطلب بنجاح!' : 'Order Placed!'}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        {isAr ? 'البائع سيتواصل معك قريباً لإتمام التسليم.' : 'The seller will contact you shortly to complete delivery.'}
      </p>
      <Link to="/" className="btn-primary">{isAr ? 'العودة للرئيسية' : 'Back to Home'}</Link>
    </div>
  )

  if (items.length === 0) return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛒</div>
      <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>{tc.empty}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{tc.emptyDesc}</p>
      <Link to="/listings/topups" className="btn-primary">{tc.browseShopping}</Link>
    </div>
  )

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>{tc.title}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>

        {/* ITEMS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map(item => (
            <div key={item.id} className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ width: '44px', height: '44px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                🎮
              </div>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '3px' }}>{item.name || (isAr ? item.typeAr : item.typeEn)}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.game}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="btn-outline" style={{ width: '28px', height: '28px', padding: 0 }} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                <button className="btn-outline" style={{ width: '28px', height: '28px', padding: 0 }} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
              <div style={{ fontWeight: '800', fontSize: '16px', color: '#fff', minWidth: '60px', textAlign: 'center' }}>
                ${(parseFloat(item.price) * item.qty).toFixed(2)}
              </div>
              <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer', padding: '4px' }}>🗑️</button>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div style={{ position: 'sticky', top: '74px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>{tc.summary}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{tc.subtotal}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{tc.fee} (5%)</span>
                <span>${fee.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px', marginBottom: '20px' }}>
              <span>{tc.total}</span>
              <span style={{ color: 'var(--accent)' }}>${grandTotal.toFixed(2)}</span>
            </div>

            {/* Payment method */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>{tc.payWith}</div>
              {tc.methods.map((m, i) => (
                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '8px', cursor: 'pointer', color: payMethod === i ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  <input type="radio" name="pay" checked={payMethod === i} onChange={() => setPayMethod(i)} />
                  {m}
                </label>
              ))}
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px', marginBottom: '10px' }} onClick={handleCheckout}>
              {tc.checkout}
            </button>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>{tc.secure}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
