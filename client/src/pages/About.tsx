export default function About({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">

<button
onClick={() => onNavigate("home")}
className="mb-10 text-blue-600 hover:text-orange-500 text-lg"
>
العودة للرئيسية
</button>

      <h1 className="text-4xl font-bold text-center mb-16 text-orange-500">
        عن منصة شراكة
      </h1>

      <div className="max-w-5xl mx-auto space-y-10">

        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">من نحن</h2>
          <p>هنا سيكتب تعريف منصة شراكة.</p>
        </section>

        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">الرؤية</h2>
          <p>رؤية المنصة المستقبلية.</p>
        </section>

        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">الرسالة</h2>
          <p>رسالة المنصة ودورها في المجتمع.</p>
        </section>

        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">أهداف المنصة</h2>
          <p>أهداف منصة شراكة في تقديم المعرفة والاستشارات.</p>
        </section>

        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">قيم المنصة</h2>
          <p>الشفافية – الجودة – الثقة – الابتكار.</p>
        </section>

        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">كيف تعمل المنصة</h2>
          <p>شرح مبسط لكيفية استخدام المنصة وحجز الاستشارات.</p>
        </section>

        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">لماذا شراكة</h2>
          <p>أسباب تميز منصة شراكة عن غيرها.</p>
        </section>

        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">الأسئلة الشائعة</h2>
          <p>أكثر الأسئلة التي يطرحها المستخدمون.</p>
        </section>

        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">سياسة الخصوصية</h2>
          <p>سياسة حماية بيانات المستخدمين.</p>
        </section>

        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">الشروط والأحكام</h2>
          <p>القواعد المنظمة لاستخدام المنصة.</p>
        </section>

        <section className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">إخلاء المسؤولية</h2>
          <p>تنبيه قانوني حول طبيعة الاستشارات.</p>
        </section>

        <section className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">تواصل معنا</h2>
          <p>البريد الإلكتروني:</p>
          <p className="mt-2 font-semibold">info@sharaka1447.com</p>
        </section>

      </div>

    </div>
  );
}