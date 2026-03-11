import React from "react";

interface AdminProps {
  onNavigate?: (page: string) => void;
}

export default function Admin({ onNavigate }: AdminProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6" dir="rtl">
      <div className="max-w-5xl mx-auto">

        <button
          onClick={() => onNavigate?.("home")}
          className="mb-10 text-[#1976D2] hover:text-[#FF9800] text-lg"
        >
          ← العودة للرئيسية
        </button>

        <h1 className="text-4xl font-bold text-center mb-16 text-[#FF9800]">
          لوحة إدارة المنصة
        </h1>

        <p className="text-center text-gray-600">
          هنا سيتم التحكم الكامل في المنصة
        </p>

      </div>
    </div>
  );
}