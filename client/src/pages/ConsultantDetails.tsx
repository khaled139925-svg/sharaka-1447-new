import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { X, Mail, Phone, Globe, Instagram, Youtube, Linkedin, MessageCircle } from 'lucide-react';

export default function ConsultantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    loadConsultant();
  }, [id]);

  const loadConsultant = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("consultants")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setConsultant(data);
    }
    setLoading(false);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const val = (v: any) => (v && v !== "" ? v : "-");

  // دوال الروابط
  const getWhatsAppLink = (value: string) => {
    let phone = value.replace(/[^0-9+]/g, '');
    if (!phone.startsWith('+')) phone = '+' + phone;
    return `https://wa.me/${phone}`;
  };

  const getPhoneLink = (value: string) => {
    let phone = value.replace(/[^0-9+]/g, '');
    if (!phone.startsWith('+') && phone.length > 0) phone = '+' + phone;
    return `tel:${phone}`;
  };

  const getEmailLink = (value: string) => `mailto:${value}`;
  const getWebLink = (value: string) => {
    if (!value.startsWith('http://') && !value.startsWith('https://')) return `https://${value}`;
    return value;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9800] mx-auto"></div>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">المستشار غير موجود</p>
      </div>
    );
  }

  const adsList = consultant.ads && Array.isArray(consultant.ads) ? consultant.ads : [];
  const paymentsList = consultant.payment_methods && Array.isArray(consultant.payment_methods) ? consultant.payment_methods : [];
  const portfolioList = consultant.portfolio && Array.isArray(consultant.portfolio) ? consultant.portfolio : [];
  
  // التحقق من تسجيل الدخول
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = localStorage.getItem("user");
  const currentUserId = currentUser ? JSON.parse(currentUser).id : null;
  const isNotSelf = consultant.id !== currentUserId;

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-5xl mx-auto px-6">
        
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-[#1976D2] hover:text-[#FF9800] flex items-center gap-2 transition"
        >
          <span>←</span> رجوع
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* صورة الغلاف */}
          <div className="h-48 bg-gradient-to-r from-[#1976D2] to-[#FF9800] relative">
            {consultant.profile_image && (
              <img
                src={consultant.profile_image}
                alt="صورة الغلاف"
                className="w-full h-full object-cover opacity-50 cursor-pointer"
                onClick={() => openImageModal(consultant.profile_image)}
              />
            )}
            <div className="absolute -bottom-12 right-8">
              <div 
                className="w-28 h-28 rounded-full bg-white shadow-lg border-4 border-white overflow-hidden cursor-pointer hover:scale-105 transition"
                onClick={() => consultant.profile_image && openImageModal(consultant.profile_image)}
              >
                {consultant.profile_image ? (
                  <img
                    src={consultant.profile_image}
                    alt="صورة شخصية"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl">
                    {consultant.account_type === "individual" ? "👤" : "🏢"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 p-8">
            
            <h1 className="text-2xl font-bold text-gray-800">
              {consultant.full_name || consultant.company_name || "مستشار"}
            </h1>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {consultant.specialty && (
                <span className="bg-[#FF9800] text-white px-3 py-1 rounded-full text-sm">
                  {consultant.specialty}
                </span>
              )}
              {consultant.sub_specialty && (
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {consultant.sub_specialty}
                </span>
              )}
            </div>

            <hr className="my-6" />

            <div className="grid md:grid-cols-2 gap-4">
              <div><b>الدولة:</b> {val(consultant.country)}</div>
              <div><b>المدينة:</b> {val(consultant.city)}</div>
              <div><b>سنوات الخبرة:</b> {val(consultant.experience)}</div>
              <div><b>نوع الخدمة:</b> {val(consultant.activity)}</div>
              <div><b>السعر:</b> {val(consultant.price)} {val(consultant.currency)}/ساعة</div>
              <div><b>برامج الاجتماعات:</b> {val(consultant.meeting_platforms)}</div>
            </div>

            {consultant.bio && (
              <>
                <hr className="my-6" />
                <div>
                  <h2 className="text-xl font-bold text-[#1976D2] mb-3">النبذة</h2>
                  <p className="text-gray-700 leading-relaxed">{consultant.bio}</p>
                </div>
              </>
            )}

            <hr className="my-6" />
            
            {/* أزرار التواصل */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowContact(!showContact)}
                className="bg-[#1976D2] text-white px-6 py-2 rounded-lg hover:bg-[#1565C0] transition"
              >
                {showContact ? "إخفاء معلومات التواصل" : "تواصل"}
              </button>

              {/* زر المراسلة - يظهر فقط للمستخدمين المسجلين وليس لنفسه */}
              {isLoggedIn && isNotSelf && (
                <button
                  onClick={() => navigate(`/messages/${consultant.id}`)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  مراسلة {consultant.full_name || consultant.company_name}
                </button>
              )}
            </div>

            {showContact && (
              <div className="mt-4 grid md:grid-cols-2 gap-3">
                {consultant.whatsapp && (
                  <a href={getWhatsAppLink(consultant.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:text-green-700 transition p-2 rounded-lg hover:bg-green-50">
                    <MessageCircle size={18} /> <span>واتساب: {consultant.whatsapp}</span>
                  </a>
                )}
                {consultant.phone && (
                  <a href={getPhoneLink(consultant.phone)} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition p-2 rounded-lg hover:bg-blue-50">
                    <Phone size={18} /> <span>هاتف: {consultant.phone}</span>
                  </a>
                )}
                {consultant.email && (
                  <a href={getEmailLink(consultant.email)} className="flex items-center gap-2 text-red-600 hover:text-red-700 transition p-2 rounded-lg hover:bg-red-50">
                    <Mail size={18} /> <span>بريد: {consultant.email}</span>
                  </a>
                )}
                {consultant.other_contact && (
                  <div className="flex items-center gap-2 text-gray-600 p-2">
                    <Globe size={18} /> <span>وسيلة أخرى: {consultant.other_contact}</span>
                  </div>
                )}
              </div>
            )}

            {/* الروابط الاجتماعية */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-[#1976D2] mb-3">الروابط</h2>
              <div className="flex flex-wrap gap-3">
                {consultant.website && (
                  <a href={getWebLink(consultant.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                    <Globe size={18} className="text-blue-600" /> <span>الموقع الإلكتروني</span>
                  </a>
                )}
                {consultant.linkedin && (
                  <a href={getWebLink(consultant.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                    <Linkedin size={18} className="text-blue-700" /> <span>لينكدإن</span>
                  </a>
                )}
                {consultant.instagram && (
                  <a href={getWebLink(consultant.instagram)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                    <Instagram size={18} className="text-pink-600" /> <span>انستغرام</span>
                  </a>
                )}
                {consultant.youtube && (
                  <a href={getWebLink(consultant.youtube)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                    <Youtube size={18} className="text-red-600" /> <span>يوتيوب</span>
                  </a>
                )}
                {consultant.tiktok && (
                  <a href={getWebLink(consultant.tiktok)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                    <span className="text-black">🎵</span> <span>تيك توك</span>
                  </a>
                )}
                {consultant.telegram && (
                  <a href={getWebLink(consultant.telegram)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                    <span className="text-blue-400">✈️</span> <span>تيليجرام</span>
                  </a>
                )}
                {consultant.snapchat && (
                  <a href={getWebLink(consultant.snapchat)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">
                    <span className="text-yellow-600">👻</span> <span>سناب شات</span>
                  </a>
                )}
              </div>
            </div>

            {/* الإعلانات */}
            {adsList.length > 0 && (
              <>
                <hr className="my-6" />
                <h2 className="text-xl font-bold text-[#FF9800] mb-3">الإعلانات ({adsList.length})</h2>
                <div className="space-y-4">
                  {adsList.map((ad: any, idx: number) => (
                    <div key={idx} className="border rounded-xl p-4 hover:shadow-md transition">
                      <h3 className="font-bold text-lg">{ad.title || "بدون عنوان"}</h3>
                      <p className="text-gray-600 mt-1">{ad.description || "لا يوجد وصف"}</p>
                      {ad.image && (
                        <div className="mt-3">
                          <img src={ad.image} alt="صورة الإعلان" className="max-h-48 rounded-lg border cursor-pointer hover:opacity-90 transition" onClick={() => openImageModal(ad.image)} />
                        </div>
                      )}
                      {ad.video && (
                        <div className="mt-3">
                          <video src={ad.video} controls className="max-h-48 rounded-lg border" />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        {ad.price && <span className="text-[#FF9800] font-bold">💰 {ad.price} ريال</span>}
                        {ad.contact && <span className="text-gray-500">📞 {ad.contact}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* طرق الدفع */}
            {paymentsList.length > 0 && (
              <>
                <hr className="my-6" />
                <h2 className="text-xl font-bold text-[#1976D2] mb-3">طرق الدفع ({paymentsList.length})</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {paymentsList.map((p: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-3 flex justify-between items-center">
                      <span className="font-semibold">{p.method || "-"}</span>
                      <span className="text-gray-600">{p.details || "-"}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* معرض الأعمال */}
            {portfolioList.length > 0 && (
              <>
                <hr className="my-6" />
                <h2 className="text-xl font-bold text-[#1976D2] mb-3">معرض الأعمال ({portfolioList.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {portfolioList.map((item: any, idx: number) => (
                    <div key={idx} className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition" onClick={() => item.type === "image" && openImageModal(item.url)}>
                      {item.type === "image" && <img src={item.url} alt="عمل" className="w-full h-32 object-cover" />}
                      {item.type === "video" && <video src={item.url} controls className="w-full h-32 object-cover" onClick={(e) => e.stopPropagation()} />}
                      {item.type === "video_link" && <iframe src={item.url} className="w-full h-32" title="فيديو" />}
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* نافذة عرض الصورة المكبرة */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
          <div className="relative max-w-5xl max-h-[90vh]">
            <button onClick={closeImageModal} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"><X size={32} /></button>
            <img src={selectedImage} alt="صورة مكبرة" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}