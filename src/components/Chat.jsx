import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import CountryBadge from './CountryBadge'

const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function Chat({ listingId, sellerId, sellerName, sellerRating, sellerCountry, onClose }) {
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
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed', bottom: '20px', right: '20px', width: '350px',
        background: 'linear-gradient(180deg, #15100a, #0c0a06)', border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: '18px', boxShadow: '0 24px 70px rgba(0,0,0,0.75), 0 0 0 1px rgba(201,168,76,0.05)',
        zIndex: 1000, display: 'flex', flexDirection: 'column',
        maxHeight: '500px', direction: isAr ? 'rtl' : 'ltr', overflow: 'hidden',
      }}>
      {/* Header */}
      <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(201,168,76,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #c9a84c, #a07830)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#0c0a08', fontWeight: '800', boxShadow: 'var(--glow-gold-soft)' }}>
            {sellerName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', fontFamily: 'var(--font-display)' }}>{sellerName}</div>
            <div style={{ fontSize: '10px', color: '#9a8570' }}>
              {sellerCountry ? <CountryBadge code={sellerCountry} isAr={isAr} /> : sellerRating ? `⭐ ${sellerRating}` : (isAr ? 'بائع' : 'Seller')}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', width: '26px', height: '26px', color: '#9a8570', cursor: 'pointer', fontSize: '16px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#9a8570' }}
        >×</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '280px' }}>
        {loading && <div style={{ color: '#9a8570', fontSize: '12px', textAlign: 'center' }}>{isAr ? 'جاري التحميل...' : 'Loading...'}</div>}
        {!loading && messages.length === 0 && (
          <div style={{ color: '#9a8570', fontSize: '12px', textAlign: 'center', marginTop: '40px' }}>
            <div style={{ fontSize: '26px', marginBottom: '8px' }}>💬</div>
            {isAr ? 'ابدأ المحادثة مع البائع' : 'Start a conversation with the seller'}
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
                style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '82%' }}
              >
                <div style={{
                  background: mine ? 'linear-gradient(135deg, #c9a84c, #a07830)' : 'rgba(255,255,255,0.06)',
                  color: mine ? '#0c0a08' : '#ffffff',
                  padding: '9px 13px', borderRadius: '13px', fontSize: '13px',
                  lineHeight: '1.5', boxShadow: mine ? '0 4px 14px rgba(201,168,76,0.25)' : '0 2px 8px rgba(0,0,0,0.25)',
                  borderBottomRightRadius: (isAr ? !mine : mine) ? '4px' : '13px',
                  borderBottomLeftRadius: (isAr ? mine : !mine) ? '4px' : '13px',
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
      <div style={{ padding: '14px', borderTop: '1px solid rgba(201,168,76,0.15)', display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={isAr ? 'اكتب رسالة...' : 'Type a message...'}
          style={{ flex: 1, padding: '9px 13px', fontSize: '13px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.15)', color: '#ffffff' }}
        />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendMessage} style={{ background: 'linear-gradient(135deg, #c9a84c, #a07830)', border: 'none', borderRadius: '10px', color: '#0c0a08', padding: '9px 16px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', boxShadow: 'var(--glow-gold-soft)' }}>
          {isAr ? 'إرسال' : 'Send'}
        </motion.button>
      </div>
    </motion.div>
  )
}


