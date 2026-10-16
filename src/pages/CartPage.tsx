import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBasket,
  Trash2,
  Plus,
  Minus,
  Tag,
  CalendarClock,
  ShieldCheck,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { VegetableGradeType } from '../types';

export const CartPage: React.FC = () => {
  const {
    resolvedCartLines,
    subtotal,
    totalSavings,
    updateCartQuantity,
    removeFromCart,
    updateCartGrade,
    clearCart,
    coupons,
    appliedCoupon,
    couponDiscount,
    couponError,
    applyCoupon,
    removeCoupon,
    selectedDeliveryDate,
    selectedDeliverySlot,
    pinInfo,
    lastDailyPriceSync,
  } = useStore();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const freeThreshold = pinInfo?.freeDeliveryMinOrder || 499;
  const baseDelivery =
    subtotal === 0 ? 0 : subtotal >= freeThreshold ? 0 : pinInfo?.deliveryCharge || 30;
  const expressExtra = selectedDeliverySlot?.isExpress ? selectedDeliverySlot.extraCharge || 49 : 0;
  const deliveryFee = subtotal === 0 ? 0 : baseDelivery + expressExtra;
  const taxable = Math.max(0, subtotal - couponDiscount);
  const taxAmount = Math.round(taxable * 0.05);
  const finalPayable = subtotal === 0 ? 0 : taxable + taxAmount + deliveryFee;

  if (resolvedCartLines.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-forest-100 text-forest-700">
          <ShoppingBasket className="h-12 w-12" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">
          Your Shopping Basket is Empty
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Fill your basket with orchard-fresh fruits, Grade A/B/C vegetables, and artisanal dry
          fruits.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-2xl bg-forest-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-forest-700 transition"
          >
            <span>Explore Fresh Groceries</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Shopping Basket ({resolvedCartLines.length} Products)
          </h1>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
            <Clock className="h-3.5 w-3.5 text-forest-600" />
            Using verified daily prices updated{' '}
            {new Date(lastDailyPriceSync).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:underline"
        >
          Clear Entire Basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Selected Delivery Slot Banner */}
          <div className="rounded-2xl bg-forest-50 p-4 border border-forest-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-forest-950">
              <CalendarClock className="h-5 w-5 text-forest-700" />
              <div>
                <p className="font-bold">
                  Scheduled Delivery: {selectedDeliveryDate} •{' '}
                  {selectedDeliverySlot?.label || '7:00 AM – 9:00 AM'}
                </p>
                <p className="text-[11px] text-forest-700">
                  Delivering to PIN {pinInfo ? `${pinInfo.pincode} (${pinInfo.city})` : '560034'}
                </p>
              </div>
            </div>
            <Link
              to="/delivery-scheduling"
              className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-forest-800 border border-forest-300 hover:bg-forest-100"
            >
              Change Date / Time Slot
            </Link>
          </div>

          {/* Cart Items */}
          {resolvedCartLines.map((line) => {
            const isVeg =
              line.product.category === 'vegetables' &&
              Array.isArray(line.product.vegetableGrades);

            return (
              <div
                key={`${line.product.id}-${line.selectedGrade || 'std'}`}
                className="rounded-3xl bg-white p-5 shadow-soft border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={line.product.image}
                    alt={line.product.name}
                    className="h-20 w-20 rounded-2xl object-cover bg-cream-100 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700">
                      {line.product.category.replace('-', ' ')}
                    </span>
                    <Link
                      to={`/product/${line.product.id}`}
                      className="block font-display text-base font-bold text-slate-900 hover:text-forest-700"
                    >
                      {line.product.name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      ₹{line.unitPrice} per {line.product.unit} • {line.freshness}
                    </p>

                    {/* STRICT RULE: Grade Switcher ONLY for vegetables */}
                    {isVeg && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-forest-900">
                          <ShieldCheck className="h-3.5 w-3.5 text-forest-600" />
                          Vegetable Grade:
                        </span>
                        {(['Grade A', 'Grade B', 'Grade C'] as VegetableGradeType[]).map((gr) => {
                          const grInfo = line.product.vegetableGrades!.find((g) => g.grade === gr);
                          return (
                            <button
                              key={gr}
                              type="button"
                              onClick={() =>
                                updateCartGrade(line.product.id, line.selectedGrade, gr)
                              }
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition border ${
                                line.selectedGrade === gr
                                  ? 'bg-forest-700 text-white border-forest-700'
                                  : 'bg-forest-50 text-forest-800 border-forest-200 hover:bg-forest-100'
                              }`}
                            >
                              {gr} {grInfo ? `(₹${grInfo.price})` : ''}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl bg-cream-100 border border-slate-200 px-1.5 py-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(line.product.id, line.selectedGrade, line.quantity - 1)
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-700 hover:bg-white"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-extrabold">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(line.product.id, line.selectedGrade, line.quantity + 1)
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-700 hover:bg-white"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(line.product.id, line.selectedGrade)}
                      className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-display text-lg font-extrabold text-slate-900">
                      ₹{line.lineTotal}
                    </span>
                    {line.originalPrice > line.unitPrice && (
                      <span className="ml-1.5 text-xs text-slate-400 line-through">
                        ₹{line.originalPrice * line.quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary & Coupons */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-slate-200/80 space-y-5">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Coupon & Order Summary
            </h2>

            {/* Coupon Form */}
            <div className="space-y-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-2xl bg-forest-50 p-3 border border-forest-200 text-xs">
                  <div>
                    <p className="font-bold text-forest-900">
                      Coupon {appliedCoupon.code} Applied!
                    </p>
                    <p className="text-[11px] text-forest-700">You saved ₹{couponDiscount}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (couponInput.trim()) {
                      const ok = await applyCoupon(couponInput.trim());
                      if (ok) setCouponInput('');
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold uppercase focus:border-forest-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-forest-700"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] font-semibold text-rose-600">{couponError}</p>}

              {/* Quick Available Coupons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {coupons.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => applyCoupon(c.code)}
                    className="inline-flex items-center gap-1 rounded-lg bg-citrus-50 px-2.5 py-1 text-[11px] font-bold text-citrus-600 border border-citrus-400/30 hover:bg-citrus-100"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{c.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Live Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between font-bold text-forest-700">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST & Packaging (5%)</span>
                <span>₹{taxAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-semibold text-forest-700">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-slate-900">
                <span>Final Payable Amount</span>
                <span>₹{finalPayable}</span>
              </div>
              {totalSavings > 0 && (
                <p className="rounded-xl bg-forest-50 py-1.5 px-3 text-center text-xs font-bold text-forest-800">
                  🎉 Total Savings on this Basket: ₹{totalSavings}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-forest-600 py-3.5 px-6 text-sm font-bold text-white shadow-glow hover:bg-forest-700 transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
