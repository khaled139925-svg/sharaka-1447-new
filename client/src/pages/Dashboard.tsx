import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Edit, LogOut, User, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, MessageSquare, ShoppingBag, CreditCard, Image } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate(`/edit-profile/${user?.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9800] mx-auto"></div>
      </div>
    );
  }

  const displayName = user?.full_name || user?.company_name || user?.email?.split('@')[0];
  const adsList = user?.ads && Array.isArray(user.ads) ? user.ads : [];
  const paymentsList = user?.payment_methods && Array.isArray(user.payment_methods) ? user.payment_methods : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#1976D2] to-[#FF9800] flex items-center justify-center text-white text-2xl">
                {displayName?.[0] || "م"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{displayName}</h1>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-sm text-[#FF9800]">{user?.account_type === "individual" ? "حساب فرد" : "حساب منشأة"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
            >
              <LogOut size={18} />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleEditProfile}
            className="bg-[#1976D2] text-white p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#1565C0] transition"
          >
            <Edit size={22} />
            <span className="font-bold">تعديل الملف الشخصي</span>
          </button>
          
          <button
            onClick={() => navigate("/messages")}
            className="bg-purple-600 text-white p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-purple-700 transition"
          >
            <MessageSquare size={22} />
            <span className="font-bold">الرسائل</span>
          </button>
          
          <button
            onClick={() => navigate(`/consultant/${user?.id}`)}
            className="bg-[#FF9800] text-white p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-orange-500 transition"
          >
            <User size={22} />
            <span className="font-bold">عرض صفحتي العامة</span>
          </button>
        </div>

        {/* معلومات الملف الشخصي */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-[#1976D2] mb-6">معلومات الملف الشخصي</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User size={20} className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">الاسم</p>
                <p className="font-semibold">{displayName || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                <p className="font-semibold">{user?.email || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">رقم الهاتف</p>
                <p className="font-semibold">{user?.phone || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">الموقع</p>
                <p className="font-semibold">{user?.city && user?.country ? `${user.city}, ${user.country}` : (user?.country || user?.city || "-")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase size={20} className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">التخصص</p>
                <p className="font-semibold">{user?.specialty || "-"} {user?.sub_specialty ? `(${user.sub_specialty})` : ""}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign size={20} className="text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">السعر</p>
                <p className="font-semibold">{user?.price ? `${user.price} ${user.currency}/ساعة` : "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* الإعلانات */}
        {adsList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-bold text-[#FF9800] mb-4 flex items-center gap-2">
              <ShoppingBag size={20} />
              الإعلانات ({adsList.length})
            </h3>
            <div className="space-y-3">
              {adsList.slice(0, 3).map((ad: any, idx: number) => (
                <div key={idx} className="border-b pb-2">
                  <p className="font-semibold">{ad.title || "بدون عنوان"}</p>
                  <p className="text-sm text-gray-500">{ad.description || "لا يوجد وصف"}</p>
                </div>
              ))}
              {adsList.length > 3 && (
                <p className="text-sm text-[#1976D2]">+ {adsList.length - 3} إعلانات أخرى</p>
              )}
            </div>
          </div>
        )}

        {/* طرق الدفع */}
        {paymentsList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-bold text-[#1976D2] mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              طرق الدفع ({paymentsList.length})
            </h3>
            <div className="space-y-2">
              {paymentsList.map((p: any, idx: number) => (
                <div key={idx} className="border-b pb-2">
                  <p className="font-semibold">{p.method || "-"}</p>
                  <p className="text-sm text-gray-500">{p.details || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* زر العودة للرئيسية */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ← العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}