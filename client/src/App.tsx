import Home from '@/pages/Home';
import Admin from '@/pages/Admin';
import StoresManagement from '@/pages/StoresManagement';
import StoresShowcase from '@/pages/StoresShowcase';
import CreateStore from '@/pages/CreateStore';
import StoreDetail from '@/pages/StoreDetail';
import { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'admin' | 'stores-management' | 'stores-showcase' | 'create-store' | 'store-detail'>('home');

  const handleNavigate = (page: typeof currentPage) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {currentPage === 'home' && (
        <Home onAdminClick={() => handleNavigate('admin')} />
      )}
      {currentPage === 'admin' && (
        <Admin onBack={() => handleNavigate('home')} onNavigate={handleNavigate} />
      )}
      {currentPage === 'stores-management' && (
        <StoresManagement onBack={() => handleNavigate('admin')} />
      )}
      {currentPage === 'stores-showcase' && (
        <StoresShowcase onBack={() => handleNavigate('home')} />
      )}
      {currentPage === 'create-store' && (
        <CreateStore onNavigate={handleNavigate} />
      )}
      {currentPage === 'store-detail' && (
        <StoreDetail onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
