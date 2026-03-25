import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Upload, X, Save, ArrowRight } from 'lucide-react';

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

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [openServiceDropdown, setOpenServiceDropdown] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [form, setForm] = useState({
    account_type: "individual",
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
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
    existingPortfolio: [] as any[],
    profile_image: "",
  });

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("consultants")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setForm({
        account_type: data.account_type || "individual",
        fullName: data.full_name || "",
        companyName: data.company_name || "",
        email: data.email || "",
        phone: data.phone || "",
        country: data.country || "",
        city: data.city || "",
        specialty: data.specialty || "",
        sub_specialty: data.sub_specialty || "",
        experience: data.experience || "",
        activity: data.activity || "",
        bio: data.bio || "",
        price: data.price || "",
        currency: data.currency || "ريال سعودي",
        website: data.website || "",
        whatsapp: data.whatsapp || "",
        linkedin: data.linkedin || "",
        instagram: data.instagram || "",
        youtube: data.youtube || "",
        tiktok: data.tiktok || "",
        telegram: data.telegram || "",
        snapchat: data.snapchat || "",
        otherContact: data.other_contact || "",
        meetingPlatforms: data.meeting_platforms ? data.meeting_platforms.split(", ") : [],
        ads: data.ads || [],
        payments: data.payment_methods || [],
        portfolioImages: [],
        portfolioVideo: null,
        videoLink: "",
        existingPortfolio: data.portfolio || [],
        profile_image: data.profile_image || "",
      });
      if (data.profile_image) {
        setImagePreview(data.profile_image);
      }
    }
    setFetching(false);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // رفع الصورة الشخصية
    let profileImageUrl = form.profile_image;
    if (imageFile) {
      profileImageUrl = await uploadFile(imageFile, "profile");
    }

    // رفع صور الإعلانات الجديدة
    const updatedAds = [...form.ads];
    for (let i = 0; i < updatedAds.length; i++) {
      const ad = updatedAds[i];
      if (ad.imageFile) {
        ad.image = await uploadFile(ad.imageFile, "ads");
        delete ad.imageFile;
      }
      if (ad.videoFile) {
        ad.video = await uploadFile(ad.videoFile, "ads");
        delete ad.videoFile;
      }
    }

    // رفع صور معرض الأعمال الجديدة
    const updatedPortfolio = [...form.existingPortfolio];
    for (const img of form.portfolioImages) {
      const url = await uploadFile(img, "portfolio");
      updatedPortfolio.push({ type: "image", url: url });
    }
    if (form.portfolioVideo) {
      const url = await uploadFile(form.portfolioVideo, "portfolio");
      updatedPortfolio.push({ type: "video", url: url });
    }
    if (form.videoLink) {
      updatedPortfolio.push({ type: "video_link", url: form.videoLink });
    }

    // تحديث البيانات
    const { error } = await supabase
      .from("consultants")
      .update({
        full_name: form.fullName || null,
        company_name: form.companyName || null,
        email: form.email || null,
        phone: form.phone || null,
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
        ads: updatedAds,
        payment_methods: form.payments,
        portfolio: updatedPortfolio,
      })
      .eq("id", id);

    if (error) {
      alert("خطأ في التحديث: " + error.message);
    } else {
      alert("تم تحديث الملف الشخصي بنجاح");
      // تحديث localStorage
      const { data: updatedUser } = await supabase
        .from("consultants")
        .select("*")
        .eq("id", id)
        .single();
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      navigate(`/dashboard`);
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9800] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#1976D2] hover:text-[#FF9800] transition"
          >
            <ArrowRight size={20} />
            <span>رجوع</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-[#FF9800] mb-8">
            تعديل الملف الشخصي
          </h1>

          <form onSubmit={handleSubmit}>
            {/* صورة شخصية */}
            <div className="mb-8">
              <label className="block mb-3 font-semibold text-gray-700">الصورة الشخصية / الشعار</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="معاينة" className="h-32 w-32 object-cover rounded-full mx-auto" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">انقر لاختيار صورة</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageInput"
                />
                <label htmlFor="imageInput" className="cursor-pointer inline-block mt-4 px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                  تغيير الصورة
                </label>
              </div>
            </div>

            {/* المعلومات الأساسية */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">الاسم الكامل / اسم المنشأة</label>
                <input className="w-full border border-gray-300 rounded-xl p-3" value={form.fullName || form.companyName} onChange={(e) => setForm({...form, fullName: e.target.value, companyName: e.target.value})} />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">البريد الإلكتروني</label>
                <input type="email" className="w-full border border-gray-300 rounded-xl p-3" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">رقم الهاتف</label>
                <input className="w-full border border-gray-300 rounded-xl p-3" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">الدولة</label>
                <input className="w-full border border-gray-300 rounded-xl p-3" value={form.country} onChange={(e) => update("country", e.target.value)} />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">المدينة</label>
                <input className="w-full border border-gray-300 rounded-xl p-3" value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">سنوات الخبرة</label>
                <input type="number" className="w-full border border-gray-300 rounded-xl p-3" value={form.experience} onChange={(e) => update("experience", e.target.value)} />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">السعر لكل ساعة</label>
                <input type="number" className="w-full border border-gray-300 rounded-xl p-3" value={form.price} onChange={(e) => update("price", e.target.value)} />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">العملة</label>
                <select className="w-full border border-gray-300 rounded-xl p-3" value={form.currency} onChange={(e) => update("currency", e.target.value)}>
                  <option>ريال سعودي</option>
                  <option>درهم إماراتي</option>
                  <option>دولار أمريكي</option>
                </select>
              </div>
            </div>

            {/* التخصصات */}
            <div className="grid md:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">التخصص الرئيسي</label>
                <select className="w-full border border-gray-300 rounded-xl p-3" value={form.specialty} onChange={(e) => setForm({...form, specialty: e.target.value, sub_specialty: ""})}>
                  <option value="">اختر التخصص</option>
                  {SPECIALTIES.map((s) => (<option key={s.name} value={s.name}>{s.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">التخصص الفرعي</label>
                <select className="w-full border border-gray-300 rounded-xl p-3" value={form.sub_specialty} onChange={(e) => update("sub_specialty", e.target.value)} disabled={!form.specialty}>
                  <option value="">اختر التخصص الفرعي</option>
                  {SPECIALTIES.find(s => s.name === form.specialty)?.subs.map((sub) => (<option key={sub} value={sub}>{sub}</option>))}
                </select>
              </div>
            </div>

            {/* نوع الخدمة */}
            <div className="mt-5">
              <label className="block mb-2 font-semibold text-gray-700">نوع الخدمة / الجلسات التي تقدمها</label>
              <div className="relative">
                <button type="button" onClick={() => setOpenServiceDropdown(!openServiceDropdown)} className="w-full border border-gray-300 rounded-xl p-3 text-right bg-white flex justify-between items-center">
                  <span>{form.activity || "اختر نوع الخدمة"}</span>
                  <span className="text-gray-400">▼</span>
                </button>
                {openServiceDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {SERVICE_TYPES.map((service) => (
                      <div key={service} onClick={() => { update("activity", service); setOpenServiceDropdown(false); }} className="p-3 hover:bg-gray-100 cursor-pointer text-right">{service}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* برامج الاجتماعات */}
            <div className="mt-5">
              <label className="block mb-2 font-semibold text-gray-700">برامج الاجتماعات</label>
              <div className="grid grid-cols-3 gap-3">
                {MEETING_PLATFORMS.map((platform) => (
                  <label key={platform} className="flex items-center gap-2 border p-2 rounded-lg cursor-pointer">
                    <input type="checkbox" checked={form.meetingPlatforms.includes(platform)} onChange={(e) => handleMeetingPlatformChange(platform, e.target.checked)} /> {platform}
                  </label>
                ))}
              </div>
            </div>

            {/* الروابط */}
            <div className="grid md:grid-cols-2 gap-5 mt-5">
              <div><label className="block mb-2 font-semibold text-gray-700">الموقع الإلكتروني</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.website} onChange={(e) => update("website", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">واتساب</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">لينكدإن</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">انستغرام</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.instagram} onChange={(e) => update("instagram", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">يوتيوب</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.youtube} onChange={(e) => update("youtube", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">تيك توك</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.tiktok} onChange={(e) => update("tiktok", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">تيليجرام</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.telegram} onChange={(e) => update("telegram", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">سناب شات</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.snapchat} onChange={(e) => update("snapchat", e.target.value)} /></div>
            </div>

            {/* النبذة */}
            <div className="mt-5">
              <label className="block mb-2 font-semibold text-gray-700">النبذة</label>
              <textarea rows={5} className="w-full border border-gray-300 rounded-xl p-3" value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="نبذة عنك..." />
            </div>

            {/* الإعلانات */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-[#FF9800] mb-4">الإعلانات</h2>
              {form.ads.map((ad: any, index: number) => (
                <div key={index} className="border p-4 rounded-lg mb-4">
                  <input type="text" placeholder="عنوان الإعلان" value={ad.title} onChange={(e) => { const updated = [...form.ads]; updated[index].title = e.target.value; setForm({...form, ads: updated}); }} className="w-full border p-2 rounded mb-2" />
                  <textarea placeholder="وصف الإعلان" value={ad.description} onChange={(e) => { const updated = [...form.ads]; updated[index].description = e.target.value; setForm({...form, ads: updated}); }} className="w-full border p-2 rounded mb-2" rows={2} />
                  <div className="mb-2"><label>صورة الإعلان</label><input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; const updated = [...form.ads]; updated[index].imageFile = file; setForm({...form, ads: updated}); }} className="w-full border p-2 rounded" /></div>
                  <div className="mb-2"><label>فيديو الإعلان</label><input type="file" accept="video/*" onChange={(e) => { const file = e.target.files?.[0]; const updated = [...form.ads]; updated[index].videoFile = file; setForm({...form, ads: updated}); }} className="w-full border p-2 rounded" /></div>
                  <input type="text" placeholder="السعر" value={ad.price} onChange={(e) => { const updated = [...form.ads]; updated[index].price = e.target.value; setForm({...form, ads: updated}); }} className="w-full border p-2 rounded mb-2" />
                  <input type="text" placeholder="رقم التواصل" value={ad.contact} onChange={(e) => { const updated = [...form.ads]; updated[index].contact = e.target.value; setForm({...form, ads: updated}); }} className="w-full border p-2 rounded mb-2" />
                  <button type="button" onClick={() => { const filtered = form.ads.filter((_, i) => i !== index); setForm({...form, ads: filtered}); }} className="bg-red-500 text-white px-3 py-1 rounded text-sm">حذف الإعلان</button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({...form, ads: [...form.ads, { title: "", description: "", price: "", contact: "", imageFile: null, videoFile: null }]})} className="bg-blue-600 text-white px-4 py-2 rounded">+ إضافة إعلان</button>
            </div>

            {/* طرق الدفع */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-[#1976D2] mb-4">طرق الدفع</h2>
              {form.payments.map((p: any, index: number) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input placeholder="طريقة الدفع" value={p.method} onChange={(e) => { const updated = [...form.payments]; updated[index].method = e.target.value; setForm({...form, payments: updated}); }} className="border p-2 rounded w-1/2" />
                  <input placeholder="التفاصيل" value={p.details} onChange={(e) => { const updated = [...form.payments]; updated[index].details = e.target.value; setForm({...form, payments: updated}); }} className="border p-2 rounded w-1/2" />
                  <button type="button" onClick={() => { const filtered = form.payments.filter((_, i) => i !== index); setForm({...form, payments: filtered}); }} className="bg-red-500 text-white px-3 py-1 rounded">✕</button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({...form, payments: [...form.payments, { method: "", details: "" }]})} className="bg-green-600 text-white px-4 py-2 rounded">+ إضافة طريقة دفع</button>
            </div>

            {/* معرض الأعمال */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-[#1976D2] mb-4">معرض الأعمال</h2>
              
              {/* الأعمال الموجودة */}
              {form.existingPortfolio.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">الأعمال الحالية:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {form.existingPortfolio.map((item: any, idx: number) => (
                      <div key={idx} className="relative border rounded-lg overflow-hidden">
                        {item.type === "image" && <img src={item.url} className="w-full h-20 object-cover" />}
                        {item.type === "video" && <video src={item.url} className="w-full h-20 object-cover" />}
                        {item.type === "video_link" && <iframe src={item.url} className="w-full h-20" />}
                        <button type="button" onClick={() => { const filtered = form.existingPortfolio.filter((_, i) => i !== idx); setForm({...form, existingPortfolio: filtered}); }} className="absolute top-0 left-0 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div><label>رفع صور جديدة</label><input type="file" multiple onChange={(e) => { const files = Array.from(e.target.files || []); update("portfolioImages", files); }} className="w-full border p-2 rounded" /></div>
                <div><label>رفع فيديو جديد</label><input type="file" accept="video/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) update("portfolioVideo", file); }} className="w-full border p-2 rounded" /></div>
                <div className="md:col-span-2"><label>رابط فيديو جديد</label><input type="text" placeholder="رابط يوتيوب" value={form.videoLink} onChange={(e) => update("videoLink", e.target.value)} className="w-full border p-2 rounded" /></div>
              </div>
            </div>

            {/* أزرار الحفظ والإلغاء */}
            <div className="flex gap-4 mt-10">
              <button type="submit" disabled={loading} className="flex-1 bg-[#FF9800] text-white font-bold py-3 rounded-xl hover:bg-orange-500 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? "جاري الحفظ..." : "حفظ التعديلات"} <Save size={18} />
              </button>
              <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition">إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}