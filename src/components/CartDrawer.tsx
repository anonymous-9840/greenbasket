import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBasket,
  Trash2,
  Plus,
  Minus,
  Tag,
  CalendarClock,
  ArrowRight,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { VegetableGradeType } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    resolvedCartLines,
    cartCount,
    subtotal,
    totalSavings,
    updateCartQuantity,
    removeFromCart,
    updateCartGrade,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    selectedDeliveryDate,
    selectedDeliverySlot,
    pinInfo,
  } = useStore();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  const freeDeliveryThreshold = pinInfo?.freeDeliveryMinOrder || 499;
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const baseDeliveryFee =
    subtotal === 0 ? 0 : subtotal >= freeDeliveryThreshold ? 0 : pinInfo?.deliveryCharge || 30;
  const expressExtra = selectedDeliverySlot?.isExpress ? selectedDeliverySlot.extraCharge || 49 : 0;
  const deliveryFee = subtotal === 0 ? 0 : baseDeliveryFee + expressExtra;
  const taxable = Math.max(0, subtotal - couponDiscount);
  const taxAmount = Math.round(taxable * 0.05);
  const finalPayable = subtotal === 0 ? 0 : taxable + taxAmount + deliveryFee;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = await applyCoupon(couponInput.trim());
    if (ok) setCouponInput('');
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="flex h-full w-full max-w-md flex-col bg-cream-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-forest-900 px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-600">
                  <ShoppingBasket className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold">Your Green Basket</h2>
                  <p className="text-[11px] text-forest-200">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'} • Live daily farm pricing
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="rounded-full p-1.5 text-forest-200 hover:bg-forest-800 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Selected Delivery Slot Banner */}
            <div className="bg-forest-100/80 px-4 py-2.5 border-b border-forest-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-forest-900">
                <CalendarClock className="h-4 w-4 text-forest-700 shrink-0" />
                <div>
                  <span className="font-semibold">Scheduled Slot: </span>
                  <span className="font-bold">
                    {selectedDeliveryDate} • {selectedDeliverySlot?.label || 'Select Time'}
                  </span>
                </div>
              </div>
              <Link
                to="/delivery-scheduling"
                onClick={() => setIsCartDrawerOpen(false)}
                className="font-bold text-forest-700 underline hover:text-forest-900"
              >
                Change
              </Link>
            </div>

            {/* Free Delivery Progress */}
            {subtotal > 0 && (
              <div className="bg-white px-4 py-2.5 border-b border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Truck className="h-3.5 w-3.5 text-forest-600" />
                    {amountForFreeDelivery === 0 ? (
                      <span className="text-forest-700 font-bold">
                        🎉 Unlocked FREE Standard Delivery!
                      </span>
                    ) : (
                      <span>
                        Add <strong>₹{amountForFreeDelivery}</strong> more for FREE Delivery
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-forest-600 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {resolvedCartLines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest-100 text-forest-600 mb-4">
                    <ShoppingBasket className="h-10 w-10" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-800">
                    Your Green Basket is Empty
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-xs">
                    Explore farm-fresh fruits, Grade A/B/C vegetables, and premium dry fruits.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigate('/shop');
                    }}
                    className="mt-5 rounded-2xl bg-forest-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-forest-700 transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                resolvedCartLines.map((line) => {
                  const isVeg = line.product.category === 'vegetables' && Array.isArray(line.product.vegetableGrades);
                  return (
                    <div
                      key={`${line.product.id}-${line.selectedGrade || 'std'}`}
                      className="rounded-2xl bg-white p-3 shadow-sm border border-slate-200/80"
                    >
                      <div className="flex gap-3">
                        <img
                          src={line.product.image}
                          alt={line.product.name}
                          className="h-16 w-16 rounded-xl object-cover shrink-0 bg-cream-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${line.product.id}`}
                              onClick={() => setIsCartDrawerOpen(false)}
                              className="text-xs font-bold text-slate-900 hover:text-forest-700 line-clamp-1"
                            >
                              {line.product.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeFromCart(line.product.id, line.selectedGrade)}
                              className="text-slate-400 hover:text-rose-500"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <p className="text-[11px] text-slate-500">
                            ₹{line.unitPrice} / {line.product.unit}
                          </p>

                          {/* STRICT RULE: Grade Switcher ONLY for vegetables */}
                          {isVeg && (
                            <div className="mt-1.5 flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3 text-forest-600 shrink-0" />
                              <span className="text-[10px] font-semibold text-slate-600">Grade:</span>
                              {(['Grade A', 'Grade B', 'Grade C'] as VegetableGradeType[]).map((gr) => (
                                <button
                                  key={gr}
                                  type="button"
                                  onClick={() => updateCartGrade(line.product.id, line.selectedGrade, gr)}
                                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold transition ${
                                    line.selectedGrade === gr
                                      ? 'bg-forest-700 text-white'
                                      : 'bg-forest-50 text-forest-800 hover:bg-forest-100'
                                  }`}
                                >
                                  {gr}
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-xl bg-cream-100 border border-slate-200 px-1 py-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(
                                    line.product.id,
                                    line.selectedGrade,
                                    line.quantity - 1
                                  )
                                }
                                className="flex h-5 w-5 items-center justify-center text-slate-700"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold">{line.quantity}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartQuantity(
                                    line.product.id,
                                    line.selectedGrade,
                                    line.quantity + 1
                                  )
                                }
                                className="flex h-5 w-5 items-center justify-center text-slate-700"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="text-sm font-extrabold text-slate-900">
                              ₹{line.lineTotal}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout Actions */}
            {resolvedCartLines.length > 0 && (
              <div className="border-t border-slate-200 bg-white p-4 space-y-3">
                {/* Coupon Input */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-forest-50 px-3 py-2 border border-forest-200 text-xs">
                    <div className="flex items-center gap-1.5 text-forest-900">
                      <Tag className="h-3.5 w-3.5 text-forest-600" />
                      <span>
                        Code <strong>{appliedCoupon.code}</strong> applied (-₹{couponDiscount})
                      </span>
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
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter coupon (e.g. GREEN10)"
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase focus:border-forest-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-forest-800 transition"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Bill Breakdown */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Live Items Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-forest-700 font-semibold">
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Taxes (5% GST)</span>
                    <span>₹{taxAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee ({selectedDeliverySlot?.isExpress ? 'Express' : 'Scheduled'})</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold text-slate-900">
                    <span>Total Payable</span>
                    <span>₹{finalPayable}</span>
                  </div>
                  {totalSavings > 0 && (
                    <p className="text-[11px] font-semibold text-forest-700 text-right">
                      You save ₹{totalSavings} on this basket!
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/cart"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="flex items-center justify-center rounded-2xl border border-forest-600 py-2.5 text-xs font-bold text-forest-700 hover:bg-forest-50 transition"
                  >
                    View Full Cart
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigate('/checkout');
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-2xl bg-forest-600 py-2.5 text-xs font-bold text-white hover:bg-forest-700 transition shadow-md"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
