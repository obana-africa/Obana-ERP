export const DEFAULT_THEME = {
  /* Identity */
  storeName: 'My Store',
  logoText: 'My Store',
  tagline: 'Your store tagline here',
  faviconUrl: '',
  logoUrl: '',

  /* Colours */
  primary: '#111827',
  accent: '#2DBD97',
  bg: '#ffffff',
  text: '#111827',
  heroBg: '#111827',
  heroTextColor: '#ffffff',
  cardBg: '#ffffff',
  cardBorder: '#F3F4F6',
  footerBg: '#111827',
  footerText: '#ffffff',
  navBg: '#ffffff',
  navText: '#111827',

  /* Typography */
  headingFont: 'Playfair Display',
  bodyFont: 'DM Sans',
  headingWeight: '700',
  bodySize: '14',

  /* Shape & layout */
  radius: 8,
  btn: 'filled',
  navLayout: 'centered',
  productCols: 3,
  cardStyle: 'shadow',

  /* Hero section */
  heroTitle: 'Your Store Headline',
  heroSub: 'Describe your store and what makes it special',
  heroCta1: 'Shop Now',
  heroCta2: 'View Collections',
  heroImageUrl: '',
  heroOverlayOpacity: 40,

  /* Announcement bar */
  announceText: '🎉 Welcome to our store! Free shipping on orders above ₦20,000',
  announceBg: '#111827',
  announceColor: '#ffffff',

  /* Products section */
  featuredTitle: 'Featured Products',
  showRatings: true,
  showBadges: true,
  showQuickAdd: true,
  showWishlist: true,
  productsPerRow: 3,

  /* Promo banner */
  promoTitle: 'New Arrivals',
  promoSub: 'Check out our latest products',
  promoCta: 'Shop Now',

  /* Footer */
  footerTagline: 'Quality products, delivered to your door.',
  footerCopyright: '© 2026 My Store. All rights reserved.',

  /* Section visibility */
  showAnnounce: true,
  showHero: true,
  showCats: true,
  showFeatured: true,
  showPromo: true,
  showTrust: true,
  showNewsletter: true,
  showFooter: true,

  /* Meta */
  activeTemplate: '',
  activePreset: '',

  /* SEO */
  metaTitle: '',
  metaDesc: '',
  ogImage: '',

  /* Custom CSS */
  customCss: '',
};

export const TEMPLATES = [
  {
    id: 'blank',
    name: 'Start Blank',
    category: 'General',
    desc: 'Start from scratch — no preset colours or fonts',
    thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=80',
    theme: {
      primary: '#111827',
      accent: '#2DBD97',
      bg: '#ffffff',
      text: '#111827',
      heroBg: '#111827',
      heroTextColor: '#ffffff',
      radius: 8,
      btn: 'filled',
      headingFont: 'DM Sans',
      cardStyle: 'flat'
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Navy',
    category: 'Fashion',
    desc: 'Dark & premium — perfect for luxury African fashion',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    theme: {
      primary: '#1a1a2e',
      accent: '#2DBD97',
      bg: '#ffffff',
      text: '#111827',
      heroBg: '#1a1a2e',
      heroTextColor: '#ffffff',
      radius: 8,
      btn: 'filled',
      headingFont: 'Playfair Display',
      cardStyle: 'shadow'
    },
  },
  {
    id: 'earth',
    name: 'Earth Tones',
    category: 'Lifestyle',
    desc: 'Warm & organic — ideal for natural/sustainable brands',
    thumbnail: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&q=80',
    theme: {
      primary: '#78350f',
      accent: '#d97706',
      bg: '#fffbf5',
      text: '#1c1917',
      heroBg: '#292524',
      heroTextColor: '#f5f5f4',
      radius: 6,
      btn: 'rounded',
      headingFont: 'Fraunces',
      cardStyle: 'border'
    },
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    category: 'General',
    desc: 'Light & crisp — works for any product category',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
    theme: {
      primary: '#111827',
      accent: '#6366f1',
      bg: '#ffffff',
      text: '#111827',
      heroBg: '#f9fafb',
      heroTextColor: '#111827',
      radius: 4,
      btn: 'outline',
      headingFont: 'Georgia',
      cardStyle: 'flat'
    },
  },
  {
    id: 'bold',
    name: 'Bold Green',
    category: 'Beauty',
    desc: 'Fresh & vibrant — great for beauty and wellness',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    theme: {
      primary: '#064e3b',
      accent: '#10b981',
      bg: '#ffffff',
      text: '#111827',
      heroBg: '#064e3b',
      heroTextColor: '#ffffff',
      radius: 12,
      btn: 'pill',
      headingFont: 'Montserrat',
      cardStyle: 'shadow'
    },
  },
  {
    id: 'luxury',
    name: 'Royal Purple',
    category: 'Fashion',
    desc: 'Elegant & rich — for high-end collections',
    thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
    theme: {
      primary: '#4c1d95',
      accent: '#8b5cf6',
      bg: '#fafafa',
      text: '#1e1b4b',
      heroBg: '#1e1b4b',
      heroTextColor: '#f5f3ff',
      radius: 8,
      btn: 'filled',
      headingFont: 'Playfair Display',
      cardStyle: 'shadow'
    },
  },
  {
    id: 'coral',
    name: 'Coral Pop',
    category: 'Accessories',
    desc: 'Vibrant & playful — for accessories and gifts',
    thumbnail: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
    theme: {
      primary: '#9f1239',
      accent: '#f43f5e',
      bg: '#fff1f2',
      text: '#1c1917',
      heroBg: '#881337',
      heroTextColor: '#fff1f2',
      radius: 16,
      btn: 'pill',
      headingFont: 'Poppins',
      cardStyle: 'border'
    },
  },
];

export const NAV_CONFIG = {
  desktop: { icon: '🖥', label: 'Desktop', width: 1160 },
  tablet: { icon: '📱', label: 'Tablet', width: 768 },
  mobile: { icon: '📱', label: 'Mobile', width: 390 }
};