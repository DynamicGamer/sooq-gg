import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

const LINK_MAP = {
  'Top-Ups': '/listings/topups',
  'Sell Accounts': '/listings/accounts',
  'Game Currency': '/listings/currency',
  'Boosting': '/listings/boosting',
  'Gift Cards': '/listings/giftcards',
  'Start Selling': '/auth?mode=register',
  'Dashboard': '/dashboard',
  'Commission Policy': '/terms',
  'Verification': '/terms',
  'Help Center': '/terms',
  'Contact Us': '/terms',
  'Report a Problem': '/terms',
  'Terms of Service': '/terms',
  'شحن رصيد': '/listings/topups',
  'بيع حسابات': '/listings/accounts',
  'عملات ألعاب': '/listings/currency',
  'بوستنق': '/listings/boosting',
  'بطاقات هدايا': '/listings/giftcards',
  'ابدأ البيع': '/auth?mode=register',
  'لوحة التحكم': '/dashboard',
  'سياسة العمولة': '/terms',
  'التحقق من الهوية': '/terms',
  'مركز المساعدة': '/terms',
  'تواصل معنا': '/terms',
  'الإبلاغ عن مشكلة': '/terms',
  'شروط الاستخدام': '/terms',
}

export default function Footer() {
  const { t, isAr } = useLang()
  const f = t.home.footer

  return (
    <footer style={{ background: '#0a0800', borderTop: '1px solid rgba(201,168,76,0.12)', padding: '40px 20px', marginTop: '16px', direction: isAr ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '32px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #c9a84c, #a07830)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>⚡</div>
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '15px' }}>{t.logo}<span style={{ color: '#c9a84c' }}>.gg</span></span>
          </div>
          <p style={{ color: '#9a8570', fontSize: '12px', lineHeight: '1.8', margin: 0 }}>{f.desc}</p>
        </div>

        {f.cols.map(col => (
          <div key={col.title}>
            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '13px', marginBottom: '14px' }}>{col.title}</div>
            {col.links.map(l => (
              <Link key={l} to={LINK_MAP[l] || '/'} style={{ display: 'block', color: '#9a8570', fontSize: '12px', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
                onMouseLeave={e => e.currentTarget.style.color = '#9a8570'}
              >{l}</Link>
            ))}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ color: '#6b5a45', fontSize: '12px' }}>{f.copy}</span>
        <span style={{ color: '#6b5a45', fontSize: '12px' }}>{f.made}</span>
      </div>
    </footer>
  )
}