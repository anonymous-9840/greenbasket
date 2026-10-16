import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBasket,
  Heart,
  Star,
  Clock,
  ShieldCheck,
  MapPin,
  Box,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Minus,
  History,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductPreview3D } from '../components/three/CategoryScene3D';
import { ProductCard } from '../components/ProductCard';
import { VegetableGradeType } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
    reducedMotion,
    selectedPinCode,
    pinInfo,
    checkPinServiceability,
    selectedDeliveryDate,
    selectedDeliverySlot,
  } = useStore();

  const product = products.find((p) => p.id === id || p.slug === id);

  const [view3D, setView3D] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<VegetableGradeType>('Grade A');
  const [quantity, setQuantity] = useState(1);
  const [pinInput, setPinInput] = useState(selectedPinCode);
  const [pinMsg, setPinMsg] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedGrade('Grade A');
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-slate-800">Product not found</h2>
        <Link
          to="/shop"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-forest-600 px-5 py-2.5 text-xs font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </div>
    );
  }

  // STRICT RULE: Vegetable grades ONLY for category === 'vegetables'
  const isVegetable =
    product.category === 'vegetables' &&
    Array.isArray(product.vegetableGrades) &&
    product.vegetableGrades.length > 0;

  const activeGradeObj = isVegetable
    ? product.vegetableGrades!.find((g) => g.grade === selectedGrade) || product.vegetableGrades![0]
    : null;

  const currentPrice = activeGradeObj ? activeGradeObj.price : product.price;
  const currentOrigPrice = activeGradeObj ? activeGradeObj.originalPrice : product.originalPrice;
  const currentStock = activeGradeObj ? activeGradeObj.stock : product.stock;
  const currentFreshness = activeGradeObj ? activeGradeObj.freshness : product.freshnessInfo;

  const isWishlisted = wishlist.includes(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handlePinCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await checkPinServiceability(pinInput);
    setPinMsg(res.message);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-forest-700">
          Home
        </Link>
        <span>/</span>
        <Link to={`/category/${product.category}`} className="hover:text-forest-700 capitalize">
          {product.category.replace('-', ' ')}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Photo & Interactive 3D Preview Toggle */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative overflow-hidden rounded-3xl bg-white p-3 shadow-soft border border-slate-200/80">
            {view3D ? (
              <ProductPreview3D
                modelType={product.model3dType}
                primaryColor={product.primaryColor}
                reducedMotion={reducedMotion}
              />
            ) : (
              <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-2xl bg-cream-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Photo / 3D Switcher Pill */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setView3D(false)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    !view3D
                      ? 'bg-forest-700 text-white'
                      : 'bg-cream-100 text-slate-700 hover:bg-forest-50'
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Farm Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setView3D(true)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    view3D
                      ? 'bg-forest-700 text-white'
                      : 'bg-cream-100 text-slate-700 hover:bg-forest-50'
                  }`}
                >
                  <Box className="h-3.5 w-3.5" />
                  <span>Interactive 3D Preview</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* Daily Price History Card */}
          <div className="rounded-3xl bg-white p-5 shadow-soft border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <History className="h-4 w-4 text-forest-600" />
                <span>Verified Daily Price History</span>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Last updated: {new Date(product.priceUpdatedAt).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="space-y-1.5">
              {(product.priceHistory || []).slice(-3).reverse().map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-cream-50 px-3 py-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">₹{h.price}</span>
                    {h.gradePrices && product.category === 'vegetables' && (
                      <span className="ml-2 text-[11px] text-forest-700 font-semibold">
                        (Grade A: ₹{h.gradePrices.gradeA} • B: ₹{h.gradePrices.gradeB} • C: ₹
                        {h.gradePrices.gradeC})
                      </span>
                    )}
                    <span className="ml-2 text-[11px] text-slate-500">• {h.note}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(h.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Product Details, Grade Selection (Vegetables only), & Add to Cart */}
        <div className="lg:col-span-6 space-y-6 rounded-3xl bg-white p-6 sm:p-8 shadow-soft border border-slate-200/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-3 py-1 text-xs font-bold text-forest-800 capitalize">
              <Sparkles className="h-3.5 w-3.5 text-forest-600" />
              {product.category.replace('-', ' ')} • {product.subcategory}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
            </div>
          </div>

          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              {product.name}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Timestamp Box */}
          <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-cream-50 p-4 border border-slate-200/70">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
                Today's Verified Price {isVegetable ? `(${selectedGrade})` : ''}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-slate-900">
                  ₹{currentPrice}
                </span>
                {currentOrigPrice > currentPrice && (
                  <span className="text-sm text-slate-400 line-through">₹{currentOrigPrice}</span>
                )}
                <span className="text-xs font-semibold text-slate-500">per {product.unit}</span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                  currentStock > 0
                    ? 'bg-forest-100 text-forest-800'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {currentStock > 0 ? `${currentStock} Packs Available` : 'Out of Stock'}
              </span>
              <p className="mt-1 flex items-center justify-end gap-1 text-[11px] text-slate-500">
                <Clock className="h-3 w-3 text-forest-600" />
                Updated {new Date(product.priceUpdatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* VEGETABLE GRADING SYSTEM — STRICTLY SHOWN ONLY FOR VEGETABLES */}
          {isVegetable && (
            <div className="space-y-3 rounded-2xl bg-forest-50/70 p-4 border-2 border-forest-300">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-forest-900">
                  <ShieldCheck className="h-4 w-4 text-forest-600" />
                  Select Vegetable Quality Grade
                </span>
                <span className="text-[11px] font-semibold text-forest-700">
                  Mandatory for Vegetables
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {product.vegetableGrades!.map((g) => {
                  const active = selectedGrade === g.grade;
                  return (
                    <button
                      key={g.grade}
                      type="button"
                      disabled={g.stock <= 0}
                      onClick={() => setSelectedGrade(g.grade)}
                      className={`flex flex-col justify-between rounded-2xl p-3 text-left transition border ${
                        active
                          ? 'bg-forest-800 text-white border-forest-800 shadow-md'
                          : 'bg-white text-slate-800 border-forest-200 hover:border-forest-500'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold">{g.grade}</span>
                          <span
                            className={`text-sm font-extrabold ${
                              active ? 'text-forest-200' : 'text-forest-700'
                            }`}
                          >
                            ₹{g.price}
                          </span>
                        </div>
                        <p
                          className={`mt-1 text-[11px] leading-snug ${
                            active ? 'text-forest-100' : 'text-slate-500'
                          }`}
                        >
                          {g.label}
                        </p>
                      </div>
                      <p
                        className={`mt-2 pt-1.5 border-t text-[10px] font-semibold ${
                          active
                            ? 'border-forest-700 text-forest-300'
                            : 'border-slate-100 text-forest-700'
                        }`}
                      >
                        {g.stock > 0 ? `${g.stock} in stock` : 'Sold out'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Freshness & Origin Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl bg-cream-50 p-3 border border-slate-200/60">
              <p className="font-bold text-slate-800">Freshness & Quality</p>
              <p className="mt-0.5 text-slate-600">{currentFreshness}</p>
            </div>
            <div className="rounded-2xl bg-cream-50 p-3 border border-slate-200/60">
              <p className="font-bold text-slate-800">Origin & Nutrition</p>
              <p className="mt-0.5 text-slate-600">
                {product.origin} • {product.nutritionFacts}
              </p>
            </div>
          </div>

          {/* Quantity & Add to Basket Action */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center rounded-2xl bg-cream-100 border border-slate-200 px-2 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-700 hover:bg-white"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-extrabold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(currentStock || 10, q + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-700 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={currentStock <= 0}
              onClick={() => addToCart(product, quantity, isVegetable ? selectedGrade : null)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-forest-600 py-3.5 px-6 text-sm font-bold text-white shadow-glow hover:bg-forest-700 transition disabled:bg-slate-300"
            >
              <ShoppingBasket className="h-5 w-5" />
              <span>
                Add to Basket {isVegetable ? `(${selectedGrade})` : ''} • ₹
                {currentPrice * quantity}
              </span>
            </button>
          </div>

          {/* PIN Code & Scheduled Slot Assurance */}
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2.5 text-xs">
            <form onSubmit={handlePinCheck} className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-forest-600 shrink-0" />
              <input
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN code"
                maxLength={6}
                className="w-36 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-forest-700"
              >
                Check PIN
              </button>
              <span className="text-slate-500 hidden sm:inline">
                {pinInfo ? `${pinInfo.city} (${pinInfo.estimatedEta})` : ''}
              </span>
            </form>
            {pinMsg && <p className="text-forest-800 font-medium">{pinMsg}</p>}
            <p className="flex items-center gap-1.5 text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-forest-600 shrink-0" />
              <span>
                Next Scheduled Delivery: <strong>{selectedDeliveryDate}</strong> (
                {selectedDeliverySlot?.label || '7:00 AM – 9:00 AM'})
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className="font-display text-2xl font-extrabold text-slate-900">
            More in {product.category.replace('-', ' ')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
