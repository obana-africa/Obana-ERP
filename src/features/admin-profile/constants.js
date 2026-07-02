// Centralised constants for the admin profile feature

export const NAV_ITEMS = [
  { id: 'profile', label: 'General', icon: 'user' },
  { id: 'security', label: 'Security', icon: 'shield' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'store', label: 'Store', icon: 'store' },
  { id: 'billing', label: 'Billing', icon: 'credit' },
  { id: 'language', label: 'Language & Region', icon: 'globe' },
];

export const PASSWORD_MIN_LENGTH = 8;

export const NOTIFICATION_ITEMS = [
  { key: 'newOrder', label: 'New order received', sub: 'Every time a customer places an order' },
  { key: 'lowStock', label: 'Low stock alert', sub: 'When a product has fewer than 5 units left' },
  { key: 'newCustomer', label: 'New customer registered', sub: 'When someone signs up via the store or WhatsApp' },
  { key: 'orderShipped', label: 'Order status updates', sub: 'Shipped, delivered, and returned' },
  { key: 'marketing', label: 'Marketing & promotions', sub: 'Tips, product updates, and offers from thaja' },
  { key: 'weeklyReport', label: 'Weekly performance report', sub: "Summary of your store's activity every Monday" },
];

export const LOGIN_SERVICES = [
  { id: 'apple', emoji: '', name: 'Apple' },
  { id: 'google', emoji: '', name: 'Google' },
  { id: 'facebook', emoji: '', name: 'Facebook' },
];

export const LANGUAGES = ['English', 'Hausa', 'Yoruba', 'Igbo', 'French'];
export const REGIONAL_FORMATS = ['English (Nigeria)', 'English (US)', 'English (UK)'];
export const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
export const TIME_FORMATS = ['12-hour (AM/PM)', '24-hour'];