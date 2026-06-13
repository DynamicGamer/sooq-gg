import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

// Your admin email — only you can access this page
const ADMIN_EMAIL = 'thabetalqaisi@gmail.com'

const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    buyer_email: 'ahmed@gmail.com',
    items: [{ name: '660 UC', game: 'PUBG Mobile', price: '3.20', qty: 1 }],
    subtotal: '3.20', fee: '0.22', grand_total: '3.42',
    crypto_symbol: 'USDT', crypto_network: 'TRC20 (Tron)',
    wallet_address: 'TPwHCjFDZcU9F6Z2zzzeVjnMYLjoK8M2Ts',
    tx_hash: 'abc123def456...',
    status: 'pending_payment',
    created_at: '2025-06-13T10:00:00Z',
  },
  {
    id: 'ORD-002',
    buyer_email: 'khalid@hotmail.com',
    items: [{ name: '520 Diamonds', game: 'Free Fire', price: '2.80', qty: 2 }],
    subtotal: '5.60', fee: '0.39', grand_total: '5.99',
    crypto_symbol: 'USDT', crypto_network: 'BEP20 (BNB Chain)',
    wallet_address: '0x5ab164a7c18093be23b23e365ff742960f404f22',
    tx_hash: 'xyz789...',
    status: 'funds_held',
    created_at: '2025-06-12T14:00:00Z',
  },
  {
    id: 'ORD-003',
    buyer_email: 'sara@gmail.com',
    items: [{ name: '1000 V-Bucks', game: 'Fortnite', price: '6.90', qty: 1 }],
    subtotal: '6.90', fee: '0.48', grand_total: '7.38',
    crypto_symbol: 'SOL', crypto_network: 'Solana',
    wallet_address: 'C3HsTGi7J41ea7ZHcPb6d4FuSd69UjUrxvLDYBdykY7d',
    tx_hash: 'sol999...',
    status: 'disputed',
    created_at: '2025-06-11T09:00:00Z',
  },
  {
    id: 'ORD-004',
    buyer_email: 'mo@gmail.com',
    items: [{ name: '660 UC', game: 'PUBG Mobile', price: '3.20', qty: 3 }],
    subtotal: '9.60', fee: '0.67', grand_total: '10.27',
    crypto_symbol: 'BTC', crypto_network: 'Bitcoin',
    wallet_address: '17WMUyN8wyTMYaG4owLCmGFF4vWLHUyTga',
    tx_hash: 'btc555...',
    status: 'completed',
    created_at: '2025-06-10T16:00:00Z',
  },
]

const STATUS_CONFIG = {
  pending_payment: { label: 'Pending Payment', labelAr: 'انتظار الدفع', color: '#fbbf24', bg: '#1f1a09', border: '#854f0b' },
  funds_held:      { label: 'Funds Held', labelAr: 'أموال محجوزة', color: '#a78bfa', bg: '#1e1b4b', border: '#3730a3' },
  delivered:       { label: 'Delivered', labelAr: 'تم التسليم', color: '#34d399', bg: '#0a1f12', border: '#065f46' },
  completed:       { label: 'Completed', labelAr: 'مكتمل', color: '#4ade80', bg: '#0f2318', border: '#166534' },
  disputed:        { label: 'Disputed', labelAr: 'نزاع', color: '#f87171', bg: '#1f0a0a', border: '#991b1b' },
  released:        { label: 'Released', labelAr: 'تم الإفراج', color: '#60a5fa', bg: '#0a1020', border: '#1d4ed8' },
}

export default function Admin() {
  const { isAr } = useLang()
  const { user } = useAuth()
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')

  // Block non-admins
  if (!user) return <Navigate to="/auth" />
  if (user.email !== ADMIN_EMAIL) return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
      <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Access Denied</h2>
    </div>
  )

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const filtered = orders.filter(o => {
    if (tab !== 'all' && o.status !== tab) return false
    if (search && !o.id.includes(search) && !o.buyer_email.includes(search)) return false
    return true
  })

  const totalRevenue = orders.filter(o => o.status === 'completed' || o.status === 'released').reduce((s, o) => s + parseFloat(o.fee), 0)
  const pendingCount = orders.filter(o => o.status === 'pending_payment').length
  const heldCount = orders.filter(o => o.status === 'funds_held').length
  const disputeCount = orders.filter(o => o.status === 'disputed').length

  const TABS = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending_payment', label: `Pending (${pendingCount})` },
    { id: 'funds_held', label: `Held (${heldCount})` },
    { id: 'disputed', label: `Disputes (${disputeCount})` },
    { id: 'completed', label: 'Completed' },
  ]

  return (
    <div className="page-container" style={{ maxWidth: '1100px' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>🔧 Admin Panel</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>سوق.gg — Manage all orders and escrow</p>
        </div>
        <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-md)', padding: '6px 14px', fontSize: '12px', color: '#a78bfa' }}>
          👤 {user.email}
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        {[
          { label: 'Total Revenue (fees)', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', color: '#4ade80' },
          { label: 'Total Orders', value: orders.length, icon: '📦', color: '#fff' },
          { label: 'Funds Held', value: heldCount, icon: '🛡️', color: '#a78bfa' },
          { label: 'Open Disputes', value: disputeCount, icon: '⚠️', color: '#f87171' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: s.color, marginBottom: '3px' }}>{s.value}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '16px', alignItems: 'start' }}>

        {/* LEFT: ORDER LIST */}
        <div>
          {/* TABS + SEARCH */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: tab === t.id ? 'var(--accent)' : 'var(--bg-tertiary)',
                border: `1px solid ${tab === t.id ? 'var(--accent)' : 'var(--border-hover)'}`,
                color: tab === t.id ? '#fff' : 'var(--text-muted)',
                padding: '6px 12px', borderRadius: 'var(--radius-md)',
                fontSize: '12px', fontWeight: tab === t.id ? '700' : '400',
                whiteSpace: 'nowrap', cursor: 'pointer',
              }}>{t.label}</button>
            ))}
          </div>

          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or email..."
            style={{ width: '100%', padding: '9px 14px', fontSize: '13px', marginBottom: '12px' }} />

          {/* ORDER ROWS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.map(order => {
              const sc = STATUS_CONFIG[order.status]
              const isSelected = selected?.id === order.id
              return (
                <div key={order.id} onClick={() => setSelected(isSelected ? null : order)}
                  className="card" style={{
                    padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                    border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--accent)', marginBottom: '2px' }}>{order.id}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.buyer_email}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', fontSize: '15px', color: '#fff' }}>${order.grand_total}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{order.crypto_symbol} · fee: ${order.fee}</div>
                      </div>
                      <div style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '5px', padding: '3px 8px', fontSize: '10px', fontWeight: '700', color: sc.color, whiteSpace: 'nowrap' }}>
                        {sc.label}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {order.items.map(i => `${i.name} × ${i.qty}`).join(', ')} — {order.items[0]?.game}
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found</div>
            )}
          </div>
        </div>

        {/* RIGHT: ORDER DETAIL */}
        {selected && (
          <div style={{ position: 'sticky', top: '74px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800' }}>Order Detail</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>

              {/* INFO */}
              {[
                { label: 'Order ID', value: selected.id },
                { label: 'Buyer', value: selected.buyer_email },
                { label: 'Total', value: `$${selected.grand_total}` },
                { label: 'Your Fee (7%)', value: `$${selected.fee}` },
                { label: 'Network', value: `${selected.crypto_symbol} · ${selected.crypto_network}` },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                  <span style={{ fontWeight: '600', wordBreak: 'break-all', textAlign: 'right', maxWidth: '60%' }}>{r.value}</span>
                </div>
              ))}

              {/* TX HASH */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>TX Hash</div>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '8px 10px', fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all', color: '#fff' }}>
                  {selected.tx_hash || 'Not provided yet'}
                </div>
              </div>

              {/* WALLET */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>Receiving Wallet</div>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '8px 10px', fontFamily: 'monospace', fontSize: '10px', wordBreak: 'break-all', color: '#a78bfa' }}>
                  {selected.wallet_address}
                </div>
              </div>

              {/* STATUS BADGE */}
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <div style={{
                  background: STATUS_CONFIG[selected.status].bg,
                  border: `1px solid ${STATUS_CONFIG[selected.status].border}`,
                  borderRadius: 'var(--radius-md)', padding: '8px',
                  fontSize: '13px', fontWeight: '700',
                  color: STATUS_CONFIG[selected.status].color,
                }}>
                  {STATUS_CONFIG[selected.status].label}
                </div>
              </div>

              {/* ACTIONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {selected.status === 'pending_payment' && (
                  <button className="btn-primary" style={{ padding: '9px', fontSize: '12px', background: '#a78bfa', border: 'none' }}
                    onClick={() => updateStatus(selected.id, 'funds_held')}>
                    ✓ Mark as Funds Received
                  </button>
                )}
                {selected.status === 'funds_held' && (
                  <button className="btn-primary" style={{ padding: '9px', fontSize: '12px', background: '#10b981', border: 'none' }}
                    onClick={() => updateStatus(selected.id, 'released')}>
                    💸 Release Funds to Seller
                  </button>
                )}
                {selected.status === 'disputed' && (
                  <>
                    <button className="btn-primary" style={{ padding: '9px', fontSize: '12px', background: '#10b981', border: 'none' }}
                      onClick={() => updateStatus(selected.id, 'released')}>
                      💸 Release to Seller (seller wins)
                    </button>
                    <button className="btn-primary" style={{ padding: '9px', fontSize: '12px', background: '#ef4444', border: 'none' }}
                      onClick={() => updateStatus(selected.id, 'completed')}>
                      ↩ Refund to Buyer (buyer wins)
                    </button>
                  </>
                )}
                {(selected.status === 'completed' || selected.status === 'released') && (
                  <div style={{ textAlign: 'center', fontSize: '13px', color: '#4ade80' }}>✓ Order Closed</div>
                )}

                {/* VERIFY ON BLOCKCHAIN */}
                {selected.tx_hash && selected.tx_hash.length > 5 && (
                  <a
                    href={
                      selected.crypto_network.includes('Tron') ? `https://tronscan.org/#/transaction/${selected.tx_hash}` :
                      selected.crypto_network.includes('Bitcoin') ? `https://blockstream.info/tx/${selected.tx_hash}` :
                      selected.crypto_network.includes('Solana') ? `https://solscan.io/tx/${selected.tx_hash}` :
                      `https://etherscan.io/tx/${selected.tx_hash}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    style={{ display: 'block', textAlign: 'center', padding: '9px', fontSize: '12px' }}
                  >
                    🔍 Verify on Blockchain Explorer
                  </a>
                )}
              </div>

              {/* ADMIN NOTE */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>Admin Note</div>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                  placeholder="Add internal note..."
                  style={{ width: '100%', padding: '8px 10px', fontSize: '12px', resize: 'none' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
