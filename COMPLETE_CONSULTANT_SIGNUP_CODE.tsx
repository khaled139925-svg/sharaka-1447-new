import { useState } from "react";
import { Upload, X } from 'lucide-react';

interface ConsultantSignupProps {
  onNavigate?: (page: string) => void;
}

export default function ConsultantSignup({ onNavigate }: ConsultantSignupProps) {

const [accountType,setAccountType] = useState<"individual" | "company">("individual")

const [form,setForm] = useState({
fullName:"",
companyName:"",
email:"",
phone:"",
password:"",
confirmPassword:"",
country:"",
city:"",
specialty:"",
experience:"",
activity:"",
bio:"",
price:"",
currency:"ريال سعودي",
website:"",
whatsapp:"",
linkedin:"",
instagram:"",
youtube:"",
tiktok:"",
telegram:"",
snapchat:"",
profileImage:"",
})

const [imagePreview, setImagePreview] = useState<string | null>(null);
const [imageFile, setImageFile] = useState<File | null>(null);

const update = (key:string,value:string)=>{
setForm({...form,[key]:value})
}

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار صورة صحيحة');
      return;
    }
    
    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setForm({...form, profileImage: reader.result as string});
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  setImagePreview(null);
  setImageFile(null);
  setForm({...form, profileImage: ""});
};

return (

<div className="min-h-screen bg-gray-50 py-16" dir="rtl">

<div className="max-w-5xl mx-auto px-6">

<div className="mb-8 text-right">

<button
onClick={()=>onNavigate?.("home")}
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

<h2 className="text-2xl font-bold text-[#1976D2] mb-4">
نوع الحساب
</h2>

<div className="grid grid-cols-2 gap-4 mb-10">

<button
type="button"
onClick={()=>setAccountType("individual")}
className={`p-4 rounded-xl border text-lg ${
accountType==="individual"
? "border-[#FF9800] text-[#FF9800]"
: "border-gray-300"
}`}
>
فرد
</button>

<button
type="button"
onClick={()=>setAccountType("company")}
className={`p-4 rounded-xl border text-lg ${
accountType==="company"
? "border-[#1976D2] text-[#1976D2]"
: "border-gray-300"
}`}
>
منشأة
</button>

</div>

{/* المعلومات الأساسية */}

<h2 className="text-2xl font-bold text-[#1976D2] mb-4">
المعلومات الأساسية
</h2>

<div className="grid md:grid-cols-2 gap-6 mb-10">

{accountType==="individual" && (

<div>

<label className="block mb-2 font-semibold">
الاسم الكامل
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.fullName}
onChange={(e)=>update("fullName",e.target.value)}
/>

</div>

)}

{accountType==="company" && (

<div>

<label className="block mb-2 font-semibold">
اسم المنشأة
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.companyName}
onChange={(e)=>update("companyName",e.target.value)}
/>

</div>

)}

<div>

<label className="block mb-2 font-semibold">
البريد الإلكتروني
</label>

<input
type="email"
className="w-full border p-3 rounded-lg"
value={form.email}
onChange={(e)=>update("email",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
رقم الهاتف
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.phone}
onChange={(e)=>update("phone",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
كلمة المرور
</label>

<input
type="password"
className="w-full border p-3 rounded-lg"
value={form.password}
onChange={(e)=>update("password",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
تأكيد كلمة المرور
</label>

<input
type="password"
className="w-full border p-3 rounded-lg"
value={form.confirmPassword}
onChange={(e)=>update("confirmPassword",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
الدولة
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.country}
onChange={(e)=>update("country",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
المدينة
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.city}
onChange={(e)=>update("city",e.target.value)}
/>

</div>

{/* حقل الصورة الشخصية/الشعار - هذا هو الحقل الجديد */}

<div className="md:col-span-2">

<label className="block mb-2 font-semibold">
صورة شخصية / شعار
</label>

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

<h2 className="text-2xl font-bold text-[#1976D2] mb-4">
المعلومات المهنية
</h2>

<div className="grid md:grid-cols-2 gap-6 mb-10">

<div>

<label className="block mb-2 font-semibold">
التخصص
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.specialty}
onChange={(e)=>update("specialty",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
سنوات الخبرة
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.experience}
onChange={(e)=>update("experience",e.target.value)}
/>

</div>

<div className="md:col-span-2">

<label className="block mb-2 font-semibold">
نوع النشاط المهني
</label>

<select
className="w-full border p-3 rounded-lg"
value={form.activity}
onChange={(e)=>update("activity",e.target.value)}
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

<h2 className="text-2xl font-bold text-[#1976D2] mb-4">
الجلسات والاجتماعات
</h2>

<p className="text-gray-600 mb-6 leading-8">
هل ترغب في تقديم جلسات استشارية أو اجتماعات تتضمن عرض منتجات أو دورات تدريبية أو جلسات لتقديم أي خدمة؟
</p>

<div className="grid md:grid-cols-2 gap-6 mb-10">

<div>

<label className="block mb-2 font-semibold">
السعر لكل ساعة
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.price}
onChange={(e)=>update("price",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
العملة
</label>

<select
className="w-full border p-3 rounded-lg"
value={form.currency}
onChange={(e)=>update("currency",e.target.value)}
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

<h3 className="text-xl font-bold text-[#FF9800] mb-4">
برامج الاجتماعات
</h3>

<div className="grid md:grid-cols-3 gap-4 mb-10">

<label className="flex items-center gap-3 border p-3 rounded-lg">
<input type="checkbox"/>
Zoom
</label>

<label className="flex items-center gap-3 border p-3 rounded-lg">
<input type="checkbox"/>
Google Meet
</label>

<label className="flex items-center gap-3 border p-3 rounded-lg">
<input type="checkbox"/>
Microsoft Teams
</label>

<label className="flex items-center gap-3 border p-3 rounded-lg">
<input type="checkbox"/>
WhatsApp
</label>

<label className="flex items-center gap-3 border p-3 rounded-lg">
<input type="checkbox"/>
Telegram
</label>

<label className="flex items-center gap-3 border p-3 rounded-lg">
<input type="checkbox"/>
Discord
</label>

</div>

{/* طرق التواصل */}

<h2 className="text-2xl font-bold text-[#1976D2] mb-4">
طرق التواصل
</h2>

<div className="grid md:grid-cols-2 gap-4 mb-10">

<label className="flex items-center gap-3 border p-3 rounded-lg">
<input type="checkbox"/>
واتساب
</label>

<label className="flex items-center gap-3 border p-3 rounded-lg">
<input type="checkbox"/>
مكالمة هاتفية
</label>

<label className="flex items-center gap-3 border p-3 rounded-lg">
<input type="checkbox"/>
رسائل داخل المنصة
</label>

<label className="flex items-center gap-3 border p-3 rounded-lg">
<input type="checkbox"/>
بريد إلكتروني
</label>

</div>

<div className="mb-10">

<label className="block mb-2 font-semibold">
وسيلة تواصل أخرى
</label>

<input
className="w-full border p-3 rounded-lg"
placeholder="اكتب وسيلة تواصل أخرى"
/>

</div>

{/* الموقع والروابط */}

<h2 className="text-2xl font-bold text-[#1976D2] mb-4">
الموقع الإلكتروني والروابط
</h2>

<div className="grid md:grid-cols-2 gap-6 mb-10">

<div>

<label className="block mb-2 font-semibold">
الموقع الإلكتروني
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.website}
onChange={(e)=>update("website",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
WhatsApp
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.whatsapp}
onChange={(e)=>update("whatsapp",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
LinkedIn
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.linkedin}
onChange={(e)=>update("linkedin",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
Instagram
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.instagram}
onChange={(e)=>update("instagram",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
YouTube
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.youtube}
onChange={(e)=>update("youtube",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
TikTok
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.tiktok}
onChange={(e)=>update("tiktok",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
Telegram
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.telegram}
onChange={(e)=>update("telegram",e.target.value)}
/>

</div>

<div>

<label className="block mb-2 font-semibold">
Snapchat
</label>

<input
className="w-full border p-3 rounded-lg"
value={form.snapchat}
onChange={(e)=>update("snapchat",e.target.value)}
/>

</div>

</div>

{/* النبذة */}

<h2 className="text-2xl font-bold text-[#1976D2] mb-4">
النبذة
</h2>

<div className="mb-10">

<label className="block mb-2 font-semibold">
نبذة عنك أو عن نشاطك
</label>

<textarea
rows={6}
className="w-full border p-3 rounded-lg"
value={form.bio}
onChange={(e)=>update("bio",e.target.value)}
/>

</div>

{/* معرض الأعمال */}

<h2 className="text-2xl font-bold text-[#1976D2] mb-4">
معرض الأعمال
</h2>

<div className="grid md:grid-cols-2 gap-6 mb-10">

<div>

<label className="block mb-2 font-semibold">
رفع صور
</label>

<input
type="file"
multiple
className="w-full border p-3 rounded-lg"
/>

</div>

<div>

<label className="block mb-2 font-semibold">
رفع فيديو
</label>

<input
type="file"
className="w-full border p-3 rounded-lg"
/>

</div>

<div className="md:col-span-2">

<label className="block mb-2 font-semibold">
رابط فيديو
</label>

<input
className="w-full border p-3 rounded-lg"
placeholder="رابط فيديو يوتيوب مثلاً"
/>

</div>

</div>

{/* الموافقة */}

<div className="flex items-center gap-3 mb-10">

<input type="checkbox"/>

<span>
أوافق على شروط وأحكام منصة شراكة
</span>

</div>

{/* زر إنشاء الحساب */}

<div className="text-center">

<button
className="bg-[#FF9800] hover:bg-orange-500 text-white font-bold py-4 px-10 rounded-lg text-lg transition"
>
إنشاء الحساب
</button>

</div>

</div>

</div>

</div>

)

}
