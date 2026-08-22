import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const GENRES = [
  { id: 'battle_royale', en: 'Battle Royale', ar: 'باتل رويال' },
  { id: 'shooter',       en: 'Shooter',       ar: 'شوتر' },
  { id: 'moba',          en: 'MOBA',          ar: 'موبا' },
  { id: 'sports',        en: 'Sports',        ar: 'رياضة' },
  { id: 'strategy',      en: 'Strategy',      ar: 'استراتيجية' },
  { id: 'rpg',           en: 'RPG',           ar: 'آر بي جي' },
  { id: 'platform',      en: 'Gift Cards & Platforms', ar: 'بطاقات ومنصات' },
]

export const GAMES = [
  { id: 1,  name: 'PUBG Mobile',         nameAr: 'ببجي موبايل',        tagEn: 'UC Top-Up',       tagAr: 'UC شحن',         color: '#f59e0b', img: '🎯', hot: true,  genre: 'battle_royale' },
  { id: 2,  name: 'Free Fire',            nameAr: 'فري فاير',           tagEn: 'Diamond Top-Up',  tagAr: 'ماسة شحن',       color: '#10b981', img: '🔥', hot: true,  genre: 'battle_royale' },
  { id: 3,  name: 'Fortnite',             nameAr: 'فورتنايت',           tagEn: 'V-Bucks',         tagAr: 'V-Bucks',        color: '#6366f1', img: '🌪️', hot: false, genre: 'battle_royale' },
  { id: 4,  name: 'Clash of Clans',       nameAr: 'كلاش أوف كلانس',    tagEn: 'Gems Top-Up',     tagAr: 'جيمز شحن',       color: '#f97316', img: '🏰', hot: false, genre: 'strategy' },
  { id: 5,  name: 'Mobile Legends',       nameAr: 'موبايل ليجندز',      tagEn: 'Diamond Top-Up',  tagAr: 'ماسة شحن',       color: '#8b5cf6', img: '⚡', hot: true,  genre: 'moba' },
  { id: 6,  name: 'Valorant',             nameAr: 'فالورانت',           tagEn: 'VP Top-Up',       tagAr: 'VP شحن',         color: '#ef4444', img: '🔫', hot: false, genre: 'shooter' },
  { id: 7,  name: 'FIFA Mobile',          nameAr: 'فيفا موبايل',        tagEn: 'FC Points',       tagAr: 'FC Points',      color: '#3b82f6', img: '⚽', hot: false, genre: 'sports' },
  { id: 8,  name: 'Genshin Impact',       nameAr: 'جنشن إمباكت',        tagEn: 'Genesis Crystal', tagAr: 'Genesis Crystal', color: '#06b6d4', img: '✨', hot: false, genre: 'rpg' },
  { id: 9,  name: 'Call of Duty Mobile',  nameAr: 'كول أوف ديوتي',      tagEn: 'CP Top-Up',       tagAr: 'CP شحن',         color: '#84cc16', img: '💥', hot: false, genre: 'shooter' },
  { id: 10, name: 'League of Legends',    nameAr: 'ليج أوف ليجندز',     tagEn: 'RP Top-Up',       tagAr: 'RP شحن',         color: '#c084fc', img: '🏆', hot: false, genre: 'moba' },
  { id: 11, name: 'Steam Wallet',         nameAr: 'ستيم',               tagEn: 'Gift Card',       tagAr: 'بطاقة هدية',     color: '#64748b', img: '🎮', hot: false, genre: 'platform' },
  { id: 12, name: 'PlayStation',          nameAr: 'بلايستيشن',          tagEn: 'PSN Card',        tagAr: 'PSN Card',       color: '#1d4ed8', img: '🕹️', hot: false, genre: 'platform' },
]

export async function fetchListings() {
  const { data, error } = await supabase.from('listings').select('*')
  if (error) {
    console.error('Error fetching listings:', error)
    return []
  }
  return data
}

export const CATEGORIES = ['topups', 'accounts', 'currency', 'items', 'boosting', 'giftcards']

export async function fetchLiveStats() {
  const fallback = { trades: 0, volume: 0, activeListings: 0 }
  try {
    const [tradesRes, volumeRes, listingsRes] = await Promise.all([
      supabase.from('escrow_orders').select('id', { count: 'exact', head: true }).in('status', ['completed', 'released']),
      supabase.from('escrow_orders').select('grand_total').in('status', ['completed', 'released']),
      supabase.from('listings').select('id', { count: 'exact', head: true }),
    ])
    const volume = (volumeRes.data || []).reduce((sum, row) => sum + (parseFloat(row.grand_total) || 0), 0)
    return {
      trades: tradesRes.count || 0,
      volume,
      activeListings: listingsRes.count || 0,
    }
  } catch (err) {
    console.error('Error fetching live stats:', err)
    return fallback
  }
}