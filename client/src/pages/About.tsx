import React from "react";

interface AboutProps {
  onNavigate?: (page: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6" dir="rtl">

      <div className="max-w-5xl mx-auto">

        <button
          onClick={() => onNavigate && onNavigate("home")}
          className="mb-10 text-[#1976D2] hover:text-[#FF9800] text-lg font-semibold"
        >
          ← العودة للرئيسية
        </button>

        <h1 className="text-4xl font-bold text-center mb-16 text-[#FF9800]">
          عن منصة شراكة
        </h1>

        <div className="space-y-10">

          <section className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#1976D2]">
              شراكة — منصة تجمع الخبرة والخدمة والمنتج
            </h2>
            <p className="text-gray-700 leading-8">
              شراكة منصة رقمية عالمية تجمع بين الخبرات والاستشارات والخدمات
              والمنتجات والفرص في بيئة واحدة تساعد الأفراد والمؤسسات على
              الوصول إلى المعرفة والتواصل والتعاون وبناء العلاقات المهنية.
            </p>
          </section>

          <section className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#1976D2]">
              لماذا تعتبر شراكة منصة مختلفة؟
            </h2>
            <ul className="list-disc pr-6 text-gray-700 space-y-2">
              <li>الحصول على استشارات وخبرات متخصصة</li>
              <li>عرض الخدمات المهنية والمهارات</li>
              <li>تقديم الدورات التدريبية والمعرفة</li>
              <li>عرض المنتجات التجارية أو الرقمية</li>
              <li>التعريف بالمتاجر والخدمات</li>
              <li>خلق فرص للتعاون والعمل والمشاريع</li>
            </ul>
          </section>

          <section className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#1976D2]">
              من نحن
            </h2>
            <p className="text-gray-700 leading-8">
              شراكة منصة تهدف إلى ربط الناس بالخبرات والمعرفة والخدمات
              والفرص التي تساعدهم على تطوير حياتهم وأعمالهم.
            </p>
          </section>

          <section className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#1976D2]">
              الرؤية
            </h2>
            <p className="text-gray-700 leading-8">
              أن تكون شراكة منصة عالمية رائدة تجمع الخبرات والخدمات
              والمنتجات والمعرفة في مكان واحد.
            </p>
          </section>

          <section className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#1976D2]">
              الرسالة
            </h2>
            <p className="text-gray-700 leading-8">
              تمكين الأفراد والمؤسسات من الوصول إلى المعرفة والخبرة
              والخدمات التي يحتاجونها.
            </p>
          </section>

          <section className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-[#1976D2]">
              قيم المنصة
            </h2>
            <p className="text-gray-700">
              الشفافية – الجودة – الثقة – الابتكار
            </p>
          </section>

          <section className="bg-white shadow-lg rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#1976D2]">
              تواصل معنا
            </h2>
            <p>البريد الإلكتروني</p>
            <p className="mt-2 font-semibold text-[#1976D2]">
              khaled139925@gmail.com
            </p>
          </section>

        </div>

      </div>

    </div>
  );
}