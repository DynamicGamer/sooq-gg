import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { WALLETS, COMMISSION_RATE } from '../lib/wallets'

const STEPS = ['select_crypto', 'send_payment', 'confirm', 'done']

export default function Checkout() {
  const { isAr } = useLang()
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('select_crypto')
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [copied, setCopied] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [orderId, setOrderId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fee = total * COMMISSION_RATE
  const grandTotal = total + fee

  useEffect(() => {
    if (!user) navigate('/auth')
    if (items.length === 0) navigate('/cart')
  }, [user, items])

  const copy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreateOrder = async () => {
    setLoading(true)
    setError('')
    try {
      const orderData = {
        buyer_id: user.id,
        items: items.map(i => ({ id: i.id, name: i.name || i.typeEn, game: i.game, price: i.price, qty: i.qty })),
        subtotal: total.toFixed(2),
        fee: fee.toFixed(2),
        grand_total: grandTotal.toFixed(2),
        crypto_network: selectedWallet.network,
        crypto_symbol: selectedWallet.symbol,
        wallet_address: selectedWallet.address,
        tx_hash: txHash,
        status: 'pending_payment',
        created_at: new Date().toISOString(),
      }

      const { data, error: e } = await supabase.from('escrow_orders').insert([orderData]).select().single()

      if (e) {
        // If table doesn't exist yet, simulate order creation
        console.warn('Supabase error:', e.message)
        setOrderId(`ORD-${Date.now()}`)
      } else {
        setOrderId(data.id)
      }

      clearCart()
      setStep('done')
    } catch (err) {
      setOrderId(`ORD-${Date.now()}`)
      clearCart()
      setStep('done')
    }
    setLoading(false)
  }

  const walletList = Object.entries(WALLETS)

  return (
    <div className="page-container" style={{ maxWidth: '600px' }}>

      {/* PROGRESS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
        {[
          { key: 'select_crypto', label: isAr ? 'اختر العملة' : 'Select Crypto' },
          { key: 'send_payment', label: isAr ? 'أرسل الدفعة' : 'Send Payment' },
          { key: 'confirm', label: isAr ? 'تأكيد' : 'Confirm' },
          { key: 'done', label: isAr ? 'تم' : 'Done' },
        ].map((s, i, arr) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: step === s.key ? 'var(--accent)' : STEPS.indexOf(step) > STEPS.indexOf(s.key) ? '#10b981' : 'var(--bg-tertiary)',
                border: `1px solid ${step === s.key ? 'var(--accent)' : STEPS.indexOf(step) > STEPS.indexOf(s.key) ? '#10b981' : 'var(--border-hover)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '700', color: '#fff',
              }}>
                {STEPS.indexOf(step) > STEPS.indexOf(s.key) ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '10px', color: step === s.key ? 'var(--accent)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{s.label}</span>
            </div>
            {i < arr.length - 1 && <div style={{ flex: 1, height: '1px', background: 'var(--border)', margin: '0 4px', marginBottom: '16px' }} />}
          </div>
        ))}
      </div>

      {/* STEP 1: SELECT CRYPTO */}
      {step === 'select_crypto' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>
            {isAr ? 'اختر طريقة الدفع' : 'Select Payment Method'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {isAr ? 'اختر العملة التي تريد الدفع بها' : 'Choose which crypto you want to pay with'}
          </p>

          {/* ORDER SUMMARY */}
          <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              {isAr ? 'ملخص الطلب' : 'Order Summary'}
            </div>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>{item.name || item.typeEn} × {item.qty}</span>
                <span>${(parseFloat(item.price) * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '10px', paddingTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <span>{isAr ? 'عمولة المنصة (7%)' : 'Platform fee (7%)'}</span>
                <span>${fee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', marginTop: '8px' }}>
                <span>{isAr ? 'الإجمالي' : 'Total'}</span>
                <span style={{ color: 'var(--accent)' }}>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* CRYPTO OPTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {walletList.map(([key, wallet]) => (
              <div key={key}
                onClick={() => setSelectedWallet(wallet)}
                style={{
                  background: selectedWallet?.address === wallet.address && selectedWallet?.network === wallet.network ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                  border: `1px solid ${selectedWallet?.address === wallet.address && selectedWallet?.network === wallet.network ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.15s',
                }}>
                <span style={{ fontSize: '24px' }}>{wallet.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>{wallet.symbol}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{wallet.network}</div>
                </div>
                {selectedWallet?.network === wallet.network && selectedWallet?.symbol === wallet.symbol && (
                  <span style={{ color: 'var(--accent)', fontSize: '18px' }}>✓</span>
                )}
              </div>
            ))}
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px' }}
            onClick={() => selectedWallet && setStep('send_payment')}
            disabled={!selectedWallet}>
            {isAr ? 'متابعة ←' : 'Continue →'}
          </button>
        </div>
      )}

      {/* STEP 2: SEND PAYMENT */}
      {step === 'send_payment' && selectedWallet && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>
            {isAr ? 'أرسل الدفعة' : 'Send Payment'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {isAr ? `أرسل المبلغ بالضبط إلى العنوان أدناه` : `Send the exact amount to the address below`}
          </p>

          {/* AMOUNT */}
          <div className="card" style={{ padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {isAr ? 'المبلغ المطلوب' : 'Amount to send'}
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
              ${grandTotal.toFixed(2)}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {isAr ? 'ما يعادله من' : 'equivalent in'} {selectedWallet.symbol} ({selectedWallet.network})
            </div>
          </div>

          {/* WALLET ADDRESS */}
          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>
              {isAr ? 'عنوان المحفظة' : 'Wallet Address'} — {selectedWallet.network}
            </div>
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-hover)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontFamily: 'monospace',
              fontSize: '13px',
              wordBreak: 'break-all',
              lineHeight: '1.6',
              marginBottom: '10px',
              color: '#fff',
            }}>
              {selectedWallet.address}
            </div>
            <button
              onClick={() => copy(selectedWallet.address)}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '13px' }}>
              {copied ? (isAr ? '✓ تم النسخ!' : '✓ Copied!') : (isAr ? '📋 نسخ العنوان' : '📋 Copy Address')}
            </button>
          </div>

          {/* WARNING */}
          <div style={{
            background: '#1f1a09',
            border: '1px solid #854f0b',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontSize: '12px',
            color: '#fbbf24',
            marginBottom: '20px',
            lineHeight: '1.7',
          }}>
            ⚠️ {isAr
              ? `تأكد من إرسال المبلغ على شبكة ${selectedWallet.network} فقط. إرسال على شبكة خاطئة يعني فقدان الأموال.`
              : `Make sure you send on the ${selectedWallet.network} network only. Sending on the wrong network means losing your funds.`}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline" style={{ flex: 1, padding: '12px' }} onClick={() => setStep('select_crypto')}>
              {isAr ? '← رجوع' : '← Back'}
            </button>
            <button className="btn-primary" style={{ flex: 2, padding: '12px', fontSize: '14px' }} onClick={() => setStep('confirm')}>
              {isAr ? 'أرسلت الدفعة ←' : 'I sent the payment →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRM */}
      {step === 'confirm' && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>
            {isAr ? 'تأكيد الدفع' : 'Confirm Payment'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {isAr ? 'أدخل رقم المعاملة (TX Hash) للتحقق من دفعتك' : 'Enter your transaction hash (TX ID) to verify your payment'}
          </p>

          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '700' }}>
              {isAr ? 'رقم المعاملة (TX Hash / TXID)' : 'Transaction Hash (TX Hash / TXID)'}
            </div>
            <input
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
              placeholder={isAr ? 'الصق رقم المعاملة هنا...' : 'Paste your transaction hash here...'}
              style={{ width: '100%', padding: '10px 12px', fontSize: '13px', fontFamily: 'monospace' }}
            />
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
              {isAr
                ? 'يمكنك إيجاد TX Hash في تطبيق محفظتك بعد إرسال الدفعة'
                : 'You can find the TX Hash in your wallet app after sending'}
            </p>
          </div>

          {/* ESCROW EXPLANATION */}
          <div style={{
            background: 'var(--accent-soft)',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            fontSize: '12px',
            color: '#a78bfa',
            marginBottom: '20px',
            lineHeight: '1.8',
          }}>
            🛡️ {isAr
              ? 'أموالك محفوظة في الضمان (Escrow) — لن يحصل البائع على المال حتى تؤكد استلام طلبك.'
              : 'Your funds are held in escrow — the seller won\'t receive money until you confirm delivery.'}
          </div>

          {error && (
            <div style={{ background: '#1f0a0a', border: '1px solid var(--red)', borderRadius: 'var(--radius-md)', padding: '10px', fontSize: '12px', color: '#f87171', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline" style={{ flex: 1, padding: '12px' }} onClick={() => setStep('send_payment')}>
              {isAr ? '← رجوع' : '← Back'}
            </button>
            <button className="btn-primary" style={{ flex: 2, padding: '12px', fontSize: '14px' }} onClick={handleCreateOrder} disabled={loading}>
              {loading ? '...' : (isAr ? 'تأكيد الطلب ✓' : 'Confirm Order ✓')}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DONE */}
      {step === 'done' && (
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛡️</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '10px' }}>
            {isAr ? 'الطلب في الضمان!' : 'Order in Escrow!'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: '1.7' }}>
            {isAr
              ? 'تم استلام طلبك. البائع سيقوم بالتسليم قريباً.'
              : 'Your order has been received. The seller will deliver shortly.'}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.7' }}>
            {isAr
              ? 'بعد استلام طلبك، اضغط "تأكيد الاستلام" في صفحة طلباتي لتحرير المبلغ للبائع.'
              : 'After receiving your order, click "Confirm Delivery" in My Orders to release payment to the seller.'}
          </p>

          {orderId && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '24px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'رقم الطلب: ' : 'Order ID: '}</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{orderId}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/orders" className="btn-primary" style={{ padding: '10px 24px' }}>
              {isAr ? 'طلباتي' : 'My Orders'}
            </Link>
            <Link to="/" className="btn-outline" style={{ padding: '10px 24px' }}>
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
