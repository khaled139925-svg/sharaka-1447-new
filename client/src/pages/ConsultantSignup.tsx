import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Upload, X } from 'lucide-react';

interface ConsultantSignupProps {
  onNavigate?: (page: string) => void;
}

const SPECIALTIES = [
  { name: "الاستشارات",  subs: ["استشارات إدارية", "استشارات مالية", "استشارات قانونية", "استشارات مهنية", "استشارات أسرية"] },
  { name: "التعليم والتدريب",  subs: ["الدورات التدريبية", "التعليم الأكاديمي", "التعليم عن بعد", "التدريب المهني", "التدريب القيادي"] },
  { name: "التقنية والبرمجة", subs: ["تطوير المواقع", "تطوير التطبيقات", "الذكاء الاصطناعي", "أمن المعلومات", "تحليل البيانات"] },
  { name: "التصميم والإبداع",  subs: ["تصميم الجرافيك", "تصميم الشعارات", "تصميم واجهات المستخدم", "التصميم الإعلاني"] },
  { name: "الإعلام وصناعة المحتوى",  subs: ["إنتاج الفيديو", "التصوير الفوتوغرافي", "صناعة المحتوى", "إدارة القنوات"] },
  { name: "التسويق والتجارة",  subs: ["التسويق الرقمي", "إدارة الحملات الإعلانية", "التسويق عبر السوشيال ميديا", "تحليل السوق"] },
  { name: "الإدارة وريادة الأعمال",  subs: ["إدارة المشاريع", "ريادة الأعمال", "تطوير الأعمال", "التخطيط الاستراتيجي"] },
  { name: "القانون والمحاماة",  subs: ["الاستشارات القانونية", "القضايا التجارية", "القضايا المدنية", "التحكيم"] },
  { name: "الطب والصحة",  subs: ["الاستشارات الطبية", "الصحة العامة", "الطب الوقائي", "التوجيه الصحي"] },
  { name: "الصحة النفسية",  subs: ["العلاج النفسي", "الإرشاد النفسي", "تنمية الشخصية", "الدعم النفسي"] },
  { name: "الرياضة واللياقة", subs: ["التدريب الرياضي", "اللياقة البدنية", "التغذية الرياضية", "التأهيل البدني"] },
  { name: "التغذية والطبخ",  subs: ["الطبخ الاحترافي", "التغذية الصحية", "إعداد الوجبات", "المطابخ العالمية"] },
  { name: "الجمال والعناية",  subs: ["العناية بالبشرة", "العناية بالشعر", "التجميل", "الصحة الجمالية"] },
  { name: "الأسرة والتربية",  subs: ["الإرشاد الأسري", "التربية", "العلاقات الأسرية", "تنمية الأطفال"] },
  { name: "الطفولة",  subs: ["تنمية الطفل", "تعليم الأطفال", "أنشطة الأطفال", "تربية الأطفال"] },
  { name: "الشباب",  subs: ["تطوير المهارات", "العمل الحر", "بناء المستقبل", "التوجيه المهني"] },
  { name: "الهوايات والفنون",  subs: ["الرسم", "الموسيقى", "الحرف اليدوية", "الفنون الإبداعية"] },
  { name: "الأدب والشعر",  subs: ["الشعر", "الكتابة الأدبية", "النقد الأدبي", "تطوير مهارات الكتابة"] },
  { name: "السفر والسياحة", subs: ["التخطيط للسفر", "السياحة العالمية", "المرشدون السياحيون", "برامج الرحلات"] },
  { name: "الحج والعمرة", subs: ["تنظيم رحلات الحج", "تنظيم رحلات العمرة", "الإرشاد الديني", "خدمات المعتمرين"] },
  { name: "الفنادق والضيافة",  subs: ["إدارة الفنادق", "الضيافة", "تنظيم الفعاليات", "خدمات الضيافة"] },
  { name: "التجارة الدولية",  subs: ["الاستيراد والتصدير", "التجارة العالمية", "الشحن الدولي", "الأسواق العالمية"] },
  { name: "الزراعة",  subs: ["الزراعة الحديثة", "المزارع", "الإنتاج الزراعي", "التقنيات الزراعية"] },
  { name: "تربية الحيوانات",  subs: ["تربية المواشي", "تربية الطيور", "رعاية الحيوانات", "الإنتاج الحيواني"] },
  { name: "البيئة والطبيعة",  subs: ["الحفاظ على البيئة", "الاستدامة", "المشاريع البيئية", "الطبيعة"] },
  { name: "المتاجر والتجارة الإلكترونية",  subs: ["إنشاء المتاجر", "إدارة المتاجر", "التجارة الإلكترونية", "التسويق الإلكتروني"] },
  { name: "النقل والخدمات اللوجستية", subs: ["الشحن", "النقل", "الخدمات اللوجستية", "إدارة سلاسل الإمداد"] },
  { name: "الاستثمار والمال",  subs: ["الاستثمار", "الأسواق المالية", "التخطيط المالي", "إدارة الأموال"] },
  { name: "العقار",  subs: ["بيع وشراء العقارات", "التأجير", "التطوير العقاري", "الاستثمار العقاري"] },
  { name: "أنشطة متنوعة",  subs: ["أفكار ومشاريع", "مبادرات مجتمعية", "أنشطة ثقافية", "أنشطة عامة"] },
];

const SERVICE_TYPES = [
  "جلسات استشارية",
  "دورات تدريبية",
  "عرض منتجات",
  "جلسات فردية",
  "ورش عمل",
  "خدمات متنوعة"
];

const MEETING_PLATFORMS = ["Zoom", "Google Meet", "Microsoft Teams", "WhatsApp", "Telegram", "Discord"];

export default function ConsultantSignup({ onNavigate }: ConsultantSignupProps) {
  const [accountType, setAccountType] = useState<"individual" | "company">("individual");
  const [loading, setLoading] = useState(false);
  const [openServiceDropdown, setOpenServiceDropdown] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "",
    city: "",
    specialty: "",
    sub_specialty: "",
    experience: "",
    activity: "",
    bio: "",
    price: "",
    currency: "ريال سعودي",
    website: "",
    whatsapp: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    telegram: "",
    snapchat: "",
    otherContact: "",
    meetingPlatforms: [] as string[],
    ads: [] as any[],
    payments: [] as any[],
    portfolioImages: [] as File[],
    portfolioVideo: null as File | null,
    videoLink: "",
  });

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleMeetingPlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      setForm({ ...form, meetingPlatforms: [...form.meetingPlatforms, platform] });
    } else {
      setForm({ ...form, meetingPlatforms: form.meetingPlatforms.filter(p => p !== platform) });
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error } = await supabase.storage
      .from('media')
      .upload(fileName, file);
    
    if (error) {
      console.error("خطأ في رفع الملف:", error);
      return "";
    }
    
    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      setLoading(false);
      return;
    }

    // 1. رفع الصورة الشخصية
    let profileImageUrl = "";
    if (imageFile) {
      profileImageUrl = await uploadFile(imageFile, "profile");
    }

    // 2. رفع صور الإعلانات
    const adsWithUrls = [];
    for (const ad of form.ads) {
      const adData: any = {
        title: ad.title || "",
        description: ad.description || "",
        price: ad.price || "",
        contact: ad.contact || "",
      };
      
      if (ad.image) {
        adData.image = await uploadFile(ad.image, "ads");
      }
      if (ad.video) {
        adData.video = await uploadFile(ad.video, "ads");
      }
      adsWithUrls.push(adData);
    }

    // 3. رفع صور معرض الأعمال
    const portfolioItems = [];
    for (const img of form.portfolioImages) {
      const url = await uploadFile(img, "portfolio");
      portfolioItems.push({ type: "image", url: url });
    }
    if (form.portfolioVideo) {
      const url = await uploadFile(form.portfolioVideo, "portfolio");
      portfolioItems.push({ type: "video", url: url });
    }
    if (form.videoLink) {
      portfolioItems.push({ type: "video_link", url: form.videoLink });
    }

    // تجهيز البيانات للإرسال
    const dataToInsert = {
      account_type: accountType,
      full_name: form.fullName || null,
      company_name: form.companyName || null,
      email: form.email || null,
      phone: form.phone || null,
      password: form.password || null,
      country: form.country || null,
      city: form.city || null,
      specialty: form.specialty || null,
      sub_specialty: form.sub_specialty || null,
      experience: form.experience || null,
      activity: form.activity || null,
      bio: form.bio || null,
      price: form.price || null,
      currency: form.currency || null,
      website: form.website || null,
      whatsapp: form.whatsapp || null,
      linkedin: form.linkedin || null,
      instagram: form.instagram || null,
      youtube: form.youtube || null,
      tiktok: form.tiktok || null,
      telegram: form.telegram || null,
      snapchat: form.snapchat || null,
      other_contact: form.otherContact || null,
      meeting_platforms: form.meetingPlatforms.join(", ") || null,
      profile_image: profileImageUrl || null,
      ads: adsWithUrls,
      payment_methods: form.payments,
      portfolio: portfolioItems,
    };

    console.log("البيانات:", dataToInsert);

    const { data, error } = await supabase
      .from("consultants")
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error("الخطأ:", error);
      alert("خطأ: " + error.message);
      setLoading(false);
      return;
    }

    console.log("تم الحفظ:", data);
    alert("تم التسجيل بنجاح");
    setLoading(false);
    onNavigate?.("home");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gray-50 py-16" dir="rtl">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8 text-right">
            <button
              type="button"
              onClick={() => onNavigate?.("home")}
              className="text-[#1976D2] hover:text-[#FF9800] text-lg flex items-center gap-2"
            >
              <span>🏠</span>
              <span>الرئيسية</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-10">
            <h1 className="text-4xl font-bold text-center text-[#FF9800] mb-10">
              إنشاء حساب جديد في منصة شراكة
            </h1>

            {/* نوع الحساب */}
            <h2 className="text-2xl font-bold text-[#1976D2] mb-4">نوع الحساب</h2>
            <div className="grid grid-cols-2 gap-4 mb-10">
              <button
                type="button"
                onClick={() => setAccountType("individual")}
                className={`p-4 rounded-xl border text-lg ${
                  accountType === "individual"
                    ? "border-[#FF9800] text-[#FF9800] bg-orange-50"
                    : "border-gray-300"
                }`}
              >
                فرد
              </button>
              <button
                type="button"
                onClick={() => setAccountType("company")}
                className={`p-4 rounded-xl border text-lg ${
                  accountType === "company"
                    ? "border-[#1976D2] text-[#1976D2] bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                منشأة
              </button>
            </div>

            {/* المعلومات الأساسية - نفس الكود السابق */}
            <h2 className="text-2xl font-bold text-[#1976D2] mb-4">المعلومات الأساسية</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {accountType === "individual" && (
                <div>
                  <label className="block mb-2 font-semibold">الاسم الكامل</label>
                  <input
                    className="w-full border p-3 rounded-lg"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </div>
              )}
              {accountType === "company" && (
                <div>
                  <label className="block mb-2 font-semibold">اسم المنشأة</label>
                  <input
                    className="w-full border p-3 rounded-lg"
                    value={form.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                  />
                </div>
              )}
              <div>
                <label className="block mb-2 font-semibold">البريد الإلكتروني</label>
                <input
                  type="email"
                  className="w-full border p-3 rounded-lg"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">رقم الهاتف</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">كلمة المرور</label>
                <input
                  type="password"
                  className="w-full border p-3 rounded-lg"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  className="w-full border p-3 rounded-lg"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">الدولة</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">المدينة</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </div>

              {/* صورة شخصية */}
              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold">صورة شخصية / شعار</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="معاينة" className="h-48 w-48 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={40} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">اختر صورة شخصية أو شعار</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-4 w-full"
                  />
                </div>
              </div>
            </div>

            {/* المعلومات المهنية */}
            <h2 className="text-2xl font-bold text-[#1976D2] mb-4">المعلومات المهنية</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block mb-2 font-semibold">التخصص الرئيسي</label>
                <select
                  className="w-full border p-3 rounded-lg"
                  value={form.specialty}
                  onChange={(e) =>
                    setForm({ ...form, specialty: e.target.value, sub_specialty: "" })
                  }
                >
                  <option value="">اختر التخصص</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold">التخصص الفرعي</label>
                <select
                  className="w-full border p-3 rounded-lg"
                  value={form.sub_specialty}
                  onChange={(e) =>
                    setForm({ ...form, sub_specialty: e.target.value })
                  }
                  disabled={!form.specialty}
                >
                  <option value="">اختر التخصص الفرعي</option>
                  {SPECIALTIES.find(s => s.name === form.specialty)?.subs.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold">سنوات الخبرة</label>
                <input
                  type="number"
                  className="w-full border p-3 rounded-lg"
                  value={form.experience}
                  onChange={(e) => update("experience", e.target.value)}
                />
              </div>
            </div>

            {/* نوع الخدمة - القائمة المنسدلة */}
            <div className="mb-10">
              <label className="block mb-2 font-semibold">نوع الخدمة / الجلسات التي تقدمها</label>
              <p className="text-gray-600 mb-3 text-sm">
                هل ترغب في تقديم جلسات استشارية أو اجتماعات تتضمن عرض منتجات أو دورات تدريبية أو جلسات لتقديم أي خدمة؟
              </p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenServiceDropdown(!openServiceDropdown)}
                  className="w-full border p-3 rounded-lg text-right bg-white flex justify-between items-center"
                >
                  <span>{form.activity || "اختر نوع الخدمة"}</span>
                  <span className="text-gray-400">▼</span>
                </button>
                {openServiceDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {SERVICE_TYPES.map((service) => (
                      <div
                        key={service}
                        onClick={() => {
                          update("activity", service);
                          setOpenServiceDropdown(false);
                        }}
                        className="p-3 hover:bg-gray-100 cursor-pointer text-right"
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* الجلسات والاجتماعات */}
            <h2 className="text-2xl font-bold text-[#1976D2] mb-4">الجلسات والاجتماعات</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block mb-2 font-semibold">السعر لكل ساعة</label>
                <input
                  type="number"
                  className="w-full border p-3 rounded-lg"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">العملة</label>
                <select
                  className="w-full border p-3 rounded-lg"
                  value={form.currency}
                  onChange={(e) => update("currency", e.target.value)}
                >
                  <option>ريال سعودي</option>
                  <option>درهم إماراتي</option>
                  <option>دولار أمريكي</option>
                </select>
              </div>
            </div>

            {/* برامج الاجتماعات */}
            <h3 className="text-xl font-bold text-[#FF9800] mb-4">برامج الاجتماعات</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {MEETING_PLATFORMS.map((platform) => (
                <label key={platform} className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={form.meetingPlatforms.includes(platform)}
                    onChange={(e) => handleMeetingPlatformChange(platform, e.target.checked)} 
                  /> 
                  {platform}
                </label>
              ))}
            </div>

            {/* طرق الاتصال */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">طرق الاتصال</h2>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-40">واتساب</span>
                <input
                  type="text"
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                  className="flex-1 border p-2 rounded"
                  placeholder="رابط الواتساب أو رقم الجوال"
                />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-40">مكالمة هاتفية</span>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="flex-1 border p-2 rounded"
                  placeholder="رقم الهاتف للاتصال"
                />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-40">بريد إلكتروني</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="flex-1 border p-2 rounded"
                  placeholder="البريد الإلكتروني"
                />
              </div>
            </div>

            <div className="mb-10">
              <label className="block mb-2 font-semibold">وسيلة تواصل أخرى</label>
              <input
                className="w-full border p-3 rounded-lg"
                placeholder="اكتب وسيلة تواصل أخرى"
                value={form.otherContact}
                onChange={(e) => update("otherContact", e.target.value)}
              />
            </div>

            {/* الموقع والروابط */}
            <h2 className="text-2xl font-bold text-[#1976D2] mb-4">الموقع الإلكتروني والروابط</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div><label className="block mb-2 font-semibold">الموقع الإلكتروني</label><input className="w-full border p-3 rounded-lg" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://example.com" /></div>
              <div><label className="block mb-2 font-semibold">LinkedIn</label><input className="w-full border p-3 rounded-lg" value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold">Instagram</label><input className="w-full border p-3 rounded-lg" value={form.instagram} onChange={(e) => update("instagram", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold">YouTube</label><input className="w-full border p-3 rounded-lg" value={form.youtube} onChange={(e) => update("youtube", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold">TikTok</label><input className="w-full border p-3 rounded-lg" value={form.tiktok} onChange={(e) => update("tiktok", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold">Telegram</label><input className="w-full border p-3 rounded-lg" value={form.telegram} onChange={(e) => update("telegram", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold">Snapchat</label><input className="w-full border p-3 rounded-lg" value={form.snapchat} onChange={(e) => update("snapchat", e.target.value)} /></div>
            </div>

            {/* النبذة */}
            <h2 className="text-2xl font-bold text-[#1976D2] mb-4">النبذة</h2>
            <div className="mb-10">
              <textarea
                rows={6}
                className="w-full border p-3 rounded-lg"
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="نبذة عنك أو عن منشأتك..."
              />
            </div>

            {/* معرض الأعمال */}
            <h2 className="text-2xl font-bold text-[#1976D2] mb-4">معرض الأعمال</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block mb-2 font-semibold">رفع صور</label>
                <input 
                  type="file" 
                  multiple 
                  className="w-full border p-3 rounded-lg"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    update("portfolioImages", files);
                  }}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">رفع فيديو</label>
                <input 
                  type="file" 
                  className="w-full border p-3 rounded-lg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) update("portfolioVideo", file);
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold">رابط فيديو</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  placeholder="رابط فيديو يوتيوب مثلاً"
                  value={form.videoLink}
                  onChange={(e) => update("videoLink", e.target.value)}
                />
              </div>
            </div>

            {/* الإعلانات */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">الإعلانات</h2>
              {form.ads.map((ad: any, index: number) => (
                <div key={index} className="border p-4 rounded mb-6">
                  <input
                    type="text"
                    placeholder="عنوان الإعلان"
                    value={ad.title}
                    onChange={(e) => {
                      const updated = [...form.ads];
                      updated[index].title = e.target.value;
                      setForm({ ...form, ads: updated });
                    }}
                    className="w-full border p-3 rounded mb-3"
                  />
                  <textarea
                    placeholder="وصف الإعلان"
                    value={ad.description}
                    onChange={(e) => {
                      const updated = [...form.ads];
                      updated[index].description = e.target.value;
                      setForm({ ...form, ads: updated });
                    }}
                    className="w-full border p-3 rounded mb-3"
                  />
                  <div className="mb-3">
                    <label>صورة الإعلان</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        const updated = [...form.ads];
                        updated[index].image = file;
                        setForm({ ...form, ads: updated });
                      }}
                      className="w-full border p-2 rounded"
                    />
                    {ad.image && <p className="text-green-600 text-sm mt-1">✓ تم اختيار صورة</p>}
                  </div>
                  <div className="mb-3">
                    <label>فيديو الإعلان</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        const updated = [...form.ads];
                        updated[index].video = file;
                        setForm({ ...form, ads: updated });
                      }}
                      className="w-full border p-2 rounded"
                    />
                    {ad.video && <p className="text-green-600 text-sm mt-1">✓ تم اختيار فيديو</p>}
                  </div>
                  <input
                    type="text"
                    placeholder="السعر (اختياري)"
                    value={ad.price}
                    onChange={(e) => {
                      const updated = [...form.ads];
                      updated[index].price = e.target.value;
                      setForm({ ...form, ads: updated });
                    }}
                    className="w-full border p-3 rounded mb-3"
                  />
                  <input
                    type="text"
                    placeholder="رقم التواصل"
                    value={ad.contact}
                    onChange={(e) => {
                      const updated = [...form.ads];
                      updated[index].contact = e.target.value;
                      setForm({ ...form, ads: updated });
                    }}
                    className="w-full border p-3 rounded mb-3"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = form.ads.filter((_, i) => i !== index);
                      setForm({ ...form, ads: filtered });
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm mt-2"
                  >
                    حذف الإعلان
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setForm({
                    ...form,
                    ads: [
                      ...form.ads,
                      { title: "", description: "", image: null, video: null, price: "", contact: "" }
                    ]
                  });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                + إضافة إعلان
              </button>
            </div>

            {/* طرق الدفع */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">طرق الدفع</h2>
              {form.payments.map((p: any, index: number) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    placeholder="طريقة الدفع (مثال: باي بال، تحويل بنكي)"
                    value={p.method}
                    onChange={(e) => {
                      const updated = [...form.payments];
                      updated[index].method = e.target.value;
                      setForm({ ...form, payments: updated });
                    }}
                    className="border p-2 rounded w-1/2"
                  />
                  <input
                    placeholder="التفاصيل (مثال: الرقم أو الحساب)"
                    value={p.details}
                    onChange={(e) => {
                      const updated = [...form.payments];
                      updated[index].details = e.target.value;
                      setForm({ ...form, payments: updated });
                    }}
                    className="border p-2 rounded w-1/2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = form.payments.filter((_, i) => i !== index);
                      setForm({ ...form, payments: filtered });
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setForm({
                    ...form,
                    payments: [
                      ...form.payments,
                      { method: "", details: "" }
                    ]
                  });
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                + إضافة طريقة دفع
              </button>
            </div>

            {/* الموافقة */}
            <div className="flex items-center gap-3 mb-10">
              <input type="checkbox" />
              <span>أوافق على الشروط والأحكام</span>
            </div>

            {/* زر إنشاء الحساب */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FF9800] text-white font-bold py-4 px-10 rounded-lg disabled:opacity-50"
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}