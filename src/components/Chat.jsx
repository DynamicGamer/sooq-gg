import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import CountryBadge from './CountryBadge'

const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

// Embeddable chat panel — fills whatever container it's placed in (the Dashboard/Admin
// inbox layout). No fixed positioning: this is meant to sit inside a panel, not float.
export default function Chat({ listingId, sellerId, sellerName, sellerRating, sellerCountry, onBack }) {
  const { isAr } = useLang()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!user) return
    fetchMessages()

    const channel = supabase
      .channel('chat-' + listingId)
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
    setLoading(true)
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
    if (!sellerId) {
      return alert(isAr
        ? 'تعذر إرسال الرسالة — هذا البائع ليس لديه معرّف حساب صالح (على الأرجح عرض قديم من قبل هذا التحديث).'
        : "Can't send — this seller has no valid account ID (likely an older listing from before this fix).")
    }
    const msg = {
      sender_id: user.id,
      receiver_id: sellerId,
      listing_id: listingId,
      content: input.trim(),
    }
    setInput('')
    const { error } = await supabase.from('messages').insert([msg])
    if (error) {
      setInput(msg.content)
      return alert((isAr ? 'فشل إرسال الرسالة: ' : 'Failed to send message: ') + error.message)
    }
    fetchMessages()
  }

  if (!user) return null

  return (
    <div style={{
      background: 'linear-gradient(180deg, #15100a, #0c0a06)',
      borderRadius: '16px', border: '1px solid rgba(201,168,76,0.2)',
      display: 'flex', flexDirection: 'column', height: '100%',
      direction: isAr ? 'rtl' : 'ltr', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', gap: '11px', background: 'rgba(201,168,76,0.04)', flexShrink: 0 }}>
        {onBack && (
          <button onClick={onBack} className="hide-desktop" style={{ background: 'none', border: 'none', color: '#9a8570', cursor: 'pointer', fontSize: '18px', padding: '4px', lineHeight: 1 }}>
            {isAr ? '→' : '←'}
          </button>
        )}
        <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #c9a84c, #a07830)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#0c0a08', fontWeight: '800', boxShadow: 'var(--glow-gold-soft)', flexShrink: 0 }}>
          {sellerName?.[0]?.toUpperCase() || '?'}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sellerName}</div>
          <div style={{ fontSize: '11px', color: '#9a8570' }}>
            {sellerCountry ? <CountryBadge code={sellerCountry} isAr={isAr} /> : sellerRating ? `⭐ ${sellerRating}` : (isAr ? 'بائع' : 'Seller')}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
        {loading && <div style={{ color: '#9a8570', fontSize: '12px', textAlign: 'center' }}>{isAr ? 'جاري التحميل...' : 'Loading...'}</div>}
        {!loading && messages.length === 0 && (
          <div style={{ color: '#9a8570', fontSize: '12px', textAlign: 'center', marginTop: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>💬</div>
            {isAr ? 'ابدأ المحادثة' : 'Start the conversation'}
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map(m => {
            const mine = m.sender_id === user.id
            return (
              <motion.div key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}
              >
                <div style={{
                  background: mine ? 'linear-gradient(135deg, #c9a84c, #a07830)' : 'rgba(255,255,255,0.06)',
                  color: mine ? '#0c0a08' : '#ffffff',
                  padding: '10px 14px', borderRadius: '14px', fontSize: '13px',
                  lineHeight: '1.5', boxShadow: mine ? '0 4px 14px rgba(201,168,76,0.25)' : '0 2px 8px rgba(0,0,0,0.25)',
                  borderBottomRightRadius: (isAr ? !mine : mine) ? '4px' : '14px',
                  borderBottomLeftRadius: (isAr ? mine : !mine) ? '4px' : '14px',
                }}>
                  {m.content}
                </div>
                <div style={{ fontSize: '9px', color: '#6b5a45', marginTop: '3px', textAlign: mine ? 'end' : 'start' }}>{formatTime(m.created_at)}</div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '14px', borderTop: '1px solid rgba(201,168,76,0.15)', display: 'flex', gap: '8px', flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={isAr ? 'اكتب رسالة...' : 'Type a message...'}
          style={{ flex: 1, padding: '10px 14px', fontSize: '13px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.15)', color: '#ffffff' }}
        />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendMessage} style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)', border: 'none', borderRadius: '10px', color: '#0c0a08', padding: '10px 18px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', boxShadow: 'var(--glow-gold-soft)' }}>
          {isAr ? 'إرسال' : 'Send'}
        </motion.button>
      </div>
    </div>
  )
}
