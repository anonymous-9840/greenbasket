import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  LogIn,
  KeyRound,
  Mail,
  Phone,
  Calendar,
  Lock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthPage: React.FC = () => {
  const { loginWithCredentials, registerUser, sendOtp, verifyOtp, showToast } = useStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Login State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoOtpBanner, setDemoOtpBanner] = useState<string | null>(null);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('1996-08-15');
  const [regPassword, setRegPassword] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [regOtpInput, setRegOtpInput] = useState('');

  // Forgot Password State
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSendOtp = async (targetIdentifier: string) => {
    setErrorMsg(null);
    if (!targetIdentifier.trim()) {
      setErrorMsg('Please enter an email address or phone number first.');
      return;
    }
    try {
      const res = await sendOtp(targetIdentifier.trim());
      setDemoOtpBanner(`Demo OTP for ${targetIdentifier}: ${res.demoOtp}`);
      showToast(`OTP Sent! Demo Code: ${res.demoOtp}`, 'info');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const loggedUser = await loginWithCredentials({
        identifier,
        password: loginMethod === 'password' ? password : undefined,
        otp: loginMethod === 'otp' ? otpCode : undefined,
      });
      navigate(loggedUser.role === 'admin' ? '/admin' : '/account');
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await registerUser({
        fullName: regName,
        email: regEmail,
        phone: regPhone,
        dob: regDob,
        password: regPassword,
      });
      navigate('/account');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: resetIdentifier,
          otp: resetOtp,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password reset failed');
      showToast(data.message, 'success');
      setMode('login');
      setIdentifier(resetIdentifier);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Brand & Demo Credentials Panel */}
        <div className="lg:col-span-5 rounded-3xl bg-forest-950 p-6 sm:p-8 text-white space-y-6 shadow-xl">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-3 py-1 text-xs font-bold text-forest-300">
              <ShieldCheck className="h-4 w-4" />
              Verified Account Security
            </span>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold">
              Welcome to Green Basket
            </h1>
            <p className="mt-2 text-xs text-forest-200/85 leading-relaxed">
              Sign in with your verified email address or phone number. Manage your Date of Birth,
              saved addresses, scheduled delivery slots, wishlist, and coupons in one place.
            </p>
          </div>

          <div className="rounded-2xl bg-forest-900 p-4 border border-forest-700 space-y-3">
            <p className="text-xs font-bold text-forest-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Customer Demo Sign In
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={async () => {
                  await loginWithCredentials({
                    identifier: 'arjun@example.com',
                    password: 'Customer@123',
                  });
                  navigate('/account');
                }}
                className="w-full rounded-xl bg-forest-600 py-2.5 px-4 text-left text-xs font-bold text-white hover:bg-forest-500 transition flex items-center justify-between"
              >
                <span>👤 Customer: Arjun Mehta</span>
                <span className="text-[10px] bg-forest-800 px-2 py-0.5 rounded">arjun@example.com                </span>
              </button>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-forest-200">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-forest-400 shrink-0" />
              <span>Email & Phone OTP Verification supported</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-forest-400 shrink-0" />
              <span>Protected Date of Birth registration & profile editing</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-forest-400 shrink-0" />
              <span>Persisted shopping basket & saved delivery addresses</span>
            </li>
          </ul>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-slate-200/80 space-y-6">
          {/* Mode Tabs */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-cream-100 p-1.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${
                mode === 'login' ? 'bg-forest-700 text-white shadow' : 'text-slate-600'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${
                mode === 'register' ? 'bg-forest-700 text-white shadow' : 'text-slate-600'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Register</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                setErrorMsg(null);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 transition ${
                mode === 'forgot' ? 'bg-forest-700 text-white shadow' : 'text-slate-600'
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Recovery</span>
            </button>
          </div>

          {errorMsg && (
            <div className="rounded-2xl bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 border border-rose-200">
              {errorMsg}
            </div>
          )}

          {demoOtpBanner && (
            <div className="rounded-2xl bg-forest-50 p-3.5 text-xs font-bold text-forest-900 border border-forest-200">
              🔑 {demoOtpBanner} (or use universal test OTP <span className="underline">123456</span>)
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address or Phone Number
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="arjun@example.com or +919811122233"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 rounded-xl py-2 font-bold border ${
                    loginMethod === 'password'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-cream-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Use Password
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`flex-1 rounded-xl py-2 font-bold border ${
                    loginMethod === 'otp'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-cream-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Use Phone / Email OTP
                </button>
              </div>

              {loginMethod === 'password' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-forest-600 focus:outline-none"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit OTP (or 123456)"
                      className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleSendOtp(identifier)}
                      className="rounded-xl bg-forest-100 px-4 py-2.5 font-bold text-forest-800 hover:bg-forest-200"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-forest-600 py-3.5 text-sm font-bold text-white shadow-glow hover:bg-forest-700 transition"
              >
                {submitting ? 'Signing In...' : 'Sign In to Green Basket'}
              </button>
            </form>
          )}

          {/* 2. REGISTER FORM WITH DATE OF BIRTH & OTP VERIFICATION */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    <Mail className="inline h-3.5 w-3.5 mr-1 text-forest-600" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    <Phone className="inline h-3.5 w-3.5 mr-1 text-forest-600" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 12345"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Optional Instant OTP Verification Box */}
              <div className="rounded-2xl bg-cream-50 p-3 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">
                    Phone / Email OTP Verification
                  </span>
                  {phoneVerified ? (
                    <span className="text-forest-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp(regPhone || regEmail)}
                      className="text-forest-700 font-bold underline"
                    >
                      Send OTP Code
                    </button>
                  )}
                </div>
                {!phoneVerified && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={regOtpInput}
                      onChange={(e) => setRegOtpInput(e.target.value)}
                      placeholder="Enter OTP (or 123456)"
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const ok = await verifyOtp(
                            regPhone || regEmail || 'demo',
                            regOtpInput || '123456'
                          );
                          if (ok) {
                            setPhoneVerified(true);
                            showToast('Phone/Email OTP verified!', 'success');
                          }
                        } catch (err: any) {
                          setErrorMsg(err.message);
                        }
                      }}
                      className="rounded-xl bg-slate-900 px-3.5 py-1.5 font-bold text-white"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    <Calendar className="inline h-3.5 w-3.5 mr-1 text-forest-600" />
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={regDob}
                    max="2013-01-01"
                    onChange={(e) => setRegDob(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold"
                    required
                  />
                  <span className="text-[10px] text-slate-400">
                    Editable anytime in Account Settings. Never used as password.
                  </span>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    <Lock className="inline h-3.5 w-3.5 mr-1 text-forest-600" />
                    Create Password *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-forest-600 py-3.5 text-sm font-bold text-white shadow-glow hover:bg-forest-700 transition"
              >
                {submitting ? 'Creating Account...' : 'Create Green Basket Account'}
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD & RECOVERY */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Registered Email or Phone Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    placeholder="arjun@example.com"
                    className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleSendOtp(resetIdentifier)}
                    className="rounded-xl bg-forest-100 px-4 py-2.5 font-bold text-forest-800"
                  >
                    Get OTP
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Verification OTP</label>
                <input
                  type="text"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP (or 123456)"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-forest-600 py-3.5 text-sm font-bold text-white hover:bg-forest-700 transition"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
