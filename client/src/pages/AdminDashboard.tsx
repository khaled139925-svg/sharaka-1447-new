import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Users, ShoppingBag, CreditCard, Eye, EyeOff, Trash2, Edit, CheckCircle, XCircle, Mail, Send, RefreshCw, Image, Video, DollarSign, Phone, MapPin, Award, Calendar, MessageSquare } from 'lucide-react';

interface Consultant {
  id: number;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  specialty: string;
  sub_specialty: string;
  is_active: boolean;
  is_frozen: boolean;
  created_at: string;
  ads: any[];
  payment_methods: any[];
  portfolio: any[];
  profile_image: string;
  country: string;
  city: string;
  experience: string;
  activity: string;
  price: string;
  currency: string;
  selected_services: string[];
  products: any[];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Consultant | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessageUser, setSelectedMessageUser] = useState<Consultant | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    frozenUsers: 0,
    totalAds: 0,
    totalServices: 0,
    totalProducts: 0
  });

  useEffect(() => {
    checkAdmin();
    loadData();
  }, []);

  const checkAdmin = () => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!adminLoggedIn) {
      navigate("/admin");
      return;
    }
  };

  const loadData = async () => {
    setLoading(true);
    
    // جلب جميع المستخدمين باستثناء الأدمن
    const { data: usersData } = await supabase
      .from("consultants")
      .select("*")
      .neq("id", 5)
      .order("created_at", { ascending: false });
    
    if (usersData) {
      setUsers(usersData);
      
      const activeUsers = usersData.filter(u => u.is_active === true && u.is_frozen === false).length;
      const frozenUsers = usersData.filter(u => u.is_frozen === true).length;
      const totalAds = usersData.reduce((sum, u) => sum + (u.ads?.length || 0), 0);
      const totalServices = usersData.reduce((sum, u) => sum + (u.selected_services?.length || 0), 0);
      const totalProducts = usersData.reduce((sum, u) => sum + (u.products?.length || 0), 0);
      
      setStats({
        totalUsers: usersData.length,
        activeUsers: activeUsers,
        frozenUsers: frozenUsers,
        totalAds: totalAds,
        totalServices: totalServices,
        totalProducts: totalProducts
      });
    }
    
    setLoading(false);
  };

  const toggleUserActive = async (userId: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from("consultants")
      .update({ is_active: !currentStatus, is_frozen: false })
      .eq("id", userId);
    
    if (!error) {
      loadData();
    }
  };

  const toggleUserFrozen = async (userId: number, currentStatus: boolean) => {
    const reason = currentStatus ? "" : prompt("سبب التجميد:");
    if (!currentStatus && !reason) return;
    
    const { error } = await supabase
      .from("consultants")
      .update({ is_frozen: !currentStatus, frozen_reason: reason || null })
      .eq("id", userId);
    
    if (!error) {
      loadData();
    }
  };

  const deleteUser = async (userId: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء")) {
      const { error } = await supabase
        .from("consultants")
        .delete()
        .eq("id", userId);
      
      if (!error) {
        loadData();
        alert("تم حذف المستخدم بنجاح");
      }
    }
  };

  const sendMessage = async () => {
    if (!selectedMessageUser || !newMessage.trim()) return;
    
    // الحصول على معرف الأدمن
    const { data: adminData } = await supabase
      .from("consultants")
      .select("id")
      .eq("email", "admin@sharaka.com")
      .single();
    
    const adminId = adminData?.id;
    if (!adminId) return;
    
    const { error } = await supabase.from("messages").insert({
      sender_id: adminId,
      receiver_id: selectedMessageUser.id,
      message: newMessage,
    });
    
    if (!error) {
      setNewMessage("");
      setShowMessageModal(false);
      alert("تم إرسال الرسالة بنجاح");
    } else {
      alert("خطأ في إرسال الرسالة: " + error.message);
    }
  };

  const deleteAd = async (userId: number, adIndex: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const updatedAds = [...(user.ads || [])];
    updatedAds.splice(adIndex, 1);
    
    const { error } = await supabase
      .from("consultants")
      .update({ ads: updatedAds })
      .eq("id", userId);
    
    if (!error) {
      loadData();
      alert("تم حذف الإعلان بنجاح");
    }
  };

  const deletePaymentMethod = async (userId: number, paymentIndex: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const updatedPayments = [...(user.payment_methods || [])];
    updatedPayments.splice(paymentIndex, 1);
    
    const { error } = await supabase
      .from("consultants")
      .update({ payment_methods: updatedPayments })
      .eq("id", userId);
    
    if (!error) {
      loadData();
      alert("تم حذف طريقة الدفع بنجاح");
    }
  };

  const deletePortfolioItem = async (userId: number, portfolioIndex: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const updatedPortfolio = [...(user.portfolio || [])];
    updatedPortfolio.splice(portfolioIndex, 1);
    
    const { error } = await supabase
      .from("consultants")
      .update({ portfolio: updatedPortfolio })
      .eq("id", userId);
    
    if (!error) {
      loadData();
      alert("تم حذف العنصر بنجاح");
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const { data } = supabase.storage.from('media').getPublicUrl(url);
    return data.publicUrl;
  };

  const getServiceName = (serviceId: string) => {
    if (serviceId === "consulting") return "جلسات استشارية";
    if (serviceId === "training") return "دورات تدريبية";
    if (serviceId === "products") return "متجر";
    if (serviceId === "individual") return "جلسات فردية";
    if (serviceId === "workshop") return "ورش عمل";
    return serviceId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9800] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1976D2] to-[#FF9800] rounded-2xl p-6 mb-8 text-white">
          <h1 className="text-3xl font-bold">لوحة التحكم الإدارية</h1>
          <p className="opacity-90 mt-2">إدارة المستخدمين والإعلانات</p>
          <button
            onClick={() => {
              localStorage.removeItem("adminLoggedIn");
              navigate("/");
            }}
            className="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
          >
            تسجيل خروج
          </button>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Users size={28} className="mx-auto text-[#1976D2] mb-2" />
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">المستخدمين</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <CheckCircle size={28} className="mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
            <p className="text-sm text-gray-500">نشطاء</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <XCircle size={28} className="mx-auto text-red-600 mb-2" />
            <p className="text-2xl font-bold">{stats.frozenUsers}</p>
            <p className="text-sm text-gray-500">مجمّدين</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <ShoppingBag size={28} className="mx-auto text-[#FF9800] mb-2" />
            <p className="text-2xl font-bold">{stats.totalAds}</p>
            <p className="text-sm text-gray-500">إعلانات</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Award size={28} className="mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold">{stats.totalServices}</p>
            <p className="text-sm text-gray-500">خدمات</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <CreditCard size={28} className="mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
            <p className="text-sm text-gray-500">منتجات</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-semibold transition ${activeTab === "users" ? "text-[#FF9800] border-b-2 border-[#FF9800]" : "text-gray-500"}`}
          >
            👥 المستخدمين
          </button>
        </div>

        {/* محتوى المستخدمين */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1976D2] to-[#FF9800] flex items-center justify-center text-white font-bold">
                      {(user.full_name || user.company_name || "م")[0]}
                    </div>
                    <div>
                      <h3 className="font-bold">{user.full_name || user.company_name || "بدون اسم"}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.specialty || "لا يوجد تخصص"}</p>
                      {user.selected_services && user.selected_services.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.selected_services.slice(0, 2).map(s => (
                            <span key={s} className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                              {getServiceName(s)}
                            </span>
                          ))}
                          {user.selected_services.length > 2 && (
                            <span className="text-xs text-gray-400">+{user.selected_services.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.is_active && !user.is_frozen ? "bg-green-100 text-green-700" : user.is_frozen ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                      {user.is_active && !user.is_frozen ? "نشط" : user.is_frozen ? "مجمّد" : "غير مفعّل"}
                    </span>
                    
                    <button
                      onClick={() => toggleUserActive(user.id, user.is_active)}
                      className={`p-2 rounded-lg transition ${user.is_active ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                      title={user.is_active ? "إيقاف" : "تفعيل"}
                    >
                      {user.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    
                    <button
                      onClick={() => toggleUserFrozen(user.id, user.is_frozen)}
                      className={`p-2 rounded-lg transition ${user.is_frozen ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                      title={user.is_frozen ? "إلغاء التجميد" : "تجميد"}
                    >
                      {user.is_frozen ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedMessageUser(user);
                        setShowMessageModal(true);
                      }}
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      title="إرسال رسالة"
                    >
                      <Send size={16} />
                    </button>
                    
                    <button
                      onClick={() => navigate(`/messages/${user.id}`)}
                      className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                      title="فتح المحادثة"
                    >
                      <MessageSquare size={16} />
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      title="عرض التفاصيل"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* نافذة تفاصيل المستخدم */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUserModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">تفاصيل المستخدم</h2>
              <button onClick={() => setShowUserModal(false)} className="text-2xl hover:text-red-500">✕</button>
            </div>
            <div className="p-6">
              {/* صورة المستخدم */}
              {selectedUser.profile_image && (
                <div className="text-center mb-6">
                  <img src={getImageUrl(selectedUser.profile_image)} alt="صورة" className="w-32 h-32 rounded-full mx-auto object-cover" />
                </div>
              )}
              
              {/* المعلومات الأساسية */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div><b>الاسم:</b> {selectedUser.full_name || selectedUser.company_name || "-"}</div>
                <div><b>البريد:</b> {selectedUser.email || "-"}</div>
                <div><b>الهاتف:</b> {selectedUser.phone || "-"}</div>
                <div><b>الدولة/المدينة:</b> {selectedUser.city && selectedUser.country ? `${selectedUser.city}, ${selectedUser.country}` : (selectedUser.country || selectedUser.city || "-")}</div>
                <div><b>التخصص:</b> {selectedUser.specialty || "-"} {selectedUser.sub_specialty ? `(${selectedUser.sub_specialty})` : ""}</div>
                <div><b>الخبرة:</b> {selectedUser.experience || "-"} سنة</div>
                <div><b>السعر:</b> {selectedUser.price || "-"} {selectedUser.currency || "ريال"}/ساعة</div>
                <div><b>نوع الخدمة:</b> {selectedUser.activity || "-"}</div>
                <div><b>الخدمات المقدمة:</b> {selectedUser.selected_services?.map(s => getServiceName(s)).join(", ") || "-"}</div>
                <div><b>عدد المنتجات:</b> {selectedUser.products?.length || 0}</div>
              </div>

              {/* الإعلانات */}
              {selectedUser.ads && selectedUser.ads.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-[#FF9800] mb-2">الإعلانات ({selectedUser.ads.length})</h3>
                  <div className="space-y-2">
                    {selectedUser.ads.map((ad: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                        <p><b>{ad.title || "بدون عنوان"}</b></p>
                        <p className="text-sm text-gray-600">{ad.description || "لا يوجد وصف"}</p>
                        {ad.image && <img src={getImageUrl(ad.image)} className="w-20 h-20 object-cover mt-2 rounded" />}
                        {ad.price && <p className="text-sm text-[#FF9800] mt-1">السعر: {ad.price} ريال</p>}
                        {ad.contact && <p className="text-sm text-gray-500">للتواصل: {ad.contact}</p>}
                        <button onClick={() => deleteAd(selectedUser.id, idx)} className="mt-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">حذف الإعلان</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* طرق الدفع */}
              {selectedUser.payment_methods && selectedUser.payment_methods.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-[#1976D2] mb-2">طرق الدفع</h3>
                  <div className="space-y-2">
                    {selectedUser.payment_methods.map((p: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center border-b pb-2">
                        <span><b>{p.method}</b>: {p.details}</span>
                        <button onClick={() => deletePaymentMethod(selectedUser.id, idx)} className="text-xs text-red-500">حذف</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* المنتجات */}
              {selectedUser.products && selectedUser.products.length > 0 && (
                <div>
                  <h3 className="font-bold text-[#1976D2] mb-2">المنتجات ({selectedUser.products.length})</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedUser.products.map((product: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-2">
                        {product.image && <img src={getImageUrl(product.image)} className="w-full h-24 object-cover rounded mb-1" />}
                        <p className="font-semibold text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.price} ريال</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* نافذة إرسال رسالة */}
      {showMessageModal && selectedMessageUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMessageModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">إرسال رسالة إلى {selectedMessageUser.full_name || selectedMessageUser.company_name}</h2>
              <button onClick={() => setShowMessageModal(false)} className="text-2xl hover:text-red-500">✕</button>
            </div>
            <div className="p-6">
              <textarea
                rows={5}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
                placeholder="اكتب رسالتك هنا..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={sendMessage}
                className="mt-4 w-full bg-[#FF9800] text-white py-2 rounded-lg hover:bg-orange-500 transition flex items-center justify-center gap-2"
              >
                <Send size={18} /> إرسال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}