import Home from '@/pages/Home';
import Admin from '@/pages/Admin';
import StoresManagement from '@/pages/StoresManagement';
import StoresShowcase from '@/pages/StoresShowcase';
import CreateStore from '@/pages/CreateStore';
import StoreDetail from '@/pages/StoreDetail';
import ProductDetail from '@/pages/ProductDetail';
import EditStore from '@/pages/EditStore';
import { useState } from 'react';
import { StoresProvider } from '@/contexts/StoresContext';

type PageType = 'home' | 'admin' | 'stores-management' | 'stores-showcase' | 'create-store' | 'store-detail' | 'product-detail' | 'edit-store';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleNavigate = (pageOrPath: string, storeId?: string, productId?: string) => {
    // معالجة المسارات الديناميكية مثل 'store-detail-1' و 'edit-store-1'
    if (pageOrPath.startsWith('store-detail-')) {
      const id = pageOrPath.replace('store-detail-', '');
      console.log('Navigating to store detail with ID:', id);
      setCurrentPage('store-detail');
      setSelectedStoreId(id);
    } else if (pageOrPath.startsWith('edit-store-')) {
      const id = pageOrPath.replace('edit-store-', '');
      console.log('Navigating to edit store with ID:', id);
      setCurrentPage('edit-store');
      setSelectedStoreId(id);
    } else {
      setCurrentPage(pageOrPath as PageType);
      if (storeId) {
        console.log('Setting store ID:', storeId);
        setSelectedStoreId(storeId);
      }
      if (productId) {
        console.log('Setting product ID:', productId);
        setSelectedProductId(productId);
      }
    }
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
        {currentPage === 'create-store' && (
          <CreateStore onNavigate={handleNavigate} />
        )}
        {currentPage === 'store-detail' && (
          <StoreDetail onNavigate={handleNavigate} storeId={selectedStoreId} />
        )}
        {currentPage === 'edit-store' && (
          <EditStore onNavigate={handleNavigate} storeId={selectedStoreId} />
        )}
        {currentPage === 'product-detail' && (
          <ProductDetail onNavigate={handleNavigate} storeId={selectedStoreId} productId={selectedProductId} />
        )}
      </div>
    </StoresProvider>
  );
}

export default App;
