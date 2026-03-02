import { useState } from 'react';
import Home from '@/pages/Home';
import ClientSignup from '@/pages/ClientSignup';
import ConsultantSignup from '@/pages/ConsultantSignup';
import ConsultantsList from '@/pages/ConsultantsList';
import BookingSession from '@/pages/BookingSession';
import PaymentPage from '@/pages/PaymentPage';

type Page = 'home' | 'client-signup' | 'consultant-signup' | 'consultants' | 'booking' | 'payment';

interface PageData {
  consultantId?: number;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<PageData>({});

  const handleNavigate = (page: string, data?: PageData) => {
    setCurrentPage(page as Page);
    if (data) {
      setPageData(data);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'client-signup':
        return <ClientSignup onNavigate={handleNavigate} />;
      case 'consultant-signup':
        return <ConsultantSignup onNavigate={handleNavigate} />;
      case 'consultants':
        return <ConsultantsList onNavigate={handleNavigate} />;
      case 'booking':
        return <BookingSession consultantId={pageData.consultantId} onNavigate={handleNavigate} />;
      case 'payment':
        return <PaymentPage sessionId={pageData.sessionId} amount={pageData.amount} consultantName={pageData.consultantName} onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {renderPage()}
    </div>
  );
}

export default App;
