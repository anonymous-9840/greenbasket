import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBasket,
  Search,
  MapPin,
  Heart,
  User as UserIcon,
  CalendarClock,
  Sparkles,
  Menu,
  X,
  ShieldAlert,
  CheckCircle2,
  Package,
  Home,
  Store,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    products,
    cartCount,
    subtotal,
    setIsCartDrawerOpen,
    basketBump,
    wishlist,
    user,
    selectedPinCode,
    pinInfo,
    pinCodesList,
    checkPinServiceability,
    selectedDeliveryDate,
    selectedDeliverySlot,
    toasts,
  } = useStore();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState(selectedPinCode);
  const [pinStatusMsg, setPinStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const logoClickCountRef = useRef(0);
  const logoClickTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (logoClickTimeoutRef.current !== null) {
        window.clearTimeout(logoClickTimeoutRef.current);
      }
    };
  }, []);

  const autocompleteMatches = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleCheckPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await checkPinServiceability(pinInput);
    setPinStatusMsg({ ok: res.serviceable, text: res.message });
  };

  return (
    <>
      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Brand Logo */}
            <Link
              to="/"
              onClick={(event) => {
                logoClickCountRef.current += 1;
                if (logoClickTimeoutRef.current !== null) {
                  window.clearTimeout(logoClickTimeoutRef.current);
                }
                if (logoClickCountRef.current >= 3) {
                  event.preventDefault();
                  logoClickCountRef.current = 0;
                  navigate('/admin');
                  return;
                }
                logoClickTimeoutRef.current = window.setTimeout(() => {
                  logoClickCountRef.current = 0;
                }, 1000);
              }}
              className="flex min-w-0 items-center gap-2 sm:gap-2.5 shrink-0 group"
              aria-label="Green Basket home"
            >
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 text-white shadow-md group-hover:scale-105 transition">
                <ShoppingBasket className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <span className="whitespace-nowrap font-display text-lg sm:text-xl font-extrabold tracking-tight text-forest-950">
                  Green <span className="text-forest-600">Basket</span>
                </span>
                <p className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest text-forest-700">
                  Farm-Fresh 3D Grocer
                </p>
              </div>
            </Link>

            {/* PIN Code & Delivery Slot Quick Selector */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPinInput(selectedPinCode);
                  setPinStatusMsg(null);
                  setPinModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-left text-xs border border-slate-200 hover:border-forest-500 transition shadow-sm"
              >
                <MapPin className="h-4 w-4 text-forest-600 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-slate-500">Deliver to PIN</p>
                  <p className="font-bold text-slate-800">
                    {pinInfo ? `${pinInfo.city} ${pinInfo.pincode}` : selectedPinCode}
                  </p>
                </div>
              </button>

              <Link
                to="/delivery-scheduling"
                className="flex items-center gap-2 rounded-2xl bg-forest-50 px-3 py-2 text-left text-xs border border-forest-200 hover:border-forest-500 transition"
              >
                <CalendarClock className="h-4 w-4 text-forest-700 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-forest-700">Delivery Slot</p>
                  <p className="font-bold text-forest-950 line-clamp-1 max-w-[140px]">
                    {selectedDeliverySlot ? selectedDeliverySlot.label : 'Choose Slot'}
                  </p>
                </div>
              </Link>
            </div>

            {/* Search Bar with Autocomplete */}
            <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className=" absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="Search apples, Grade A tomatoes, almonds..."
                  className="w-full rounded-2xl bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-500/20 shadow-sm"
                />
              </form>

              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {showSuggestions && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white p-2 shadow-xl border border-slate-200 z-50"
                  >
                    {autocompleteMatches.length === 0 ? (
                      <p className="px-3 py-4 text-center text-xs text-slate-500">
                        No matching groceries found for "{searchQuery}".
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {autocompleteMatches.map((item) => (
                          <Link
                            key={item.id}
                            to={`/product/${item.id}`}
                            onClick={() => setShowSuggestions(false)}
                            className="flex items-center justify-between gap-3 rounded-xl p-2 hover:bg-forest-50 transition"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="text-xs font-bold text-slate-900">{item.name}</p>
                                <p className="text-[11px] text-slate-500 capitalize">
                                  {item.category.replace('-', ' ')} • {item.unit}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-extrabold text-forest-700">
                              ₹{item.price}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Actions: Wishlist, Account, Animated Basket */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Link
                to="/wishlist"
                className="relative hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 border border-slate-200 hover:border-forest-500 hover:text-rose-500 transition"
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to={user ? '/account' : '/auth'}
                className="hidden sm:flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 border border-slate-200 hover:border-forest-500 transition"
              >
                <UserIcon className="h-4 w-4 text-forest-600" />
                <span className="hidden sm:inline">
                  {user ? user.fullName.split(' ')[0] : 'Sign In'}
                </span>
              </Link>

              {/* Animated Shopping Basket Trigger */}
              <motion.button
                key={basketBump}
                animate={basketBump > 0 ? { scale: [1, 1.16, 0.95, 1.04, 1], rotate: [0, -6, 6, 0] } : {}}
                transition={{ duration: 0.45 }}
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-2 rounded-xl sm:rounded-2xl bg-forest-700 px-2.5 sm:px-3.5 py-2 text-white shadow-md hover:bg-forest-800 transition"
              >
                <div className="relative">
                  <ShoppingBasket className="h-5 w-5" />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-citrus-500 text-[10px] font-extrabold text-white shadow">
                    {cartCount}
                  </span>
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-[10px] font-medium text-forest-200">My Basket</p>
                  <p className="text-xs font-extrabold">₹{subtotal}</p>
                </div>
              </motion.button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex md:hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-slate-700"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Secondary Category Navigation Bar */}
          <nav aria-label="Main menu" className="mt-2.5 hidden md:flex items-center justify-between border-t border-slate-200/60 pt-2 text-xs font-semibold text-slate-700">
            <div className="flex min-w-0 items-center gap-1 overflow-x-auto lg:gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `rounded-xl px-3 py-1.5 transition ${
                    isActive ? 'bg-forest-600 text-white' : 'hover:bg-forest-100 text-slate-700'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-1.5 transition ${
                    isActive ? 'bg-forest-600 text-white' : 'hover:bg-forest-100 text-slate-700'
                  }`
                }
              >
                Shop All
              </NavLink>
              <NavLink
                to="/category/fruits"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-1.5 transition ${
                    isActive ? 'bg-forest-600 text-white' : 'hover:bg-forest-100 text-slate-700'
                  }`
                }
              >
                🍎 Fresh Fruits
              </NavLink>
              <NavLink
                to="/category/vegetables"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-1.5 transition ${
                    isActive ? 'bg-forest-600 text-white' : 'hover:bg-forest-100 text-slate-700'
                  }`
                }
              >
                🥦 Fresh Vegetables
              </NavLink>
              <NavLink
                to="/category/dry-fruits"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-1.5 transition ${
                    isActive ? 'bg-forest-600 text-white' : 'hover:bg-forest-100 text-slate-700'
                  }`
                }
              >
                🥜 Premium Dry Fruits
              </NavLink>
              <NavLink
                to="/offers"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-1.5 transition ${
                    isActive ? 'bg-citrus-500 text-white' : 'text-citrus-600 hover:bg-citrus-50'
                  }`
                }
              >
                Offers & Coupons
              </NavLink>
              <NavLink
                to="/delivery-scheduling"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-1.5 transition ${
                    isActive ? 'bg-forest-600 text-white' : 'hover:bg-forest-100 text-slate-700'
                  }`
                }
              >
                Delivery Scheduling
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-1.5 transition ${
                    isActive ? 'bg-forest-600 text-white' : 'hover:bg-forest-100 text-slate-700'
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-1.5 transition ${
                    isActive ? 'bg-forest-600 text-white' : 'hover:bg-forest-100 text-slate-700'
                  }`
                }
              >
                Contact
              </NavLink>
              <NavLink
                to="/faq"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-1.5 transition ${
                    isActive ? 'bg-forest-600 text-white' : 'hover:bg-forest-100 text-slate-700'
                  }`
                }
              >
                FAQs
              </NavLink>
            </div>

            <div className="flex items-center gap-3">
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1 rounded-xl px-3 py-1.5 transition ${
                    isActive ? 'bg-forest-600 text-white' : 'hover:bg-forest-100 text-slate-700'
                  }`
                }
              >
                <Package className="h-3.5 w-3.5" />
                Track Orders
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto bg-white border-t border-slate-200 px-3 sm:px-4 py-3 sm:py-4 space-y-3"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fresh fruits, graded vegetables..."
                  className="w-full rounded-xl bg-cream-50 pl-9 pr-4 py-2 text-sm border border-slate-200"
                />
              </form>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-cream-100 p-2.5 text-slate-800"
                >
                  🏠 Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-cream-100 p-2.5 text-slate-800"
                >
                  🛒 Shop All
                </Link>
                <Link
                  to="/category/fruits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-forest-50 p-2.5 text-forest-900"
                >
                  🍎 Fresh Fruits
                </Link>
                <Link
                  to="/category/vegetables"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-forest-50 p-2.5 text-forest-900"
                >
                  🥦 Vegetables (Graded)
                </Link>
                <Link
                  to="/category/dry-fruits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-forest-50 p-2.5 text-forest-900"
                >
                  🥜 Premium Dry Fruits
                </Link>
                <Link
                  to="/offers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-citrus-50 p-2.5 text-citrus-600"
                >
                  🏷️ Coupons & Offers
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setPinInput(selectedPinCode);
                    setPinStatusMsg(null);
                    setPinModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl bg-forest-50 p-2.5 text-left text-forest-900"
                >
                  📍 Check Delivery PIN
                </button>
                <Link
                  to="/delivery-scheduling"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-cream-100 p-2.5 text-slate-800"
                >
                  ⏰ Delivery Slots
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-cream-100 p-2.5 text-slate-800"
                >
                  📦 My Orders
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-cream-100 p-2.5 text-slate-800"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-cream-100 p-2.5 text-slate-800"
                >
                  Contact
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-cream-100 p-2.5 text-slate-800"
                >
                  FAQs
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* PIN Code Serviceability Modal */}
      <AnimatePresence>
        {pinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      Check Delivery PIN Code
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verify farm-to-doorstep serviceability & ETA
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPinModalOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCheckPin} className="flex gap-2">
                <input
                  type="text"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 6-digit PIN code (e.g. 560034)"
                  maxLength={6}
                  className="flex-1 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold focus:border-forest-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-forest-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-forest-700 transition"
                >
                  Verify
                </button>
              </form>

              {pinStatusMsg && (
                <div
                  className={`mt-4 flex items-start gap-2.5 rounded-2xl p-3.5 text-xs ${
                    pinStatusMsg.ok
                      ? 'bg-forest-50 text-forest-900 border border-forest-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {pinStatusMsg.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-forest-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span>{pinStatusMsg.text}</span>
                </div>
              )}

              <div className="mt-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quick Select Serviceable Green Hubs:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {pinCodesList.map((p) => (
                    <button
                      key={p.pincode}
                      type="button"
                      onClick={async () => {
                        setPinInput(p.pincode);
                        const res = await checkPinServiceability(p.pincode);
                        setPinStatusMsg({ ok: res.serviceable, text: res.message });
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition ${
                        selectedPinCode === p.pincode
                          ? 'bg-forest-700 text-white border-forest-700'
                          : 'bg-cream-50 text-slate-700 border-slate-200 hover:border-forest-400'
                      }`}
                    >
                      {p.city} ({p.pincode})
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden items-center justify-around bg-white/95 py-2 px-2 border-t border-slate-200 backdrop-blur-md shadow-lg">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              isActive ? 'text-forest-600' : 'text-slate-500'
            }`
          }
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              isActive ? 'text-forest-600' : 'text-slate-500'
            }`
          }
        >
          <Store className="h-5 w-5" />
          <span>Shop</span>
        </NavLink>
        <NavLink
          to="/delivery-scheduling"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              isActive ? 'text-forest-600' : 'text-slate-500'
            }`
          }
        >
          <CalendarClock className="h-5 w-5" />
          <span>Slots</span>
        </NavLink>
        <button
          type="button"
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-[10px] font-semibold text-forest-700"
        >
          <ShoppingBasket className="h-5 w-5" />
          <span>Basket ({cartCount})</span>
        </button>
        <NavLink
          to={user ? '/account' : '/auth'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              isActive ? 'text-forest-600' : 'text-slate-500'
            }`
          }
        >
          <UserIcon className="h-5 w-5" />
          <span>{user ? 'Account' : 'Login'}</span>
        </NavLink>
      </div>

      {/* Global Toast Notifications */}
      <div className="fixed bottom-16 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={`pointer-events-auto flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-semibold text-white shadow-xl ${
                t.type === 'error'
                  ? 'bg-rose-600'
                  : t.type === 'info'
                  ? 'bg-slate-900'
                  : 'bg-forest-800 border border-forest-500'
              }`}
            >
              <Sparkles className="h-4 w-4 text-forest-300 shrink-0" />
              <span>{t.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};
