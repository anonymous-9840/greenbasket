export type CategoryType = 'fruits' | 'vegetables' | 'dry-fruits';
export type VegetableGradeType = 'Grade A' | 'Grade B' | 'Grade C';

export interface VegetableGradeOption {
  grade: VegetableGradeType;
  label: string;
  price: number;
  originalPrice: number;
  stock: number;
  freshness: string;
  available: boolean;
}

export interface PriceHistoryEntry {
  price: number;
  gradePrices?: {
    gradeA?: number;
    gradeB?: number;
    gradeC?: number;
  };
  updatedAt: string;
  updatedBy: string;
  note: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  subcategory: string;
  description: string;
  unit: string;
  price: number;
  originalPrice: number;
  stock: number;
  lowStockThreshold?: number;
  image: string;
  model3dType: string;
  primaryColor: string;
  secondaryColor: string;
  freshnessInfo: string;
  nutritionFacts: string;
  origin: string;
  isFeatured: boolean;
  isSeasonal: boolean;
  isOrganic: boolean;
  rating: number;
  reviewsCount: number;
  // Strictly undefined on fruits and dry-fruits
  vegetableGrades?: VegetableGradeOption[];
  priceUpdatedAt: string;
  priceHistory: PriceHistoryEntry[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  // Strictly null for fruits & dry-fruits, Grade A/B/C for vegetables
  selectedGrade: VegetableGradeType | null;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface DeliveryPreferences {
  preferredSlotId: string;
  leaveAtDoor: boolean;
  callBeforeDelivery: boolean;
  ecoPackaging: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  role: 'customer' | 'admin';
  emailVerified: boolean;
  phoneVerified: boolean;
  addresses: Address[];
  wishlist: string[];
  savedCoupons: string[];
  deliveryPreferences: DeliveryPreferences;
  cart: CartItem[];
  createdAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  startDate: string;
  expiryDate: string;
  applicableCategories: string[];
  firstOrderOnly: boolean;
  usageLimit: number;
  usedCount: number;
  perCustomerLimit: number;
  isActive: boolean;
}

export interface DeliverySlot {
  id: string;
  label: string;
  startHour: number;
  endHour: number;
  maxCapacity: number;
  isActive: boolean;
  isExpress: boolean;
  extraCharge: number;
  date?: string;
  bookedCount?: number;
  remainingCapacity?: number;
  isFull?: boolean;
  isAvailable?: boolean;
  unavailableReason?: string | null;
}

export interface PinCodeInfo {
  pincode: string;
  city: string;
  area: string;
  state: string;
  isServiceable: boolean;
  deliveryCharge: number;
  freeDeliveryMinOrder: number;
  estimatedEta: string;
  expressAvailable: boolean;
  expressEta: string;
  expressCharge: number;
}

export type OrderStatusType =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Preparing Your Basket'
  | 'Packed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderTimelineEvent {
  status: OrderStatusType;
  timestamp: string;
  note: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  category: CategoryType;
  unit: string;
  price: number;
  quantity: number;
  image: string;
  selectedGrade: VegetableGradeType | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  taxAmount: number;
  deliveryFee: number;
  totalPayable: number;
  address: Address;
  deliverySchedule: {
    date: string;
    slotId: string;
    slotLabel: string;
    isExpress: boolean;
    instructions?: string;
  };
  payment: {
    method: 'UPI' | 'CARD' | 'NETBANKING' | 'COD';
    gateway: string;
    status: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    paidAt?: string;
  };
  status: OrderStatusType;
  statusTimeline: OrderTimelineEvent[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  adminName: string;
  timestamp: string;
  details?: Record<string, unknown>;
}
