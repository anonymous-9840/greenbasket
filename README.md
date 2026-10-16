# 🌿 Green Basket — 3D Animated Online Grocery Shopping Platform

Green Basket is a full-stack, responsive 3D online grocery platform specializing in **Fresh Fruits**, **Fresh Vegetables (with an exclusive 3-Tier Grade A/B/C Grading System)**, and **Premium Dry Fruits**.

---

## ✨ Key Features

1. **Interactive 3D Hero & Category Scenes (Three.js + React Three Fiber + Drei)**
   - Rotating 3D woven fruit basket containing 3D apples, oranges, bananas, grapes, and strawberries.
   - Floating interactive 3D vegetables (carrots, tomatoes, broccoli, bell peppers) with mouse-following parallax and hover inspection tooltips.
   - Category-specific 3D banners and interactive 3D product previews on product detail pages.
   - Built-in **Reduced Motion Toggle** in the top navigation bar for accessibility and mobile optimization.

2. **Exclusive Vegetable Grading System (`Grade A`, `Grade B`, `Grade C`)**
   - Strictly enforced **ONLY** on Fresh Vegetables (`category === 'vegetables'`) on both frontend and backend.
   - **Grade A**: Premium quality, carefully selected vegetables.
   - **Grade B**: Standard quality vegetables.
   - **Grade C**: Budget-friendly vegetables.
   - Never displayed on Fresh Fruits or Premium Dry Fruits.

3. **Administrator-Controlled Daily Pricing & Price History**
   - Every product stores verified daily prices with timestamps and a full `priceHistory` log.
   - Admin updates immediately reflect across product listings, detail pages, and shopping carts.

4. **Secure Authentication & Customer Accounts**
   - Register with Full Name, Email, Phone Number, validated **Date of Birth** (editable in Account Settings, prohibited from being used as a password), and Password.
   - Sign in using Email or Phone Number via Password or OTP verification.
   - Includes Saved Delivery Addresses, Wishlist, Saved Coupons, Order History, and Delivery Preferences.

5. **Delivery Scheduling & PIN Code Serviceability**
   - Verify serviceability by PIN code (`560001`, `560034`, `400001`, `110001`, `500001`, `600001`, `411001`, `380001`).
   - 7-day calendar date picker + real-time capacity tracking for 2-hour slots (`7:00 AM – 9:00 AM`, `9:00 AM – 11:00 AM`, `11:00 AM – 1:00 PM`, `4:00 PM – 6:00 PM`, `6:00 PM – 8:00 PM`) + **45-Min Express Green Rider** option.

6. **Coupon Engine, Razorpay Payment Verification & 7-Stage Order Tracking**
   - Sample coupons: `GREEN10`, `FRESH50`, `FIRSTORDER`, `DRYFRUIT15`.
   - Supports UPI, Cards, NetBanking (via Razorpay order creation & HMAC-SHA256 signature verification), and Cash on Delivery (COD).
   - Animated 7-stage Order Tracking Timeline (`Order Placed` → `Order Confirmed` → `Preparing Your Basket` → `Packed` → `Out for Delivery` → `Delivered` / `Cancelled`) with rescheduling and cancellation support.

---

## 🚀 Quick Start Instructions

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Seed Sample Data (Optional — auto-seeds on first launch)
```bash
npm run seed
```

### 3. Start Backend & Frontend Concurrently
```bash
npm run dev
```
- **Frontend (Vite + React + Three.js)**: `http://localhost:5173`
- **Backend API (Express + Mongoose/Persistent Datastore)**: `http://localhost:5000`

### Deploying to Vercel

Vercel serves the frontend as static files and runs the Express API through `api/[...path].js`.
The function starts with the bundled `server/data/greenbasket_db.json`, so product listings work
without a separately hosted API server. Set `MONGODB_URI` in Vercel Project Settings to persist
admin changes, orders, and account data across serverless cold starts. Without it, API writes last
only for the lifetime of a warm function instance.

---

## 🔑 Demo Accounts

| Role | Login ID |
| :--- | :--- | :--- |
| **Customer** | `arjun@example.com` or `+919811122233` |
| **Administrator** | `admin` |

The administrator password is `admin@123`.

---

## ⚙️ Environment Variables & Third-Party Integrations (`.env`)

Copy `.env.example` to `.env` to configure external services:
- `MONGODB_URI`: Connects automatically to MongoDB (`mongodb://127.0.0.1:27017/greenbasket`) when running, and seamlessly persists to `server/data/greenbasket_db.json` when `mongod` is not running locally.
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Configure live/test keys from the [Razorpay Dashboard](https://dashboard.razorpay.com). Works out-of-the-box in Verified Test Mode without exposing secrets to the frontend.
- `SMTP_HOST` / `SMS_PROVIDER_API_KEY`: Optional notification credentials for production SMS/Email OTPs (a demo OTP banner + universal code `123456` is enabled in development).
