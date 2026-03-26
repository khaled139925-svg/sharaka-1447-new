import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Upload, X, Save, ArrowRight, Plus, Trash2 } from 'lucide-react';

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

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
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
    profile_image: "",
    consulting_price: "",
    training_price: "",
    individual_price: "",
    workshop_price: "",
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
        fullName: data.full_name || "",
        companyName: data.company_name || "",
        email: data.email || "",
        phone: data.phone || "",
        country: data.country || "",
        city: data.city || "",
        specialty: data.specialty || "",
        sub_specialty: data.sub_specialty || "",
        experience: data.experience || "",
        bio: data.bio || "",
        website: data.website || "",
        whatsapp: data.whatsapp || "",
        linkedin: data.linkedin || "",
        instagram: data.instagram || "",
        youtube: data.youtube || "",
        tiktok: data.tiktok || "",
        telegram: data.telegram || "",
        snapchat: data.snapchat || "",
        otherContact: data.other_contact || "",
        profile_image: data.profile_image || "",
        consulting_price: data.consulting_price || "",
        training_price: data.training_price || "",
        individual_price: data.individual_price || "",
        workshop_price: data.workshop_price || "",
      });
      setSelectedServices(data.selected_services || []);
      setProducts(data.products || []);
      setAds(data.ads || []);
      setPayments(data.payment_methods || []);
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

  const updateProduct = (index: number, field: string, value: any) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const addAd = () => {
    setAds([...ads, { title: "", description: "", image: null, video: null, price: "", contact: "" }]);
  };

  const updateAd = (index: number, field: string, value: any) => {
    const updated = [...ads];
    updated[index][field] = value;
    setAds(updated);
  };

  const removeAd = (index: number) => {
    setAds(ads.filter((_, i) => i !== index));
  };

  const addPayment = () => {
    setPayments([...payments, { method: "", details: "" }]);
  };

  const updatePayment = (index: number, field: string, value: any) => {
    const updated = [...payments];
    updated[index][field] = value;
    setPayments(updated);
  };

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const { error } = await supabase.storage
      .from('media')
      .upload(fileName, file);
    
    if (error) {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      return base64;
    }
    
    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let profileImageUrl = form.profile_image;
    if (imageFile) {
      profileImageUrl = await uploadFile(imageFile, "profile");
    }

    // رفع صور المنتجات
    const productsWithImages = [];
    for (const product of products) {
      let productImage = product.image;
      if (product.image && typeof product.image !== 'string') {
        productImage = await uploadFile(product.image, "products");
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

    // رفع صور الإعلانات
    const adsWithMedia = [];
    for (const ad of ads) {
      let adImage = ad.image;
      let adVideo = ad.video;
      if (ad.image && typeof ad.image !== 'string') {
        adImage = await uploadFile(ad.image, "ads");
      }
      if (ad.video && typeof ad.video !== 'string') {
        adVideo = await uploadFile(ad.video, "ads");
      }
      adsWithMedia.push({
        title: ad.title,
        description: ad.description,
        image: adImage,
        video: adVideo,
        price: ad.price,
        contact: ad.contact,
      });
    }

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
        profile_image: profileImageUrl || null,
        selected_services: selectedServices,
        products: productsWithImages,
        consulting_price: form.consulting_price || null,
        training_price: form.training_price || null,
        individual_price: form.individual_price || null,
        workshop_price: form.workshop_price || null,
        ads: adsWithMedia,
        payment_methods: payments,
      })
      .eq("id", id);

    if (error) {
      alert("خطأ في التحديث: " + error.message);
    } else {
      alert("تم تحديث الملف الشخصي بنجاح");
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

            {/* الخدمات - أزرار اختيار */}
            <div className="mt-5">
              <label className="block mb-2 font-semibold text-gray-700">الخدمات التي تقدمها</label>
              <p className="text-gray-600 mb-3 text-sm">اختر الخدمات التي تقدمها (يمكنك اختيار أكثر من خدمة)</p>
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
                  <h3 className="font-bold text-[#FF9800] mb-3">المنتجات في المتجر</h3>
                  {products.map((product, idx) => (
                    <div key={idx} className="border p-4 rounded-lg mb-4">
                      <input
                        type="text"
                        placeholder="اسم المنتج"
                        value={product.name}
                        onChange={(e) => updateProduct(idx, "name", e.target.value)}
                        className="w-full border p-2 rounded mb-2"
                      />
                      <textarea
                        placeholder="وصف المنتج"
                        value={product.description}
                        onChange={(e) => updateProduct(idx, "description", e.target.value)}
                        className="w-full border p-2 rounded mb-2"
                        rows={2}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          updateProduct(idx, "image", file);
                        }}
                        className="w-full border p-2 rounded mb-2"
                      />
                      {product.image && typeof product.image === 'string' && product.image.startsWith('http') && (
                        <img src={product.image} alt="صورة المنتج" className="w-20 h-20 object-cover rounded mt-2" />
                      )}
                      <input
                        type="text"
                        placeholder="السعر"
                        value={product.price}
                        onChange={(e) => updateProduct(idx, "price", e.target.value)}
                        className="w-full border p-2 rounded mb-2"
                      />
                      <input
                        type="text"
                        placeholder="طريقة التوصيل"
                        value={product.delivery}
                        onChange={(e) => updateProduct(idx, "delivery", e.target.value)}
                        className="w-full border p-2 rounded mb-2"
                      />
                      <input
                        type="text"
                        placeholder="المناطق التي يشملها التوصيل (مثال: الرياض، جدة، الدمام)"
                        value={product.locations.join(", ")}
                        onChange={(e) => {
                          const locations = e.target.value.split(",").map(l => l.trim());
                          updateProduct(idx, "locations", locations);
                        }}
                        className="w-full border p-2 rounded mb-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeProduct(idx)}
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
            <div className="mt-5">
              <label className="block mb-2 font-semibold text-gray-700">النبذة</label>
              <textarea rows={5} className="w-full border border-gray-300 rounded-xl p-3" value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="نبذة عنك..." />
            </div>

            {/* طرق الاتصال */}
            <div className="grid md:grid-cols-2 gap-5 mt-5">
              <div><label className="block mb-2 font-semibold text-gray-700">الموقع الإلكتروني</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.website} onChange={(e) => update("website", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">واتساب</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">لينكدإن</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">انستغرام</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.instagram} onChange={(e) => update("instagram", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">يوتيوب</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.youtube} onChange={(e) => update("youtube", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">تيك توك</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.tiktok} onChange={(e) => update("tiktok", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">تيليجرام</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.telegram} onChange={(e) => update("telegram", e.target.value)} /></div>
              <div><label className="block mb-2 font-semibold text-gray-700">سناب شات</label><input className="w-full border border-gray-300 rounded-xl p-3" value={form.snapchat} onChange={(e) => update("snapchat", e.target.value)} /></div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold text-gray-700">وسيلة تواصل أخرى</label>
                <input className="w-full border border-gray-300 rounded-xl p-3" value={form.otherContact} onChange={(e) => update("otherContact", e.target.value)} />
              </div>
            </div>

            {/* طرق الدفع */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-[#1976D2] mb-4">طرق الدفع</h2>
              {payments.map((p: any, index: number) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input placeholder="طريقة الدفع" value={p.method} onChange={(e) => updatePayment(index, "method", e.target.value)} className="border p-2 rounded w-1/2" />
                  <input placeholder="التفاصيل" value={p.details} onChange={(e) => updatePayment(index, "details", e.target.value)} className="border p-2 rounded w-1/2" />
                  <button type="button" onClick={() => removePayment(index)} className="bg-red-500 text-white px-3 py-1 rounded">✕</button>
                </div>
              ))}
              <button type="button" onClick={addPayment} className="bg-green-600 text-white px-4 py-2 rounded">+ إضافة طريقة دفع</button>
            </div>

            {/* الإعلانات */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-[#FF9800] mb-4">الإعلانات</h2>
              {ads.map((ad: any, index: number) => (
                <div key={index} className="border p-4 rounded-lg mb-4">
                  <input type="text" placeholder="عنوان الإعلان" value={ad.title} onChange={(e) => updateAd(index, "title", e.target.value)} className="w-full border p-2 rounded mb-2" />
                  <textarea placeholder="وصف الإعلان" value={ad.description} onChange={(e) => updateAd(index, "description", e.target.value)} className="w-full border p-2 rounded mb-2" rows={2} />
                  <div className="mb-2">
                    <label>صورة الإعلان</label>
                    <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; updateAd(index, "image", file); }} className="w-full border p-2 rounded" />
                    {ad.image && typeof ad.image === 'string' && ad.image.startsWith('http') && (
                      <img src={ad.image} alt="صورة الإعلان" className="w-20 h-20 object-cover rounded mt-2" />
                    )}
                  </div>
                  <div className="mb-2">
                    <label>فيديو الإعلان</label>
                    <input type="file" accept="video/*" onChange={(e) => { const file = e.target.files?.[0]; updateAd(index, "video", file); }} className="w-full border p-2 rounded" />
                  </div>
                  <input type="text" placeholder="السعر" value={ad.price} onChange={(e) => updateAd(index, "price", e.target.value)} className="w-full border p-2 rounded mb-2" />
                  <input type="text" placeholder="رقم التواصل" value={ad.contact} onChange={(e) => updateAd(index, "contact", e.target.value)} className="w-full border p-2 rounded mb-2" />
                  <button type="button" onClick={() => removeAd(index)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">حذف الإعلان</button>
                </div>
              ))}
              <button type="button" onClick={addAd} className="bg-blue-600 text-white px-4 py-2 rounded">+ إضافة إعلان</button>
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