'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  points: number;
  quantity?: number;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  pointsRatio: number;
  products: Product[];
}

export interface CartItem {
  storeId: string;
  productId: string;
  quantity: number;
  product: Product;
  store: Store;
}

interface StoresContextType {
  stores: Store[];
  addStore: (store: Store) => void;
  updateStore: (id: string, store: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  addProduct: (storeId: string, product: Product) => void;
  updateProduct: (storeId: string, productId: string, product: Partial<Product>) => void;
  deleteProduct: (storeId: string, productId: string) => void;
  getStore: (id: string) => Store | undefined;
  getProduct: (storeId: string, productId: string) => Product | undefined;
  cart: CartItem[];
  addToCart: (storeId: string, productId: string, quantity: number) => void;
  removeFromCart: (storeId: string, productId: string) => void;
  updateCartQuantity: (storeId: string, productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartPoints: () => number;
}

const StoresContext = createContext<StoresContextType | undefined>(undefined);

// البيانات الافتراضية
const DEFAULT_STORES: Store[] = [
  {
    id: '1',
    name: 'متجر التكنولوجيا',
    description: 'متجر متخصص في الأجهزة الإلكترونية',
    category: 'إلكترونيات',
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    ownerName: 'أحمد محمد',
    ownerEmail: 'ahmed@tech.com',
    ownerPhone: '+966501234567',
    pointsRatio: 0.1,
    products: [
      {
        id: '1-1',
        name: 'سماعات بلوتوث',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        description: 'سماعات بلوتوث عالية الجودة مع بطارية تدوم 24 ساعة',
        points: 30,
        quantity: 10,
      },
      {
        id: '1-2',
        name: 'هاتف ذكي',
        price: 1299.99,
        image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300&h=300&fit=crop',
        description: 'هاتف ذكي بأحدث المواصفات والتقنيات',
        points: 130,
        quantity: 5,
      },
    ],
  },
];

export function StoresProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // تحميل البيانات من localStorage عند التحميل
  useEffect(() => {
    const savedStores = localStorage.getItem('sharaka_stores');
    const savedCart = localStorage.getItem('sharaka_cart');

    if (savedStores) {
      try {
        setStores(JSON.parse(savedStores));
      } catch (error) {
        console.error('خطأ في تحميل المتاجر:', error);
        setStores(DEFAULT_STORES);
      }
    } else {
      setStores(DEFAULT_STORES);
    }

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('خطأ في تحميل السلة:', error);
        setCart([]);
      }
    }

    setIsLoaded(true);
  }, []);

  // حفظ المتاجر في localStorage عند التغيير
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('sharaka_stores', JSON.stringify(stores));
    }
  }, [stores, isLoaded]);

  // حفظ السلة في localStorage عند التغيير
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('sharaka_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addStore = (store: Store) => {
    setStores([...stores, store]);
  };

  const updateStore = (id: string, updates: Partial<Store>) => {
    setStores(
      stores.map((store) =>
        store.id === id ? { ...store, ...updates } : store
      )
    );
  };

  const deleteStore = (id: string) => {
    setStores(stores.filter((store) => store.id !== id));
  };

  const addProduct = (storeId: string, product: Product) => {
    setStores(
      stores.map((store) =>
        store.id === storeId
          ? { ...store, products: [...store.products, product] }
          : store
      )
    );
  };

  const updateProduct = (storeId: string, productId: string, updates: Partial<Product>) => {
    setStores(
      stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              products: store.products.map((product) =>
                product.id === productId ? { ...product, ...updates } : product
              ),
            }
          : store
      )
    );
  };

  const deleteProduct = (storeId: string, productId: string) => {
    setStores(
      stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              products: store.products.filter((product) => product.id !== productId),
            }
          : store
      )
    );
  };

  const getStore = (id: string): Store | undefined => {
    return stores.find((store) => store.id === id);
  };

  const getProduct = (storeId: string, productId: string): Product | undefined => {
    const store = getStore(storeId);
    return store?.products.find((product) => product.id === productId);
  };

  const addToCart = (storeId: string, productId: string, quantity: number) => {
    const store = getStore(storeId);
    const product = getProduct(storeId, productId);

    if (!store || !product) return;

    const existingItem = cart.find(
      (item) => item.storeId === storeId && item.productId === productId
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.storeId === storeId && item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          storeId,
          productId,
          quantity,
          product,
          store,
        },
      ]);
    }
  };

  const removeFromCart = (storeId: string, productId: string) => {
    setCart(
      cart.filter(
        (item) => !(item.storeId === storeId && item.productId === productId)
      )
    );
  };

  const updateCartQuantity = (storeId: string, productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(storeId, productId);
    } else {
      setCart(
        cart.map((item) =>
          item.storeId === storeId && item.productId === productId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartPoints = () => {
    return cart.reduce((points, item) => points + item.product.points * item.quantity, 0);
  };

  return (
    <StoresContext.Provider
      value={{
        stores,
        addStore,
        updateStore,
        deleteStore,
        addProduct,
        updateProduct,
        deleteProduct,
        getStore,
        getProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartPoints,
      }}
    >
      {children}
    </StoresContext.Provider>
  );
}

export function useStores() {
  const context = useContext(StoresContext);
  if (!context) {
    throw new Error('useStores must be used within StoresProvider');
  }
  return context;
}
