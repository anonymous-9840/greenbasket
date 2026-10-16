import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Copy, CheckCircle2, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OffersPage: React.FC = () => {
  const { coupons, appliedCoupon, applyCoupon, showToast } = useStore();

  const handleCopyApply = async (code: string) => {
    navigator.clipboard?.writeText(code);
    await applyCoupon(code);
    showToast(`Coupon ${code} copied to clipboard!`, 'success');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-citrus-600 via-amber-600 to-forest-900 p-8 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Verified Backend Coupon Engine
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold">
            Green Basket Offers & Discount Coupons
          </h1>
          <p className="text-xs sm:text-sm text-cream-100/90 leading-relaxed">
            Apply storewide, first-order, or category-specific dry fruit coupons at checkout. Every
            coupon is validated securely on our server against minimum order value, expiry date, and
            eligible categories.
          </p>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((c) => {
          const isApplied = appliedCoupon?.code === c.code;
          return (
            <div
              key={c.id}
              className={`rounded-3xl bg-white p-6 shadow-soft border-2 transition flex flex-col justify-between ${
                isApplied ? 'border-forest-600 bg-forest-50/30' : 'border-dashed border-slate-200'
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-citrus-50 px-4 py-1.5 border border-citrus-400/40">
                    <Tag className="h-4 w-4 text-citrus-600" />
                    <span className="font-mono text-base font-extrabold text-citrus-600">
                      {c.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.firstOrderOnly && (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-[11px] font-bold text-purple-800">
                        First Order Exclusive
                      </span>
                    )}
                    <span className="rounded-full bg-forest-100 px-3 py-1 text-[11px] font-bold text-forest-800 capitalize">
                      {c.applicableCategories.includes('all')
                        ? 'All Categories'
                        : `${c.applicableCategories.join(', ')} Only`}
                    </span>
                  </div>
                </div>

                <h3 className="mt-4 font-display text-xl font-extrabold text-slate-900">
                  {c.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {c.description}
                </p>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-2xl bg-cream-50 p-3 text-xs border border-slate-200/60">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Min. Order</span>
                    <strong className="text-slate-800">₹{c.minOrderValue}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Max Discount</span>
                    <strong className="text-slate-800">Up to ₹{c.maxDiscount}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Valid Until</span>
                    <strong className="text-slate-800 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-forest-600" />
                      {c.expiryDate}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Limit: {c.perCustomerLimit} uses per customer
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyApply(c.code)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition ${
                    isApplied
                      ? 'bg-forest-700 text-white'
                      : 'bg-slate-900 text-white hover:bg-forest-600'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Applied to Basket</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy & Apply {c.code}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl bg-forest-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold">Ready to Redeem Your Offer?</h3>
          <p className="text-xs text-forest-200 mt-1">
            Add fresh fruits, graded vegetables, or dry fruits to your basket and apply your code at
            checkout.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-2xl bg-forest-500 px-6 py-3 text-xs font-bold text-forest-950 hover:bg-forest-400 transition shrink-0"
        >
          <span>Shop Eligible Products</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
