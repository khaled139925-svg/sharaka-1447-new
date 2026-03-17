# توثيق التعديلات على شاشة انضمام المستشار

## الملف المعدل
**المسار:** `client/src/pages/ConsultantSignup.tsx`

---

## الخطوات التي تمت

### 1. إضافة الاستيرادات (Imports)
تم إضافة استيراد أيقونات جديدة من مكتبة `lucide-react`:

```typescript
import { Upload, X } from 'lucide-react';
```

**الشرح:** 
- `Upload`: أيقونة لتمثيل عملية الرفع
- `X`: أيقونة لحذف الصورة

---

### 2. إضافة حالات جديدة (State) في الـ Form

تم إضافة حقل جديد في كائن `form`:

```typescript
const [form,setForm] = useState({
  // ... الحقول القديمة ...
  profileImage:"",  // ← حقل جديد لتخزين الصورة كـ Base64
})
```

**الشرح:** هذا الحقل يخزن الصورة بصيغة Base64 لتسهيل إرسالها مع البيانات الأخرى.

---

### 3. إضافة حالات لمعاينة الصورة

تم إضافة متغيرات جديدة لإدارة معاينة الصورة:

```typescript
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [imageFile, setImageFile] = useState<File | null>(null);
```

**الشرح:**
- `imagePreview`: يخزن الصورة لعرض معاينة لها
- `imageFile`: يخزن ملف الصورة الأصلي

---

### 4. دالة معالجة تغيير الصورة

تم إضافة دالة جديدة تسمى `handleImageChange`:

```typescript
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
```

**الشرح:**
1. تأخذ الملف المختار من input
2. تتحقق من أن الملف صورة (jpg, png, gif إلخ)
3. تتحقق من أن حجم الملف لا يتجاوز 5MB
4. تحول الصورة إلى Base64 لعرضها ومعالجتها

---

### 5. دالة حذف الصورة

تم إضافة دالة جديدة تسمى `removeImage`:

```typescript
const removeImage = () => {
  setImagePreview(null);
  setImageFile(null);
  setForm({...form, profileImage: ""});
};
```

**الشرح:** تحذف الصورة المختارة وتعيد الحقل إلى حالته الأولى.

---

### 6. إضافة حقل الصورة في واجهة المستخدم

تم إضافة قسم جديد في قسم "المعلومات الأساسية":

```jsx
{/* حقل الصورة الشخصية/الشعار */}

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
```

**الشرح:**
- يعرض منطقة رفع بتصميم "Drag & Drop"
- عند اختيار صورة، يعرض معاينة لها مع زر حذف
- عند عدم اختيار صورة، يعرض رسالة توضيحية

---

## ملخص التغييرات

| العنصر | النوع | الوصف |
|--------|-------|-------|
| `Upload, X` | Imports | أيقونات جديدة |
| `profileImage` | State | حقل تخزين الصورة |
| `imagePreview` | State | حالة معاينة الصورة |
| `imageFile` | State | حالة ملف الصورة |
| `handleImageChange()` | Function | معالج تغيير الصورة |
| `removeImage()` | Function | معالج حذف الصورة |
| Image Upload Section | JSX | واجهة رفع الصورة |

---

## كيفية الاستخدام في مشروعك

### الخطوة 1: استبدال الملف
انسخ محتوى الملف الكامل من أسفل هذا الملف واستبدل محتوى:
```
client/src/pages/ConsultantSignup.tsx
```

### الخطوة 2: تثبيت الاعتمادات (إذا لم تكن مثبتة)
```bash
npm install lucide-react
```

### الخطوة 3: إعادة بناء المشروع
```bash
npm run build
```

### الخطوة 4: تشغيل المشروع
```bash
npm run dev
```

---

## الميزات المضافة

✅ **رفع الصورة:** المستخدم يمكنه رفع صورة شخصية أو شعار  
✅ **معاينة فورية:** عرض الصورة مباشرة بعد الاختيار  
✅ **حذف الصورة:** زر لحذف الصورة وإعادة الاختيار  
✅ **التحقق من النوع:** التأكد من أن الملف صورة  
✅ **التحقق من الحجم:** التأكد من أن الصورة لا تتجاوز 5MB  
✅ **تصميم احترافي:** تصميم يتناسب مع باقي الموقع  

---

## ملاحظات مهمة

1. **Base64:** الصورة يتم تحويلها إلى Base64 لتسهيل إرسالها مع البيانات
2. **الحد الأقصى:** حجم الصورة محدد بـ 5MB لتجنب مشاكل الأداء
3. **الصيغ المدعومة:** JPG, PNG, GIF, WebP وجميع صيغ الصور الشهيرة
4. **التخزين:** عند الإرسال للخادم، يجب التعامل مع `form.profileImage`

---

## الكود الكامل للملف المعدل

يتابع أدناه...
