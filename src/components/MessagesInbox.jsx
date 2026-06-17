import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Chat from './Chat'

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

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#9a8570' }}>Loading...</div>

  if (conversations.length === 0) return (
    <div className="card" style={{ padding: '48px', textAlign: 'center', color: '#9a8570' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
      <div>{isAr ? 'لا توجد رسائل' : 'No messages yet'}</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {conversations.map(convo => (
        <div key={convo.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          onClick={() => setActiveChat(convo)}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #c9a84c, #a07830)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0c0a08', fontWeight: '800', fontSize: '16px' }}>
              {convo.content?.[0] || '?'}
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#ffffff', marginBottom: '3px' }}>{convo.type_en || convo.listing_id}</div>
              <div style={{ fontSize: '12px', color: '#9a8570' }}>{convo.content?.slice(0, 40)}...</div>
            </div>
          </div>
          <button style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)', border: 'none', borderRadius: '8px', color: '#0c0a08', padding: '7px 14px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>
            {isAr ? 'فتح' : 'Open'}
          </button>
        </div>
      ))}
      {activeChat && (
        <Chat
          listingId={activeChat.listing_id}
          sellerId={activeChat.receiver_id}
          sellerName={isAr ? 'البائع' : 'Seller'}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  )
}


