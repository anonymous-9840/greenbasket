import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  IndianRupee,
  Package,
  ShoppingBasket,
  Tag,
  Truck,
  Users,
  ClipboardList,
  AlertTriangle,
  Plus,
  Trash2,
  ShieldCheck,
  RefreshCw,
  Check,
  Clock,
  MapPin,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  Product,
  Order,
  Coupon,
  DeliverySlot,
  PinCodeInfo,
  AuditLog,
  OrderStatusType,
  CategoryType,
} from '../types';

const ORDER_STATUS_OPTIONS: OrderStatusType[] = [
  'Order Placed',
  'Order Confirmed',
  'Preparing Your Basket',
  'Packed',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const AdminDashboardPage: React.FC = () => {
  const { user, token, loginWithCredentials, logout, refreshProducts, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'daily-pricing' | 'products' | 'orders' | 'delivery' | 'coupons' | 'audit'
  >('overview');

  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminCoupons, setAdminCoupons] = useState<Coupon[]>([]);
  const [adminSlots, setAdminSlots] = useState<DeliverySlot[]>([]);
  const [adminPins, setAdminPins] = useState<PinCodeInfo[]>([]);
  const [adminCustomers, setAdminCustomers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminLoginPending, setAdminLoginPending] = useState(false);

  // Daily Pricing Edit Buffer
  const [priceEdits, setPriceEdits] = useState<
    Record<
      string,
      {
        price: number;
        stock: number;
        gradeA?: number;
        gradeB?: number;
        gradeC?: number;
      }
    >
  >({});

  // New Product Form
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'fruits' as CategoryType,
    subcategory: 'Seasonal Favorites',
    unit: '1 kg',
    price: 120,
    originalPrice: 150,
    stock: 50,
    image:
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=85',
    freshnessInfo: 'Harvested fresh today • Direct from partner farms',
    origin: 'Indian Organic Farms',
    gradeAPrice: 60,
    gradeBPrice: 48,
    gradeCPrice: 35,
  });

  // New Coupon Form
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: 15,
    minOrderValue: 299,
    maxDiscount: 250,
    applicableCategory: 'all',
    firstOrderOnly: false,
  });

  // New Slot & PIN Forms
  const [newSlot, setNewSlot] = useState({
    label: '2:00 PM – 4:00 PM',
    maxCapacity: 25,
    isExpress: false,
    extraCharge: 0,
  });
  const [newPin, setNewPin] = useState({
    pincode: '',
    city: '',
    area: '',
    deliveryCharge: 30,
    freeDeliveryMinOrder: 499,
  });

  const fetchAdminData = useCallback(async () => {
    if (!token || user?.role !== 'admin') return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setAdminProducts(data.products || []);
        setAdminOrders(data.orders || []);
        setAdminCoupons(data.coupons || []);
        setAdminSlots(data.deliverySlots || []);
        setAdminPins(data.pinCodes || []);
        setAdminCustomers(data.customers || []);
        setAuditLogs(data.auditLogs || []);

        const initialBuffer: typeof priceEdits = {};
        for (const p of data.products || []) {
          initialBuffer[p.id] = {
            price: p.price,
            stock: p.stock,
            gradeA: p.vegetableGrades?.find((g: any) => g.grade === 'Grade A')?.price,
            gradeB: p.vegetableGrades?.find((g: any) => g.grade === 'Grade B')?.price,
            gradeC: p.vegetableGrades?.find((g: any) => g.grade === 'Grade C')?.price,
          };
        }
        setPriceEdits(initialBuffer);
      }
    } catch (err) {
      console.error('Error loading admin overview:', err);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Role Protection Gate
  if (!user || user.role !== 'admin') {
    const handleAdminLogin = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setAdminLoginError('');
      setAdminLoginPending(true);
      try {
        const loggedInUser = await loginWithCredentials({
          identifier: adminIdentifier,
          password: adminPassword,
        });
        if (loggedInUser.role !== 'admin') {
          logout();
          setAdminLoginError('This account does not have administrator access.');
        }
      } catch (error) {
        setAdminLoginError(error instanceof Error ? error.message : 'Administrator sign-in failed.');
      } finally {
        setAdminLoginPending(false);
      }
    };

    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16 text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-forest-900 text-forest-300 shadow-xl">
          <LayoutDashboard className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Green Basket Administrator Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Restricted to authorized store administrators. Manage daily product pricing, vegetable
          grades (A/B/C), inventory, delivery slot capacities, PIN codes, coupons, orders, and audit
          logs.
        </p>
        <form onSubmit={handleAdminLogin} className="mx-auto max-w-md space-y-3 text-left">
          <label className="block text-xs font-semibold text-slate-700" htmlFor="admin-identifier">
            Admin ID
          </label>
          <input
            id="admin-identifier"
            autoComplete="username"
            placeholder="admin"
            required
            value={adminIdentifier}
            onChange={(event) => setAdminIdentifier(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
          />
          <label className="block text-xs font-semibold text-slate-700" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
          />
          {adminLoginError && (
            <p role="alert" className="text-sm font-medium text-rose-700">
              {adminLoginError}
            </p>
          )}
          <button
            type="submit"
            disabled={adminLoginPending}
            className="w-full rounded-2xl bg-forest-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {adminLoginPending ? 'Signing in...' : 'Sign in as administrator'}
          </button>
        </form>
      </div>
    );
  }

  const handleSaveDailyPrice = async (product: Product) => {
    const edit = priceEdits[product.id];
    if (!edit) return;
    try {
      const payload: any = {
        price: Number(edit.price),
        stock: Number(edit.stock),
        note: 'Admin Dashboard daily rate update',
      };
      if (product.category === 'vegetables') {
        payload.gradePrices = {
          gradeA: Number(edit.gradeA || edit.price),
          gradeB: Number(edit.gradeB || Math.round(edit.price * 0.8)),
          gradeC: Number(edit.gradeC || Math.round(edit.price * 0.6)),
        };
      }
      const res = await fetch(`/api/admin/products/${product.id}/daily-price`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update price');
      showToast(data.message, 'success');
      await fetchAdminData();
      await refreshProducts();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: newProd.name,
        category: newProd.category,
        subcategory: newProd.subcategory,
        unit: newProd.unit,
        price:
          newProd.category === 'vegetables'
            ? Number(newProd.gradeAPrice)
            : Number(newProd.price),
        originalPrice: Number(newProd.originalPrice),
        stock: Number(newProd.stock),
        image: newProd.image,
        freshnessInfo: newProd.freshnessInfo,
        origin: newProd.origin,
      };

      // Strictly attach vegetableGrades ONLY when category === 'vegetables'
      if (newProd.category === 'vegetables') {
        payload.vegetableGrades = [
          {
            grade: 'Grade A',
            label: 'Premium quality, carefully selected vegetables',
            price: Number(newProd.gradeAPrice),
            originalPrice: Math.round(Number(newProd.gradeAPrice) * 1.2),
            stock: 25,
            freshness: 'Harvested < 6 hrs ago • Hand-sorted uniform size',
            available: true,
          },
          {
            grade: 'Grade B',
            label: 'Standard quality vegetables',
            price: Number(newProd.gradeBPrice),
            originalPrice: Number(newProd.gradeAPrice),
            stock: 25,
            freshness: 'Harvested today • Great everyday kitchen quality',
            available: true,
          },
          {
            grade: 'Grade C',
            label: 'Budget-friendly vegetables',
            price: Number(newProd.gradeCPrice),
            originalPrice: Number(newProd.gradeBPrice),
            stock: 20,
            freshness: 'Farm-fresh value pick • Ideal for curries & soups',
            available: true,
          },
        ];
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create product');
      showToast(data.message, 'success');
      setNewProd({ ...newProd, name: '' });
      await fetchAdminData();
      await refreshProducts();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(data.message, 'info');
      await fetchAdminData();
      await refreshProducts();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: OrderStatusType) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(data.message, 'success');
      await fetchAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newCoupon,
          applicableCategories: [newCoupon.applicableCategory],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(data.message, 'success');
      setNewCoupon({ ...newCoupon, code: '', title: '', description: '' });
      await fetchAdminData();
      await refreshProducts();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'info');
        await fetchAdminData();
        await refreshProducts();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSlotUpdate = async (slot: DeliverySlot, maxCapacity: number, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/delivery-slots/${slot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ maxCapacity, isActive }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        await fetchAdminData();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/delivery-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSlot),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        await fetchAdminData();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleAddPinCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/pincodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPin),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        setNewPin({ ...newPin, pincode: '', city: '', area: '' });
        await fetchAdminData();
        await refreshProducts();
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-5 sm:py-8 space-y-5 sm:space-y-8">
      {/* Admin Top Header */}
      <div className="rounded-3xl bg-forest-950 p-4 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-3 py-1 text-xs font-bold text-forest-300">
            <ShieldCheck className="h-4 w-4" />
            <span className="break-words">Authorized Administrator Session • {user.fullName}</span>
          </span>
          <h1 className="mt-2 font-display text-xl sm:text-3xl font-extrabold">
            Green Basket Command Center
          </h1>
          <p className="text-xs text-forest-200/80 mt-1">
            Control daily prices, vegetable grades (A/B/C), inventory, delivery slots, PIN codes,
            coupons & live orders
          </p>
        </div>
        <button
          type="button"
          onClick={fetchAdminData}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-forest-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-forest-600 transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Live Store Data</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-3 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Analytics', icon: LayoutDashboard },
          { id: 'daily-pricing', label: 'Daily Price & Grade Rates', icon: IndianRupee },
          { id: 'products', label: 'Products & Catalog CRUD', icon: ShoppingBasket },
          { id: 'orders', label: `Orders (${adminOrders.length})`, icon: Package },
          { id: 'delivery', label: 'Delivery Slots & PIN Codes', icon: Truck },
          { id: 'coupons', label: `Coupons (${adminCoupons.length})`, icon: Tag },
          { id: 'audit', label: 'Customers & Audit Logs', icon: ClipboardList },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-3 sm:px-4 py-2.5 transition ${
                activeTab === tab.id
                  ? 'bg-forest-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-forest-400'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-3xl bg-white p-5 shadow-soft border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Store Revenue</span>
              <p className="mt-2 font-display text-3xl font-extrabold text-forest-700">
                ₹{metrics.totalRevenue.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                From {metrics.activeOrdersCount} active orders
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-soft border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase">Catalog Products</span>
              <p className="mt-2 font-display text-3xl font-extrabold text-slate-900">
                {metrics.totalProducts}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Fruits, Graded Vegetables & Dry Fruits
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-soft border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase">Registered Customers</span>
              <p className="mt-2 font-display text-3xl font-extrabold text-slate-900">
                {metrics.totalCustomers}
              </p>
              <p className="mt-1 text-xs text-slate-500">Email & Phone OTP verified</p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-soft border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase">Low Stock Alerts</span>
              <p className="mt-2 font-display text-3xl font-extrabold text-citrus-600">
                {metrics.lowStockCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">Threshold &le; 15 units</p>
            </div>
          </div>

          {/* Category Revenue Breakdown & Low Stock Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900">
                Sales Breakdown by Category
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  {
                    label: '🍎 Fresh Fruits',
                    val: metrics.categorySales?.fruits || 0,
                    color: 'bg-rose-500',
                  },
                  {
                    label: '🥦 Fresh Vegetables (Graded A/B/C)',
                    val: metrics.categorySales?.vegetables || 0,
                    color: 'bg-forest-600',
                  },
                  {
                    label: '🥜 Premium Dry Fruits',
                    val: metrics.categorySales?.['dry-fruits'] || 0,
                    color: 'bg-amber-500',
                  },
                ].map((c) => (
                  <div key={c.label} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{c.label}</span>
                      <span>₹{c.val}</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${c.color}`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(12, Math.round((c.val / (metrics.totalRevenue || 1)) * 100))
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-citrus-500" />
                Inventory & Low Stock Watchlist
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
                {adminProducts
                  .slice()
                  .sort((a, b) => a.stock - b.stock)
                  .slice(0, 6)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-2xl bg-cream-50 p-3 border border-slate-200/70"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <p className="text-[11px] text-slate-500 capitalize">
                          {p.category.replace('-', ' ')} • {p.unit}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 font-extrabold ${
                          p.stock <= 40
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-forest-100 text-forest-800'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAILY PRICE UPDATES & VEGETABLE GRADE PRICING */}
      {activeTab === 'daily-pricing' && (
        <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">
                Daily Product Price & Vegetable Grade Rate Manager
              </h2>
              <p className="text-xs text-slate-500">
                Update daily rates and inventory. Changes immediately update product listings,
                timestamps, price history, and customer carts.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {adminProducts.map((p) => {
              const edit = priceEdits[p.id] || { price: p.price, stock: p.stock };
              const isVeg = p.category === 'vegetables';

              return (
                <div
                  key={p.id}
                  className="rounded-2xl bg-cream-50/70 p-4 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-12 w-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-forest-700">
                        {p.category.replace('-', ' ')} • {p.unit}
                      </span>
                      <p className="break-words font-bold text-slate-900 text-sm">{p.name}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {new Date(p.priceUpdatedAt).toLocaleTimeString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Inputs: If Vegetable, show Grade A, Grade B, Grade C prices; else show single Price */}
                  {isVeg ? (
                    <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-forest-800">
                          Grade A (₹)
                        </label>
                        <input
                          type="number"
                          value={edit.gradeA ?? p.price}
                          onChange={(e) =>
                            setPriceEdits({
                              ...priceEdits,
                              [p.id]: {
                                ...edit,
                                gradeA: Number(e.target.value),
                                price: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full sm:w-20 rounded-xl border border-forest-300 bg-white px-2.5 py-1.5 font-extrabold text-forest-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-citrus-600">
                          Grade B (₹)
                        </label>
                        <input
                          type="number"
                          value={edit.gradeB ?? Math.round(p.price * 0.8)}
                          onChange={(e) =>
                            setPriceEdits({
                              ...priceEdits,
                              [p.id]: { ...edit, gradeB: Number(e.target.value) },
                            })
                          }
                          className="w-full sm:w-20 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-amber-700">
                          Grade C (₹)
                        </label>
                        <input
                          type="number"
                          value={edit.gradeC ?? Math.round(p.price * 0.6)}
                          onChange={(e) =>
                            setPriceEdits({
                              ...priceEdits,
                              [p.id]: { ...edit, gradeC: Number(e.target.value) },
                            })
                          }
                          className="w-full sm:w-20 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 font-bold"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600">
                          Daily Price (₹)
                        </label>
                        <input
                          type="number"
                          value={edit.price}
                          onChange={(e) =>
                            setPriceEdits({
                              ...priceEdits,
                              [p.id]: { ...edit, price: Number(e.target.value) },
                            })
                          }
                          className="w-24 rounded-xl border border-slate-300 bg-white px-3 py-1.5 font-extrabold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600">
                          Total Stock
                        </label>
                        <input
                          type="number"
                          value={edit.stock}
                          onChange={(e) =>
                            setPriceEdits({
                              ...priceEdits,
                              [p.id]: { ...edit, stock: Number(e.target.value) },
                            })
                          }
                          className="w-20 rounded-xl border border-slate-300 bg-white px-3 py-1.5 font-bold"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSaveDailyPrice(p)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-forest-700 px-4 py-2 font-bold text-white hover:bg-forest-800 transition shrink-0"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Daily Rate</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT CREATION & CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleCreateProduct}
            className="lg:col-span-5 rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-4 text-xs"
          >
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-1.5">
              <Plus className="h-5 w-5 text-forest-600" />
              Add New Grocery Product
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={newProd.name}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                placeholder="e.g. Organic Shimla Pears"
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={newProd.category}
                  onChange={(e) =>
                    setNewProd({ ...newProd, category: e.target.value as CategoryType })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
                >
                  <option value="fruits">Fresh Fruits</option>
                  <option value="vegetables">Fresh Vegetables (Graded)</option>
                  <option value="dry-fruits">Premium Dry Fruits</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit *</label>
                <input
                  type="text"
                  value={newProd.unit}
                  onChange={(e) => setNewProd({ ...newProd, unit: e.target.value })}
                  placeholder="1 kg / 500 g"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Strictly show Vegetable Grade Pricing ONLY when category === 'vegetables' */}
            {newProd.category === 'vegetables' ? (
              <div className="rounded-2xl bg-forest-50 p-3.5 border border-forest-200 space-y-2">
                <p className="font-bold text-forest-900">
                  Vegetable Grade Pricing (Grade A, B, C)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold">Grade A (₹)</label>
                    <input
                      type="number"
                      value={newProd.gradeAPrice}
                      onChange={(e) =>
                        setNewProd({ ...newProd, gradeAPrice: Number(e.target.value) })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Grade B (₹)</label>
                    <input
                      type="number"
                      value={newProd.gradeBPrice}
                      onChange={(e) =>
                        setNewProd({ ...newProd, gradeBPrice: Number(e.target.value) })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold">Grade C (₹)</label>
                    <input
                      type="number"
                      value={newProd.gradeCPrice}
                      onChange={(e) =>
                        setNewProd({ ...newProd, gradeCPrice: Number(e.target.value) })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-bold"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Image URL</label>
              <input
                type="url"
                value={newProd.image}
                onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-forest-600 py-3 font-bold text-white hover:bg-forest-700 transition"
            >
              Add Product to Catalog
            </button>
          </form>

          <div className="lg:col-span-7 rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Active Catalog ({adminProducts.length} Items)
            </h3>
            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1 text-xs">
              {adminProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-2xl bg-cream-50 p-3 border border-slate-200/80"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                    <div>
                      <p className="break-words font-bold text-slate-900">{p.name}</p>
                      <p className="text-[11px] text-slate-500">
                        ₹{p.price}/{p.unit} • Stock: {p.stock}
                        {p.category === 'vegetables' ? ' • Graded (A/B/C)' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(p.id)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-4">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Customer Order & Fulfillment Management
          </h2>
          <div className="space-y-4">
            {adminOrders.map((ord) => (
              <div
                key={ord.id}
                className="rounded-2xl bg-cream-50 p-4 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm font-extrabold text-slate-900">
                      #{ord.orderNumber}
                    </span>
                    <span className="rounded-full bg-forest-100 px-2.5 py-0.5 font-bold text-forest-800">
                      ₹{ord.totalPayable} • {ord.payment?.method} ({ord.payment?.status})
                    </span>
                  </div>
                  <p className="font-semibold text-slate-700">
                    {ord.customerName} ({ord.customerPhone}) • PIN: {ord.address?.pincode}
                  </p>
                  <p className="text-forest-800 font-bold">
                    Scheduled Slot: {ord.deliverySchedule?.date} •{' '}
                    {ord.deliverySchedule?.slotLabel}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="font-bold text-slate-600">Update Status:</label>
                  <select
                    value={ord.status}
                    onChange={(e) =>
                      handleOrderStatusChange(ord.id, e.target.value as OrderStatusType)
                    }
                    className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold text-slate-900"
                  >
                    {ORDER_STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DELIVERY SLOTS & PIN CODE SERVICEABILITY */}
      {activeTab === 'delivery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Delivery Time Slots */}
          <div className="lg:col-span-6 rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-4 text-xs">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-forest-600" />
              Delivery Time-Slot & Capacity Manager
            </h3>

            <div className="space-y-2.5">
              {adminSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream-50 p-3 border border-slate-200"
                >
                  <div>
                    <p className="font-bold text-slate-900">{slot.label}</p>
                    <p className="text-[11px] text-slate-500">
                      Max Capacity: {slot.maxCapacity} orders
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={slot.maxCapacity}
                      onBlur={(e) =>
                        handleSlotUpdate(slot, Number(e.target.value), slot.isActive)
                      }
                      className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleSlotUpdate(slot, slot.maxCapacity, !slot.isActive)}
                      className={`rounded-lg px-2.5 py-1 font-bold ${
                        slot.isActive
                          ? 'bg-forest-700 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {slot.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddSlot}
              className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                value={newSlot.label}
                onChange={(e) => setNewSlot({ ...newSlot, label: e.target.value })}
                placeholder="e.g. 2:00 PM – 4:00 PM"
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
                required
              />
              <button
                type="submit"
                className="rounded-xl bg-forest-600 px-4 py-2 font-bold text-white"
              >
                Add Slot
              </button>
            </form>
          </div>

          {/* PIN Codes */}
          <div className="lg:col-span-6 rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-4 text-xs">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-forest-600" />
              Serviceable PIN Codes ({adminPins.length})
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {adminPins.map((p) => (
                <div
                  key={p.pincode}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-cream-50 p-3 border border-slate-200"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {p.pincode} — {p.area}, {p.city}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Delivery Fee: ₹{p.deliveryCharge} (Free above ₹{p.freeDeliveryMinOrder})
                    </p>
                  </div>
                  <span className="rounded-full bg-forest-100 px-2.5 py-0.5 font-bold text-forest-800">
                    Serviceable
                  </span>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleAddPinCode}
              className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2"
            >
              <input
                type="text"
                placeholder="PIN (e.g. 700001)"
                value={newPin.pincode}
                onChange={(e) => setNewPin({ ...newPin, pincode: e.target.value })}
                maxLength={6}
                className="rounded-xl border border-slate-300 px-3 py-2 font-bold"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={newPin.city}
                onChange={(e) => setNewPin({ ...newPin, city: e.target.value })}
                className="rounded-xl border border-slate-300 px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Area Hub"
                value={newPin.area}
                onChange={(e) => setNewPin({ ...newPin, area: e.target.value })}
                className="rounded-xl border border-slate-300 px-3 py-2"
                required
              />
              <button
                type="submit"
                className="sm:col-span-3 rounded-xl bg-forest-600 py-2.5 font-bold text-white"
              >
                Enable PIN Code Serviceability
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: COUPON & DISCOUNT MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleCreateCoupon}
            className="lg:col-span-5 rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-3 text-xs"
          >
            <h3 className="font-display text-lg font-bold text-slate-900">Create New Coupon</h3>
            <input
              type="text"
              placeholder="Coupon Code (e.g. MONSOON20)"
              value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono font-bold uppercase"
              required
            />
            <input
              type="text"
              placeholder="Coupon Title"
              value={newCoupon.title}
              onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newCoupon.discountType}
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    discountType: e.target.value as 'percentage' | 'flat',
                  })
                }
                className="rounded-xl border border-slate-300 px-3 py-2 font-bold"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
              <input
                type="number"
                placeholder="Value"
                value={newCoupon.discountValue}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })
                }
                className="rounded-xl border border-slate-300 px-3 py-2 font-bold"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500">Min Order (₹)</label>
                <input
                  type="number"
                  value={newCoupon.minOrderValue}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500">Category</label>
                <select
                  value={newCoupon.applicableCategory}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, applicableCategory: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                >
                  <option value="all">All Categories</option>
                  <option value="fruits">Fresh Fruits Only</option>
                  <option value="vegetables">Vegetables Only</option>
                  <option value="dry-fruits">Dry Fruits Only</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-forest-600 py-3 font-bold text-white"
            >
              Create Coupon
            </button>
          </form>

          <div className="lg:col-span-7 rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-3 text-xs">
            <h3 className="font-display text-lg font-bold text-slate-900">Configured Coupons</h3>
            {adminCoupons.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-cream-50 p-3.5 border border-slate-200"
              >
                <div>
                  <span className="font-mono font-extrabold text-citrus-600 text-sm">
                    {c.code}
                  </span>
                  <p className="font-bold text-slate-900">{c.title}</p>
                  <p className="text-[11px] text-slate-500">
                    Min ₹{c.minOrderValue} • Used {c.usedCount} times
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleCoupon(c)}
                  className={`rounded-xl px-3.5 py-1.5 font-bold ${
                    c.isActive
                      ? 'bg-forest-700 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: CUSTOMERS & AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-4 text-xs">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-forest-600" />
              Customer Accounts ({adminCustomers.length})
            </h3>
            <div className="space-y-2.5">
              {adminCustomers.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl bg-cream-50 p-3 border border-slate-200 space-y-0.5"
                >
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">{c.fullName}</span>
                    <span className="rounded bg-forest-100 px-2 py-0.5 text-[10px] font-bold text-forest-800 uppercase">
                      {c.role}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    {c.email} • {c.phone}
                  </p>
                  <p className="text-[10px] text-slate-400">DOB: {c.dob}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 rounded-3xl bg-white p-4 sm:p-6 shadow-soft border border-slate-200/80 space-y-4 text-xs">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-forest-600" />
              Immutable Admin Audit Trail
            </h3>
            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl bg-cream-50 p-3 border border-slate-200 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-forest-900 px-2 py-0.5 text-[10px] font-bold text-forest-200">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="font-bold text-slate-800">{log.summary}</p>
                  <p className="text-[10px] text-slate-500">By {log.adminName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
