import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const GAMES = [
  { id: 1,  name: 'PUBG Mobile',         nameAr: 'ببجي موبايل',        tagEn: 'UC Top-Up',       tagAr: 'UC شحن',         color: '#f59e0b', img: '🎯', sellers: 142, hot: true  },
  { id: 2,  name: 'Free Fire',            nameAr: 'فري فاير',           tagEn: 'Diamond Top-Up',  tagAr: 'ماسة شحن',       color: '#10b981', img: '🔥', sellers: 98,  hot: true  },
  { id: 3,  name: 'Fortnite',             nameAr: 'فورتنايت',           tagEn: 'V-Bucks',         tagAr: 'V-Bucks',        color: '#6366f1', img: '🌪️', sellers: 76,  hot: false },
  { id: 4,  name: 'Clash of Clans',       nameAr: 'كلاش أوف كلانس',    tagEn: 'Gems Top-Up',     tagAr: 'جيمز شحن',       color: '#f97316', img: '🏰', sellers: 64,  hot: false },
  { id: 5,  name: 'Mobile Legends',       nameAr: 'موبايل ليجندز',      tagEn: 'Diamond Top-Up',  tagAr: 'ماسة شحن',       color: '#8b5cf6', img: '⚡', sellers: 59,  hot: true  },
  { id: 6,  name: 'Valorant',             nameAr: 'فالورانت',           tagEn: 'VP Top-Up',       tagAr: 'VP شحن',         color: '#ef4444', img: '🔫', sellers: 51,  hot: false },
  { id: 7,  name: 'FIFA Mobile',          nameAr: 'فيفا موبايل',        tagEn: 'FC Points',       tagAr: 'FC Points',      color: '#3b82f6', img: '⚽', sellers: 88,  hot: false },
  { id: 8,  name: 'Genshin Impact',       nameAr: 'جنشن إمباكت',        tagEn: 'Genesis Crystal', tagAr: 'Genesis Crystal', color: '#06b6d4', img: '✨', sellers: 43,  hot: false },
  { id: 9,  name: 'Call of Duty Mobile',  nameAr: 'كول أوف ديوتي',      tagEn: 'CP Top-Up',       tagAr: 'CP شحن',         color: '#84cc16', img: '💥', sellers: 37,  hot: false },
  { id: 10, name: 'League of Legends',    nameAr: 'ليج أوف ليجندز',     tagEn: 'RP Top-Up',       tagAr: 'RP شحن',         color: '#c084fc', img: '🏆', sellers: 29,  hot: false },
  { id: 11, name: 'Steam Wallet',         nameAr: 'ستيم',               tagEn: 'Gift Card',       tagAr: 'بطاقة هدية',     color: '#64748b', img: '🎮', sellers: 55,  hot: false },
  { id: 12, name: 'PlayStation',          nameAr: 'بلايستيشن',          tagEn: 'PSN Card',        tagAr: 'PSN Card',       color: '#1d4ed8', img: '🕹️', sellers: 47,  hot: false },
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