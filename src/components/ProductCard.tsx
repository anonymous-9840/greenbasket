import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingBasket,
  Star,
  Sparkles,
  Clock,
  Check,
  Plus,
  Minus,
  ShieldCheck,
} from 'lucide-react';
import { Product, VegetableGradeType } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, reducedMotion } = useStore();

  // STRICT INVARIANT: Vegetable grading ONLY exists for category === 'vegetables'
  const isVegetable = product.category === 'vegetables' && Array.isArray(product.vegetableGrades) && product.vegetableGrades.length > 0;

  const [selectedGrade, setSelectedGrade] = useState<VegetableGradeType>('Grade A');
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  // Resolve active price, stock, and freshness based on whether it's a vegetable
  const activeGradeOption = isVegetable
    ? product.vegetableGrades!.find((g) => g.grade === selectedGrade) || product.vegetableGrades![0]
    : null;

  const displayPrice = activeGradeOption ? activeGradeOption.price : product.price;
  const displayOriginalPrice = activeGradeOption
    ? activeGradeOption.originalPrice
    : product.originalPrice;
  const displayStock = activeGradeOption ? activeGradeOption.stock : product.stock;
  const displayFreshness = activeGradeOption ? activeGradeOption.freshness : product.freshnessInfo;

  const discountPercent =
    displayOriginalPrice > displayPrice
      ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
      : 0;

  const isWishlisted = wishlist.includes(product.id);
  const outOfStock = displayStock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(product, quantity, isVegetable ? selectedGrade : null);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const formattedTime = new Date(product.priceUpdatedAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      whileHover={reducedMotion ? {} : { y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between rounded-3xl bg-white p-4 shadow-soft border border-slate-100 hover:border-forest-300 transition-all"
    >
      <div>
        {/* Image & Badges Container */}
        <div className="relative mb-3.5 h-48 w-full overflow-hidden rounded-2xl bg-cream-100">
          <Link to={`/product/${product.id}`} className="block h-full w-full">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Top Left Badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
            {discountPercent > 0 && (
              <span className="rounded-full bg-citrus-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            {product.isOrganic && (
              <span className="flex items-center gap-1 rounded-full bg-forest-900/90 px-2.5 py-0.5 text-[10px] font-semibold text-forest-200 backdrop-blur-sm">
                <Sparkles className="h-2.5 w-2.5 text-forest-400" />
                Organic
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label="Toggle Wishlist"
            className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-md transition ${
              isWishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-slate-600 hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Daily Price Timestamp Pill */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-medium text-slate-700 backdrop-blur-sm shadow-sm">
              <Clock className="h-2.5 w-2.5 text-forest-600" />
              Rate updated {formattedTime}
            </span>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50/95 px-2 py-0.5 text-[11px] font-bold text-amber-700 shadow-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Category & Title */}
        <div className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-forest-700">
          <span>
            {product.category === 'fruits'
              ? 'Fresh Fruits'
              : product.category === 'vegetables'
              ? 'Fresh Vegetables'
              : 'Premium Dry Fruits'}
          </span>
          <span
            className={`font-semibold ${
              outOfStock
                ? 'text-rose-600'
                : displayStock <= 15
                ? 'text-citrus-600'
                : 'text-forest-600'
            }`}
          >
            {outOfStock ? 'Out of Stock' : `${displayStock} in stock`}
          </span>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="line-clamp-1 font-display text-base font-bold text-slate-900 hover:text-forest-700 transition"
        >
          {product.name}
        </Link>

        {/* Freshness Info */}
        <p className="mt-1 line-clamp-1 text-xs text-slate-500" title={displayFreshness}>
          {displayFreshness}
        </p>

        {/* VEGETABLE GRADING SELECTOR — STRICTLY RENDERED ONLY FOR VEGETABLES */}
        {isVegetable && (
          <div className="mt-3 rounded-2xl bg-forest-50/80 p-2 border border-forest-200/80">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 font-bold text-forest-900">
                <ShieldCheck className="h-3.5 w-3.5 text-forest-600" />
                Select Vegetable Grade:
              </span>
              <span className="font-medium text-forest-700">
                {selectedGrade === 'Grade A'
                  ? 'Premium Pick'
                  : selectedGrade === 'Grade B'
                  ? 'Standard'
                  : 'Budget Value'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {product.vegetableGrades!.map((g) => {
                const isSelected = selectedGrade === g.grade;
                const isGradeOut = g.stock <= 0;
                return (
                  <button
                    key={g.grade}
                    type="button"
                    disabled={isGradeOut}
                    onClick={() => setSelectedGrade(g.grade)}
                    className={`flex flex-col items-center rounded-xl py-1.5 px-1 text-center transition border ${
                      isSelected
                        ? 'bg-forest-700 text-white border-forest-700 shadow-sm'
                        : isGradeOut
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-white text-slate-700 border-forest-200 hover:border-forest-500'
                    }`}
                  >
                    <span className="text-[11px] font-bold leading-tight">{g.grade}</span>
                    <span
                      className={`text-[10px] font-semibold ${
                        isSelected ? 'text-forest-100' : 'text-forest-700'
                      }`}
                    >
                      ₹{g.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Price, Quantity Selector & Add to Cart */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-xl font-extrabold text-slate-900">
                ₹{displayPrice}
              </span>
              {displayOriginalPrice > displayPrice && (
                <span className="text-xs text-slate-400 line-through">₹{displayOriginalPrice}</span>
              )}
            </div>
            <span className="text-xs font-medium text-slate-500">per {product.unit}</span>
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center rounded-xl bg-cream-100 border border-slate-200 px-1 py-0.5">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-700 hover:bg-white transition"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-slate-800">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(displayStock || 10, q + 1))}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-700 hover:bg-white transition"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={outOfStock}
          onClick={handleAdd}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 px-4 text-sm font-bold transition shadow-sm ${
            outOfStock
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : justAdded
              ? 'bg-forest-800 text-white'
              : 'bg-forest-600 text-white hover:bg-forest-700 active:scale-[0.99]'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" />
              <span>Added to Basket!</span>
            </>
          ) : (
            <>
              <ShoppingBasket className="h-4 w-4" />
              <span>
                Add {isVegetable ? `(${selectedGrade})` : ''} • ₹{displayPrice * quantity}
              </span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
