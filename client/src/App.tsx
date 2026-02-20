import Home from '@/pages/Home';
import Admin from '@/pages/Admin';
import { useState } from 'react';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="w-full min-h-screen bg-background">
      {showAdmin ? (
        <Admin onBack={() => setShowAdmin(false)} />
      ) : (
        <Home onAdminClick={() => setShowAdmin(true)} />
      )}
    </div>
  );
}

export default App;
