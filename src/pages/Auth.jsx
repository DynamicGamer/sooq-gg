import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login')
  const { t } = useLang()
  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()
  const ta = t.auth

  const [form, setForm] = useState({ email: '', password: '', username: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { if (user) navigate('/dashboard') }, [user])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    if (mode === 'login') {
      const { error: e } = await signIn(form.email, form.password)
      if (e) setError(e.message)
      else navigate('/dashboard')
    } else {
      if (form.password !== form.confirmPassword) { setError(t.isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'); setLoading(false); return }
      const { error: e } = await signUp(form.email, form.password, form.username)
      if (e) setError(e.message)
      else setSuccess(t.isAr ? 'تم إنشاء الحساب! تحقق من بريدك الإلكتروني.' : 'Account created! Check your email.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚡</div>
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>{t.logo}<span style={{ color: 'var(--accent)' }}>.gg</span></span>
          </Link>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '3px', marginBottom: '24px' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
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
          </div>

          {error && <div style={{ marginTop: '12px', padding: '10px', background: '#1f0a0a', border: '1px solid var(--red)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: '#f87171' }}>{error}</div>}
          {success && <div style={{ marginTop: '12px', padding: '10px', background: '#0a1f0e', border: '1px solid #166534', borderRadius: 'var(--radius-md)', fontSize: '12px', color: '#4ade80' }}>{success}</div>}

          <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px', marginTop: '16px' }} onClick={handleSubmit} disabled={loading}>
            {loading ? '...' : mode === 'login' ? ta.loginBtn : ta.registerBtn}
          </button>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>
            {mode === 'login' ? ta.noAccount : ta.hasAccount}{' '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
              {mode === 'login' ? ta.signupLink : ta.loginLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
