import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Zap,
  CheckCircle2,
  ShieldAlert,
  Truck,
  ArrowRight,
  Users,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const DeliverySchedulingPage: React.FC = () => {
  const {
    selectedDeliveryDate,
    setSelectedDeliveryDate,
    deliverySlots,
    selectedDeliverySlot,
    setSelectedDeliverySlot,
    selectedPinCode,
    pinInfo,
    pinCodesList,
    checkPinServiceability,
    showToast,
  } = useStore();

  const [pinInput, setPinInput] = useState(selectedPinCode);
  const [pinFeedback, setPinFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  // Generate 7-day calendar strip starting today
  const upcomingDates = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const iso = d.toISOString().split('T')[0];
      const dayName =
        i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' });
      const dateLabel = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      arr.push({ iso, dayName, dateLabel });
    }
    return arr;
  }, []);

  const handlePinCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await checkPinServiceability(pinInput);
    setPinFeedback({ ok: res.serviceable, text: res.message });
  };

  const standardSlots = deliverySlots.filter((s) => !s.isExpress);
  const expressSlots = deliverySlots.filter((s) => s.isExpress);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-forest-950 via-forest-900 to-emerald-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-3.5 py-1 text-xs font-bold text-forest-200">
            <Truck className="h-3.5 w-3.5 text-forest-400" />
            Precision Cold-Chain Slot Reservation
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold">
            Schedule Your Farm-Fresh Delivery
          </h1>
          <p className="text-xs sm:text-sm text-forest-100/85 leading-relaxed">
            Pick your preferred delivery date and 2-hour window, or choose 45-minute Express Green
            Rider delivery. We cap each slot’s capacity so your fruits and graded vegetables arrive
            crisp and on time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: PIN Code Serviceability & Express Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  1. Check PIN Code Serviceability
                </h2>
                <p className="text-xs text-slate-500">
                  Verify delivery charges, free threshold & Express ETA
                </p>
              </div>
            </div>

            <form onSubmit={handlePinCheck} className="flex gap-2">
              <input
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 6-digit PIN code"
                maxLength={6}
                className="flex-1 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-bold focus:border-forest-600 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-2xl bg-forest-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-forest-700 transition"
              >
                Check PIN
              </button>
            </form>

            {pinFeedback && (
              <div
                className={`flex items-start gap-2 rounded-2xl p-3 text-xs ${
                  pinFeedback.ok
                    ? 'bg-forest-50 text-forest-900 border border-forest-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {pinFeedback.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-forest-600 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{pinFeedback.text}</span>
              </div>
            )}

            {pinInfo && (
              <div className="rounded-2xl bg-cream-50 p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Hub:</span>
                  <strong className="text-slate-900">
                    {pinInfo.area}, {pinInfo.city} ({pinInfo.pincode})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard Delivery Fee:</span>
                  <strong className="text-forest-700">
                    ₹{pinInfo.deliveryCharge} (FREE above ₹{pinInfo.freeDeliveryMinOrder})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Express Delivery:</span>
                  <strong className="text-slate-900">
                    {pinInfo.expressAvailable
                      ? `Available (${pinInfo.expressEta} • +₹${pinInfo.expressCharge})`
                      : 'Scheduled Slots Only'}
                  </strong>
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Available Serviceable Hubs:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pinCodesList.map((p) => (
                  <button
                    key={p.pincode}
                    type="button"
                    onClick={async () => {
                      setPinInput(p.pincode);
                      const r = await checkPinServiceability(p.pincode);
                      setPinFeedback({ ok: r.serviceable, text: r.message });
                    }}
                    className={`rounded-xl px-2.5 py-1 text-xs font-semibold border transition ${
                      selectedPinCode === p.pincode
                        ? 'bg-forest-700 text-white border-forest-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-forest-400'
                    }`}
                  >
                    {p.city} {p.pincode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Selection Summary Card */}
          <div className="rounded-3xl bg-forest-900 p-6 text-white shadow-lg space-y-4">
            <h3 className="font-display text-lg font-bold">Your Reserved Delivery Window</h3>
            <div className="rounded-2xl bg-forest-800/90 p-4 border border-forest-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-forest-200">Delivery Date:</span>
                <strong className="text-white">{selectedDeliveryDate}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-200">Time Window:</span>
                <strong className="text-forest-300">
                  {selectedDeliverySlot ? selectedDeliverySlot.label : 'Select a slot'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-200">PIN Code:</span>
                <strong className="text-white">{selectedPinCode}</strong>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to="/shop"
                className="flex-1 rounded-2xl bg-white/10 py-3 text-center text-xs font-bold text-white hover:bg-white/20 transition"
              >
                Continue Shopping
              </Link>
              <Link
                to="/checkout"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-forest-500 py-3 text-xs font-bold text-forest-950 hover:bg-forest-400 transition"
              >
                <span>Go to Checkout</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Calendar Date Picker & Time Slots */}
        <div className="lg:col-span-7 space-y-6">
          {/* Date Picker */}
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  2. Choose Delivery Date
                </h2>
                <p className="text-xs text-slate-500">
                  Schedule for today or up to 7 days in advance
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {upcomingDates.map((d) => {
                const active = selectedDeliveryDate === d.iso;
                return (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => setSelectedDeliveryDate(d.iso)}
                    className={`flex flex-col items-center rounded-2xl p-3 text-center transition border ${
                      active
                        ? 'bg-forest-700 text-white border-forest-700 shadow-md'
                        : 'bg-cream-50 text-slate-700 border-slate-200 hover:border-forest-400'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        active ? 'text-forest-200' : 'text-slate-400'
                      }`}
                    >
                      {d.dayName}
                    </span>
                    <span className="mt-1 text-xs font-extrabold">{d.dateLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div className="rounded-3xl bg-white p-6 shadow-soft border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  3. Select Available Time Slot
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time slot capacity prevents overbooking and delays
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {standardSlots.map((slot) => {
                const isSelected = selectedDeliverySlot?.id === slot.id;
                const isDisabled = !slot.isAvailable;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      setSelectedDeliverySlot(slot);
                      showToast(`Selected slot: ${slot.label} on ${selectedDeliveryDate}`, 'success');
                    }}
                    className={`flex flex-col justify-between rounded-2xl p-4 text-left transition border ${
                      isSelected
                        ? 'bg-forest-800 text-white border-forest-800 shadow-md'
                        : isDisabled
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-cream-50/70 text-slate-800 border-slate-200 hover:border-forest-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold">{slot.label}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isSelected
                            ? 'bg-forest-600 text-white'
                            : isDisabled
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-forest-100 text-forest-800'
                        }`}
                      >
                        {isDisabled
                          ? slot.unavailableReason || 'Full'
                          : 'No Extra Fee'}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span
                        className={`flex items-center gap-1 ${
                          isSelected ? 'text-forest-200' : 'text-slate-500'
                        }`}
                      >
                        <Users className="h-3.5 w-3.5" />
                        Capacity: {slot.remainingCapacity}/{slot.maxCapacity} spots left
                      </span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-forest-300" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Express Delivery Option */}
            {expressSlots.length > 0 && pinInfo?.expressAvailable !== false && (
              <div className="pt-3 border-t border-slate-100">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-citrus-600 flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  Need It Immediately? Express Delivery
                </p>
                {expressSlots.map((slot) => {
                  const isSelected = selectedDeliverySlot?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => {
                        setSelectedDeliverySlot(slot);
                        showToast('Express 45-Min Green Rider selected!', 'success');
                      }}
                      className={`w-full flex items-center justify-between rounded-2xl p-4 text-left transition border ${
                        isSelected
                          ? 'bg-citrus-600 text-white border-citrus-600 shadow-md'
                          : 'bg-citrus-50/70 text-slate-900 border-citrus-400/50 hover:border-citrus-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-citrus-500 text-white'
                          }`}
                        >
                          <Zap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold">{slot.label}</p>
                          <p
                            className={`text-xs ${
                              isSelected ? 'text-citrus-100' : 'text-slate-600'
                            }`}
                          >
                            Priority dispatch within 45–60 mins • {slot.remainingCapacity} riders
                            available
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold">+₹{slot.extraCharge}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
