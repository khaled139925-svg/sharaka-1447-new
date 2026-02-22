import React, { createContext, useContext, useState } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  points: number; // النقاط بدلاً من الخصم
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
}

const StoresContext = createContext<StoresContextType | undefined>(undefined);

export function StoresProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>([
    {
      id: '1',
      name: 'متجر التكنولوجيا',
      description: 'متجر متخصص في الأجهزة الإلكترونية',
      category: 'إلكترونيات',
      logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      ownerName: 'أحمد محمد',
      ownerEmail: 'ahmed@tech.com',
      ownerPhone: '+966501234567',
      products: [
        {
          id: '1-1',
          name: 'سماعات بلوتوث',
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
          description: 'سماعات بلوتوث عالية الجودة مع بطارية تدوم 24 ساعة',
          points: 30, // 10% من السعر
        },
        {
          id: '1-2',
          name: 'هاتف ذكي',
          price: 1299.99,
          image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300&h=300&fit=crop',
          description: 'هاتف ذكي حديث مع كاميرا احترافية',
          points: 130,
        },
      ],
    },
  ]);

  const addStore = (store: Store) => {
    setStores([...stores, { ...store, id: Date.now().toString() }]);
  };

  const updateStore = (id: string, updatedStore: Partial<Store>) => {
    setStores(
      stores.map((store) =>
        store.id === id ? { ...store, ...updatedStore } : store
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
          ? {
              ...store,
              products: [...store.products, { ...product, id: Date.now().toString() }],
            }
          : store
      )
    );
  };

  const updateProduct = (storeId: string, productId: string, updatedProduct: Partial<Product>) => {
    setStores(
      stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              products: store.products.map((product) =>
                product.id === productId ? { ...product, ...updatedProduct } : product
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

  const getStore = (id: string) => stores.find((store) => store.id === id);

  const getProduct = (storeId: string, productId: string) => {
    const store = getStore(storeId);
    return store?.products.find((product) => product.id === productId);
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
