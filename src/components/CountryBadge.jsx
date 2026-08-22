import { findCountry } from '../lib/countries'

export default function CountryBadge({ code, isAr, style }) {
  const country = findCountry(code)
  if (!country) return null

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', ...style }}>
      <img
        src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
        alt={country.code}
        width={16}
        height={12}
        style={{ borderRadius: '2px', objectFit: 'cover', flexShrink: 0, display: 'inline-block' }}
        onError={e => { e.target.style.display = 'none' }}
      />
      {isAr ? country.ar : country.en}
    </span>
  )
}
