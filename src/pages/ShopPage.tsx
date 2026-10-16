import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryBanner3D } from '../components/three/CategoryScene3D';
import { CategoryType, VegetableGradeType } from '../types';

export const ShopPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, reducedMotion, lastDailyPriceSync } = useStore();

  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryType>(
    (categorySlug as CategoryType) || 'all'
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(650);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedVegGrade, setSelectedVegGrade] = useState<'all' | VegetableGradeType>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  useEffect(() => {
    if (categorySlug && ['fruits', 'vegetables', 'dry-fruits'].includes(categorySlug)) {
      setSelectedCategory(categorySlug as CategoryType);
      setSelectedSubcategory('all');
      if (categorySlug !== 'vegetables') {
        setSelectedVegGrade('all');
      }
    } else {
      setSelectedCategory('all');
    }
  }, [categorySlug]);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) setSearchTerm(q);
  }, [searchParams]);

  const subcategories = useMemo(() => {
    const base =
      selectedCategory === 'all'
        ? products
        : products.filter((p) => p.category === selectedCategory);
    const set = new Set<string>(base.map((p) => p.subcategory));
    return ['all', ...Array.from(set)];
  }, [products, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) return false;
        if (p.price > maxPrice) return false;
        if (inStockOnly && p.stock <= 0) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.subcategory.toLowerCase().includes(q) ||
            p.origin.toLowerCase().includes(q);
          if (!match) return false;
        }
        // Filter by vegetable grade ONLY when viewing vegetables or all with grade filter
        if (selectedVegGrade !== 'all') {
          if (p.category !== 'vegetables' || !Array.isArray(p.vegetableGrades)) return false;
          const gradeObj = p.vegetableGrades.find((g) => g.grade === selectedVegGrade);
          if (!gradeObj || gradeObj.stock <= 0) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return Number(b.isFeatured) - Number(a.isFeatured);
      });
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    maxPrice,
    inStockOnly,
    searchTerm,
    selectedVegGrade,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubcategory('all');
    setMaxPrice(650);
    setInStockOnly(false);
    setSelectedVegGrade('all');
    setSortBy('featured');
    setSearchParams({});
  };

  const bannerConfig = {
    fruits: {
      title: 'Fresh Orchard Fruits',
      subtitle:
        'Apples, bananas, Nagpur oranges, seedless grapes, Ratnagiri Alphonso mangoes, watermelon, strawberries, papaya, pomegranates & seasonal picks.',
      bg: 'from-rose-950 via-rose-900 to-forest-950',
      badge: '100% Wax-Free & Carbide-Free • Cold-Chain Fresh',
    },
    vegetables: {
      title: 'Farm-Fresh Graded Vegetables',
      subtitle:
        'Tomatoes, potatoes, onions, carrots, spinach, broccoli, cauliflower, cabbage, cucumbers & capsicum — choose Grade A, Grade B, or Grade C.',
      bg: 'from-forest-950 via-forest-900 to-emerald-950',
      badge: 'Exclusive 3-Tier Quality Grading System (Grade A • Grade B • Grade C)',
    },
    'dry-fruits': {
      title: 'Premium Artisanal Dry Fruits',
      subtitle:
        'California almonds, Goan W240 cashews, Iranian roasted pistachios, Kashmiri walnut kernels, golden raisins, Medjool dates, Afghan figs & trail mixes.',
      bg: 'from-amber-950 via-stone-900 to-forest-950',
      badge: 'Nitrogen-Flushed Freshness • Rich in Omega-3 & Plant Protein',
    },
    all: {
      title: 'Shop All Fresh Groceries',
      subtitle:
        'Explore our complete farm-to-doorstep catalog with transparent daily pricing and scheduled slot delivery.',
      bg: 'from-forest-950 via-forest-900 to-slate-900',
      badge: 'Daily Farm Prices Verified Today',
    },
  }[selectedCategory];

  const active3DCategory: CategoryType =
    selectedCategory === 'all' ? 'fruits' : selectedCategory;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Category Interactive 3D Hero Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${bannerConfig.bg} p-6 sm:p-8 lg:p-10 text-white shadow-xl`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-forest-200 backdrop-blur-sm border border-white/15">
              <Sparkles className="h-3.5 w-3.5 text-forest-400" />
              {bannerConfig.badge}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              {bannerConfig.title}
            </h1>
            <p className="text-xs sm:text-sm text-cream-100/85 max-w-xl leading-relaxed">
              {bannerConfig.subtitle}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-forest-200">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-forest-400" />
                Daily prices synced:{' '}
                {new Date(lastDailyPriceSync).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>•</span>
              <span>Showing {filteredProducts.length} products</span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <CategoryBanner3D category={active3DCategory} reducedMotion={reducedMotion} />
          </div>
        </div>
      </div>

      {/* Vegetable Grading Info Strip — Strictly Shown ONLY on Vegetables Category */}
      {selectedCategory === 'vegetables' && (
        <div className="rounded-3xl bg-forest-50 p-5 border border-forest-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-forest-700 px-2.5 py-1 text-xs font-extrabold text-white shrink-0">
              Grade A
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Premium quality, carefully selected vegetables
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Hand-sorted uniform size, peak firmness & zero blemishes.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-citrus-500 px-2.5 py-1 text-xs font-extrabold text-white shrink-0">
              Grade B
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Standard quality vegetables</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Fresh daily kitchen harvest with natural size variations.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-amber-500 px-2.5 py-1 text-xs font-extrabold text-white shrink-0">
              Grade C
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Budget-friendly vegetables</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                High-value farm pick ideal for curries, purees, soups & juices.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="rounded-3xl bg-white p-5 shadow-soft border border-slate-200/80 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by product name, origin, or type..."
              className="w-full rounded-2xl bg-cream-50 pl-10 pr-4 py-2.5 text-xs font-medium border border-slate-200 focus:border-forest-600 focus:outline-none"
            />
          </div>

          {/* Category Switcher */}
          <div className="md:col-span-5 flex flex-wrap gap-1.5">
            {[
              { slug: 'all', label: 'All Categories', path: '/shop' },
              { slug: 'fruits', label: '🍎 Fresh Fruits', path: '/category/fruits' },
              { slug: 'vegetables', label: '🥦 Vegetables', path: '/category/vegetables' },
              { slug: 'dry-fruits', label: '🥜 Dry Fruits', path: '/category/dry-fruits' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                to={cat.path}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  selectedCategory === cat.slug
                    ? 'bg-forest-700 text-white'
                    : 'bg-cream-100 text-slate-700 hover:bg-forest-100'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3 flex items-center justify-end gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full rounded-2xl bg-cream-50 px-3 py-2.5 text-xs font-bold text-slate-800 border border-slate-200 focus:border-forest-600 focus:outline-none"
            >
              <option value="featured">Sort: Featured Harvest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Secondary Filters Row: Subcategories, Max Price, In Stock, and Vegetable Grade Filter (ONLY if vegetables or all) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500">Type:</span>
            {subcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubcategory(sub)}
                className={`rounded-lg px-2.5 py-1 font-semibold capitalize transition ${
                  selectedSubcategory === sub
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Vegetable Grade Filter — Strictly hidden on Fruits & Dry Fruits */}
            {selectedCategory === 'vegetables' && (
              <div className="flex items-center gap-1.5 bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-200">
                <ShieldCheck className="h-3.5 w-3.5 text-forest-600" />
                <span className="font-bold text-forest-900">Grade:</span>
                {(['all', 'Grade A', 'Grade B', 'Grade C'] as const).map((gr) => (
                  <button
                    key={gr}
                    type="button"
                    onClick={() => setSelectedVegGrade(gr)}
                    className={`rounded-md px-2 py-0.5 text-[11px] font-bold transition ${
                      selectedVegGrade === gr
                        ? 'bg-forest-700 text-white'
                        : 'text-forest-800 hover:bg-forest-100'
                    }`}
                  >
                    {gr === 'all' ? 'All' : gr}
                  </button>
                ))}
              </div>
            )}

            {/* Price Range Slider */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Max Price: ₹{maxPrice}</span>
              <input
                type="range"
                min={30}
                max={650}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-forest-600 cursor-pointer"
              />
            </div>

            {/* In Stock Checkbox */}
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-forest-600"
              />
              <span>In Stock Only</span>
            </label>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-soft border border-slate-100">
          <p className="font-display text-lg font-bold text-slate-800">
            No groceries match your current filters
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try expanding your price range or clearing your search term.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-2xl bg-forest-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-forest-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
