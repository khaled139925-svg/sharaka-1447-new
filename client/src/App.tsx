import Home from '@/pages/Home';
import Admin from '@/pages/Admin';
import { useState } from 'react';
import { Settings } from 'lucide-react';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {showAdmin ? (
        <Admin />
      ) : (
        <>
          <Home />
          {/* زر الإدارة المخفي */}
          <button
            onClick={() => setShowAdmin(true)}
            className="fixed bottom-4 left-4 w-10 h-10 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg opacity-30 hover:opacity-100 transition-opacity duration-300 z-40"
            title="Admin Panel"
          >
            <Settings className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  )
}

export default App
