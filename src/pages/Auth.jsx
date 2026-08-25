import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Reveal from '../components/Reveal'

// Cloudflare's published "always passes" Turnstile test key — swap for your real site key
// from dash.cloudflare.com, and paste the matching secret key into Supabase Dashboard ->
// Authentication -> Attack Protection -> enable CAPTCHA (Turnstile).
const TURNSTILE_SITE_KEY = '1x00000000000000000000AA'

// Flip to true once Supabase email delivery is confirmed working (custom SMTP set up,
// Magic Link template includes {{ .Token }}) — until then, requiring an emailed code would
// lock everyone out since the email never arrives.
const REQUIRE_2FA = false

export default function Auth() {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login')
  const [loginStep, setLoginStep] = useState('credentials') // 'credentials' | 'code'
  const { t, isAr } = useLang()
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const ta = t.auth

  const [form, setForm] = useState({ email: '', password: '', username: '', confirmPassword: '', code: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const initialUserCheckDone = useRef(false)
  const turnstileRef = useRef(null)
  const turnstileWidgetId = useRef(null)

  // Only bounce away if the user was ALREADY logged in when this page loaded — our own
  // login flow deliberately creates a transient session mid-2FA that should NOT redirect.
  useEffect(() => {
    if (!initialUserCheckDone.current) {
      initialUserCheckDone.current = true
      if (user) navigate('/dashboard')
    }
  }, [user])

  // Turnstile's auto-render only scans the DOM once at script load, which misses this
  // React-mounted container in an SPA — render it explicitly via the JS API instead.
  // Guards against re-rendering into an already-populated container (React 18 StrictMode
  // double-invokes effects in dev, which would otherwise render this widget twice).
  useEffect(() => {
    if (mode !== 'register' || !turnstileRef.current) return
    let cancelled = false
    const renderWidget = () => {
      if (cancelled || !window.turnstile || !turnstileRef.current) return
      if (turnstileRef.current.childElementCount > 0) return
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setCaptchaToken(token),
        'expired-callback': () => setCaptchaToken(null),
      })
    }
    if (window.turnstile) renderWidget()
    else {
      const interval = setInterval(() => { if (window.turnstile) { renderWidget(); clearInterval(interval) } }, 200)
      return () => { cancelled = true; clearInterval(interval) }
    }
    return () => { cancelled = true }
  }, [mode])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const resetToCredentials = () => {
    setLoginStep('credentials')
    setForm(f => ({ ...f, code: '' }))
    setError('')
  }

  const handleRegister = async () => {
    if (!form.username.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      return setError(isAr ? 'يرجى تعبئة جميع الحقول' : 'Please fill in all fields')
    }
    if (form.password !== form.confirmPassword) {
      return setError(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match')
    }
    if (!captchaToken) {
      return setError(isAr ? 'يرجى إكمال التحقق أدناه' : 'Please complete the verification challenge below')
    }

    setLoading(true)
    const username = form.username.trim()

    const { data: existing } = await supabase.from('profiles').select('id').eq('username', username).maybeSingle()
    if (existing) {
      setLoading(false)
      return setError(isAr ? 'اسم المستخدم مستخدم بالفعل' : 'Username is already taken')
    }

    const { data, error: e } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { username }, captchaToken },
    })

    if (e) {
      setLoading(false)
      if (/already registered|already exists/i.test(e.message)) {
        return setError(isAr ? 'هذا البريد الإلكتروني مسجل بالفعل' : 'This email is already registered')
      }
      return setError(e.message)
    }

    if (data.user) {
      const { error: profileErr } = await supabase.from('profiles').insert({ id: data.user.id, username })
      if (profileErr) {
        setLoading(false)
        return setError(isAr ? 'اسم المستخدم مستخدم بالفعل، جرب اسماً آخر' : 'Username already taken, please try a different one')
      }
    }

    setLoading(false)

    // If email confirmation is off in your Supabase project, signUp already returns an
    // active session — no email needed, so just log them straight in instead of telling
    // them to check an email that will never arrive.
    if (data.session) {
      navigate('/dashboard')
      return
    }

    setSuccess(isAr ? 'تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد حسابك (تحقق من مجلد الرسائل غير المرغوب فيها أيضاً).' : 'Account created! Check your email to confirm your account (check spam too).')
  }

  const handleLoginCredentials = async () => {
    if (!form.email.trim() || !form.password) {
      return setError(isAr ? 'يرجى تعبئة جميع الحقول' : 'Please fill in all fields')
    }
    setLoading(true)
    const { error: e } = await signIn(form.email.trim(), form.password)
    if (e) {
      setLoading(false)
      return setError(isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Incorrect email or password')
    }

    if (!REQUIRE_2FA) {
      setLoading(false)
      navigate('/dashboard')
      return
    }

    // Credentials are valid — drop this session and require the emailed code before it counts.
    await supabase.auth.signOut()
    const { error: otpErr } = await supabase.auth.signInWithOtp({ email: form.email.trim(), options: { shouldCreateUser: false } })
    setLoading(false)
    if (otpErr) return setError(otpErr.message)
    setLoginStep('code')
  }

  const handleLoginCode = async () => {
    if (!form.code.trim()) return setError(isAr ? 'أدخل الرمز المرسل إلى بريدك' : 'Enter the code sent to your email')
    setLoading(true)
    const { error: e } = await supabase.auth.verifyOtp({ email: form.email.trim(), token: form.code.trim(), type: 'email' })
    setLoading(false)
    if (e) return setError(isAr ? 'رمز غير صحيح أو منتهي الصلاحية' : 'Invalid or expired code')
    navigate('/dashboard')
  }

  const handleSubmit = async () => {
    setError('')
    if (mode === 'register') return handleRegister()
    if (loginStep === 'credentials') return handleLoginCredentials()
    return handleLoginCode()
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(/desert.jpg) center/cover no-repeat' }} />
      <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(201,168,76,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(to top, rgba(201,168,76,0.08) 0%, transparent 100%)', pointerEvents: 'none' }} />

      <Reveal style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.svg" alt="SooqGG" style={{ width: '36px', height: '36px', borderRadius: '9px' }} />
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-display)' }}>{t.logo}<span style={{ color: 'var(--accent)' }}>.gg</span></span>
          </Link>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '3px', marginBottom: '24px' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); resetToCredentials() }} style={{
                flex: 1, padding: '8px', borderRadius: 'calc(var(--radius-md) - 2px)',
                border: 'none', fontSize: '13px', fontWeight: '700',
                background: mode === m ? 'var(--accent)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}>
                {m === 'login' ? ta.loginTitle : ta.registerTitle}
              </button>
            ))}
          </div>

          {mode === 'login' && loginStep === 'code' ? (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.7' }}>
                {isAr
                  ? `أرسلنا رمزاً مكوناً من 6 أرقام إلى ${form.email}. أدخله للمتابعة.`
                  : `We sent a 6-digit code to ${form.email}. Enter it to continue.`}
              </p>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>
                {isAr ? 'رمز التحقق' : 'Verification Code'}
              </label>
              <input
                value={form.code}
                onChange={e => set('code', e.target.value)}
                placeholder="123456"
                maxLength={6}
                style={{ width: '100%', padding: '10px 12px', fontSize: '18px', letterSpacing: '4px', textAlign: 'center', fontFamily: 'monospace' }}
              />
              <button onClick={resetToCredentials} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '12px', cursor: 'pointer', marginTop: '10px', padding: 0 }}>
                {isAr ? '← رجوع' : '← Back'}
              </button>
            </div>
          ) : (
            <>
              {/* Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mode === 'register' && (
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>{ta.username}</label>
                    <input value={form.username} onChange={e => set('username', e.target.value)} placeholder={ta.username} style={{ width: '100%', padding: '10px 12px', fontSize: '13px' }} />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>{ta.email}</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder={ta.email} style={{ width: '100%', padding: '10px 12px', fontSize: '13px' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ta.password}</label>
                    {mode === 'login' && <button style={{ fontSize: '11px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>{ta.forgotPassword}</button>}
                  </div>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder={ta.password} style={{ width: '100%', padding: '10px 12px', fontSize: '13px' }} />
                </div>
                {mode === 'register' && (
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>{ta.confirmPassword}</label>
                    <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder={ta.confirmPassword} style={{ width: '100%', padding: '10px 12px', fontSize: '13px' }} />
                  </div>
                )}
                {mode === 'register' && (
                  <div ref={turnstileRef} />
                )}
              </div>
            </>
          )}

          {error && <div style={{ marginTop: '12px', padding: '10px', background: '#1f0a0a', border: '1px solid var(--red)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: '#f87171' }}>{error}</div>}
          {success && <div style={{ marginTop: '12px', padding: '10px', background: '#0a1f0e', border: '1px solid #166534', borderRadius: 'var(--radius-md)', fontSize: '12px', color: '#4ade80' }}>{success}</div>}

          <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px', marginTop: '16px' }} onClick={handleSubmit} disabled={loading}>
            {loading ? '...' : mode === 'register' ? ta.registerBtn : loginStep === 'code' ? (isAr ? 'تأكيد الرمز' : 'Verify Code') : ta.loginBtn}
          </button>

          {loginStep === 'credentials' && (
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>
              {mode === 'login' ? ta.noAccount : ta.hasAccount}{' '}
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess('') }} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                {mode === 'login' ? ta.signupLink : ta.loginLink}
              </button>
            </p>
          )}
        </div>
      </Reveal>
    </div>
  )
}
