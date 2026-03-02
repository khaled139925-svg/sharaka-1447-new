import { useState } from 'react';
import Home from '@/pages/Home';
import ClientSignup from '@/pages/ClientSignup';
import ConsultantSignup from '@/pages/ConsultantSignup';

type Page = 'home' | 'client-signup' | 'consultant-signup';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'client-signup':
        return <ClientSignup onNavigate={setCurrentPage} />;
      case 'consultant-signup':
        return <ConsultantSignup onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {renderPage()}
    </div>
  );
}

export default App;
