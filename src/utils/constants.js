// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'ElGuanteWeb',
  version: '0.1.0',
  description: 'E-commerce de productos de limpieza',
  author: 'ElGuante Team',
};

// URLs de la API
export const API_URLS = {
  base: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  createPreference: '/create_preference',
  getPayment: '/payment',
  webhook: '/webhook',
  health: '/health',
};

// Configuración de Firebase Collections
export const FIREBASE_COLLECTIONS = {
  users: 'usuarios',
  products: 'productos',
  orders: 'ordenes',
  points: 'puntos',
};

// Estados de pago de MercadoPago
export const PAYMENT_STATUS = {
  approved: 'approved',
  pending: 'pending',
  rejected: 'rejected',
  cancelled: 'cancelled',
  refunded: 'refunded',
  charged_back: 'charged_back',
};

// Niveles de usuario
export const USER_LEVELS = {
  bronze: {
    name: 'Bronce',
    minPoints: 25,
    discount: 5,
    color: '#cd7f32',
    icon: '🥉',
  },
  silver: {
    name: 'Plata',
    minPoints: 50,
    discount: 10,
    color: '#c0c0c0',
    icon: '🥈',
  },
  gold: {
    name: 'Oro',
    minPoints: 100,
    discount: 15,
    color: '#ffd700',
    icon: '🥇',
  },
};

// Roles de usuario
export const USER_ROLES = {
  admin: 'admin',
  user: 'usuario',
};

// Configuración de paginación
export const PAGINATION = {
  defaultPageSize: 12,
  maxPageSize: 50,
};

// Configuración de validación
export const VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Por favor ingresa un email válido',
  },
  password: {
    minLength: 6,
    message: 'La contraseña debe tener al menos 6 caracteres',
  },
  name: {
    minLength: 2,
    maxLength: 50,
    message: 'El nombre debe tener entre 2 y 50 caracteres',
  },
  price: {
    min: 0.01,
    max: 999999,
    message: 'El precio debe estar entre $0.01 y $999,999',
  },
  stock: {
    min: 0,
    max: 9999,
    message: 'El stock debe estar entre 0 y 9,999',
  },
};

// Configuración de localStorage
export const STORAGE_KEYS = {
  cart: 'elguante_cart',
  user: 'elguante_user',
  theme: 'elguante_theme',
  language: 'elguante_language',
};

// Configuración de notificaciones
export const TOAST_CONFIG = {
  duration: {
    short: 2000,
    medium: 3000,
    long: 5000,
  },
  types: {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  },
};

// Breakpoints para responsive design
export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1200px',
};

// Configuración de imágenes
export const IMAGE_CONFIG = {
  placeholder: '/img/placeholder.jpg',
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  quality: 0.8,
};

// Configuración de rate limiting
export const RATE_LIMITS = {
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
  },
  payment: {
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 10,
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
  },
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  network: 'Error de conexión. Verifica tu internet.',
  unauthorized: 'No tienes permisos para realizar esta acción.',
  notFound: 'El recurso solicitado no fue encontrado.',
  serverError: 'Error interno del servidor. Intenta más tarde.',
  validation: 'Los datos ingresados no son válidos.',
  timeout: 'La operación tardó demasiado tiempo.',
};

// Configuración de SEO
export const SEO_CONFIG = {
  defaultTitle: 'ElGuanteWeb - Productos de Limpieza',
  titleTemplate: '%s | ElGuanteWeb',
  defaultDescription: 'Tu tienda online de productos de limpieza de calidad',
  keywords: 'limpieza, productos, hogar, detergente, jabón, lavandina',
  author: 'ElGuante Team',
  siteUrl: 'https://elguanteweb.com',
  image: '/img/og-image.jpg',
};

// Configuración de analytics
export const ANALYTICS_CONFIG = {
  trackingId: import.meta.env.VITE_GA_TRACKING_ID,
  events: {
    pageView: 'page_view',
    purchase: 'purchase',
    addToCart: 'add_to_cart',
    removeFromCart: 'remove_from_cart',
    login: 'login',
    signup: 'sign_up',
    search: 'search',
  },
};

export default {
  APP_CONFIG,
  API_URLS,
  FIREBASE_COLLECTIONS,
  PAYMENT_STATUS,
  USER_LEVELS,
  USER_ROLES,
  PAGINATION,
  VALIDATION,
  STORAGE_KEYS,
  TOAST_CONFIG,
  BREAKPOINTS,
  IMAGE_CONFIG,
  RATE_LIMITS,
  ERROR_MESSAGES,
  SEO_CONFIG,
  ANALYTICS_CONFIG,
};
