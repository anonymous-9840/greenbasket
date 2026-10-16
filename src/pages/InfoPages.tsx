import React, { useState } from 'react';
import {
  Leaf,
  ShieldCheck,
  Truck,
  PhoneCall,
  Mail,
  MapPin,
  HelpCircle,
  Send,
  CheckCircle2,
  FileText,
  RefreshCcw,
  Lock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => (
  <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
    <div className="rounded-3xl bg-gradient-to-r from-forest-950 via-forest-900 to-emerald-950 p-8 sm:p-12 text-white shadow-xl space-y-4">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-3.5 py-1 text-xs font-bold text-forest-300">
        <Leaf className="h-4 w-4" />
        Our Farm-to-Doorstep Mission
      </span>
      <h1 className="font-display text-3xl sm:text-5xl font-extrabold">About Green Basket</h1>
      <p className="text-sm sm:text-base text-forest-100/90 max-w-2xl leading-relaxed">
        Green Basket was founded with a simple promise: bring orchard-fresh fruits, transparently
        graded farm vegetables, and nitrogen-sealed artisanal dry fruits directly from Indian
        farmers to your kitchen table within hours of harvest.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft border border-slate-200/80 space-y-2">
        <ShieldCheck className="h-8 w-8 text-forest-600" />
        <h3 className="font-display text-lg font-bold text-slate-900">
          Honest Vegetable Grading
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          We pioneered our 3-Tier Vegetable Grading System (Grade A Premium, Grade B Standard, Grade
          C Budget-Friendly) exclusively for vegetables so every household can shop according to
          their recipe and budget.
        </p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-soft border border-slate-200/80 space-y-2">
        <Truck className="h-8 w-8 text-forest-600" />
        <h3 className="font-display text-lg font-bold text-slate-900">
          Zero-Plastic Cold Chain
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Every order is packed in breathable eco-paper crates and dispatched in temperature-controlled
          electric vans during your scheduled 2-hour delivery window.
        </p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-soft border border-slate-200/80 space-y-2">
        <Leaf className="h-8 w-8 text-forest-600" />
        <h3 className="font-display text-lg font-bold text-slate-900">
          1,200+ Partner Farmers
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          From apple orchards in Shopian to organic polyhouses in Ooty, Nashik, and Ratnagiri, our
          daily pricing system guarantees fair farmgate returns and transparent retail rates.
        </p>
      </div>
    </div>
  </div>
);

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Thank you! Our Green Basket Care team has received your message.', 'success');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Contact Green Basket</h1>
        <p className="text-xs text-slate-500 mt-1">
          Questions about your scheduled slot, vegetable grade, or bulk dry fruit order? We are
          here 7 AM – 10 PM daily.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 rounded-3xl bg-forest-950 p-6 sm:p-8 text-white space-y-6">
          <h2 className="font-display text-xl font-bold">Customer Support Hubs</h2>
          <div className="space-y-4 text-xs text-forest-200">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-forest-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Bengaluru Headquarters & Fresh Hub</p>
                <p>42 Green Basket Organic Park, 100 Feet Road, Indiranagar, Bengaluru 560001</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PhoneCall className="h-5 w-5 text-forest-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Toll-Free Freshness Helpline</p>
                <p>1800-419-GREEN • +91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-forest-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Email Support</p>
                <p>care@greenbasket.in • partners@greenbasket.in</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-slate-200/80">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="mx-auto h-12 w-12 text-forest-600" />
              <h3 className="font-display text-xl font-bold text-slate-900">
                Inquiry Received!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                We have logged your ticket for <strong>{form.email}</strong> and will respond within
                30 minutes.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', phone: '', subject: '', message: '' });
                }}
                className="rounded-xl bg-forest-600 px-5 py-2 text-xs font-bold text-white"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Topic *</label>
                  <input
                    type="text"
                    placeholder="e.g. Delivery Slot / Quality Feedback"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-forest-600 px-6 py-3 font-bold text-white hover:bg-forest-700"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const faqs = [
    {
      q: 'How does the Vegetable Grading System (Grade A, B, C) work?',
      a: 'Our grading system applies strictly and exclusively to Fresh Vegetables. Grade A offers hand-selected uniform premium vegetables ideal for salads; Grade B provides standard everyday kitchen vegetables; Grade C offers budget-friendly vegetables perfect for curries, soups, and purees. Fruits and Dry Fruits never display vegetable grades.',
    },
    {
      q: 'How often are product prices updated on Green Basket?',
      a: 'Our store administrators update product prices daily based on actual morning farm harvest arrivals. Every product card and detail page displays the exact timestamp of the latest price update and maintains a verifiable price history.',
    },
    {
      q: 'Can I schedule my delivery date and specific time slot?',
      a: 'Yes! You can select a delivery date up to 7 days in advance and pick from 2-hour slots (7–9 AM, 9–11 AM, 11 AM–1 PM, 4–6 PM, 6–8 PM) or choose 45-Minute Express Green Rider delivery where serviceable.',
    },
    {
      q: 'How is my Date of Birth used during registration?',
      a: 'Date of Birth is collected to verify customer age eligibility and offer birthday basket rewards. It is editable in your Account Settings and is strictly prohibited from being used as a password or authentication secret.',
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking via Razorpay signature verification, and Cash on Delivery (COD).',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <div className="flex items-center gap-3">
        <HelpCircle className="h-8 w-8 text-forest-600" />
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-slate-500">
            Everything you need to know about vegetable grades, daily pricing, slots, and coupons
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white p-6 shadow-soft border border-slate-200/80 space-y-2"
          >
            <h3 className="font-display text-base font-bold text-slate-900">{f.q}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => (
  <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
    <div className="flex items-center gap-3">
      <Lock className="h-8 w-8 text-forest-600" />
      <h1 className="font-display text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
    </div>
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
      <p>
        <strong>1. Personal Data Protection:</strong> Green Basket collects your full name, verified
        email address, phone number, Date of Birth, and delivery addresses solely to fulfill grocery
        orders and provide personalized customer support.
      </p>
      <p>
        <strong>2. Date of Birth Security:</strong> Your Date of Birth is validated during
        registration, stored securely, and never exposed publicly or permitted to be used as an
        authentication secret or password.
      </p>
      <p>
        <strong>3. Payment Security:</strong> All digital payments (UPI, Cards, NetBanking) are
        processed through Razorpay using cryptographic HMAC-SHA256 signature verification. Green
        Basket never stores raw card numbers or UPI PINs on its servers.
      </p>
    </div>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
    <div className="flex items-center gap-3">
      <FileText className="h-8 w-8 text-forest-600" />
      <h1 className="font-display text-3xl font-extrabold text-slate-900">
        Terms and Conditions
      </h1>
    </div>
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
      <p>
        <strong>1. Daily Pricing Policy:</strong> Product prices are updated daily by authorized
        administrators. The price displayed in your cart at the time of checkout verification is
        final and binding.
      </p>
      <p>
        <strong>2. Vegetable Grading Accuracy:</strong> Grade A, Grade B, and Grade C classifications
        apply strictly to Fresh Vegetables. Customers may select their preferred grade prior to
        checkout.
      </p>
      <p>
        <strong>3. Delivery Scheduling & Rescheduling:</strong> Orders can be rescheduled or
        cancelled free of charge prior to the order status reaching "Out for Delivery".
      </p>
    </div>
  </div>
);

export const RefundPolicyPage: React.FC = () => (
  <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
    <div className="flex items-center gap-3">
      <RefreshCcw className="h-8 w-8 text-forest-600" />
      <h1 className="font-display text-3xl font-extrabold text-slate-900">
        Return and Refund Policy
      </h1>
    </div>
    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
      <p>
        <strong>1. 100% Doorstep Freshness Guarantee:</strong> If any fruit, graded vegetable, or
        dry fruit pack does not meet the promised freshness or selected grade at delivery, you can
        return it immediately at the doorstep for an instant replacement or full refund.
      </p>
      <p>
        <strong>2. Order Cancellation Refunds:</strong> When a prepaid order is cancelled before
        dispatch, our backend automatically marks the payment status as <em>Refunded</em> and
        initiates reversal to your original UPI / Card / NetBanking account within 2–4 business
        days.
      </p>
    </div>
  </div>
);
