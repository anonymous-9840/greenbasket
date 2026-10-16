import mongoose from 'mongoose';

const GradeOptionSchema = new mongoose.Schema({
  grade: { type: String, enum: ['Grade A', 'Grade B', 'Grade C'], required: true },
  label: { type: String, required: true }, // e.g., "Premium quality, carefully selected vegetables"
  price: { type: Number, required: true, min: 1 },
  originalPrice: { type: Number, required: true, min: 1 },
  stock: { type: Number, required: true, min: 0 },
  freshness: { type: String, required: true }, // e.g., "Harvested < 6 hrs ago • Hand-picked export quality"
  available: { type: Boolean, default: true },
}, { _id: false });

const PriceHistorySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  gradePrices: {
    gradeA: Number,
    gradeB: Number,
    gradeC: Number,
  },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, default: 'Admin' },
  note: { type: String, default: 'Daily price update' },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['fruits', 'vegetables', 'dry-fruits'],
    required: true,
  },
  subcategory: { type: String, default: 'Seasonal' },
  description: { type: String, required: true },
  unit: { type: String, required: true }, // e.g., "1 kg", "500 g", "250 g", "1 pc"
  price: { type: Number, required: true, min: 1 },
  originalPrice: { type: Number, required: true, min: 1 },
  stock: { type: Number, required: true, min: 0 },
  lowStockThreshold: { type: Number, default: 15 },
  image: { type: String, required: true },
  model3dType: { type: String, default: 'sphere' },
  primaryColor: { type: String, default: '#22c55e' },
  secondaryColor: { type: String, default: '#16a34a' },
  freshnessInfo: { type: String, required: true },
  nutritionFacts: { type: String, default: '' },
  origin: { type: String, default: 'Local Organic Farms, India' },
  isFeatured: { type: Boolean, default: false },
  isSeasonal: { type: Boolean, default: false },
  isOrganic: { type: Boolean, default: true },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 42 },
  // STRICT RULE: vegetableGrades is ONLY permitted when category === 'vegetables'
  vegetableGrades: {
    type: [GradeOptionSchema],
    default: undefined,
  },
  priceUpdatedAt: { type: Date, default: Date.now },
  priceHistory: { type: [PriceHistorySchema], default: [] },
}, { timestamps: true });

// Pre-validate hook strictly prevents vegetableGrades on fruits or dry-fruits
ProductSchema.pre('validate', function (next) {
  if (this.category !== 'vegetables') {
    this.vegetableGrades = undefined;
  }
  next();
});

const AddressSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, default: 'Home' }, // Home, Work, Other
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String, default: '' },
  landmark: { type: String, default: '' },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  dob: { type: String, required: true }, // YYYY-MM-DD validated Date of Birth
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  addresses: { type: [AddressSchema], default: [] },
  wishlist: { type: [String], default: [] },
  savedCoupons: { type: [String], default: ['GREEN10', 'FRESH50', 'FIRSTORDER'] },
  deliveryPreferences: {
    preferredSlotId: { type: String, default: 'slot-morning-1' },
    leaveAtDoor: { type: Boolean, default: false },
    callBeforeDelivery: { type: Boolean, default: true },
    ecoPackaging: { type: Boolean, default: true },
  },
  cart: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

const CouponSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true, min: 1 },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 500 },
  startDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  applicableCategories: { type: [String], default: ['all'] }, // 'all' or ['fruits', 'vegetables', 'dry-fruits']
  firstOrderOnly: { type: Boolean, default: false },
  usageLimit: { type: Number, default: 1000 },
  usedCount: { type: Number, default: 0 },
  perCustomerLimit: { type: Number, default: 3 },
  isActive: { type: Boolean, default: true },
});

const DeliverySlotSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  label: { type: String, required: true }, // e.g., "7:00 AM – 9:00 AM"
  startHour: { type: Number, required: true },
  endHour: { type: Number, required: true },
  maxCapacity: { type: Number, default: 25 },
  isActive: { type: Boolean, default: true },
  isExpress: { type: Boolean, default: false },
  extraCharge: { type: Number, default: 0 },
});

const PinCodeSchema = new mongoose.Schema({
  pincode: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  state: { type: String, required: true },
  isServiceable: { type: Boolean, default: true },
  deliveryCharge: { type: Number, default: 35 },
  freeDeliveryMinOrder: { type: Number, default: 499 },
  estimatedEta: { type: String, default: 'Same Day / Scheduled Slot' },
  expressAvailable: { type: Boolean, default: true },
  expressEta: { type: String, default: '45 - 60 mins' },
  expressCharge: { type: Number, default: 49 },
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: { type: Array, required: true },
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String, default: null },
  taxAmount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  totalPayable: { type: Number, required: true },
  address: { type: Object, required: true },
  deliverySchedule: {
    date: { type: String, required: true }, // YYYY-MM-DD
    slotId: { type: String, required: true },
    slotLabel: { type: String, required: true },
    isExpress: { type: Boolean, default: false },
    instructions: { type: String, default: '' },
  },
  payment: {
    method: { type: String, enum: ['UPI', 'CARD', 'NETBANKING', 'COD'], required: true },
    gateway: { type: String, default: 'Razorpay' },
    status: { type: String, enum: ['Paid', 'Pending', 'Refunded', 'Failed'], default: 'Paid' },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    paidAt: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: [
      'Order Placed',
      'Order Confirmed',
      'Preparing Your Basket',
      'Packed',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ],
    default: 'Order Confirmed',
  },
  statusTimeline: { type: Array, default: [] },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

const AuditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  action: { type: String, required: true }, // e.g., "DAILY_PRICE_UPDATE", "GRADE_UPDATE", "COUPON_CREATED", "ORDER_STATUS_CHANGED"
  entityType: { type: String, required: true }, // "Product", "Coupon", "Order", "DeliverySlot"
  entityId: { type: String, required: true },
  summary: { type: String, required: true },
  adminName: { type: String, default: 'Admin (Green Basket)' },
  timestamp: { type: String, default: () => new Date().toISOString() },
  details: { type: Object, default: {} },
});

export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const CouponModel = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
export const DeliverySlotModel = mongoose.models.DeliverySlot || mongoose.model('DeliverySlot', DeliverySlotSchema);
export const PinCodeModel = mongoose.models.PinCode || mongoose.model('PinCode', PinCodeSchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const AuditLogModel = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
