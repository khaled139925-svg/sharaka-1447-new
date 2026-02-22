import Home from '@/pages/Home';
import Admin from '@/pages/Admin';
import StoresManagement from '@/pages/StoresManagement';
import StoresShowcase from '@/pages/StoresShowcase';
import { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'admin' | 'stores-management' | 'stores-showcase'>('home');

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
    </div>
  );
}

export default App;
