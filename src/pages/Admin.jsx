import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Chat from '../components/Chat'

const ADMIN_EMAIL = 'thabetalqaisi@gmail.com'

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
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [section, setSection] = useState('orders') // 'orders' | 'messages' | 'withdrawals'
  const [conversations, setConversations] = useState([])
  const [activeListingId, setActiveListingId] = useState(null)
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [withdrawals, setWithdrawals] = useState([])
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true)

  if (!user) return <Navigate to="/auth" />
  if (user.email !== ADMIN_EMAIL) return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
      <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Access Denied</h2>
    </div>
  )

  useEffect(() => {
    fetchOrders()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (section === 'messages') fetchAllConversations()
    if (section === 'withdrawals') fetchWithdrawals()
  }, [section])

  const fetchWithdrawals = async () => {
    setWithdrawalsLoading(true)
    const { data } = await supabase.from('withdrawal_requests').select('*').order('created_at', { ascending: false })
    if (data) setWithdrawals(data)
    setWithdrawalsLoading(false)
  }

  const markWithdrawalPaid = async (id) => {
    const { error: e } = await supabase.from('withdrawal_requests').update({ status: 'paid' }).eq('id', id)
    if (e) { alert('Error: ' + e.message); return }
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'paid' } : w))
  }

  const fetchAllConversations = async () => {
    setConversationsLoading(true)
    const { data } = await supabase.from('messages_with_listings').select('*').order('created_at', { ascending: false })
    if (data) {
      const seen = new Set()
      const convos = []
      for (const msg of data) {
        if (!seen.has(msg.listing_id)) { seen.add(msg.listing_id); convos.push(msg) }
      }
      setConversations(convos)
    }
    setConversationsLoading(false)
  }

  const activeConvo = conversations.find(c => String(c.listing_id) === String(activeListingId))

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error: e } = await supabase
      .from('escrow_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (e) {
      setError(e.message)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    const { error: e } = await supabase
      .from('escrow_orders')
      .update({ status })
      .eq('id', id)

    if (e) {
      alert('Error updating status: ' + e.message)
      return
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const filtered = orders.filter(o => {
    if (tab !== 'all' && o.status !== tab) return false
    if (search && !o.id?.includes(search) && !o.buyer_id?.includes(search)) return false
    return true
  })

  const totalRevenue = orders.filter(o => ['completed','released'].includes(o.status)).reduce((s, o) => s + parseFloat(o.fee || 0), 0)
  const pendingCount = orders.filter(o => o.status === 'pending_payment').length
  const heldCount = orders.filter(o => o.status === 'funds_held').length
  const disputeCount = orders.filter(o => o.status === 'disputed').length

  const TABS = [
    { id: 'all', label: `All (${orders.length})` },
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
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>سوق.gg — Live data from Supabase</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={section === 'orders' ? fetchOrders : fetchAllConversations} className="btn-outline" style={{ padding: '5px 12px', fontSize: '12px' }}>
            🔄 Refresh
          </button>
          <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-md)', padding: '6px 14px', fontSize: '12px', color: '#a78bfa' }}>
            👤 {user.email}
          </div>
        </div>
      </div>

      {/* SECTION TOGGLE */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        {[{ id: 'orders', label: '📦 Orders' }, { id: 'messages', label: '💬 All Messages' }, { id: 'withdrawals', label: '💸 Withdrawals' }].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{
            padding: '7px 18px', borderRadius: 'calc(var(--radius-md) - 2px)', border: 'none',
            background: section === s.id ? 'var(--accent)' : 'transparent',
            color: section === s.id ? '#fff' : 'var(--text-muted)',
            fontSize: '13px', fontWeight: '700', cursor: 'pointer',
          }}>{s.label}</button>
        ))}
      </div>

      {section === 'messages' ? (
        <div className="card" style={{ padding: 0, display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: '600px', overflow: 'hidden' }}>
          <div className={activeConvo ? 'hide-mobile' : ''} style={{ borderInlineEnd: '1px solid rgba(201,168,76,0.12)', overflowY: 'auto' }}>
            {conversationsLoading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No conversations yet</div>
            ) : conversations.map(convo => {
              const isActive = String(convo.listing_id) === String(activeListingId)
              return (
                <div key={convo.listing_id} onClick={() => setActiveListingId(String(convo.listing_id))} style={{
                  padding: '14px 16px', cursor: 'pointer',
                  background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                  borderInlineStart: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  borderBottom: '1px solid rgba(201,168,76,0.06)',
                }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#fff', marginBottom: '2px' }}>{convo.seller_en || convo.seller}</div>
                  <div style={{ fontSize: '11px', color: '#c9a84c', marginBottom: '2px' }}>{convo.type_en || convo.type_ar}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{convo.content}</div>
                </div>
              )
            })}
          </div>
          <div className={activeConvo ? '' : 'hide-mobile'} style={{ padding: '12px' }}>
            {activeConvo ? (
              <Chat
                listingId={activeConvo.listing_id}
                sellerId={activeConvo.receiver_id}
                sellerName={(activeConvo.seller_en || activeConvo.seller) + ' — ' + (activeConvo.type_en || activeConvo.type_ar)}
                onBack={() => setActiveListingId(null)}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b5a45', fontSize: '13px' }}>
                Select a conversation to view and reply as support
              </div>
            )}
          </div>
        </div>
      ) : section === 'withdrawals' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {withdrawalsLoading ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : withdrawals.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No withdrawal requests yet</div>
          ) : withdrawals.map(w => (
            <div key={w.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: '800', fontSize: '15px', color: '#fff' }}>${parseFloat(w.amount).toFixed(2)} — {w.seller_username || w.seller_id?.slice(0, 8)}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {w.payout_method === 'cliq' ? 'CliQ' : 'Crypto'} · <span style={{ fontFamily: 'monospace' }}>{w.payout_destination}</span> · {new Date(w.created_at).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={`badge ${w.status === 'paid' ? 'badge-green' : 'badge-gold'}`}>{w.status === 'paid' ? 'Paid' : 'Pending'}</span>
                {w.status !== 'paid' && (
                  <button className="btn-primary" style={{ padding: '7px 14px', fontSize: '12px', background: '#10b981', border: 'none' }} onClick={() => markWithdrawalPaid(w.id)}>
                    ✓ Mark Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
      <>
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

      {error && (
        <div style={{ background: '#1f0a0a', border: '1px solid #991b1b', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '13px', color: '#f87171', marginBottom: '16px' }}>
          ⚠️ Supabase error: {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '16px', alignItems: 'start' }}>

        {/* ORDER LIST */}
        <div>
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
            placeholder="Search by order ID or buyer ID..."
            style={{ width: '100%', padding: '9px 14px', fontSize: '13px', marginBottom: '12px' }} />

          {loading ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading orders...
            </div>
          ) : filtered.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
              <div>No orders yet — they will appear here when buyers place orders</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filtered.map(order => {
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_payment
                const isSelected = selected?.id === order.id
                const items = Array.isArray(order.items) ? order.items : []
                return (
                  <div key={order.id} onClick={() => setSelected(isSelected ? null : order)}
                    className="card" style={{
                      padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                      border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--accent)', marginBottom: '2px' }}>
                          {order.id?.slice(0, 8)}...
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(order.created_at).toLocaleString()}
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
                    {items.length > 0 && (
                      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {items.map(i => `${i.name} × ${i.qty}`).join(', ')}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ORDER DETAIL */}
        {selected && (
          <div style={{ position: 'sticky', top: '74px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800' }}>Order Detail</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>

              {[
                { label: 'Order ID', value: selected.id },
                { label: 'Buyer ID', value: selected.buyer_id },
                { label: 'Total', value: `$${selected.grand_total}` },
                { label: 'Your Fee (7%)', value: `$${selected.fee}` },
                { label: 'Network', value: `${selected.crypto_symbol} · ${selected.crypto_network}` },
                { label: 'Date', value: new Date(selected.created_at).toLocaleString() },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{r.label}</span>
                  <span style={{ fontWeight: '600', wordBreak: 'break-all', textAlign: 'right', maxWidth: '60%', fontSize: '11px' }}>{r.value}</span>
                </div>
              ))}

              {/* TX HASH */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>TX Hash</div>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '8px 10px', fontFamily: 'monospace', fontSize: '10px', wordBreak: 'break-all', color: '#fff' }}>
                  {selected.tx_hash || 'Not provided'}
                </div>
              </div>

              {/* WALLET */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Receiving Wallet</div>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '8px 10px', fontFamily: 'monospace', fontSize: '10px', wordBreak: 'break-all', color: '#a78bfa' }}>
                  {selected.wallet_address}
                </div>
              </div>

              {/* STATUS */}
              <div style={{ marginBottom: '14px', textAlign: 'center' }}>
                <div style={{
                  background: (STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending_payment).bg,
                  border: `1px solid ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending_payment).border}`,
                  borderRadius: 'var(--radius-md)', padding: '8px',
                  fontSize: '13px', fontWeight: '700',
                  color: (STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending_payment).color,
                }}>
                  {(STATUS_CONFIG[selected.status] || STATUS_CONFIG.pending_payment).label}
                </div>
              </div>

              {/* ACTIONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {selected.status === 'pending_payment' && (
                  <button className="btn-primary" style={{ padding: '9px', fontSize: '12px', background: '#a78bfa', border: 'none' }}
                    onClick={() => updateStatus(selected.id, 'funds_held')}>
                    ✓ Mark Funds Received
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
                      💸 Release to Seller
                    </button>
                    <button className="btn-primary" style={{ padding: '9px', fontSize: '12px', background: '#ef4444', border: 'none' }}
                      onClick={() => updateStatus(selected.id, 'completed')}>
                      ↩ Refund to Buyer
                    </button>
                  </>
                )}
                {['completed','released'].includes(selected.status) && (
                  <div style={{ textAlign: 'center', fontSize: '13px', color: '#4ade80' }}>✓ Order Closed</div>
                )}

                {selected.tx_hash && selected.tx_hash.length > 5 && (
                  <a href={
                      selected.crypto_network?.includes('Tron') ? `https://tronscan.org/#/transaction/${selected.tx_hash}` :
                      selected.crypto_network?.includes('Bitcoin') ? `https://blockstream.info/tx/${selected.tx_hash}` :
                      selected.crypto_network?.includes('Solana') ? `https://solscan.io/tx/${selected.tx_hash}` :
                      `https://etherscan.io/tx/${selected.tx_hash}`
                    }
                    target="_blank" rel="noopener noreferrer"
                    className="btn-outline"
                    style={{ display: 'block', textAlign: 'center', padding: '9px', fontSize: '12px' }}>
                    🔍 Verify on Blockchain
                  </a>
                )}
              </div>

              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>Admin Note</div>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                  placeholder="Internal note..."
                  style={{ width: '100%', padding: '8px 10px', fontSize: '12px', resize: 'none' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  )
}
