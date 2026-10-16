import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  MapPin,
  Heart,
  Tag,
  Calendar,
  LogOut,
  CheckCircle2,
  Plus,
  Trash2,
  Package,
  Sliders,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Address } from '../types';

export const AccountPage: React.FC = () => {
  const {
    user,
    logout,
    updateUserProfile,
    loginWithCredentials,
    wishlist,
    products,
    coupons,
    applyCoupon,
    deliverySlots,
    showToast,
  } = useStore();

  const location = useLocation();
  const navigate = useNavigate();

  const isWishlistRoute = location.pathname === '/wishlist';
  const [activeSection, setActiveSection] = useState<'profile' | 'addresses' | 'wishlist' | 'preferences'>(
    isWishlistRoute ? 'wishlist' : 'profile'
  );

  useEffect(() => {
    if (location.pathname === '/wishlist') {
      setActiveSection('wishlist');
    }
  }, [location.pathname]);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '1995-06-15');

  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
  });

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone);
      setDob(user.dob);
    }
  }, [user]);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  // If guest visits /wishlist, show wishlist directly; if guest visits /account, offer 1-click demo login
  if (!user && !isWishlistRoute) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest-100 text-forest-700">
          <UserIcon className="h-10 w-10" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900">
          Sign in to Manage Your Green Basket Account
        </h1>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Access your editable Date of Birth, saved delivery addresses, coupons, wishlist, and
          delivery preferences.
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
            Demo Customer Login
          </button>
          <Link
            to="/auth"
            className="rounded-2xl bg-white px-6 py-3 text-xs font-bold text-slate-800 border border-slate-300"
          >
            Login / Register
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile({ fullName, phone, dob });
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const addr: Address = {
      id: `addr-${Date.now()}`,
      ...newAddress,
      isDefault: user.addresses.length === 0,
    };
    await updateUserProfile({ addresses: [...user.addresses, addr] });
    setNewAddress({ ...newAddress, line1: '', line2: '' });
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    await updateUserProfile({
      addresses: user.addresses.filter((a) => a.id !== id),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            {isWishlistRoute ? 'My Saved Wishlist' : `Hello, ${user?.fullName || 'Green Shopper'}`}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage personal details, Date of Birth, saved addresses, coupons & delivery preferences
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-forest-700 px-4 py-2 text-xs font-bold text-white hover:bg-forest-800"
            >
              <Package className="h-4 w-4" />
              <span>My Orders</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      {user && (
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
          {[
            { id: 'profile', label: 'Personal Profile & DOB', icon: UserIcon },
            { id: 'addresses', label: `Saved Addresses (${user.addresses.length})`, icon: MapPin },
            { id: 'wishlist', label: `Wishlist (${wishlistedProducts.length})`, icon: Heart },
            { id: 'preferences', label: 'Coupons & Delivery Preferences', icon: Sliders },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveSection(t.id as typeof activeSection)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 transition ${
                  activeSection === t.id
                    ? 'bg-forest-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-forest-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* SECTION 1: PROFILE & EDITABLE DATE OF BIRTH */}
      {user && activeSection === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleSaveProfile}
            className="lg:col-span-7 rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-4 text-xs"
          >
            <h2 className="font-display text-lg font-bold text-slate-900">
              Account Information & Date of Birth
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Verified Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  <Calendar className="inline h-3.5 w-3.5 mr-1 text-forest-600" />
                  Date of Birth (Editable)
                </label>
                <input
                  type="date"
                  value={dob}
                  max="2013-01-01"
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-3 py-1 font-bold text-forest-800 border border-forest-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-forest-600" /> Email Verified
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-3 py-1 font-bold text-forest-800 border border-forest-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-forest-600" /> Phone OTP Verified
              </span>
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-forest-600 px-6 py-3 text-xs font-bold text-white hover:bg-forest-700 transition"
            >
              Save Profile Changes
            </button>
          </form>

          {/* Saved Coupons Summary */}
          <div className="lg:col-span-5 rounded-3xl bg-white p-6 shadow-soft border border-slate-200/80 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">Your Saved Coupons</h3>
            <div className="space-y-2.5">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-2xl bg-cream-50 p-3.5 border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-mono font-extrabold text-citrus-600">{c.code}</span>
                    <p className="font-bold text-slate-800 mt-0.5">{c.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => applyCoupon(c.code)}
                    className="rounded-xl bg-slate-900 px-3.5 py-1.5 font-bold text-white hover:bg-forest-700"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SAVED DELIVERY ADDRESSES */}
      {user && activeSection === 'addresses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Saved Delivery Addresses
            </h2>
            {user.addresses.length === 0 ? (
              <p className="text-xs text-slate-500">No saved addresses yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="rounded-3xl bg-white p-5 shadow-soft border border-slate-200/80 flex flex-col justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-lg bg-forest-100 px-2.5 py-0.5 font-bold text-forest-800">
                          {addr.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-2 font-bold text-slate-900">{addr.fullName}</p>
                      <p className="text-slate-600 mt-0.5">
                        {addr.line1}, {addr.line2 ? `${addr.line2}, ` : ''}
                        {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                      <p className="text-slate-500 mt-1">Phone: {addr.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleAddAddress}
            className="lg:col-span-5 rounded-3xl bg-white p-6 shadow-soft border border-slate-200/80 space-y-3 text-xs"
          >
            <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-forest-600" />
              Add New Address
            </h3>
            <input
              type="text"
              placeholder="Label (Home / Work)"
              value={newAddress.label}
              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Recipient Full Name"
              value={newAddress.fullName}
              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Flat / House No. / Building *"
              value={newAddress.line1}
              onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="rounded-xl border border-slate-300 px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="PIN Code (e.g. 560034)"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                maxLength={6}
                className="rounded-xl border border-slate-300 px-3 py-2 font-bold"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-forest-600 py-3 font-bold text-white hover:bg-forest-700"
            >
              Save Address
            </button>
          </form>
        </div>
      )}

      {/* SECTION 3: WISHLIST */}
      {(activeSection === 'wishlist' || isWishlistRoute) && (
        <div className="space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center space-y-3 border border-slate-100">
              <p className="font-display text-lg font-bold text-slate-800">
                Your Wishlist is Empty
              </p>
              <Link
                to="/shop"
                className="inline-block rounded-2xl bg-forest-600 px-6 py-2.5 text-xs font-bold text-white"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: DELIVERY PREFERENCES */}
      {user && activeSection === 'preferences' && (
        <div className="max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-5 text-xs">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Default Delivery Preferences
          </h2>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Preferred Delivery Time Slot
            </label>
            <select
              value={user.deliveryPreferences?.preferredSlotId || 'slot-morning-1'}
              onChange={(e) =>
                updateUserProfile({
                  deliveryPreferences: {
                    ...user.deliveryPreferences,
                    preferredSlotId: e.target.value,
                  },
                })
              }
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-semibold"
            >
              {deliverySlots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={user.deliveryPreferences?.ecoPackaging ?? true}
                onChange={(e) =>
                  updateUserProfile({
                    deliveryPreferences: {
                      ...user.deliveryPreferences,
                      ecoPackaging: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 accent-forest-600 rounded"
              />
              <span className="font-semibold text-slate-800">
                Use 100% Zero-Plastic Breathable Eco-Paper Crates
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={user.deliveryPreferences?.callBeforeDelivery ?? true}
                onChange={(e) =>
                  updateUserProfile({
                    deliveryPreferences: {
                      ...user.deliveryPreferences,
                      callBeforeDelivery: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 accent-forest-600 rounded"
              />
              <span className="font-semibold text-slate-800">
                Call me when the Green Rider reaches my gate
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
