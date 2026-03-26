import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { X, Mail, Phone, Globe, Instagram, Youtube, Linkedin, MessageCircle, MapPin, Award, DollarSign, Calendar, Image, Video, ChevronDown, ChevronUp } from 'lucide-react';

export default function ConsultantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // حالات لعرض/إخفاء المحتوى
  const [showAdsImages, setShowAdsImages] = useState<{ [key: number]: boolean }>({});
  const [showPortfolioImages, setShowPortfolioImages] = useState(false);
  const [expandedAds, setExpandedAds] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (e) {
        console.log("خطأ في قراءة المستخدم");
      }
    }
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

  const toggleAdImages = (adIndex: number) => {
    setShowAdsImages(prev => ({ ...prev, [adIndex]: !prev[adIndex] }));
  };

  const toggleAdExpanded = (adIndex: number) => {
    setExpandedAds(prev => ({ ...prev, [adIndex]: !prev[adIndex] }));
  };

  const togglePortfolioImages = () => {
    setShowPortfolioImages(!showPortfolioImages);
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
  const hasImages = portfolioList.some(item => item.type === "image" || item.type === "video");

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        <button
          onClick={() => navigate(-1)}
          className="mb-4 md:mb-6 text-[#1976D2] hover:text-[#FF9800] flex items-center gap-2 transition text-sm md:text-base"
        >
          <span>←</span> رجوع
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* صورة الغلاف */}
          <div className="h-32 md:h-48 bg-gradient-to-r from-[#1976D2] to-[#FF9800] relative">
            {consultant.profile_image && (
              <img
                src={consultant.profile_image}
                alt="صورة الغلاف"
                className="w-full h-full object-cover opacity-50 cursor-pointer"
                onClick={() => openImageModal(consultant.profile_image)}
              />
            )}
            <div className="absolute -bottom-8 md:-bottom-12 right-4 md:right-8">
              <div 
                className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white shadow-lg border-4 border-white overflow-hidden cursor-pointer hover:scale-105 transition"
                onClick={() => consultant.profile_image && openImageModal(consultant.profile_image)}
              >
                {consultant.profile_image ? (
                  <img
                    src={consultant.profile_image}
                    alt="صورة شخصية"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl md:text-3xl">
                    {consultant.account_type === "individual" ? "👤" : "🏢"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-12 md:pt-16 p-4 md:p-8">
            
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {consultant.full_name || consultant.company_name || "مستشار"}
            </h1>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {consultant.specialty && (
                <span className="bg-[#FF9800] text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm">
                  {consultant.specialty}
                </span>
              )}
              {consultant.sub_specialty && (
                <span className="bg-gray-200 text-gray-700 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm">
                  {consultant.sub_specialty}
                </span>
              )}
            </div>

            <hr className="my-4 md:my-6" />

            {/* المعلومات الأساسية - على شكل كروت */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="bg-gray-50 rounded-xl p-3 md:p-4 flex items-center gap-3">
                <MapPin size={18} className="text-[#1976D2] shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">الموقع</p>
                  <p className="font-medium text-sm md:text-base">{consultant.city && consultant.country ? `${consultant.city}, ${consultant.country}` : val(consultant.country || consultant.city)}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 md:p-4 flex items-center gap-3">
                <Award size={18} className="text-[#FF9800] shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">الخبرة</p>
                  <p className="font-medium text-sm md:text-base">{val(consultant.experience)} سنة</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 md:p-4 flex items-center gap-3">
                <Calendar size={18} className="text-[#1976D2] shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">نوع الخدمة</p>
                  <p className="font-medium text-sm md:text-base">{val(consultant.activity)}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 md:p-4 flex items-center gap-3">
                <DollarSign size={18} className="text-green-600 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">السعر</p>
                  <p className="font-medium text-sm md:text-base">{val(consultant.price)} {val(consultant.currency)}/ساعة</p>
                </div>
              </div>
            </div>

            {/* برامج الاجتماعات */}
            {consultant.meeting_platforms && consultant.meeting_platforms !== "-" && (
              <div className="mt-4 md:mt-6 bg-gray-50 rounded-xl p-3 md:p-4">
                <p className="text-xs text-gray-500 mb-2">برامج الاجتماعات</p>
                <div className="flex flex-wrap gap-2">
                  {consultant.meeting_platforms.split(", ").map((platform: string, idx: number) => (
                    <span key={idx} className="bg-white px-2 py-1 rounded-lg text-xs shadow-sm">{platform}</span>
                  ))}
                </div>
              </div>
            )}

            {consultant.bio && (
              <>
                <hr className="my-4 md:my-6" />
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-[#1976D2] mb-2 md:mb-3">النبذة</h2>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">{consultant.bio}</p>
                </div>
              </>
            )}

            <hr className="my-4 md:my-6" />
            
            {/* طرق الاتصال */}
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#1976D2] mb-3 md:mb-4">طرق الاتصال</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {consultant.whatsapp && (
                  <a href={getWhatsAppLink(consultant.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition">
                    <MessageCircle size={20} className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">واتساب</p>
                      <p className="font-medium text-sm">{consultant.whatsapp}</p>
                    </div>
                  </a>
                )}
                {consultant.phone && (
                  <a href={getPhoneLink(consultant.phone)} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                    <Phone size={20} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">هاتف</p>
                      <p className="font-medium text-sm">{consultant.phone}</p>
                    </div>
                  </a>
                )}
                {consultant.email && (
                  <a href={getEmailLink(consultant.email)} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl hover:bg-red-100 transition">
                    <Mail size={20} className="text-red-600" />
                    <div>
                      <p className="text-xs text-gray-500">بريد إلكتروني</p>
                      <p className="font-medium text-sm">{consultant.email}</p>
                    </div>
                  </a>
                )}
                {consultant.other_contact && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Globe size={20} className="text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">وسيلة أخرى</p>
                      <p className="font-medium text-sm">{consultant.other_contact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* زر المراسلة */}
            <div className="mt-4 md:mt-6">
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    navigate(`/messages/${consultant.id}`);
                  } else {
                    if (confirm("يرجى تسجيل الدخول أولاً للتمكن من مراسلة المستشار. هل تريد الانتقال إلى صفحة تسجيل الدخول؟")) {
                      navigate("/login");
                    }
                  }
                }}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition flex items-center justify-center gap-2 font-medium"
              >
                <MessageCircle size={20} />
                مراسلة {consultant.full_name || consultant.company_name}
              </button>
            </div>

            {/* الروابط الاجتماعية */}
            <div className="mt-6 md:mt-8">
              <h2 className="text-lg md:text-xl font-bold text-[#1976D2] mb-3 md:mb-4">الروابط</h2>
              <div className="flex flex-wrap gap-3">
                {consultant.website && (
                  <a href={getWebLink(consultant.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition text-sm">
                    <Globe size={16} className="text-blue-600" /> <span>الموقع الإلكتروني</span>
                  </a>
                )}
                {consultant.linkedin && (
                  <a href={getWebLink(consultant.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition text-sm">
                    <Linkedin size={16} className="text-blue-700" /> <span>لينكدإن</span>
                  </a>
                )}
                {consultant.instagram && (
                  <a href={getWebLink(consultant.instagram)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition text-sm">
                    <Instagram size={16} className="text-pink-600" /> <span>انستغرام</span>
                  </a>
                )}
                {consultant.youtube && (
                  <a href={getWebLink(consultant.youtube)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition text-sm">
                    <Youtube size={16} className="text-red-600" /> <span>يوتيوب</span>
                  </a>
                )}
              </div>
            </div>

            {/* الإعلانات - مع زر عرض الصور */}
            {adsList.length > 0 && (
              <>
                <hr className="my-4 md:my-6" />
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-[#FF9800] mb-3 md:mb-4">الإعلانات ({adsList.length})</h2>
                  <div className="space-y-3 md:space-y-4">
                    {adsList.map((ad: any, idx: number) => (
                      <div key={idx} className="border rounded-xl p-3 md:p-4 hover:shadow-md transition">
                        <div 
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleAdExpanded(idx)}
                        >
                          <h3 className="font-bold text-base md:text-lg">{ad.title || "بدون عنوان"}</h3>
                          {expandedAds[idx] ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                        </div>
                        
                        {expandedAds[idx] && (
                          <>
                            <p className="text-gray-600 mt-2 text-sm">{ad.description || "لا يوجد وصف"}</p>
                            
                            {/* عرض الصور والفيديو مع زر إظهار/إخفاء */}
                            {(ad.image || ad.video) && (
                              <div className="mt-3">
                                <button
                                  onClick={() => toggleAdImages(idx)}
                                  className="flex items-center gap-2 text-[#1976D2] text-sm hover:text-[#FF9800] transition"
                                >
                                  {showAdsImages[idx] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                  {showAdsImages[idx] ? "إخفاء الوسائط" : "عرض الوسائط"}
                                  {ad.image && <Image size={14} />}
                                  {ad.video && <Video size={14} />}
                                </button>
                                
                                {showAdsImages[idx] && (
                                  <div className="mt-2">
                                    {ad.image && (
                                      <img 
                                        src={ad.image} 
                                        alt="صورة الإعلان" 
                                        className="max-h-48 rounded-lg border cursor-pointer hover:opacity-90 transition" 
                                        onClick={() => openImageModal(ad.image)} 
                                      />
                                    )}
                                    {ad.video && (
                                      <video 
                                        src={ad.video} 
                                        controls 
                                        className="max-h-48 rounded-lg border mt-2" 
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-3 md:gap-4 mt-3 text-xs md:text-sm">
                              {ad.price && <span className="text-[#FF9800] font-bold">💰 {ad.price} ريال</span>}
                              {ad.contact && <span className="text-gray-500">📞 {ad.contact}</span>}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* طرق الدفع */}
            {paymentsList.length > 0 && (
              <>
                <hr className="my-4 md:my-6" />
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-[#1976D2] mb-3 md:mb-4">طرق الدفع ({paymentsList.length})</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {paymentsList.map((p: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-2 md:p-3 flex justify-between items-center text-sm">
                        <span className="font-semibold">{p.method || "-"}</span>
                        <span className="text-gray-600 text-xs md:text-sm">{p.details || "-"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* معرض الأعمال - مع زر عرض الصور */}
            {portfolioList.length > 0 && (
              <>
                <hr className="my-4 md:my-6" />
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-[#1976D2] mb-3 md:mb-4">معرض الأعمال ({portfolioList.length})</h2>
                  
                  <button
                    onClick={togglePortfolioImages}
                    className="flex items-center gap-2 text-[#1976D2] hover:text-[#FF9800] transition mb-3"
                  >
                    {showPortfolioImages ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    {showPortfolioImages ? "إخفاء معرض الأعمال" : "عرض معرض الأعمال"}
                    <Image size={16} />
                  </button>
                  
                  {showPortfolioImages && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                      {portfolioList.map((item: any, idx: number) => (
                        <div key={idx} className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition aspect-square" onClick={() => item.type === "image" && openImageModal(item.url)}>
                          {item.type === "image" && <img src={item.url} alt="عمل" className="w-full h-full object-cover" />}
                          {item.type === "video" && <video src={item.url} controls className="w-full h-full object-cover" onClick={(e) => e.stopPropagation()} />}
                          {item.type === "video_link" && <iframe src={item.url} className="w-full h-full" title="فيديو" />}
                        </div>
                      ))}
                    </div>
                  )}
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