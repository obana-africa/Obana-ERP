export const DEFAULT_THEME = {
  storeName: '',
  logoText: 'My Store',
  tagline: '',
  logoUrl: '',
  
  // Colors
  primary: '#111827',
  accent: '#2DBD97',
  bg: '#ffffff',
  text: '#111827',
  heroBg: '#111827',
  heroTextColor: '#ffffff',
  cardBg: '#ffffff',
  cardBorder: '#F3F4F6',
  footerBg: '#111827',
  navBg: '#ffffff',
  navText: '#111827',
  
  // Typography
  headingFont: 'Playfair Display',
  bodyFont: 'DM Sans',
  headingWeight: 700,
  bodySize: 14,
  
  // Layout
  radius: 8,
  btnStyle: 'filled',
  navLayout: 'centered',
  productCols: 3,
  cardStyle: 'shadow',
  
  // Sections visibility
  sections: {
    announcement: true,
    hero: true,
    categories: true,
    featured: true,
    promo: true,
    trust: true,
    newsletter: true,
    footer: true
  },
  
  // Content
  content: {
    announcement: '🎉 Welcome to our store!',
    hero: {
      title: 'Your Store Headline',
      subtitle: 'Describe your store',
      cta1: 'Shop Now',
      cta2: 'View Collections',
      imageUrl: '',
      overlayOpacity: 40
    },
    featured: {
      title: 'Featured Products',
      showRatings: true,
      showBadges: true,
      showQuickAdd: true,
      showWishlist: true
    },
    promo: {
      title: 'New Arrivals',
      subtitle: 'Check out our latest products',
      cta: 'Shop Now'
    },
    footer: {
      tagline: 'Quality products, delivered to your door.',
      copyright: '© 2026 My Store. All rights reserved.'
    }
  },
  
  // SEO
  seo: {
    title: '',
    description: '',
    ogImage: ''
  },
  
  // Advanced
  customCss: '',
  activeTemplate: '',
};

export const TEMPLATES = [
  {
    id: 'midnight',
    name: 'Midnight Navy',
    category: 'Fashion',
    description: 'Dark & premium for luxury brands',
    thumbnail: '/templates/midnight.jpg',
    theme: {
      primary: '#1a1a2e',
      accent: '#2DBD97',
      bg: '#ffffff',
      text: '#111827',
      heroBg: '#1a1a2e',
      heroTextColor: '#ffffff',
      headingFont: 'Playfair Display',
      cardStyle: 'shadow',
      radius: 8,
      btnStyle: 'filled'
    }
  },
  // ... other templates
];

export const NAV_CONFIG = {
  desktop: { icon: 'desktop', label: 'Desktop', width: 1160 },
  tablet: { icon: 'tablet', label: 'Tablet', width: 768 },
  mobile: { icon: 'phone', label: 'Mobile', width: 390 }
};