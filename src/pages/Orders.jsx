import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    items: [{ name: '660 UC', game: 'PUBG Mobile', price: '3.20', qty: 1 }],
    grand_total: '3.42',
    crypto_symbol: 'USDT',
    crypto_network: 'TRC20 (Tron)',
    status: 'pending_payment',
    created_at: '2025-06-12T10:00:00Z',
  },
  {
    id: 'ORD-002',
    items: [{ name: '520 Diamonds', game: 'Free Fire', price: '2.80', qty: 2 }],
    grand_total: '5.99',
    crypto_symbol: 'USDT',
    crypto_network: 'BEP20 (BNB Chain)',
    status: 'funds_held',
    created_at: '2025-06-11T14:00:00Z',
  },
]

const STATUS_CONFIG = {
  pending_payment: { colorAr: 'في انتظار الدفع', colorEn: 'Pending Payment', color: '#f59e0b', bg: '#1f1a09', border: '#854f0b' },
  funds_held:      { colorAr: 'الأموال محجوزة', colorEn: 'Funds Held', color: '#a78bfa', bg: '#1e1b4b', border: '#3730a3' },
  delivered:       { colorAr: 'تم التسليم', colorEn: 'Delivered', color: '#34d399', bg: '#0a1f12', border: '#065f46' },
  completed:       { colorAr: 'مكتمل', colorEn: 'Completed', color: '#4ade80', bg: '#0f2318', border: '#166534' },
  disputed:        { colorAr: 'نزاع', colorEn: 'Disputed', color: '#f87171', bg: '#1f0a0a', border: '#991b1b' },
}

export default function Orders() {
  const { isAr } = useLang()
  const { user } = useAuth()
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [loading, setLoading] = useState(false)

  if (!user) return <Navigate to="/auth" />

  const confirmDelivery = async (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed' } : o))
    try {
      await supabase.from('escrow_orders').update({ status: 'completed' }).eq('id', orderId)
    } catch (e) { console.log(e) }
  }

  const openDispute = async (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'disputed' } : o))
    try {
      await supabase.from('escrow_orders').update({ status: 'disputed' }).eq('id', orderId)
    } catch (e) { console.log(e) }
  }

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>
        {isAr ? 'طلباتي' : 'My Orders'}
      </h1>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
          <div>{isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map(order => {
            const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_payment
            return (
              <div key={order.id} className="card" style={{ padding: '20px' }}>

                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--accent)' }}>{order.id}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '10px', marginLeft: '10px' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{
                    background: sc.bg,
                    border: `1px solid ${sc.border}`,
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: sc.color,
                  }}>
                    {isAr ? sc.colorAr : sc.colorEn}
                  </div>
                </div>

                {/* ITEMS */}
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span>{item.name} × {item.qty} <span style={{ color: 'var(--text-muted)' }}>— {item.game}</span></span>
                    <span>${(parseFloat(item.price) * item.qty).toFixed(2)}</span>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid var(--border)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {isAr ? 'الإجمالي:' : 'Total:'}{' '}
                    </span>
                    <span style={{ fontWeight: '800', fontSize: '16px', color: '#fff' }}>${order.grand_total}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginRight: '8px', marginLeft: '8px' }}>
                      {order.crypto_symbol} · {order.crypto_network}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {order.status === 'funds_held' || order.status === 'delivered' ? (
                      <>
                        <button className="btn-primary" style={{ padding: '7px 16px', fontSize: '12px', background: '#10b981', border: 'none' }}
                          onClick={() => confirmDelivery(order.id)}>
                          ✓ {isAr ? 'تأكيد الاستلام' : 'Confirm Delivery'}
                        </button>
                        <button className="btn-outline" style={{ padding: '7px 12px', fontSize: '12px', borderColor: '#991b1b', color: '#f87171' }}
                          onClick={() => openDispute(order.id)}>
                          {isAr ? 'فتح نزاع' : 'Open Dispute'}
                        </button>
                      </>
                    ) : order.status === 'completed' ? (
                      <span style={{ fontSize: '13px', color: '#4ade80' }}>✓ {isAr ? 'تم بنجاح' : 'Completed'}</span>
                    ) : order.status === 'disputed' ? (
                      <span style={{ fontSize: '12px', color: '#f87171' }}>⚠️ {isAr ? 'قيد المراجعة' : 'Under Review'}</span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#f59e0b' }}>
                        ⏳ {isAr ? 'في انتظار تأكيد الدفع' : 'Awaiting payment confirmation'}
                      </span>
                    )}
                  </div>
                </div>

                {/* ESCROW NOTE */}
                {(order.status === 'funds_held' || order.status === 'delivered') && (
                  <div style={{
                    background: 'var(--accent-soft)', border: '1px solid var(--accent-border)',
                    borderRadius: 'var(--radius-md)', padding: '10px 14px',
                    fontSize: '12px', color: '#a78bfa', marginTop: '12px',
                  }}>
                    🛡️ {isAr
                      ? 'أموالك محفوظة في الضمان. اضغط "تأكيد الاستلام" بعد استلام طلبك لتحرير المبلغ للبائع.'
                      : 'Your funds are in escrow. Press "Confirm Delivery" after receiving your order to release payment to the seller.'}
                  </div>
                )}

                {order.status === 'disputed' && (
                  <div style={{
                    background: '#1f0a0a', border: '1px solid #991b1b',
                    borderRadius: 'var(--radius-md)', padding: '10px 14px',
                    fontSize: '12px', color: '#f87171', marginTop: '12px',
                  }}>
                    ⚠️ {isAr
                      ? 'تم فتح نزاع. فريق سوق.gg سيتواصل معك خلال 24 ساعة للحل.'
                      : 'Dispute opened. The Sooq.gg team will contact you within 24 hours to resolve it.'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
