import { createContext, useContext, useState, useEffect } from 'react'

const LangContext = createContext()

export const translations = {
  ar: {
    dir: 'rtl',
    langToggle: 'EN',
    logo: 'سوق',
    nav: {
      topups: 'شحن رصيد', accounts: 'حسابات', currency: 'عملات',
      items: 'أيتمز', boosting: 'بوستنق', giftcards: 'بطاقات هدايا',
      login: 'تسجيل دخول', register: 'إنشاء حساب', startSelling: 'ابدأ البيع',
      dashboard: 'لوحة التحكم', logout: 'تسجيل خروج',
    },
    home: {
      badge: '🔥 السوق الرقمي الأول للألعاب في المنطقة العربية',
      h1a: 'اشتري وبع', h1b: 'أي شيء', h1c: 'في الألعاب',
      sub: 'شحن رصيد، حسابات، آيتمز، وبوستنق — أسعار تنافسية مع حماية كاملة للمشتري',
      searchPlaceholder: 'ابحث عن لعبة... (PUBG، Free Fire، Valorant)',
      searchBtn: 'بحث',
      stats: [
        { label: 'صفقة مكتملة', value: '240,000+', icon: '✅' },
        { label: 'بائع موثوق', value: '8,000+', icon: '🛡️' },
        { label: 'لعبة مدعومة', value: '120+', icon: '🎮' },
        { label: 'دولة', value: '22', icon: '🌍' },
      ],
      trust: [
        { icon: '🛡️', text: 'حماية المشتري TradeShield' },
        { icon: '⚡', text: 'تسليم فوري' },
        { icon: '💳', text: 'دفع آمن' },
        { icon: '🕐', text: 'دعم عربي ٢٤/٧' },
      ],
      popularGames: '🎮 الألعاب الشائعة',
      bestDeals: '⚡ أفضل العروض الآن',
      viewAll: 'عرض الكل ←',
      filters: ['الأرخص', 'الأعلى تقييماً', 'الأكثر مبيعاً'],
      sellers: 'بائع', deals: 'صفقة',
      buyNow: 'شراء الآن', instant: 'فوري', minutes: 'دقائق',
      howTitle: 'كيف يعمل سوق.gg؟',
      howSub: 'آمن، سريع، وسهل',
      steps: [
        { n:'١', title:'اختر ما تريد', desc:'ابحث من مئات الخيارات', icon:'🔍' },
        { n:'٢', title:'اختر البائع', desc:'قارن الأسعار والتقييمات', icon:'👤' },
        { n:'٣', title:'ادفع بأمان', desc:'مبلغك محفوظ حتى تستلم', icon:'🛡️' },
        { n:'٤', title:'استلم فوراً', desc:'أغلب الطلبات في دقائق', icon:'⚡' },
      ],
      step: 'خطوة',
      ctaTitle: 'ابدأ البيع على سوق.gg',
      ctaSub: 'انضم لآلاف البائعين — مجاني تماماً',
      ctaLearn: 'اعرف أكثر', ctaReg: 'سجّل كبائع ←',
      footer: {
        desc: 'السوق الرقمي الأول للألعاب في المنطقة العربية.',
        cols: [
          { title: 'الخدمات', links: ['شحن رصيد','بيع حسابات','عملات ألعاب','بوستنق','بطاقات هدايا'] },
          { title: 'للبائعين', links: ['ابدأ البيع','لوحة التحكم','سياسة العمولة','التحقق من الهوية'] },
          { title: 'الدعم', links: ['مركز المساعدة','تواصل معنا','الإبلاغ عن مشكلة','شروط الاستخدام'] },
        ],
        copy: '© 2025 سوق.gg — جميع الحقوق محفوظة',
        made: '🇯🇴 صُنع في الأردن',
      },
    },
    listing: {
      by: 'البائع', rating: 'التقييم', sales: 'صفقة مكتملة',
      delivery: 'وقت التسليم', instant: 'فوري', minutes: 'دقائق',
      buyNow: 'شراء الآن', addCart: 'أضف للسلة',
      description: 'وصف العرض', reviews: 'تقييمات المشترين',
      noReviews: 'لا توجد تقييمات بعد',
      perUnit: 'لكل وحدة', minOrder: 'الحد الأدنى',
      allListings: '← كل العروض',
    },
    auth: {
      loginTitle: 'تسجيل الدخول', registerTitle: 'إنشاء حساب جديد',
      email: 'البريد الإلكتروني', password: 'كلمة المرور',
      username: 'اسم المستخدم', confirmPassword: 'تأكيد كلمة المرور',
      loginBtn: 'تسجيل الدخول', registerBtn: 'إنشاء الحساب',
      noAccount: 'ليس لديك حساب؟', hasAccount: 'لديك حساب؟',
      signupLink: 'سجّل الآن', loginLink: 'سجّل الدخول',
      orContinue: 'أو',
      forgotPassword: 'نسيت كلمة المرور؟',
    },
    dashboard: {
      title: 'لوحة التحكم',
      stats: ['إجمالي المبيعات','الطلبات النشطة','التقييم','الرصيد'],
      myListings: 'عروضي', addListing: '+ إضافة عرض',
      orders: 'الطلبات الواردة', noOrders: 'لا توجد طلبات بعد',
      listingTitle: 'عنوان العرض', price: 'السعر', game: 'اللعبة',
      quantity: 'الكمية', description: 'الوصف',
      saveListing: 'حفظ العرض', cancelBtn: 'إلغاء',
      status: { active:'نشط', pending:'قيد الانتظار', completed:'مكتمل' },
      confirm: 'تأكيد التسليم', tabListings:'عروضي', tabOrders:'الطلبات', tabEarnings:'الأرباح',
      earnings: 'الأرباح', withdraw: 'سحب الرصيد',
    },
    cart: {
      title: 'سلة الشراء', empty: 'السلة فارغة',
      emptyDesc: 'ابدأ التسوق وأضف العروض التي تريدها',
      browseShopping: 'تصفح العروض',
      summary: 'ملخص الطلب', subtotal: 'المجموع الفرعي',
      fee: 'رسوم الخدمة', total: 'الإجمالي',
      checkout: 'إتمام الشراء', remove: 'حذف',
      payWith: 'طريقة الدفع',
      methods: ['بطاقة ائتمان / مدى', 'USDT / Crypto', 'PayPal'],
      secure: '🔒 الدفع محمي بـ TradeShield',
      qty: 'الكمية',
    },
    trusted: 'موثوق', vipSeller: 'VIP بائع',
  },

  en: {
    dir: 'ltr',
    langToggle: 'عربي',
    logo: 'Sooq',
    nav: {
      topups: 'Top-Ups', accounts: 'Accounts', currency: 'Currency',
      items: 'Items', boosting: 'Boosting', giftcards: 'Gift Cards',
      login: 'Log In', register: 'Sign Up', startSelling: 'Start Selling',
      dashboard: 'Dashboard', logout: 'Log Out',
    },
    home: {
      badge: '🔥 The #1 Arabic Gaming Marketplace in MENA',
      h1a: 'Buy & Sell', h1b: 'Anything', h1c: 'In Gaming',
      sub: 'Top-ups, accounts, items & boosting — competitive prices with full buyer protection',
      searchPlaceholder: 'Search for a game... (PUBG, Free Fire, Valorant)',
      searchBtn: 'Search',
      stats: [
        { label: 'Completed Deals', value: '240,000+', icon: '✅' },
        { label: 'Trusted Sellers', value: '8,000+', icon: '🛡️' },
        { label: 'Supported Games', value: '120+', icon: '🎮' },
        { label: 'Countries', value: '22', icon: '🌍' },
      ],
      trust: [
        { icon: '🛡️', text: 'TradeShield Buyer Protection' },
        { icon: '⚡', text: 'Instant Delivery' },
        { icon: '💳', text: 'Secure Payment' },
        { icon: '🕐', text: '24/7 Support' },
      ],
      popularGames: '🎮 Popular Games',
      bestDeals: '⚡ Best Deals Right Now',
      viewAll: 'View All →',
      filters: ['Cheapest', 'Top Rated', 'Best Selling'],
      sellers: 'sellers', deals: 'deals',
      buyNow: 'Buy Now', instant: 'Instant', minutes: 'Minutes',
      howTitle: 'How does Sooq.gg work?',
      howSub: 'Safe, fast, and simple',
      steps: [
        { n:'1', title:'Choose What You Want', desc:'Browse hundreds of options', icon:'🔍' },
        { n:'2', title:'Pick a Seller', desc:'Compare prices & ratings', icon:'👤' },
        { n:'3', title:'Pay Securely', desc:'Funds held until delivery confirmed', icon:'🛡️' },
        { n:'4', title:'Receive Instantly', desc:'Most orders in minutes', icon:'⚡' },
      ],
      step: 'Step',
      ctaTitle: 'Start Selling on Sooq.gg',
      ctaSub: 'Join thousands of sellers — completely free',
      ctaLearn: 'Learn More', ctaReg: 'Register as Seller →',
      footer: {
        desc: 'The #1 Arabic digital gaming marketplace in MENA.',
        cols: [
          { title: 'Services', links: ['Top-Ups','Sell Accounts','Game Currency','Boosting','Gift Cards'] },
          { title: 'For Sellers', links: ['Start Selling','Dashboard','Commission Policy','Verification'] },
          { title: 'Support', links: ['Help Center','Contact Us','Report a Problem','Terms of Service','Privacy Policy'] },
        ],
        copy: '© 2025 Sooq.gg — All rights reserved',
        made: '🇯🇴 Proudly made in Jordan',
      },
    },
    listing: {
      by: 'Seller', rating: 'Rating', sales: 'Completed Sales',
      delivery: 'Delivery Time', instant: 'Instant', minutes: 'Minutes',
      buyNow: 'Buy Now', addCart: 'Add to Cart',
      description: 'Offer Description', reviews: 'Buyer Reviews',
      noReviews: 'No reviews yet',
      perUnit: 'per unit', minOrder: 'Min. Order',
      allListings: '← All Listings',
    },
    auth: {
      loginTitle: 'Log In', registerTitle: 'Create an Account',
      email: 'Email', password: 'Password',
      username: 'Username', confirmPassword: 'Confirm Password',
      loginBtn: 'Log In', registerBtn: 'Create Account',
      noAccount: "Don't have an account?", hasAccount: 'Already have an account?',
      signupLink: 'Sign up', loginLink: 'Log in',
      orContinue: 'or',
      forgotPassword: 'Forgot password?',
    },
    dashboard: {
      title: 'Dashboard',
      stats: ['Total Sales','Active Orders','Rating','Balance'],
      myListings: 'My Listings', addListing: '+ Add Listing',
      orders: 'Incoming Orders', noOrders: 'No orders yet',
      listingTitle: 'Listing Title', price: 'Price', game: 'Game',
      quantity: 'Quantity', description: 'Description',
      saveListing: 'Save Listing', cancelBtn: 'Cancel',
      status: { active:'Active', pending:'Pending', completed:'Completed' },
      confirm: 'Confirm Delivery', tabListings:'My Listings', tabOrders:'Orders', tabEarnings:'Earnings',
      earnings: 'Earnings', withdraw: 'Withdraw',
    },
    cart: {
      title: 'Cart', empty: 'Your cart is empty',
      emptyDesc: 'Start shopping and add listings you want',
      browseShopping: 'Browse Listings',
      summary: 'Order Summary', subtotal: 'Subtotal',
      fee: 'Service Fee', total: 'Total',
      checkout: 'Proceed to Checkout', remove: 'Remove',
      payWith: 'Payment Method',
      methods: ['Credit / Debit Card', 'USDT / Crypto', 'PayPal'],
      secure: '🔒 Payment protected by TradeShield',
      qty: 'Qty',
    },
    trusted: 'Trusted', vipSeller: 'VIP Seller',
  },
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('sooq_lang') || 'ar')

  useEffect(() => {
    localStorage.setItem('sooq_lang', lang)
    document.documentElement.dir = translations[lang].dir
    document.documentElement.lang = lang
  }, [lang])

  const toggle = () => setLang(l => l === 'ar' ? 'en' : 'ar')
  const t = translations[lang]
  const isAr = lang === 'ar'

  return (
    <LangContext.Provider value={{ lang, toggle, t, isAr }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)

