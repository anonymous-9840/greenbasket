import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Truck,
  Tag,
  CalendarClock,
  CheckCircle2,
  Copy,
  Leaf,
} from 'lucide-react';
import { HeroScene3D } from '../components/three/HeroScene3D';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { CategoryType } from '../types';

export const HomePage: React.FC = () => {
  const {
    products,
    coupons,
    applyCoupon,
    reducedMotion,
    lastDailyPriceSync,
    selectedDeliveryDate,
    selectedDeliverySlot,
    pinInfo,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | CategoryType>('all');

  const filteredFeatured = products
    .filter((p) => (activeTab === 'all' ? true : p.category === activeTab))
    .slice(0, 8);

  const formattedDate = new Date(lastDailyPriceSync).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const copyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    applyCoupon(code);
    showToast(`Coupon ${code} copied & applied to basket!`, 'success');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION WITH INTERACTIVE 3D SCENE */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-50/90 via-cream-50 to-cream-50 pt-6 pb-12 lg:py-12 border-b border-forest-100">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-3.5 py-1.5 text-xs font-bold text-forest-800 border border-forest-200">
                <Leaf className="h-3.5 w-3.5 text-forest-600" />
                <span>100% Farm-Direct • Daily Verified Prices • 3D Interactive</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                Freshness Delivered to Your{' '}
                <span className="bg-gradient-to-r from-forest-600 via-forest-700 to-citrus-500 bg-clip-text text-transparent">
                  Doorstep
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Discover nature's goodness with fresh fruits, quality vegetables, and premium dry
                fruits delivered when you need them.
              </p>

              {/* Hero CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-2xl bg-forest-600 px-7 py-4 text-sm font-bold text-white shadow-glow hover:bg-forest-700 transition transform active:scale-95"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#categories"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-forest-900 border border-forest-200 hover:border-forest-500 hover:bg-forest-50 transition shadow-sm"
                >
                  <span>Explore Categories</span>
                </a>
              </div>

              {/* Live Delivery & Daily Rate Status Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="rounded-2xl bg-white p-3.5 shadow-sm border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-forest-700">
                    <Clock className="h-4 w-4" />
                    <span>Daily Prices Live</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Updated {formattedDate}</p>
                </div>

                <div className="rounded-2xl bg-white p-3.5 shadow-sm border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-forest-700">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Graded Vegetables</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Select Grade A, B, or C on veggies
                  </p>
                </div>

                <Link
                  to="/delivery-scheduling"
                  className="rounded-2xl bg-white p-3.5 shadow-sm border border-slate-200/80 hover:border-forest-500 transition block"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-citrus-600">
                    <CalendarClock className="h-4 w-4" />
                    <span>Next Available Slot</span>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-slate-700 truncate">
                    {selectedDeliveryDate} • {selectedDeliverySlot?.label || '7:00 AM – 9:00 AM'}
                  </p>
                </Link>
              </div>
            </div>

            {/* Right Interactive 3D Hero Scene */}
            <div className="lg:col-span-6">
              <HeroScene3D reducedMotion={reducedMotion} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE MAIN SHOPPING CATEGORIES */}
      <section id="categories" className="mx-auto max-w-7xl px-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest-600">
              Curated Nature's Harvest
            </span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-1">
              Explore Our 3 Signature Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest-700 hover:text-forest-900"
          >
            <span>View Complete Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category 1: Fresh Fruits */}
          <motion.div
            whileHover={reducedMotion ? {} : { y: -6 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-amber-50/60 to-white p-6 shadow-soft border border-rose-200/60 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-700">
                  Orchard Direct • Wax-Free
                </span>
                <span className="text-3xl">🍎🍓🥭</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
                Fresh Fruits
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Apples, bananas, Nagpur oranges, seedless grapes, Ratnagiri Alphonso mangoes,
                watermelon, Mahabaleshwar strawberries, papaya, pomegranates & seasonal fruits.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['Apples', 'Bananas', 'Mangoes', 'Strawberries', 'Oranges', 'Pomegranates'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 border border-rose-100"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-200/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {products.filter((p) => p.category === 'fruits').length} Fresh Varieties
              </span>
              <Link
                to="/category/fruits"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition"
              >
                <span>Shop Fruits</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Category 2: Fresh Vegetables (WITH EXCLUSIVE GRADING BADGE) */}
          <motion.div
            whileHover={reducedMotion ? {} : { y: -6 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-50 via-emerald-50/70 to-white p-6 shadow-soft border-2 border-forest-400/70 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-forest-700 px-3 py-1 text-xs font-bold text-white">
                  ★ Grade A / B / C System
                </span>
                <span className="text-3xl">🥦🥕🍅</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
                Fresh Vegetables
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Tomatoes, potatoes, onions, Ooty carrots, baby spinach, broccoli, cauliflower,
                cabbage, cucumbers, capsicum & seasonal harvests with transparent 3-tier quality grading.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['Grade A: Premium', 'Grade B: Standard', 'Grade C: Budget Friendly'].map((g) => (
                  <span
                    key={g}
                    className="rounded-lg bg-forest-900/90 px-2.5 py-1 text-[11px] font-bold text-forest-100"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-forest-200 flex items-center justify-between">
              <span className="text-xs font-bold text-forest-900">
                {products.filter((p) => p.category === 'vegetables').length} Graded Veggies
              </span>
              <Link
                to="/category/vegetables"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-forest-600 px-4 py-2 text-xs font-bold text-white hover:bg-forest-700 transition"
              >
                <span>Shop Vegetables</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Category 3: Premium Dry Fruits */}
          <motion.div
            whileHover={reducedMotion ? {} : { y: -6 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-white p-6 shadow-soft border border-amber-200/70 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-800">
                  Nitrogen-Sealed • Rich Omega-3
                </span>
                <span className="text-3xl">🥜🌰🍯</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
                Premium Dry Fruits
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                California almonds, Goan whole cashews, Iranian roasted pistachios, Kashmiri walnut
                kernels, golden raisins, Medjool dates, Afghan figs & royal mixed dry fruits.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {['Almonds', 'Cashews W240', 'Pistachios', 'Walnuts', 'Dates', 'Figs'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 border border-amber-200/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-200/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {products.filter((p) => p.category === 'dry-fruits').length} Artisanal Packs
              </span>
              <Link
                to="/category/dry-fruits"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition"
              >
                <span>Shop Dry Fruits</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS WITH DAILY PRICING */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest-600">
              Admin-Verified Daily Rates
            </span>
            <h2 className="font-display text-3xl font-extrabold text-slate-900 mt-1">
              Today's Fresh Harvest Picks
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Highlights' },
              { id: 'fruits', label: '🍎 Fresh Fruits' },
              { id: 'vegetables', label: '🥦 Graded Vegetables' },
              { id: 'dry-fruits', label: '🥜 Dry Fruits' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'all' | CategoryType)}
                className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-forest-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-forest-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeatured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. ACTIVE COUPONS & SCHEDULED DELIVERY SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coupons Card */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-citrus-50 via-amber-50/70 to-white p-6 sm:p-8 border border-citrus-400/30 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-citrus-600">
                  Live Store Promotions
                </span>
                <h3 className="font-display text-2xl font-extrabold text-slate-900">
                  Save More With Instant Coupons
                </h3>
              </div>
              <Link
                to="/offers"
                className="text-xs font-bold text-citrus-600 hover:underline flex items-center gap-1"
              >
                <span>All Offers</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coupons.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col justify-between rounded-2xl bg-white p-4 border border-dashed border-citrus-400 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-citrus-500/10 px-2.5 py-1 font-mono text-xs font-extrabold text-citrus-600">
                        {c.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Min ₹{c.minOrderValue}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-bold text-slate-900">{c.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2">
                      {c.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCoupon(c.code)}
                    className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-1.5 text-[11px] font-bold text-white hover:bg-forest-700 transition"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Apply {c.code}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Scheduling Card */}
          <div className="lg:col-span-5 rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-700">
                <Truck className="h-4 w-4" />
                <span>Smart Slot Reservation</span>
              </div>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-slate-900">
                Delivery When You Want It
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Pick a convenient 2-hour window or 45-minute Express Green Rider delivery. We
                reserve slot capacity during checkout so your produce never sits in transit.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                {[
                  '7:00 AM – 9:00 AM (Early Morning Harvest)',
                  '9:00 AM – 11:00 AM (Kitchen Prep Window)',
                  '11:00 AM – 1:00 PM (Midday Fresh Slot)',
                  '4:00 PM – 6:00 PM & 6:00 PM – 8:00 PM (Evening)',
                ].map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-2 rounded-xl bg-forest-50/70 px-3 py-2 text-forest-900 font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4 text-forest-600 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400">Active Zone: </span>
                <strong className="text-slate-800">
                  {pinInfo ? `${pinInfo.city} (${pinInfo.pincode})` : 'Bengaluru 560034'}
                </strong>
              </div>
              <Link
                to="/delivery-scheduling"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-forest-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-forest-700 transition"
              >
                <span>Schedule Slot</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
