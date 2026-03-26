import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { X, Mail, Phone, Globe, Instagram, Youtube, Linkedin, MessageCircle, MapPin, Award, DollarSign, Package, Truck, Map, ShoppingBag } from 'lucide-react';

export default function ConsultantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [showAdMedia, setShowAdMedia] = useState<{ [key: number]: boolean }>({});

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
      if (data.selected_services && data.selected_services.length > 0) {
        setActiveService(data.selected_services[0]);
      }
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

  const toggleAdMedia = (adIndex: number) => {
    setShowAdMedia(prev => ({ ...prev, [adIndex]: !prev[adIndex] }));
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
  const selectedServices = consultant.selected_services || [];
  const products = consultant.products || [];

  const getPriceForService = (serviceId: string) => {
    if (serviceId === "consulting") return consultant.consulting_price;
    if (serviceId === "training") return consultant.training_price;
    if (serviceId === "individual") return consultant.individual_price;
    if (serviceId === "workshop") return consultant.workshop_price;
    return null;
  };

  const currentPrice = getPriceForService(activeService);
  const currentCurrency = consultant.currency || "ريال";

  const getServiceName = (serviceId: string) => {
    if (serviceId === "consulting") return "جلسات استشارية";
    if (serviceId === "training") return "دورات تدريبية";
    if (serviceId === "products") return "متجر";
    if (serviceId === "individual") return "جلسات فردية";
    if (serviceId === "workshop") return "ورش عمل";
    return serviceId;
  };

  const getServicePrice = (serviceId: string) => {
    if (serviceId === "consulting") return consultant.consulting_price;
    if (serviceId === "training") return consultant.training_price;
    if (serviceId === "individual") return consultant.individual_price;
    if (serviceId === "workshop") return consultant.workshop_price;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-12" dir="rtl">
      <div className="max-w-5xl mx-auto px-3 md:px-6">
        
        <button
          onClick={() => navigate(-1)}
          className="mb-3 md:mb-6 text-[#1976D2] hover:text-[#FF9800] flex items-center gap-2 transition text-sm md:text-base"
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
            <div className="absolute -bottom-8 md:-bottom-12 right-3 md:right-8">
              <div 
                className="w-16 h-16 md:w-28 md:h-28 rounded-full bg-white shadow-lg border-4 border-white overflow-hidden cursor-pointer hover:scale-105 transition"
                onClick={() => consultant.profile_image && openImageModal(consultant.profile_image)}
              >
                {consultant.profile_image ? (
                  <img
                    src={consultant.profile_image}
                    alt="صورة شخصية"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xl md:text-3xl">
                    {consultant.account_type === "individual" ? "👤" : "🏢"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-12 md:pt-16 p-3 md:p-8">
            
            <h1 className="text-lg md:text-2xl font-bold text-gray-800">
              {consultant.full_name || consultant.company_name || "مستشار"}
            </h1>
            
            <div className="flex flex-wrap gap-1 md:gap-2 mt-1 md:mt-2">
              {consultant.specialty && (
                <span className="bg-[#FF9800] text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm">
                  {consultant.specialty}
                </span>
              )}
              {consultant.sub_specialty && (
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm">
                  {consultant.sub_specialty}
                </span>
              )}
            </div>

            <hr className="my-3 md:my-6" />

            {/* المعلومات الأساسية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
              <div className="bg-gray-50 rounded-xl p-2 md:p-4 flex items-center gap-2 md:gap-3">
                <MapPin size={16} className="text-[#1976D2] shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">الموقع</p>
                  <p className="font-medium text-xs md:text-sm">{consultant.city && consultant.country ? `${consultant.city}, ${consultant.country}` : val(consultant.country || consultant.city)}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-2 md:p-4 flex items-center gap-2 md:gap-3">
                <Award size={16} className="text-[#FF9800] shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">الخبرة</p>
                  <p className="font-medium text-xs md:text-sm">{val(consultant.experience)} سنة</p>
                </div>
              </div>
            </div>

            {/* أنواع الخدمات - أزرار */}
            {selectedServices.length > 0 && (
              <div className="mt-4 md:mt-6">
                <h2 className="text-base md:text-xl font-bold text-[#1976D2] mb-2 md:mb-3">الخدمات</h2>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {selectedServices.map((service: string) => (
                    <button
                      key={service}
                      onClick={() => setActiveService(service)}
                      className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm transition ${
                        activeService === service 
                          ? "bg-[#FF9800] text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {getServiceName(service)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* عرض السعر للخدمة المختارة */}
            {activeService && activeService !== "products" && currentPrice && (
              <div className="mt-3 md:mt-4 bg-green-50 rounded-xl p-2 md:p-4 flex items-center gap-2 md:gap-3">
                <DollarSign size={18} className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">السعر</p>
                  <p className="font-bold text-base md:text-xl text-green-700">{currentPrice} {currentCurrency}</p>
                  <p className="text-xs text-gray-500">لكل ساعة</p>
                </div>
              </div>
            )}

            {/* عرض المنتجات (المتجر) */}
            {activeService === "products" && products.length > 0 && (
              <div className="mt-3 md:mt-4 space-y-3 md:space-y-4">
                {products.map((product: any, idx: number) => (
                  <div key={idx} className="border rounded-xl p-3 md:p-4 bg-gray-50">
                    {product.image && (
                      <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden cursor-pointer" onClick={() => openImageModal(product.image)}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-base md:text-lg">{product.name}</h3>
                    <p className="text-gray-600 text-xs md:text-sm mt-1">{product.description}</p>
                    {product.price && (
                      <p className="text-[#FF9800] font-bold mt-2 text-sm md:text-base">السعر: {product.price} ريال</p>
                    )}
                    {product.delivery && (
                      <div className="flex items-center gap-2 mt-2 text-xs md:text-sm text-gray-500">
                        <Truck size={14} />
                        <span>طريقة التوصيل: {product.delivery}</span>
                      </div>
                    )}
                    {product.locations && product.locations.length > 0 && (
                      <div className="flex items-center gap-2 mt-1 text-xs md:text-sm text-gray-500">
                        <Map size={14} />
                        <span>يشمل: {product.locations.join(", ")}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {consultant.bio && (
              <>
                <hr className="my-3 md:my-6" />
                <div>
                  <h2 className="text-base md:text-xl font-bold text-[#1976D2] mb-1 md:mb-3">نبذة</h2>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">{consultant.bio}</p>
                </div>
              </>
            )}

            <hr className="my-3 md:my-6" />
            
            {/* طرق الدفع */}
            {paymentsList.length > 0 && (
              <div>
                <h2 className="text-base md:text-xl font-bold text-[#1976D2] mb-2 md:mb-4">طرق الدفع</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {paymentsList.map((p: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-2 md:p-3 flex justify-between items-center text-xs md:text-sm">
                      <span className="font-semibold">{p.method || "-"}</span>
                      <span className="text-gray-600 text-xs md:text-sm">{p.details || "-"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* طرق الاتصال */}
            <div className="mt-4 md:mt-6">
              <h2 className="text-base md:text-xl font-bold text-[#1976D2] mb-2 md:mb-4">طرق الاتصال</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                {consultant.whatsapp && (
                  <a href={getWhatsAppLink(consultant.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 md:p-3 bg-green-50 rounded-xl hover:bg-green-100 transition">
                    <MessageCircle size={16} className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">واتساب</p>
                      <p className="font-medium text-xs md:text-sm">{consultant.whatsapp}</p>
                    </div>
                  </a>
                )}
                {consultant.phone && (
                  <a href={getPhoneLink(consultant.phone)} className="flex items-center gap-2 p-2 md:p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                    <Phone size={16} className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">هاتف</p>
                      <p className="font-medium text-xs md:text-sm">{consultant.phone}</p>
                    </div>
                  </a>
                )}
                {consultant.email && (
                  <a href={getEmailLink(consultant.email)} className="flex items-center gap-2 p-2 md:p-3 bg-red-50 rounded-xl hover:bg-red-100 transition">
                    <Mail size={16} className="text-red-600" />
                    <div>
                      <p className="text-xs text-gray-500">بريد إلكتروني</p>
                      <p className="font-medium text-xs md:text-sm">{consultant.email}</p>
                    </div>
                  </a>
                )}
                {consultant.other_contact && (
                  <div className="flex items-center gap-2 p-2 md:p-3 bg-gray-50 rounded-xl">
                    <Globe size={16} className="text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">وسيلة أخرى</p>
                      <p className="font-medium text-xs md:text-sm">{consultant.other_contact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* الروابط */}
            <div className="mt-4 md:mt-6">
              <h2 className="text-base md:text-xl font-bold text-[#1976D2] mb-2 md:mb-4">الموقع الإلكتروني والروابط</h2>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {consultant.website && (
                  <a href={getWebLink(consultant.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 md:gap-2 bg-gray-100 hover:bg-gray-200 px-2 py-1 md:px-4 md:py-2 rounded-lg transition text-xs md:text-sm">
                    <Globe size={14} className="text-blue-600" /> <span>الموقع الإلكتروني</span>
                  </a>
                )}
                {consultant.linkedin && (
                  <a href={getWebLink(consultant.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 md:gap-2 bg-gray-100 hover:bg-gray-200 px-2 py-1 md:px-4 md:py-2 rounded-lg transition text-xs md:text-sm">
                    <Linkedin size={14} className="text-blue-700" /> <span>لينكدإن</span>
                  </a>
                )}
                {consultant.instagram && (
                  <a href={getWebLink(consultant.instagram)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 md:gap-2 bg-gray-100 hover:bg-gray-200 px-2 py-1 md:px-4 md:py-2 rounded-lg transition text-xs md:text-sm">
                    <Instagram size={14} className="text-pink-600" /> <span>انستغرام</span>
                  </a>
                )}
                {consultant.youtube && (
                  <a href={getWebLink(consultant.youtube)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 md:gap-2 bg-gray-100 hover:bg-gray-200 px-2 py-1 md:px-4 md:py-2 rounded-lg transition text-xs md:text-sm">
                    <Youtube size={14} className="text-red-600" /> <span>يوتيوب</span>
                  </a>
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
                className="w-full bg-purple-600 text-white py-2 md:py-3 rounded-xl hover:bg-purple-700 transition flex items-center justify-center gap-2 font-medium text-sm md:text-base"
              >
                <MessageCircle size={18} />
                مراسلة {consultant.full_name || consultant.company_name}
              </button>
            </div>

            {/* الإعلانات */}
            {adsList.length > 0 && (
              <>
                <hr className="my-3 md:my-6" />
                <div>
                  <h2 className="text-base md:text-xl font-bold text-[#FF9800] mb-2 md:mb-4">الإعلانات</h2>
                  <div className="space-y-3 md:space-y-4">
                    {adsList.map((ad: any, idx: number) => (
                      <div key={idx} className="border rounded-xl p-3 md:p-4 hover:shadow-md transition">
                        <h3 className="font-bold text-sm md:text-lg">{ad.title || "بدون عنوان"}</h3>
                        <p className="text-gray-600 mt-1 text-xs md:text-sm">{ad.description || "لا يوجد وصف"}</p>
                        
                        {(ad.image || ad.video) && (
                          <button
                            onClick={() => toggleAdMedia(idx)}
                            className="mt-2 flex items-center gap-2 text-[#1976D2] text-xs md:text-sm hover:text-[#FF9800] transition"
                          >
                            {showAdMedia[idx] ? "إخفاء الوسائط" : "عرض الوسائط"}
                          </button>
                        )}
                        
                        {showAdMedia[idx] && (
                          <div className="mt-2">
                            {ad.image && (
                              <img 
                                src={ad.image} 
                                alt="صورة الإعلان" 
                                className="max-h-40 md:max-h-48 rounded-lg border cursor-pointer hover:opacity-90 transition" 
                                onClick={() => openImageModal(ad.image)} 
                              />
                            )}
                            {ad.video && (
                              <video 
                                src={ad.video} 
                                controls 
                                className="max-h-40 md:max-h-48 rounded-lg border mt-2" 
                              />
                            )}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 md:gap-4 mt-2 md:mt-3 text-xs md:text-sm">
                          {ad.price && <span className="text-[#FF9800] font-bold">💰 {ad.price} ريال</span>}
                          {ad.contact && <span className="text-gray-500">📞 {ad.contact}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
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