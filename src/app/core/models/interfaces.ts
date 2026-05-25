// ===== Auth Models =====
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  profileImage?: string;
  phoneVerified: boolean;
  roles: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface OtpRequest {
  phone: string;
}

export interface OtpVerify {
  phone: string;
  code: string;
}

// ===== Product Models =====
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  details?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  category: Category;
  brand?: string;
  sku?: string;
  active: boolean;
  featured: boolean;
  isNew: boolean;
  bestseller: boolean;
  flashSale: boolean;
  discountPercentage: number;
  flashSaleEndsAt?: string;
  material?: string;
  tags?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  totalStock: number;
  totalSold: number;
  averageRating: number;
  reviewCount: number;
  inWishlist?: boolean;
  createdAt: string;
}

export interface ProductImage {
  id: number;
  url: string;
  thumbnailUrl?: string;
  isPrimary: boolean;
  sortOrder: number;
  altText?: string;
}

export interface ProductVariant {
  id: number;
  sizeId?: number;
  sizeName?: string;
  colorId?: number;
  colorName?: string;
  colorHex?: string;
  stock: number;
  sku?: string;
  active: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number;
  active: boolean;
  sortOrder: number;
  productCount?: number;
  children?: Category[];
}

// ===== Cart Models =====
export interface Cart {
  id: number;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productImage?: string;
  variantId?: number;
  sizeName?: string;
  colorName?: string;
  colorHex?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  availableStock: number;
}

export interface AddToCart {
  productId: number;
  variantId?: number;
  quantity: number;
}

// ===== Order Models =====
export interface Order {
  id: number;
  orderNumber: string;
  userId?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingFullName: string;
  shippingPhone: string;
  shippingGovernorate: string;
  shippingCity: string;
  shippingAddress: string;
  shippingNotes?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  notes?: string;
  items: OrderItem[];
  isGuest: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId?: number;
  productName: string;
  sizeName?: string;
  colorName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImage?: string;
}

export interface CreateOrder {
  shippingFullName: string;
  shippingPhone: string;
  email?: string;
  shippingGovernorate: string;
  shippingCity: string;
  shippingAddress: string;
  shippingNotes?: string;
  couponCode?: string;
  notes?: string;
  sessionCartId?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  ONLINE_PAYMENT = 'ONLINE_PAYMENT'
}

// ===== Common Models =====
export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  buttonText?: string;
  active: boolean;
  sortOrder: number;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountPercentage: number;
  discountAmount?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}
