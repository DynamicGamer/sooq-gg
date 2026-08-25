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
  { id: 'sandbox',       en: 'Sandbox & Roblox', ar: 'ساندبوكس وروبلوكس' },
  { id: 'platform',      en: 'Gift Cards & Platforms', ar: 'بطاقات ومنصات' },
]

// `slug` maps to /games/{slug}.jpg — if that file doesn't exist yet, the UI falls back to
// the `color` gradient + `img` emoji automatically. Drop real cover art into public/games/
// named by slug to upgrade any of these from placeholder to real artwork.
export const GAMES = [
  { id: 1,  name: 'PUBG Mobile',         nameAr: 'ببجي موبايل',        tagEn: 'UC Top-Up',       tagAr: 'UC شحن',         color: '#f59e0b', img: '🎯', hot: true,  genre: 'battle_royale', slug: 'pubg' },
  { id: 2,  name: 'Free Fire',            nameAr: 'فري فاير',           tagEn: 'Diamond Top-Up',  tagAr: 'ماسة شحن',       color: '#10b981', img: '🔥', hot: true,  genre: 'battle_royale', slug: 'freefire' },
  { id: 3,  name: 'Fortnite',             nameAr: 'فورتنايت',           tagEn: 'V-Bucks',         tagAr: 'V-Bucks',        color: '#6366f1', img: '🌪️', hot: false, genre: 'battle_royale', slug: 'fortnite' },
  { id: 4,  name: 'Clash of Clans',       nameAr: 'كلاش أوف كلانس',    tagEn: 'Gems Top-Up',     tagAr: 'جيمز شحن',       color: '#f97316', img: '🏰', hot: false, genre: 'strategy', slug: 'coc' },
  { id: 5,  name: 'Mobile Legends',       nameAr: 'موبايل ليجندز',      tagEn: 'Diamond Top-Up',  tagAr: 'ماسة شحن',       color: '#8b5cf6', img: '⚡', hot: true,  genre: 'moba', slug: 'mlbb' },
  { id: 6,  name: 'Valorant',             nameAr: 'فالورانت',           tagEn: 'VP Top-Up',       tagAr: 'VP شحن',         color: '#ef4444', img: '🔫', hot: false, genre: 'shooter', slug: 'valorant' },
  { id: 7,  name: 'FIFA Mobile',          nameAr: 'فيفا موبايل',        tagEn: 'FC Points',       tagAr: 'FC Points',      color: '#3b82f6', img: '⚽', hot: false, genre: 'sports', slug: 'fifa' },
  { id: 8,  name: 'Genshin Impact',       nameAr: 'جنشن إمباكت',        tagEn: 'Genesis Crystal', tagAr: 'Genesis Crystal', color: '#06b6d4', img: '✨', hot: false, genre: 'rpg', slug: 'genshin' },
  { id: 9,  name: 'Call of Duty Mobile',  nameAr: 'كول أوف ديوتي',      tagEn: 'CP Top-Up',       tagAr: 'CP شحن',         color: '#84cc16', img: '💥', hot: false, genre: 'shooter', slug: 'codm' },
  { id: 10, name: 'League of Legends',    nameAr: 'ليج أوف ليجندز',     tagEn: 'RP Top-Up',       tagAr: 'RP شحن',         color: '#c084fc', img: '🏆', hot: false, genre: 'moba', slug: 'lol' },
  { id: 11, name: 'Steam Wallet',         nameAr: 'ستيم',               tagEn: 'Gift Card',       tagAr: 'بطاقة هدية',     color: '#64748b', img: '🎮', hot: false, genre: 'platform', slug: 'steam' },
  { id: 12, name: 'PlayStation',          nameAr: 'بلايستيشن',          tagEn: 'PSN Card',        tagAr: 'PSN Card',       color: '#1d4ed8', img: '🕹️', hot: false, genre: 'platform', slug: 'psn' },
  { id: 13, name: 'Roblox',               nameAr: 'روبلوكس',            tagEn: 'Robux',           tagAr: 'روبكس',          color: '#e2231a', img: '🧱', hot: true,  genre: 'sandbox', slug: 'roblox' },
  { id: 14, name: 'Minecraft',            nameAr: 'ماينكرافت',          tagEn: 'Account',         tagAr: 'حساب',           color: '#5b8731', img: '⛏️', hot: false, genre: 'sandbox', slug: 'minecraft' },
  { id: 15, name: 'Grow a Garden',        nameAr: 'جرو أ جاردن',        tagEn: 'Sheckles',        tagAr: 'شيكلز',          color: '#4ade80', img: '🌱', hot: true,  genre: 'sandbox', slug: 'growagarden' },
  { id: 16, name: 'Steal a Brainrot',     nameAr: 'ستيل أ براينروت',    tagEn: 'Brainrot Trades', tagAr: 'تداول براينروت', color: '#ff6b9d', img: '🧠', hot: true,  genre: 'sandbox', slug: 'stealbrainrot' },
  { id: 17, name: 'Brawl Stars',          nameAr: 'براول ستارز',        tagEn: 'Gems',            tagAr: 'جواهر',          color: '#fbbf24', img: '⭐', hot: false, genre: 'moba', slug: 'brawlstars' },
  { id: 18, name: 'Clash Royale',         nameAr: 'كلاش رويال',         tagEn: 'Gems',            tagAr: 'جواهر',          color: '#3b82f6', img: '👑', hot: false, genre: 'strategy', slug: 'clashroyale' },
  { id: 19, name: 'Apex Legends',         nameAr: 'أبكس ليجندز',        tagEn: 'Account',         tagAr: 'حساب',           color: '#ff2e2e', img: '🎯', hot: false, genre: 'battle_royale', slug: 'apexlegends' },
  { id: 20, name: 'Rocket League',        nameAr: 'روكيت ليج',          tagEn: 'Credits',         tagAr: 'كريديت',         color: '#f97316', img: '🚗', hot: false, genre: 'sports', slug: 'rocketleague' },
  { id: 21, name: 'Dota 2',               nameAr: 'دوتا 2',             tagEn: 'Account',         tagAr: 'حساب',           color: '#b91c1c', img: '🛡️', hot: false, genre: 'moba', slug: 'dota2' },
  { id: 22, name: 'Counter-Strike 2',     nameAr: 'كاونتر سترايك 2',    tagEn: 'Skins & Account', tagAr: 'سكنز وحساب',     color: '#eab308', img: '🔫', hot: true,  genre: 'shooter', slug: 'cs2' },
  { id: 23, name: 'Overwatch 2',          nameAr: 'أوفروواتش 2',        tagEn: 'Account',         tagAr: 'حساب',           color: '#f97316', img: '🦾', hot: false, genre: 'shooter', slug: 'overwatch2' },
  { id: 24, name: 'World of Warcraft',    nameAr: 'وورلد أوف ووركرافت', tagEn: 'Gold',            tagAr: 'ذهب',            color: '#ca8a04', img: '⚔️', hot: false, genre: 'rpg', slug: 'wow' },
  { id: 25, name: 'Honor of Kings',       nameAr: 'هونر أوف كينجز',     tagEn: 'Diamonds',        tagAr: 'ماس',            color: '#7c3aed', img: '👑', hot: false, genre: 'moba', slug: 'honorofkings' },
  { id: 26, name: 'Rainbow Six Siege',    nameAr: 'رينبو سيكس سييج',    tagEn: 'Account',         tagAr: 'حساب',           color: '#1f2937', img: '🎯', hot: false, genre: 'shooter', slug: 'r6siege' },
  { id: 27, name: 'Call of Duty: Warzone', nameAr: 'كول أوف ديوتي: وورزون', tagEn: 'CP Top-Up',    tagAr: 'CP شحن',         color: '#4b5563', img: '🪖', hot: false, genre: 'shooter', slug: 'codwarzone' },
  { id: 28, name: 'Xbox Game Pass',       nameAr: 'إكس بوكس جيم باس',   tagEn: 'Membership',      tagAr: 'اشتراك',         color: '#107c10', img: '🎮', hot: false, genre: 'platform', slug: 'xboxgamepass' },
  { id: 29, name: 'Gift Cards',           nameAr: 'بطاقات هدايا',       tagEn: 'All Brands',      tagAr: 'كل الأنواع',     color: '#c9a84c', img: '🎁', hot: false, genre: 'platform', slug: 'giftcards' },
  { id: 30, name: 'Discord Nitro',        nameAr: 'ديسكورد نيترو',      tagEn: 'Subscription',    tagAr: 'اشتراك',         color: '#5865f2', img: '💬', hot: false, genre: 'platform', slug: 'discordnitro' },
]

// Central lookup so every screen renders the same photo (or the same graceful placeholder)
// for a given game, instead of five separate hardcoded GAME_IMAGES dictionaries drifting
// out of sync as the catalog grows.
export function gameImageUrl(nameOrGame) {
  const game = typeof nameOrGame === 'string' ? GAMES.find(g => g.name === nameOrGame) : nameOrGame
  return game?.slug ? `/games/${game.slug}.jpg` : null
}

export async function fetchListings() {
  const { data, error } = await supabase.from('listings').select('*')
  if (error) {
    console.error('Error fetching listings:', error)
    return []
  }
  return data
}

export const CATEGORIES = ['topups', 'accounts', 'currency', 'items', 'boosting', 'giftcards']