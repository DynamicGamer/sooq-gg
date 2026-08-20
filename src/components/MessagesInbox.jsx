import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Chat from './Chat'
import { RevealGroup, RevealItem } from './Reveal'

export default function MessagesInbox({ username, isAr }) {
  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('messages_with_listings')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (!data) { setLoading(false); return }

    const seen = new Set()
    const convos = []
    for (const msg of data) {
      const key = msg.listing_id
      if (!seen.has(key)) {
        seen.add(key)
        convos.push(msg)
      }
    }
    setConversations(convos)
    setLoading(false)
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#9a8570', fontSize: '13px' }}>{isAr ? 'جاري التحميل...' : 'Loading...'}</div>

  if (conversations.length === 0) return (
    <div className="card" style={{ padding: '48px', textAlign: 'center', color: '#9a8570' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
      <div>{isAr ? 'لا توجد رسائل' : 'No messages yet'}</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <RevealGroup style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {conversations.map(convo => {
          const counterpart = isAr ? convo.seller : convo.seller_en
          return (
            <RevealItem key={convo.id}>
              <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', cursor: 'pointer' }}
                onClick={() => setActiveChat(convo)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #c9a84c, #a07830)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0c0a08', fontWeight: '800', fontSize: '17px', flexShrink: 0, boxShadow: 'var(--glow-gold-soft)' }}>
                    {counterpart?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '700', color: '#ffffff', marginBottom: '3px', fontFamily: 'var(--font-display)' }}>{counterpart || (isAr ? 'مستخدم' : 'User')}</div>
                    <div style={{ fontSize: '11px', color: '#c9a84c', marginBottom: '2px' }}>{isAr ? convo.type_ar : convo.type_en}</div>
                    <div style={{ fontSize: '12px', color: '#9a8570', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' }}>{convo.content}</div>
                  </div>
                </div>
                <button style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)', border: 'none', borderRadius: '8px', color: '#0c0a08', padding: '7px 14px', fontWeight: '700', cursor: 'pointer', fontSize: '12px', flexShrink: 0 }}>
                  {isAr ? 'فتح' : 'Open'}
                </button>
              </div>
            </RevealItem>
          )
        })}
      </RevealGroup>
      <AnimatePresence>
        {activeChat && (
          <Chat
            listingId={activeChat.listing_id}
            sellerId={activeChat.receiver_id}
            sellerName={isAr ? activeChat.seller : activeChat.seller_en}
            onClose={() => setActiveChat(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}


