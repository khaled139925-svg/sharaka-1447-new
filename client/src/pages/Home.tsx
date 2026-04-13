import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/globe-icon.png';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex flex-col items-center justify-center">
      <img
        src={logo}
        alt="Sharaka"
        className="w-80 cursor-pointer animate-pulse mb-8"
        style={{ animation: 'pulse 3s ease-in-out infinite' }}
        onClick={() => navigate('/')}
      />
      <h1 className="text-4xl font-bold text-[#FF9800] mb-4">شراكة</h1>
      <p className="text-gray-600 mb-8">منصة تجمع الخبرات والخدمات والفرص</p>
      <div className="flex gap-4">
        <button onClick={() => navigate('/login')} className="bg-gray-200 px-6 py-2 rounded-lg">دخول</button>
        <button onClick={() => navigate('/signup')} className="bg-[#FF9800] text-white px-6 py-2 rounded-lg">تسجيل جديد</button>
      </div>
    </div>
  );
}