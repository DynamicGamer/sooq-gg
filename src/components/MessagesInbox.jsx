import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import Chat from './Chat'

export default function MessagesInbox({ isAr, initialConversation }) {
  // Dashboard (the parent) recreates the initialConversation object on every one of its
  // own re-renders (it has three separate async effects that each cause one shortly
  // after mount), so relying on it as an effect dependency meant this ran repeatedly and
  // raced against the conversation fetch below. Capture it exactly once in a ref instead
  // — deep-linked from a listing's "Message Seller" button, shown even with no message
  // history yet.
  const pendingRef = useRef(initialConversation ? {
    listing_id: initialConversation.listingId,
    seller_id: initialConversation.sellerId,
    seller: initialConversation.sellerName,
    seller_en: initialConversation.sellerName,
    seller_country: initialConversation.sellerCountry,
    seller_rating: initialConversation.sellerRating,
    content: isAr ? 'لا توجد رسائل بعد' : 'No messages yet',
    _pending: true,
  } : null)

  const [conversations, setConversations] = useState(() => pendingRef.current ? [pendingRef.current] : [])
  const [activeKey, setActiveKey] = useState(() => pendingRef.current ? String(pendingRef.current.listing_id) : null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from('messages_with_listings')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    const seen = new Set()
    const convos = []
    for (const msg of (data || [])) {
      const key = msg.listing_id
      if (!seen.has(key)) {
        seen.add(key)
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
        convos.push({ ...msg, seller_id: otherId })
      }
    }

    const pending = pendingRef.current
    const stillPending = pending && !convos.some(x => String(x.listing_id) === String(pending.listing_id)) ? [pending] : []
    setConversations([...stillPending, ...convos])
    setLoading(false)
  }

  const active = conversations.find(c => String(c.listing_id) === String(activeKey))

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#9a8570', fontSize: '13px' }}>{isAr ? 'جاري التحميل...' : 'Loading...'}</div>

  if (conversations.length === 0) return (
    <div className="card" style={{ padding: '48px', textAlign: 'center', color: '#9a8570' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
      <div>{isAr ? 'لا توجد رسائل' : 'No messages yet'}</div>
    </div>
  )

  return (
    <div className="card" style={{ padding: 0, display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '560px', overflow: 'hidden' }}>
      {/* Conversation list */}
      <div className={active ? 'hide-mobile' : ''} style={{ borderInlineEnd: '1px solid rgba(201,168,76,0.12)', overflowY: 'auto' }}>
        {conversations.map(convo => {
          const counterpart = isAr ? convo.seller : convo.seller_en
          const isActive = String(convo.listing_id) === String(activeKey)
          return (
            <div key={convo.listing_id}
              onClick={() => setActiveKey(String(convo.listing_id))}
              style={{
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                borderInlineStart: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                borderBottom: '1px solid rgba(201,168,76,0.06)', transition: 'background 0.15s',
              }}
            >
              <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #c9a84c, #a07830)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0c0a08', fontWeight: '800', fontSize: '15px', flexShrink: 0 }}>
                {counterpart?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{counterpart || (isAr ? 'مستخدم' : 'User')}</div>
                <div style={{ fontSize: '11px', color: '#c9a84c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isAr ? convo.type_ar : convo.type_en}</div>
                <div style={{ fontSize: '11px', color: '#9a8570', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{convo.content}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Active conversation */}
      <div className={active ? '' : 'hide-mobile'} style={{ padding: '12px' }}>
        {active ? (
          <Chat
            listingId={active.listing_id}
            sellerId={active.seller_id}
            sellerName={isAr ? active.seller : active.seller_en}
            sellerRating={active.seller_rating}
            sellerCountry={active.seller_country}
            onBack={() => setActiveKey(null)}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b5a45', fontSize: '13px' }}>
            {isAr ? 'اختر محادثة لعرضها' : 'Select a conversation to view it'}
          </div>
        )}
      </div>
    </div>
  )
}
