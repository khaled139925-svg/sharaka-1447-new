import Home from '@/pages/Home';
import Admin from '@/pages/Admin';
import StoresManagement from '@/pages/StoresManagement';
import StoresShowcase from '@/pages/StoresShowcase';

import CloneStore from '@/pages/CloneStore';
import CreateNewStore from '@/pages/CreateNewStore';
import StoreDetail from '@/pages/StoreDetail';
import EditStore from '@/pages/EditStore';
import ProductDetail from '@/pages/ProductDetail';
import { useState } from 'react';
import { StoresProvider } from '@/contexts/StoresContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'admin' | 'stores-management' | 'stores-showcase' | 'create-store' | 'create-new-store' | 'clone-store' | 'store-detail' | 'edit-store' | 'product-detail'>('home');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleNavigate = (page: typeof currentPage, storeId?: string, productId?: string) => {
    setCurrentPage(page);
    if (storeId) setSelectedStoreId(storeId);
    if (productId) setSelectedProductId(productId);
  };

  return (
    <StoresProvider>
      <div className="w-full min-h-screen bg-background">
        {currentPage === 'home' && (
          <Home onAdminClick={() => handleNavigate('admin')} onNavigate={handleNavigate} />
        )}
        {currentPage === 'admin' && (
          <Admin onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />
        )}
        {currentPage === 'stores-management' && (
          <StoresManagement onBack={() => handleNavigate('admin')} onNavigate={handleNavigate} />
        )}
        {currentPage === 'stores-showcase' && (
          <StoresShowcase onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />
        )}

        {currentPage === 'create-new-store' && (
          <CreateNewStore onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />
        )}
        {currentPage === 'clone-store' && (
          <CloneStore />
        )}
        {currentPage === 'store-detail' && (
          <StoreDetail onNavigate={handleNavigate} storeId={selectedStoreId} />
        )}
        {currentPage === 'edit-store' && (
          <EditStore onBack={() => handleNavigate('stores-management')} storeId={selectedStoreId} />
        )}
        {currentPage === 'product-detail' && (
          <ProductDetail onNavigate={handleNavigate} storeId={selectedStoreId} productId={selectedProductId} />
        )}
      </div>
    </StoresProvider>
  );
}

export default App;
