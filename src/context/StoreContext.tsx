import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Product,
  CartItem,
  User,
  Coupon,
  DeliverySlot,
  PinCodeInfo,
  VegetableGradeType,
  Address,
} from '../types';

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ResolvedCartLine {
  product: Product;
  quantity: number;
  selectedGrade: VegetableGradeType | null;
  unitPrice: number;
  originalPrice: number;
  lineTotal: number;
  availableStock: number;
  freshness: string;
}

interface StoreContextType {
  products: Product[];
  loadingProducts: boolean;
  lastDailyPriceSync: string;
  refreshProducts: () => Promise<void>;
  user: User | null;
  token: string | null;
  loginWithCredentials: (payload: { identifier: string; password?: string; otp?: string }) => Promise<User>;
  registerUser: (payload: {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    password: string;
  }) => Promise<User>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => Promise<User | null>;
  sendOtp: (identifier: string, purpose?: string) => Promise<{ demoOtp: string; message: string }>;
  verifyOtp: (identifier: string, otp: string) => Promise<boolean>;
  cart: CartItem[];
  resolvedCartLines: ResolvedCartLine[];
  cartCount: number;
  subtotal: number;
  totalSavings: number;
  addToCart: (product: Product, quantity?: number, selectedGrade?: VegetableGradeType | null) => void;
  removeFromCart: (productId: string, selectedGrade?: VegetableGradeType | null) => void;
  updateCartQuantity: (productId: string, selectedGrade: VegetableGradeType | null, quantity: number) => void;
  updateCartGrade: (productId: string, oldGrade: VegetableGradeType | null, newGrade: VegetableGradeType) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  basketBump: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  selectedPinCode: string;
  pinInfo: PinCodeInfo | null;
  pinCodesList: PinCodeInfo[];
  checkPinServiceability: (pin: string) => Promise<{ serviceable: boolean; message: string; pinInfo?: PinCodeInfo }>;
  selectedDeliveryDate: string;
  setSelectedDeliveryDate: (date: string) => void;
  deliverySlots: DeliverySlot[];
  selectedDeliverySlot: DeliverySlot | null;
  setSelectedDeliverySlot: (slot: DeliverySlot | null) => void;
  fetchSlotsForDate: (date: string) => Promise<void>;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [lastDailyPriceSync, setLastDailyPriceSync] = useState<string>(new Date().toISOString());

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('gb_token'));
  const [user, setUser] = useState<User | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gb_wishlist');
      return saved ? JSON.parse(saved) : ['fruit-apples-01', 'veg-broccoli-06', 'dry-almonds-01'];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [basketBump, setBasketBump] = useState(0);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [selectedPinCode, setSelectedPinCode] = useState<string>(
    () => localStorage.getItem('gb_pincode') || '560034'
  );
  const [pinInfo, setPinInfo] = useState<PinCodeInfo | null>(null);
  const [pinCodesList, setPinCodesList] = useState<PinCodeInfo[]>([]);

  const tomorrowDefault = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string>(tomorrowDefault);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<DeliverySlot | null>(null);

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    const saved = localStorage.getItem('gb_reduced_motion');
    if (saved !== null) return saved === 'true';
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `t-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  useEffect(() => {
    localStorage.setItem('gb_reduced_motion', String(reducedMotion));
  }, [reducedMotion]);

  // Fetch products & coupons
  const refreshProducts = useCallback(async () => {
    try {
      const [prodRes, coupRes, pinRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/coupons'),
        fetch('/api/delivery/pincodes'),
      ]);
      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
        if (data.lastDailyPriceSync) setLastDailyPriceSync(data.lastDailyPriceSync);
      }
      if (coupRes.ok) {
        const cData = await coupRes.json();
        setCoupons(cData.coupons || []);
      }
      if (pinRes.ok) {
        const pData = await pinRes.json();
        setPinCodesList(pData.pinCodes || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Fetch current user if token exists
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUser(data.user);
        if (Array.isArray(data.user?.wishlist) && data.user.wishlist.length > 0) {
          setWishlist(data.user.wishlist);
        }
        if (Array.isArray(data.user?.cart) && data.user.cart.length > 0 && cart.length === 0) {
          setCart(data.user.cart);
        }
      })
      .catch(() => {
        localStorage.removeItem('gb_token');
        setToken(null);
        setUser(null);
      });
  }, [token]);

  // Sync cart to localStorage & backend
  useEffect(() => {
    localStorage.setItem('gb_cart', JSON.stringify(cart));
    if (token && user) {
      fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart }),
      }).catch(() => {});
    }
  }, [cart, token]);

  // Sync wishlist
  useEffect(() => {
    localStorage.setItem('gb_wishlist', JSON.stringify(wishlist));
    if (token && user) {
      fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ wishlist }),
      }).catch(() => {});
    }
  }, [wishlist, token]);

  // Check initial PIN code
  const checkPinServiceability = useCallback(async (pin: string) => {
    const clean = pin.trim();
    try {
      const res = await fetch(`/api/delivery/check-pin/${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (data.serviceable && data.pinInfo) {
        setSelectedPinCode(clean);
        setPinInfo(data.pinInfo);
        localStorage.setItem('gb_pincode', clean);
        return { serviceable: true, message: data.message, pinInfo: data.pinInfo };
      } else {
        setPinInfo(null);
        return { serviceable: false, message: data.message || 'PIN code not serviceable.' };
      }
    } catch {
      return { serviceable: false, message: 'Unable to check PIN code serviceability.' };
    }
  }, []);

  useEffect(() => {
    checkPinServiceability(selectedPinCode);
  }, []);

  // Fetch delivery slots for selected date
  const fetchSlotsForDate = useCallback(async (date: string) => {
    try {
      const res = await fetch(`/api/delivery/slots?date=${encodeURIComponent(date)}`);
      if (res.ok) {
        const data = await res.json();
        const slotsList: DeliverySlot[] = data.slots || [];
        setDeliverySlots(slotsList);
        setSelectedDeliverySlot((prev) => {
          if (prev) {
            const updatedPrev = slotsList.find((s) => s.id === prev.id);
            if (updatedPrev && updatedPrev.isAvailable) return updatedPrev;
          }
          return slotsList.find((s) => s.isAvailable && !s.isExpress) || slotsList.find((s) => s.isAvailable) || null;
        });
      }
    } catch (err) {
      console.error('Error loading delivery slots:', err);
    }
  }, []);

  useEffect(() => {
    fetchSlotsForDate(selectedDeliveryDate);
  }, [selectedDeliveryDate, fetchSlotsForDate]);

  // Compute resolved cart lines using live products and strictly enforcing vegetable grades
  const resolvedCartLines: ResolvedCartLine[] = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        let unitPrice = product.price;
        let originalPrice = product.originalPrice || product.price;
        let availableStock = product.stock;
        let selectedGrade: VegetableGradeType | null = null;
        let freshness = product.freshnessInfo;

        if (product.category === 'vegetables' && Array.isArray(product.vegetableGrades)) {
          const targetGrade = item.selectedGrade || 'Grade A';
          const gradeObj =
            product.vegetableGrades.find((g) => g.grade === targetGrade) || product.vegetableGrades[0];
          if (gradeObj) {
            unitPrice = gradeObj.price;
            originalPrice = gradeObj.originalPrice || gradeObj.price;
            availableStock = gradeObj.stock;
            selectedGrade = gradeObj.grade;
            freshness = gradeObj.freshness;
          }
        }

        return {
          product,
          quantity: item.quantity,
          selectedGrade,
          unitPrice,
          originalPrice,
          lineTotal: unitPrice * item.quantity,
          availableStock,
          freshness,
        };
      })
      .filter((x): x is ResolvedCartLine => x !== null);
  }, [cart, products]);

  const cartCount = useMemo(
    () => resolvedCartLines.reduce((sum, item) => sum + item.quantity, 0),
    [resolvedCartLines]
  );

  const subtotal = useMemo(
    () => resolvedCartLines.reduce((sum, item) => sum + item.lineTotal, 0),
    [resolvedCartLines]
  );

  const totalSavings = useMemo(() => {
    const mrpSavings = resolvedCartLines.reduce(
      (sum, item) => sum + Math.max(0, item.originalPrice - item.unitPrice) * item.quantity,
      0
    );
    return mrpSavings + couponDiscount;
  }, [resolvedCartLines, couponDiscount]);

  // Re-validate applied coupon whenever cart changes
  useEffect(() => {
    if (!appliedCoupon) {
      setCouponDiscount(0);
      return;
    }
    if (cart.length === 0) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      return;
    }
    fetch('/api/coupons/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ code: appliedCoupon.code, cartItems: cart }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setCouponDiscount(data.discountAmount);
          setCouponError(null);
        } else {
          setAppliedCoupon(null);
          setCouponDiscount(0);
          setCouponError(data.error || 'Coupon no longer eligible for current cart.');
        }
      })
      .catch(() => {});
  }, [cart, products]);

  const addToCart = useCallback(
    (product: Product, quantity = 1, selectedGrade?: VegetableGradeType | null) => {
      // Strictly enforce grade rule: ONLY vegetables can have a grade
      const resolvedGrade: VegetableGradeType | null =
        product.category === 'vegetables' ? selectedGrade || 'Grade A' : null;

      setCart((prev) => {
        const idx = prev.findIndex(
          (item) => item.productId === product.id && item.selectedGrade === resolvedGrade
        );
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
          return updated;
        }
        return [...prev, { productId: product.id, quantity, selectedGrade: resolvedGrade }];
      });

      setBasketBump((b) => b + 1);
      showToast(
        `Added ${product.name}${resolvedGrade ? ` (${resolvedGrade})` : ''} to your Green Basket!`,
        'success'
      );
    },
    [showToast]
  );

  const removeFromCart = useCallback((productId: string, selectedGrade: VegetableGradeType | null = null) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedGrade === selectedGrade))
    );
  }, []);

  const updateCartQuantity = useCallback(
    (productId: string, selectedGrade: VegetableGradeType | null, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, selectedGrade);
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId && item.selectedGrade === selectedGrade
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const updateCartGrade = useCallback(
    (productId: string, oldGrade: VegetableGradeType | null, newGrade: VegetableGradeType) => {
      setCart((prev) => {
        const targetItem = prev.find((i) => i.productId === productId && i.selectedGrade === oldGrade);
        if (!targetItem) return prev;
        const withoutOld = prev.filter(
          (i) => !(i.productId === productId && i.selectedGrade === oldGrade)
        );
        const existingNewIdx = withoutOld.findIndex(
          (i) => i.productId === productId && i.selectedGrade === newGrade
        );
        if (existingNewIdx > -1) {
          const merged = [...withoutOld];
          merged[existingNewIdx] = {
            ...merged[existingNewIdx],
            quantity: merged[existingNewIdx].quantity + targetItem.quantity,
          };
          return merged;
        }
        return [...withoutOld, { productId, quantity: targetItem.quantity, selectedGrade: newGrade }];
      });
      showToast(`Switched vegetable grade to ${newGrade}`, 'info');
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
        showToast(exists ? 'Removed from Wishlist' : 'Saved to your Wishlist!', 'info');
        return next;
      });
    },
    [showToast]
  );

  const applyCoupon = useCallback(
    async (code: string) => {
      setCouponError(null);
      try {
        const res = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ code, cartItems: cart }),
        });
        const data = await res.json();
        if (!res.ok || !data.valid) {
          setCouponError(data.error || 'Invalid coupon code.');
          showToast(data.error || 'Invalid coupon code.', 'error');
          return false;
        }
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discountAmount);
        showToast(data.message, 'success');
        return true;
      } catch {
        setCouponError('Could not validate coupon.');
        return false;
      }
    },
    [cart, token, showToast]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError(null);
    showToast('Coupon removed.', 'info');
  }, [showToast]);

  const loginWithCredentials = useCallback(
    async (payload: { identifier: string; password?: string; otp?: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      localStorage.setItem('gb_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast(data.message || `Welcome back, ${data.user.fullName}!`, 'success');
      return data.user;
    },
    [showToast]
  );

  const registerUser = useCallback(
    async (payload: { fullName: string; email: string; phone: string; dob: string; password: string }) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      localStorage.setItem('gb_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast(data.message || 'Account created successfully!', 'success');
      return data.user;
    },
    [showToast]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('gb_token');
    setToken(null);
    setUser(null);
    showToast('Signed out of Green Basket.', 'info');
  }, [showToast]);

  const updateUserProfile = useCallback(
    async (updates: Partial<User>): Promise<User | null> => {
      if (!token) return null;
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      setUser(data.user);
      showToast(data.message || 'Profile updated!', 'success');
      return data.user;
    },
    [token, showToast]
  );

  const sendOtp = useCallback(async (identifier: string, purpose = 'verification') => {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, purpose }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
    return { demoOtp: data.demoOtp, message: data.message };
  }, []);

  const verifyOtp = useCallback(async (identifier: string, otp: string) => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'OTP verification failed');
    return Boolean(data.verified);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        loadingProducts,
        lastDailyPriceSync,
        refreshProducts,
        user,
        token,
        loginWithCredentials,
        registerUser,
        logout,
        updateUserProfile,
        sendOtp,
        verifyOtp,
        cart,
        resolvedCartLines,
        cartCount,
        subtotal,
        totalSavings,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartGrade,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        basketBump,
        wishlist,
        toggleWishlist,
        coupons,
        appliedCoupon,
        couponDiscount,
        couponError,
        applyCoupon,
        removeCoupon,
        selectedPinCode,
        pinInfo,
        pinCodesList,
        checkPinServiceability,
        selectedDeliveryDate,
        setSelectedDeliveryDate,
        deliverySlots,
        selectedDeliverySlot,
        setSelectedDeliverySlot,
        fetchSlotsForDate,
        reducedMotion,
        setReducedMotion,
        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
