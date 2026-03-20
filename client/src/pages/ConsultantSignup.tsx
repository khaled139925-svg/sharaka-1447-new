import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Upload, X } from 'lucide-react';

interface ConsultantSignupProps {
  onNavigate?: (page: string) => void;
}

const SPECIALTIES = [
  { name: "تقنية", subs: ["برمجة", "ذكاء اصطناعي", "أمن سيبراني", "تطوير مواقع"] },
  { name: "تسويق", subs: ["إعلانات", "سوشيال ميديا", "SEO", "تسويق محتوى"] },
  { name: "تصميم", subs: ["جرافيك", "UI/UX", "موشن", "تصميم مواقع"] },
  { name: "إدارة", subs: ["إدارة مشاريع", "قيادة", "تطوير أعمال"] },
  { name: "تعليم", subs: ["دورات", "تدريب", "تعليم عن بعد"] },
  { name: "صحة", subs: ["تغذية", "رياضة", "علاج طبيعي"] },
  { name: "قانون", subs: ["استشارات قانونية", "عقود", "قضايا"] },
  { name: "استثمار", subs: ["أسهم", "عقار", "مشاريع"] },
  { name: "إعلام", subs: ["صناعة محتوى", "يوتيوب", "بودكاست"] },
  { name: "برمجة", subs: ["React", "Node", "Flutter"] }
];

export default function ConsultantSignup({ onNavigate }: ConsultantSignupProps) {
  const [accountType, setAccountType] = useState<"individual" | "company">("individual");
  
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
    profileImage: "",
    ads: [] as any[],
    payments: [] as any[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const update = (key: string, value: string) => {
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
        setForm({ ...form, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setForm({ ...form, profileImage: "" });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // إدراج المستشار
    const { error } = await supabase.from("consultants").insert([
      {
        name: form.fullName || form.companyName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        country: form.country,
        city: form.city,
        specialty: form.specialty,
        sub_specialty: form.sub_specialty,
        bio: form.bio,
        profile_image: form.profileImage
      }
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("تم التسجيل بنجاح");
    onNavigate?.("browse");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-gray-50 py-16" dir="rtl">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8 text-right">
            <button
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
                    ? "border-[#FF9800] text-[#FF9800]"
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
                    ? "border-[#1976D2] text-[#1976D2]"
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

              {/* صورة شخصية / شعار */}
              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold">صورة شخصية / شعار</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1976D2] transition">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="معاينة الصورة"
                        className="h-48 w-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={40} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 mb-2">اسحب الصورة هنا أو انقر للاختيار</p>
                      <p className="text-sm text-gray-500">صيغ مدعومة: JPG, PNG, GIF (الحد الأقصى 5MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profileImageInput"
                  />
                  <label htmlFor="profileImageInput" className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border p-3 rounded-lg cursor-pointer"
                    />
                  </label>
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
                  className="w-full border p-3 rounded-lg"
                  value={form.experience}
                  onChange={(e) => update("experience", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold">نوع النشاط المهني</label>
                <select
                  className="w-full border p-3 rounded-lg"
                  value={form.activity}
                  onChange={(e) => update("activity", e.target.value)}
                >
                  <option value="">اختر النشاط</option>
                  <option>استشارات</option>
                  <option>تدريب وتعليم</option>
                  <option>تقنية وبرمجة</option>
                  <option>تصميم وإبداع</option>
                  <option>إعلام وصناعة محتوى</option>
                  <option>تسويق وأعمال</option>
                  <option>منتجات</option>
                  <option>خدمات متنوعة</option>
                </select>
              </div>
            </div>

            {/* الجلسات والاجتماعات */}
            <h2 className="text-2xl font-bold text-[#1976D2] mb-4">الجلسات والاجتماعات</h2>
            <p className="text-gray-600 mb-6 leading-8">
              هل ترغب في تقديم جلسات استشارية أو اجتماعات تتضمن عرض منتجات أو دورات تدريبية أو جلسات لتقديم أي خدمة؟
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block mb-2 font-semibold">السعر لكل ساعة</label>
                <input
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
                  <option>دينار كويتي</option>
                  <option>ريال قطري</option>
                  <option>دينار بحريني</option>
                  <option>ريال عماني</option>
                  <option>جنيه مصري</option>
                  <option>دولار أمريكي</option>
                  <option>يورو</option>
                </select>
              </div>
            </div>

            {/* برامج الاجتماعات */}
            <h3 className="text-xl font-bold text-[#FF9800] mb-4">برامج الاجتماعات</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              <label className="flex items-center gap-3 border p-3 rounded-lg">
                <input type="checkbox" /> Zoom
              </label>
              <label className="flex items-center gap-3 border p-3 rounded-lg">
                <input type="checkbox" /> Google Meet
              </label>
              <label className="flex items-center gap-3 border p-3 rounded-lg">
                <input type="checkbox" /> Microsoft Teams
              </label>
              <label className="flex items-center gap-3 border p-3 rounded-lg">
                <input type="checkbox" /> WhatsApp
              </label>
              <label className="flex items-center gap-3 border p-3 rounded-lg">
                <input type="checkbox" /> Telegram
              </label>
              <label className="flex items-center gap-3 border p-3 rounded-lg">
                <input type="checkbox" /> Discord
              </label>
            </div>

            {/* طرق الاتصال */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">طرق الاتصال</h2>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-40">واتساب</span>
                <input
                  type="text"
                  value={form.whatsapp || ""}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="flex-1 border p-2 rounded"
                />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-40">مكالمة هاتفية</span>
                <input
                  type="text"
                  value={form.phone || ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="flex-1 border p-2 rounded"
                />
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="w-40">بريد إلكتروني</span>
                <input
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="flex-1 border p-2 rounded"
                />
              </div>
            </div>

            <div className="mb-10">
              <label className="block mb-2 font-semibold">وسيلة تواصل أخرى</label>
              <input
                className="w-full border p-3 rounded-lg"
                placeholder="اكتب وسيلة تواصل أخرى"
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
                <label className="block mb-2 font-semibold">WhatsApp</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
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

            {/* النبذة */}
            <h2 className="text-2xl font-bold text-[#1976D2] mb-4">النبذة</h2>
            <div className="mb-10">
              <label className="block mb-2 font-semibold">نبذة عنك أو عن نشاطك</label>
              <textarea
                rows={6}
                className="w-full border p-3 rounded-lg"
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
              />
            </div>

            {/* معرض الأعمال */}
            <h2 className="text-2xl font-bold text-[#1976D2] mb-4">معرض الأعمال</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block mb-2 font-semibold">رفع صور</label>
                <input type="file" multiple className="w-full border p-3 rounded-lg" />
              </div>
              <div>
                <label className="block mb-2 font-semibold">رفع فيديو</label>
                <input type="file" className="w-full border p-3 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 font-semibold">رابط فيديو</label>
                <input
                  className="w-full border p-3 rounded-lg"
                  placeholder="رابط فيديو يوتيوب مثلاً"
                />
              </div>
            </div>

            {/* الإعلانات */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">الإعلانات</h2>
              {(form.ads || []).map((ad: any, index: number) => (
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
                    <label>تحميل صورة</label>
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
                    <label>تحميل فيديو</label>
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
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setForm({
                    ...form,
                    ads: [
                      ...(form.ads || []),
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
              {(form.payments || []).map((p: any, index: number) => (
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
                    className="border p-2 rounded bg-red-500 text-white px-3"
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
                      ...(form.payments || []),
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
              <span>أوافق على الشروط</span>
            </div>

            {/* زر إنشاء الحساب */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-[#FF9800] text-white font-bold py-4 px-10 rounded-lg"
              >
                إنشاء الحساب
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}