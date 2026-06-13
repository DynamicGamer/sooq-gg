import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const STATUS_CONFIG = {
  pending_payment: { labelAr: 'في انتظار الدفع', labelEn: 'Pending Payment', color: '#fbbf24', bg: '#1f1a09', border: '#854f0b' },
  funds_held:      { labelAr: 'الأموال محجوزة', labelEn: 'Funds Held — Awaiting Delivery', color: '#a78bfa', bg: '#1e1b4b', border: '#3730a3' },
  delivered:       { labelAr: 'تم التسليم', labelEn: 'Delivered', color: '#34d399', bg: '#0a1f12', border: '#065f46' },
  completed:       { labelAr: 'مكتمل', labelEn: 'Completed', color: '#4ade80', bg: '#0f2318', border: '#166534' },
  released:        { labelAr: 'تم الإفراج', labelEn: 'Released to Seller', color: '#60a5fa', bg: '#0a1020', border: '#1d4ed8' },
  disputed:        { labelAr: 'نزاع مفتوح', labelEn: 'Dispute Opened', color: '#f87171', bg: '#1f0a0a', border: '#991b1b' },
}

export default function Orders() {
  const { isAr } = useLang()
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  if (!user) return <Navigate to="/auth" />

  useEffect(() => {
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('escrow_orders')
      .select('*')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setOrders(data || [])
    setLoading(false)
  }

  const updateStatus = async (orderId, status) => {
    const { error } = await supabase
      .from('escrow_orders')
      .update({ status })
      .eq('id', orderId)
      .eq('buyer_id', user.id)

    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    }
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '800' }}>
          {isAr ? 'طلباتي' : 'My Orders'}
        </h1>
        <button onClick={fetchOrders} className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
          🔄 {isAr ? 'تحديث' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          {isAr ? 'جاري التحميل...' : 'Loading...'}
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
          <div style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            {isAr ? 'لا توجد طلبات بعد' : 'No orders yet'}
          </div>
          <Link to="/listings/topups" className="btn-primary">
            {isAr ? 'تصفح العروض' : 'Browse Listings'}
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map(order => {
            const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_payment
            const items = Array.isArray(order.items) ? order.items : []
            return (
              <div key={order.id} className="card" style={{ padding: '20px' }}>

                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--accent)' }}>
                      {order.id?.slice(0, 8)}...
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 10px' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', color: sc.color }}>
                    {isAr ? sc.labelAr : sc.labelEn}
                  </div>
                </div>

                {/* ITEMS */}
                {items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span>{item.name} × {item.qty} <span style={{ color: 'var(--text-muted)' }}>— {item.game}</span></span>
                    <span>${(parseFloat(item.price) * item.qty).toFixed(2)}</span>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid var(--border)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{isAr ? 'الإجمالي: ' : 'Total: '}</span>
                    <span style={{ fontWeight: '800', fontSize: '16px', color: '#fff' }}>${order.grand_total}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 8px' }}>
                      {order.crypto_symbol} · {order.crypto_network}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['funds_held', 'delivered'].includes(order.status) && (
                      <>
                        <button className="btn-primary"
                          style={{ padding: '7px 16px', fontSize: '12px', background: '#10b981', border: 'none' }}
                          onClick={() => updateStatus(order.id, 'completed')}>
                          ✓ {isAr ? 'تأكيد الاستلام' : 'Confirm Delivery'}
                        </button>
                        <button className="btn-outline"
                          style={{ padding: '7px 12px', fontSize: '12px', borderColor: '#991b1b', color: '#f87171' }}
                          onClick={() => updateStatus(order.id, 'disputed')}>
                          {isAr ? 'فتح نزاع' : 'Open Dispute'}
                        </button>
                      </>
                    )}
                    {order.status === 'completed' && (
                      <span style={{ fontSize: '13px', color: '#4ade80' }}>✓ {isAr ? 'تم بنجاح' : 'Completed'}</span>
                    )}
                    {order.status === 'released' && (
                      <span style={{ fontSize: '13px', color: '#60a5fa' }}>💸 {isAr ? 'تم تحرير الأموال للبائع' : 'Funds released to seller'}</span>
                    )}
                    {order.status === 'disputed' && (
                      <span style={{ fontSize: '12px', color: '#f87171' }}>⚠️ {isAr ? 'قيد المراجعة من الإدارة' : 'Under admin review'}</span>
                    )}
                    {order.status === 'pending_payment' && (
                      <span style={{ fontSize: '12px', color: '#fbbf24' }}>⏳ {isAr ? 'في انتظار تأكيد الدفع' : 'Awaiting payment confirmation'}</span>
                    )}
                  </div>
                </div>

                {/* ESCROW NOTE */}
                {['funds_held', 'delivered'].includes(order.status) && (
                  <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '12px', color: '#a78bfa', marginTop: '12px' }}>
                    🛡️ {isAr
                      ? 'أموالك محفوظة في الضمان. اضغط "تأكيد الاستلام" بعد استلام طلبك.'
                      : 'Your funds are in escrow. Press "Confirm Delivery" after receiving your order.'}
                  </div>
                )}

                {order.status === 'disputed' && (
                  <div style={{ background: '#1f0a0a', border: '1px solid #991b1b', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '12px', color: '#f87171', marginTop: '12px' }}>
                    ⚠️ {isAr
                      ? 'تم فتح نزاع. فريق سوق.gg سيتواصل معك خلال 24 ساعة.'
                      : 'Dispute opened. The Sooq.gg team will review within 24 hours.'}
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
