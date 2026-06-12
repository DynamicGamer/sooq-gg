import { useLang } from '../context/LangContext'

export default function Footer() {
  const { t } = useLang()
  const f = t.home.footer

  return (
    <footer style={{
      background: '#0a0c10',
      borderTop: '1px solid var(--border)',
      padding: '32px 20px',
      marginTop: '16px',
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '28px', marginBottom: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
            <div style={{
              width: '26px', height: '26px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              borderRadius: '6px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '12px',
            }}>⚡</div>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>{t.logo}.gg</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: '1.7', margin: 0 }}>{f.desc}</p>
        </div>

        {f.cols.map(col => (
          <div key={col.title}>
            <div style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '12px', marginBottom: '10px' }}>
              {col.title}
            </div>
            {col.links.map(l => (
              <div key={l} style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '7px', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{l}</div>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        borderTop: '1px solid var(--border)', paddingTop: '14px',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
      }}>
        <span style={{ color: 'var(--text-faint)', fontSize: '11px' }}>{f.copy}</span>
        <span style={{ color: 'var(--text-faint)', fontSize: '11px' }}>{f.made}</span>
      </div>
    </footer>
  )
}
