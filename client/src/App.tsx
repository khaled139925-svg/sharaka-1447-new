import Home from '@/pages/Home';
import Admin from '@/pages/Admin';
import { useState } from 'react';
import { Settings, Home as HomeIcon } from 'lucide-react';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      {showAdmin ? (
        <div className="min-h-screen w-full">
          <Admin />
          {/* زر العودة للرئيسية */}
          <button
            onClick={() => setShowAdmin(false)}
            className="fixed bottom-4 right-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-40 hover:scale-110"
            title="Back to Home"
          >
            <HomeIcon className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <>
          <Home />
          {/* زر الإدارة المخفي */}
          <button
            onClick={() => setShowAdmin(true)}
            className="fixed bottom-4 left-4 w-12 h-12 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg opacity-30 hover:opacity-100 transition-all duration-300 z-40 hover:scale-110"
            title="Admin Panel"
          >
            <Settings className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  )
}

export default App
