import { useState, useEffect, useRef } from 'react'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Chat({ listingId, sellerId, sellerName, onClose }) {
  const { isAr } = useLang()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!user) return
    fetchMessages()

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `listing_id=eq.${listingId}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [listingId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || !user) return
    const msg = {
      sender_id: user.id,
      receiver_id: sellerId,
      listing_id: listingId,
      content: input.trim(),
    }
    setInput('')
    await supabase.from('messages').insert([msg])
    fetchMessages()
  }

  if (!user) return null

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', width: '340px',
      background: '#111008', border: '1px solid rgba(201,168,76,0.25)',
      borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
      zIndex: 1000, display: 'flex', flexDirection: 'column',
      maxHeight: '480px', direction: isAr ? 'rtl' : 'ltr'
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #c9a84c, #a07830)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#0c0a08', fontWeight: '800' }}>
            {sellerName?.[0] || '?'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>{sellerName}</div>
            <div style={{ fontSize: '10px', color: '#10b981' }}>{isAr ? 'متصل' : 'Online'}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9a8570', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '280px' }}>
        {loading && <div style={{ color: '#9a8570', fontSize: '12px', textAlign: 'center' }}>{isAr ? 'جاري التحميل...' : 'Loading...'}</div>}
        {!loading && messages.length === 0 && (
          <div style={{ color: '#9a8570', fontSize: '12px', textAlign: 'center', marginTop: '40px' }}>
            {isAr ? 'ابدأ المحادثة مع البائع' : 'Start a conversation with the seller'}
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} style={{
            alignSelf: m.sender_id === user.id ? 'flex-end' : 'flex-start',
            background: m.sender_id === user.id ? 'linear-gradient(135deg, #c9a84c, #a07830)' : 'rgba(255,255,255,0.06)',
            color: m.sender_id === user.id ? '#0c0a08' : '#ffffff',
            padding: '8px 12px', borderRadius: '12px', fontSize: '13px',
            maxWidth: '80%', lineHeight: '1.5',
            borderBottomRightRadius: m.sender_id === user.id ? '4px' : '12px',
            borderBottomLeftRadius: m.sender_id === user.id ? '12px' : '4px',
          }}>
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(201,168,76,0.15)', display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={isAr ? 'اكتب رسالة...' : 'Type a message...'}
          style={{ flex: 1, padding: '8px 12px', fontSize: '13px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.15)', color: '#ffffff', outline: 'none' }}
        />
        <button onClick={sendMessage} style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)', border: 'none', borderRadius: '8px', color: '#0c0a08', padding: '8px 14px', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}>
          {isAr ? 'إرسال' : 'Send'}
        </button>
      </div>
    </div>
  )
}

