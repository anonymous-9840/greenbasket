import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle2,
  CalendarClock,
  MapPin,
  CreditCard,
  XCircle,
  RefreshCw,
  ShieldCheck,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatusType } from '../types';

const ORDER_STAGES: OrderStatusType[] = [
  'Order Placed',
  'Order Confirmed',
  'Preparing Your Basket',
  'Packed',
  'Out for Delivery',
  'Delivered',
];

export const OrdersPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user, token, loginWithCredentials, deliverySlots, showToast, refreshProducts } =
    useStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleOrder, setRescheduleOrder] = useState<Order | null>(null);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newSlotId, setNewSlotId] = useState('slot-morning-1');

  const fetchMyOrders = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const handleCancelOrder = async (orderId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: 'Customer cancelled via Order Tracking portal' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not cancel order');
      showToast(data.message || 'Order cancelled.', 'info');
      await fetchMyOrders();
      await refreshProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel order', 'error');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleOrder || !token) return;
    try {
      const res = await fetch(`/api/orders/${rescheduleOrder.id}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: newDate, slotId: newSlotId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reschedule failed');
      showToast(data.message || 'Delivery slot rescheduled!', 'success');
      setRescheduleOrder(null);
      await fetchMyOrders();
    } catch (err: any) {
      showToast(err.message || 'Could not reschedule', 'error');
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest-100 text-forest-700">
          <Package className="h-10 w-10" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900">
          Sign in to Track Your Green Basket Orders
        </h1>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          View live 7-stage order tracking, scheduled delivery slots, and order history.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() =>
              loginWithCredentials({
                identifier: 'arjun@example.com',
                password: 'Customer@123',
              })
            }
            className="rounded-2xl bg-forest-600 px-6 py-3 text-xs font-bold text-white hover:bg-forest-700"
          >
            Demo Customer Login (Arjun)
          </button>
          <Link
            to="/auth"
            className="rounded-2xl bg-white px-6 py-3 text-xs font-bold text-slate-800 border border-slate-300"
          >
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  const displayedOrders = id
    ? orders.filter((o) => o.id === id || o.orderNumber === id)
    : orders;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {id && (
            <Link
              to="/orders"
              className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-forest-700 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All My Orders
            </Link>
          )}
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            {id ? 'Live Order Tracking & Confirmation' : 'My Orders & Delivery Timeline'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status updates, scheduled slot details & rescheduling controls
          </p>
        </div>
        <button
          type="button"
          onClick={fetchMyOrders}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-slate-700 border border-slate-200 hover:border-forest-500"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Status</span>
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-12 text-center text-xs text-slate-500">
          Loading your orders...
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center space-y-3 border border-slate-100">
          <p className="font-display text-lg font-bold text-slate-800">No orders found</p>
          <Link
            to="/shop"
            className="inline-block rounded-2xl bg-forest-600 px-6 py-2.5 text-xs font-bold text-white"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {displayedOrders.map((order) => {
            const isCancelled = order.status === 'Cancelled';
            const currentStageIdx = ORDER_STAGES.indexOf(order.status);
            const canModify = !['Out for Delivery', 'Delivered', 'Cancelled'].includes(
              order.status
            );

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-6"
              >
                {/* Top Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-900 text-white animate-truck">
                      <Truck className="h-6 w-6 text-forest-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-extrabold text-slate-900">
                          Order #{order.orderNumber}
                        </span>
                        <span
                          className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                            isCancelled
                              ? 'bg-rose-100 text-rose-700'
                              : order.status === 'Delivered'
                              ? 'bg-forest-100 text-forest-800'
                              : 'bg-citrus-100 text-citrus-600'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Scheduled Delivery Slot Pill */}
                  <div className="rounded-2xl bg-forest-50 px-4 py-2.5 border border-forest-200 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-forest-900">
                      <CalendarClock className="h-4 w-4 text-forest-600" />
                      <span>
                        Scheduled Slot: {order.deliverySchedule?.date} •{' '}
                        {order.deliverySchedule?.slotLabel}
                      </span>
                    </div>
                    {order.deliverySchedule?.isExpress && (
                      <span className="text-[10px] font-bold text-citrus-600">
                        ⚡ Express 45-Min Green Rider
                      </span>
                    )}
                  </div>
                </div>

                {/* ANIMATED 7-STAGE ORDER TRACKING TIMELINE */}
                {isCancelled ? (
                  <div className="rounded-2xl bg-rose-50 p-4 border border-rose-200 flex items-center gap-3 text-xs text-rose-800">
                    <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                    <div>
                      <p className="font-bold">This order was Cancelled</p>
                      <p className="text-[11px]">
                        Payment Status: <strong>{order.payment?.status}</strong> • Inventory
                        restored.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Live Farm-to-Doorstep Progress</span>
                      <span className="text-forest-700">
                        Stage {Math.max(1, currentStageIdx + 1)} of {ORDER_STAGES.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {ORDER_STAGES.map((stage, idx) => {
                        const completed = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;
                        return (
                          <motion.div
                            key={stage}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            className={`rounded-2xl p-3 border text-xs transition ${
                              isCurrent
                                ? 'bg-forest-800 text-white border-forest-800 shadow-md ring-2 ring-forest-400'
                                : completed
                                ? 'bg-forest-50 text-forest-900 border-forest-200'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold uppercase">
                                Step {idx + 1}
                              </span>
                              {completed && (
                                <CheckCircle2
                                  className={`h-3.5 w-3.5 ${
                                    isCurrent ? 'text-forest-300' : 'text-forest-600'
                                  }`}
                                />
                              )}
                            </div>
                            <p className="font-bold leading-snug">{stage}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order Items & Address / Payment Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                  {/* Items */}
                  <div className="lg:col-span-7 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Ordered Groceries ({order.items.length})
                    </h4>
                    <div className="divide-y divide-slate-100 rounded-2xl bg-cream-50 p-3 border border-slate-200/70">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-11 w-11 rounded-xl object-cover"
                            />
                            <div>
                              <p className="font-bold text-slate-900">
                                {item.name} × {item.quantity}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                ₹{item.price} / {item.unit}
                                {/* Strictly show grade ONLY for vegetables */}
                                {item.category === 'vegetables' && item.selectedGrade && (
                                  <span className="ml-1.5 inline-flex items-center gap-0.5 rounded bg-forest-100 px-1.5 py-0.5 text-[10px] font-bold text-forest-800">
                                    <ShieldCheck className="h-2.5 w-2.5" />
                                    {item.selectedGrade}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="font-extrabold text-slate-900">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address, Payment & Actions */}
                  <div className="lg:col-span-5 space-y-3 text-xs">
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
                      <p className="flex items-center gap-1.5 font-bold text-slate-800">
                        <MapPin className="h-4 w-4 text-forest-600" />
                        Delivery Address ({order.address?.label || 'Home'})
                      </p>
                      <p className="text-slate-600">
                        {order.address?.fullName} • {order.address?.line1}, {order.address?.city} -{' '}
                        <strong>{order.address?.pincode}</strong>
                      </p>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <CreditCard className="h-3.5 w-3.5 text-forest-600" />
                          {order.payment?.method} ({order.payment?.status})
                        </span>
                        <span className="text-sm font-extrabold text-slate-900">
                          Total: ₹{order.totalPayable}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Activity Log */}
                    {order.statusTimeline && order.statusTimeline.length > 0 && (
                      <div className="rounded-2xl bg-cream-50 p-3.5 border border-slate-200/60 space-y-1.5">
                        <p className="font-bold text-slate-700 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-forest-600" />
                          Recent Activity Log
                        </p>
                        {order.statusTimeline.slice(-2).map((ev, i) => (
                          <p key={i} className="text-[11px] text-slate-600">
                            • <strong>{ev.status}:</strong> {ev.note}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Reschedule & Cancel Buttons */}
                    {canModify && (
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setRescheduleOrder(order);
                            setNewDate(order.deliverySchedule.date);
                            setNewSlotId(order.deliverySchedule.slotId);
                          }}
                          className="flex-1 rounded-xl bg-forest-50 py-2.5 px-3 font-bold text-forest-800 border border-forest-200 hover:bg-forest-100 transition"
                        >
                          Reschedule Slot
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order.id)}
                          className="rounded-xl bg-rose-50 py-2.5 px-4 font-bold text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Reschedule Delivery (#{rescheduleOrder.orderNumber})
            </h3>
            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Delivery Date</label>
                <input
                  type="date"
                  value={newDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Time Slot</label>
                <select
                  value={newSlotId}
                  onChange={(e) => setNewSlotId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
                >
                  {deliverySlots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleOrder(null)}
                  className="rounded-xl px-4 py-2 text-slate-600"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-forest-600 px-5 py-2 font-bold text-white"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
