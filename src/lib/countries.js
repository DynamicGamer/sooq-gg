export const COUNTRIES = [
  { code: 'JO', en: 'Jordan',        ar: 'الأردن',        flag: '🇯🇴' },
  { code: 'SA', en: 'Saudi Arabia',  ar: 'السعودية',       flag: '🇸🇦' },
  { code: 'AE', en: 'UAE',           ar: 'الإمارات',       flag: '🇦🇪' },
  { code: 'EG', en: 'Egypt',         ar: 'مصر',            flag: '🇪🇬' },
  { code: 'KW', en: 'Kuwait',        ar: 'الكويت',         flag: '🇰🇼' },
  { code: 'QA', en: 'Qatar',         ar: 'قطر',            flag: '🇶🇦' },
  { code: 'BH', en: 'Bahrain',       ar: 'البحرين',        flag: '🇧🇭' },
  { code: 'OM', en: 'Oman',          ar: 'عُمان',           flag: '🇴🇲' },
  { code: 'LB', en: 'Lebanon',       ar: 'لبنان',          flag: '🇱🇧' },
  { code: 'IQ', en: 'Iraq',          ar: 'العراق',         flag: '🇮🇶' },
  { code: 'PS', en: 'Palestine',     ar: 'فلسطين',         flag: '🇵🇸' },
  { code: 'SY', en: 'Syria',         ar: 'سوريا',          flag: '🇸🇾' },
  { code: 'MA', en: 'Morocco',       ar: 'المغرب',         flag: '🇲🇦' },
  { code: 'US', en: 'United States', ar: 'الولايات المتحدة', flag: '🇺🇸' },
  { code: 'GB', en: 'United Kingdom', ar: 'بريطانيا',      flag: '🇬🇧' },
]

export function findCountry(code) {
  return COUNTRIES.find(c => c.code === code) || null
}

export function countryLabel(code, isAr) {
  const c = findCountry(code)
  if (!c) return null
  return `${c.flag} ${isAr ? c.ar : c.en}`
}
