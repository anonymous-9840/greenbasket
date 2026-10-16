import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBasket,
  PhoneCall,
  Mail,
  MapPin,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-cream-100 border-t border-forest-900 pb-20 md:pb-8">
      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-600 text-white">
              <ShoppingBasket className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-extrabold text-white">
              Green <span className="text-forest-400">Basket</span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-forest-200/80 max-w-sm">
            India’s modern 3D interactive online grocery destination specializing in orchard-fresh
            fruits, quality-graded farm vegetables, and artisanal dry fruits delivered in breathable
            eco-packaging.
          </p>
          <div className="space-y-1.5 text-xs text-forest-200">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-forest-400" />
              42 Green Basket Organic Park, Indiranagar, Bengaluru 560001
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-forest-400" />
              1800-419-GREEN (+91 98765 43210)
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-forest-400" />
              care@greenbasket.in
            </p>
          </div>
        </div>

        {/* Shop Categories */}
        <div>
          <h4 className="font-display text-sm font-bold text-white mb-3">Shop Categories</h4>
          <ul className="space-y-2 text-xs text-forest-200/80">
            <li>
              <Link to="/shop" className="hover:text-white transition">
                Shop All Groceries
              </Link>
            </li>
            <li>
              <Link to="/category/fruits" className="hover:text-white transition">
                Fresh Fruits
              </Link>
            </li>
            <li>
              <Link to="/category/vegetables" className="hover:text-white transition">
                Fresh Vegetables (Grade A/B/C)
              </Link>
            </li>
            <li>
              <Link to="/category/dry-fruits" className="hover:text-white transition">
                Premium Dry Fruits
              </Link>
            </li>
            <li>
              <Link to="/offers" className="hover:text-white transition">
                Offers & Discount Coupons
              </Link>
            </li>
            <li>
              <Link to="/delivery-scheduling" className="hover:text-white transition">
                Delivery Slot Scheduler
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Account */}
        <div>
          <h4 className="font-display text-sm font-bold text-white mb-3">My Green Basket</h4>
          <ul className="space-y-2 text-xs text-forest-200/80">
            <li>
              <Link to="/auth" className="hover:text-white transition">
                Login / Register
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-white transition">
                My Account & Saved Addresses
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-white transition">
                My Orders & Live Tracking
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-white transition">
                My Wishlist
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white transition">
                Shopping Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Policies */}
        <div>
          <h4 className="font-display text-sm font-bold text-white mb-3">Company & Policies</h4>
          <ul className="space-y-2 text-xs text-forest-200/80">
            <li>
              <Link to="/about" className="hover:text-white transition">
                About Green Basket
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white transition">
                FAQs & Grading Guide
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-white transition">
                Return & Refund Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mx-auto max-w-7xl px-4 pt-6 border-t border-forest-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-forest-300/70">
        <p>© {new Date().getFullYear()} Green Basket Organic Retail Pvt. Ltd. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-forest-900 px-2.5 py-1 text-[11px] font-semibold text-forest-200">
            Razorpay UPI
          </span>
          <span className="rounded-lg bg-forest-900 px-2.5 py-1 text-[11px] font-semibold text-forest-200">
            Visa / MasterCard / RuPay
          </span>
          <span className="rounded-lg bg-forest-900 px-2.5 py-1 text-[11px] font-semibold text-forest-200">
            NetBanking
          </span>
          <span className="rounded-lg bg-forest-900 px-2.5 py-1 text-[11px] font-semibold text-forest-200">
            Cash on Delivery
          </span>
        </div>
      </div>
    </footer>
  );
};
