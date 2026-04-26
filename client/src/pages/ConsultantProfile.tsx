<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ChatWindow from "../components/ChatWindow";

export default function ConsultantProfile() {
  const { id } = useParams(); // استلام id من الرابط
  const navigate = useNavigate();

  // بيانات المستشار والإعلانات وطرق الدفع
  const [consultant, setConsultant] = useState<any>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // حالة الدردشة والمستخدم الحالي
  const [showChat, setShowChat] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // جلب بيانات المستشار والإعلانات وطرق الدفع
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);

      // جلب بيانات المستشار
      const { data: consData } = await supabase
        .from("consultants")
        .select("*")
        .eq("id", id)
        .single();
      setConsultant(consData);

      // جلب الإعلانات
      const { data: adsData } = await supabase
        .from("ads")
        .select("*")
        .eq("consultant_id", id);
      setAds(adsData || []);

      // جلب طرق الدفع
      const { data: payData } = await supabase
        .from("payments")
        .select("*")
        .eq("consultant_id", id);
      setPayments(payData || []);

      setLoading(false);
    };

    loadData();
  }, [id]);

  // جلب المستخدم الحالي
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    };
    getUser();

    // مراقبة تغييرات حالة المصادقة
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // فتح الدردشة تلقائياً إذا كان الرابط يحوي ?openChat=true (بعد العودة من تسجيل الدخول)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("openChat") === "true") {
      setShowChat(true);
      // إزالة المعامل من الرابط حتى لا تفتح الدردشة مرة أخرى عند تحديث الصفحة
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleMessage = () => {
    if (!currentUser) {
      // حفظ المسار الحالي لفتح الدردشة بعد تسجيل الدخول
      localStorage.setItem("returnTo", window.location.pathname);
      localStorage.setItem("openChat", "true");
      navigate("/login");
      return;
    }
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    // إزالة أي معامل openChat من الرابط (لضمان عدم إعادة فتح الدردشة)
    window.history.replaceState({}, "", window.location.pathname);
  };

  if (loading) return <div className="p-10 text-center">جاري التحميل...</div>;
  if (!consultant) return <div className="p-10 text-center">المستشار غير موجود</div>;

  return (
    <div className="p-10">
      <img
        src={consultant.profile_image}
        alt="صورة شخصية"
        className="w-40 h-40 rounded mb-4"
      />
      <h1 className="text-2xl font-bold">{consultant.name}</h1>
      <p className="text-gray-600">{consultant.specialty}</p>
      <p className="mt-2">{consultant.bio}</p>

      {/* زر المراسلة */}
      <button
        onClick={handleMessage}
        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition"
      >
        💬 مراسلة
      </button>

      {/* الإعلانات */}
      <h2 className="mt-6 text-xl font-bold">الإعلانات</h2>
      {ads.length === 0 ? (
        <p>لا توجد إعلانات</p>
      ) : (
        ads.map((ad) => (
          <div key={ad.id} className="border p-4 rounded mt-2">
            <h3 className="font-bold">{ad.title}</h3>
            <p>{ad.description}</p>
          </div>
        ))
      )}

      {/* طرق الدفع */}
      <h2 className="mt-6 text-xl font-bold">طرق الدفع</h2>
      {payments.length === 0 ? (
        <p>لا توجد طرق دفع مسجلة</p>
      ) : (
        payments.map((p) => (
          <div key={p.id} className="border p-4 rounded mt-2">
            {p.method} – {p.details}
          </div>
        ))
      )}

      {/* نافذة الدردشة */}
      {showChat && (
        <ChatWindow
          otherUserId={consultant.user_id}
          otherUserName={consultant.name}
          onClose={handleCloseChat}
        />
      )}
=======
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function CreateProfile() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [contact, setContact] = useState("");

  const navigate = useNavigate();

  async function handleSubmit() {
    const { error } = await supabase.from("profiles").insert([
      { name, title, bio, contact }
    ]);

    if (error) {
      alert("خطأ");
      return;
    }

    navigate("/");
  }

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>إنشاء حساب</h2>

      <input placeholder="الاسم" onChange={(e) => setName(e.target.value)} />
      <input placeholder="المجال" onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="نبذة" onChange={(e) => setBio(e.target.value)} />
      <input placeholder="رقم / واتساب" onChange={(e) => setContact(e.target.value)} />

      <button onClick={handleSubmit}>حفظ</button>
>>>>>>> temp-preview
    </div>
  );
}