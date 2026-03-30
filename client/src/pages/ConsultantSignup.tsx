import React from 'react';
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Upload, X } from 'lucide-react';
import { Button } from "../components/ui/button";

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
  { id: "consulting", name: "جلسات استشارية", hasPrice: true },
  { id: "training", name: "دورات تدريبية", hasPrice: true },
  { id: "products", name: "متجر", hasPrice: false },
  { id: "individual", name: "جلسات فردية", hasPrice: true },
  { id: "workshop", name: "ورش عمل", hasPrice: true },
];

export default function ConsultantSignup({ onNavigate }: ConsultantSignupProps) {
  const [accountType, setAccountType] = useState<"individual" | "company">("individual");
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
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
    bio: "",
    website: "",
    whatsapp: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    telegram: "",
    snapchat: "",
    otherContact: "",
    profileImage: "",
    ads: [] as any[],
    payments: [] as any[],
    consulting_price: "",
    training_price: "",
    individual_price: "",
    workshop_price: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار صورة صحيحة');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(s => s !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const addProduct = () => {
    setProducts([...products, { 
      name: "", 
      description: "", 
      image: null, 
      price: "", 
      delivery: "", 
      locations: [] 
    }]);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('profile_images')
      .upload(fileName, file);

    if (uploadError) {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      return base64;
    }

    const { data: publicUrlData } = supabase.storage
      .from('profile_images')
      .getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      setLoading(false);
      return;
    }

    let imageUrl = "";
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const productsWithImages = [];
    for (const product of products) {
      let productImage = "";
      if (product.image) {
        productImage = await uploadImage(product.image);
      }
      productsWithImages.push({
        name: product.name,
        description: product.description,
        image: productImage,
        price: product.price,
        delivery: product.delivery,
        locations: product.locations,
      });
    }

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
      bio: form.bio || null,
      website: form.website || null,
      whatsapp: form.whatsapp || null,
      linkedin: form.linkedin || null,
      instagram: form.instagram || null,
      youtube: form.youtube || null,
      tiktok: form.tiktok || null,
      telegram: form.telegram || null,
      snapchat: form.snapchat || null,
      other_contact: form.otherContact || null,
      profile_image: imageUrl || null,
      ads: form.ads,
      payment_methods: form.payments,
      selected_services: selectedServices,
      products: productsWithImages,
      consulting_price: form.consulting_price || null,
      training_price: form.training_price || null,
      individual_price: form.individual_price || null,
      workshop_price: form.workshop_price || null,
    };

    const { data, error } = await supabase
      .from("consultants")
      .insert([dataToInsert])
      .select();

    if (error) {
      alert("خطأ: " + error.message);
      setLoading(false);
      return;
    }

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

            {/* المعلومات الأساسية */}
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
                <label className="block mb-2 font-semibold">التخصص</label>
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
                <select
                  className="w-full border p-3 rounded-lg mt-3"
                  value={form.sub_specialty}
                  onChange={(e) =>
                    setForm({ ...form, sub_specialty: e.target.value })
                  }
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

            {/* أنواع الخدمات - أزرار اختيار */}
            <div className="mb-10">
              <label className="block mb-2 font-semibold">الخدمات التي تقدمها</label>
              <p className="text-gray-600 mb-3 text-sm">
                اختر الخدمات التي تقدمها (يمكنك اختيار أكثر من خدمة)
              </p>
              <div className="flex flex-wrap gap-3">
                {SERVICE_TYPES.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      selectedServices.includes(service.id)
                        ? "bg-[#FF9800] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
              
              {/* أسعار الخدمات */}
              {selectedServices.includes("consulting") && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <label className="block mb-2 font-semibold">سعر الجلسات الاستشارية (لكل ساعة)</label>
                  <input
                    type="number"
                    className="w-full border p-3 rounded-lg"
                    value={form.consulting_price}
                    onChange={(e) => update("consulting_price", e.target.value)}
                    placeholder="مثال: 200"
                  />
                </div>
              )}
              
              {selectedServices.includes("training") && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <label className="block mb-2 font-semibold">سعر الدورات التدريبية (لكل ساعة)</label>
                  <input
                    type="number"
                    className="w-full border p-3 rounded-lg"
                    value={form.training_price}
                    onChange={(e) => update("training_price", e.target.value)}
                    placeholder="مثال: 300"
                  />
                </div>
              )}
              
              {selectedServices.includes("individual") && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <label className="block mb-2 font-semibold">سعر الجلسات الفردية (لكل ساعة)</label>
                  <input
                    type="number"
                    className="w-full border p-3 rounded-lg"
                    value={form.individual_price}
                    onChange={(e) => update("individual_price", e.target.value)}
                    placeholder="مثال: 150"
                  />
                </div>
              )}
              
              {selectedServices.includes("workshop") && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <label className="block mb-2 font-semibold">سعر ورش العمل (لكل ساعة)</label>
                  <input
                    type="number"
                    className="w-full border p-3 rounded-lg"
                    value={form.workshop_price}
                    onChange={(e) => update("workshop_price", e.target.value)}
                    placeholder="مثال: 500"
                  />
                </div>
              )}
              
              {/* المتجر */}
              {selectedServices.includes("products") && (
                <div className="mt-4">
                  <h3 className="font-bold text-[#FF9800] mb-3">المتجر</h3>
                  {products.map((product, idx) => (
                    <div key={idx} className="border p-4 rounded-lg mb-4">
                      <input
                        type="text"
                        placeholder="اسم المنتج"
                        value={product.name}
                        onChange={(e) => {
                          const updated = [...products];
                          updated[idx].name = e.target.value;
                          setProducts(updated);
                        }}
                        className="w-full border p-2 rounded mb-2"
                      />
                      <textarea
                        placeholder="وصف المنتج"
                        value={product.description}
                        onChange={(e) => {
                          const updated = [...products];
                          updated[idx].description = e.target.value;
                          setProducts(updated);
                        }}
                        className="w-full border p-2 rounded mb-2"
                        rows={2}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          const updated = [...products];
                          updated[idx].image = file;
                          setProducts(updated);
                        }}
                        className="w-full border p-2 rounded mb-2"
                      />
                      <input
                        type="text"
                        placeholder="السعر"
                        value={product.price}
                        onChange={(e) => {
                          const updated = [...products];
                          updated[idx].price = e.target.value;
                          setProducts(updated);
                        }}
                        className="w-full border p-2 rounded mb-2"
                      />
                      <input
                        type="text"
                        placeholder="طريقة التوصيل"
                        value={product.delivery}
                        onChange={(e) => {
                          const updated = [...products];
                          updated[idx].delivery = e.target.value;
                          setProducts(updated);
                        }}
                        className="w-full border p-2 rounded mb-2"
                      />
                      <input
                        type="text"
                        placeholder="المناطق التي يشملها التوصيل (مثال: الرياض، جدة، الدمام)"
                        value={product.locations.join(", ")}
                        onChange={(e) => {
                          const locations = e.target.value.split(",").map(l => l.trim());
                          const updated = [...products];
                          updated[idx].locations = locations;
                          setProducts(updated);
                        }}
                        className="w-full border p-2 rounded mb-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = products.filter((_, i) => i !== idx);
                          setProducts(filtered);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        حذف المنتج
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addProduct}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    + إضافة منتج
                  </button>
                </div>
              )}
            </div>

            {/* النبذة */}
            <h2 className="text-2xl font-bold text-[#1976D2] mb-4">نبذة</h2>
            <div className="mb-10">
              <textarea
                rows={6}
                className="w-full border p-3 rounded-lg"
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="نبذة عنك أو عن منشأتك..."
              />
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
                />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-40">مكالمة هاتفية</span>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-40">بريد إلكتروني</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="flex-1 border p-2 rounded"
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
              <div>
                <label className="block mb-2 font-semibold">الموقع الإلكتروني</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">LinkedIn</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  value={form.linkedin}
                  onChange={(e) => update("linkedin", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Instagram</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  value={form.instagram}
                  onChange={(e) => update("instagram", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">YouTube</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  value={form.youtube}
                  onChange={(e) => update("youtube", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">TikTok</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  value={form.tiktok}
                  onChange={(e) => update("tiktok", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Telegram</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  value={form.telegram}
                  onChange={(e) => update("telegram", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Snapchat</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  value={form.snapchat}
                  onChange={(e) => update("snapchat", e.target.value)}
                />
              </div>
            </div>

            {/* طرق الدفع */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">طرق الدفع</h2>
              {form.payments.map((p: any, index: number) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    placeholder="طريقة الدفع"
                    value={p.method}
                    onChange={(e) => {
                      const updated = [...form.payments];
                      updated[index].method = e.target.value;
                      setForm({ ...form, payments: updated });
                    }}
                    className="border p-2 rounded w-1/2"
                  />
                  <input
                    placeholder="التفاصيل"
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