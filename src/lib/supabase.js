import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ─── Mock data (replace with real Supabase queries later) ───────────────────

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

export const LISTINGS = [
  { id: 'l1', gameId: 1, game: 'PUBG Mobile', typeEn: '660 UC',         typeAr: '660 UC',       price: '3.20', seller: 'خالد_GG',   sellerEn: 'Khaled_GG',  rating: 4.9, sales: 1240, badgeKey: 'trusted', deliveryKey: 'instant', descAr: 'شحن UC أوتوماتيكي على حسابك فوراً بعد الدفع.', descEn: 'Automatic UC top-up to your account right after payment.' },
  { id: 'l2', gameId: 2, game: 'Free Fire',   typeEn: '520 Diamonds',   typeAr: '520 ماسة',     price: '2.80', seller: 'سوق_برو',   sellerEn: 'SooqPro',    rating: 5.0, sales: 876,  badgeKey: 'vip',     deliveryKey: 'instant', descAr: 'شحن ماس فري فاير بأسرع وقت.', descEn: 'Free Fire diamond top-up, fastest delivery.' },
  { id: 'l3', gameId: 1, game: 'PUBG Mobile', typeEn: '1800 UC',        typeAr: '1800 UC',      price: '8.50', seller: 'GulfGamer',  sellerEn: 'GulfGamer',  rating: 4.8, sales: 553,  badgeKey: 'trusted', deliveryKey: 'instant', descAr: 'باقة 1800 UC بأفضل سعر في المنطقة.', descEn: 'Best price for 1800 UC in the region.' },
  { id: 'l4', gameId: 3, game: 'Fortnite',    typeEn: '1000 V-Bucks',   typeAr: '1000 V-Bucks', price: '6.90', seller: 'TopUp_KSA', sellerEn: 'TopUp_KSA', rating: 4.7, sales: 321,  badgeKey: null,      deliveryKey: 'instant', descAr: 'V-Bucks فورتنايت، تسليم سريع.', descEn: 'Fortnite V-Bucks, quick delivery.' },
  { id: 'l5', gameId: 5, game: 'Mobile Legends', typeEn: '500 Diamonds', typeAr: '500 ماسة',    price: '4.20', seller: 'MLBBstore', sellerEn: 'MLBBstore', rating: 4.9, sales: 789,  badgeKey: 'vip',     deliveryKey: 'instant', descAr: 'ماس موبايل ليجندز بأرخص سعر.', descEn: 'Cheapest Mobile Legends diamonds.' },
  { id: 'l6', gameId: 7, game: 'FIFA Mobile',  typeEn: '2200 FC Points', typeAr: '2200 FC Points', price: '19.99', seller: 'FIFAkings', sellerEn: 'FIFAkings', rating: 4.6, sales: 210, badgeKey: null,    deliveryKey: 'minutes', descAr: 'FC Points فيفا موبايل.', descEn: 'FIFA Mobile FC Points top-up.' },
]

export const CATEGORIES = ['topups', 'accounts', 'currency', 'items', 'boosting', 'giftcards']
