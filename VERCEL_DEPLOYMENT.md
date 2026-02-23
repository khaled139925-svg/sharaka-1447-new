# نشر منصة شراكة على Vercel

## الخطوات السريعة

### 1. إنشاء حساب Vercel
- اذهب إلى https://vercel.com
- سجل دخول باستخدام GitHub أو بريدك الإلكتروني

### 2. ربط المشروع مع GitHub
```bash
# تأكد من أنك في مجلد المشروع
cd /home/ubuntu/sharaka-platform

# إنشاء مستودع Git محلي
git init
git add .
git commit -m "Initial commit: Sharaka Platform"

# إنشاء مستودع على GitHub
# اذهب إلى https://github.com/new وأنشئ مستودع جديد

# ربط المستودع المحلي مع GitHub
git remote add origin https://github.com/YOUR_USERNAME/sharaka-platform.git
git branch -M main
git push -u origin main
```

### 3. نشر على Vercel
1. اذهب إلى https://vercel.com/dashboard
2. انقر على "Add New..." → "Project"
3. اختر المستودع `sharaka-platform`
4. Vercel سيكتشف تلقائياً أنه مشروع Vite
5. انقر على "Deploy"

### 4. إعدادات البيئة (إذا لزم الأمر)
في لوحة تحكم Vercel:
1. اذهب إلى Settings → Environment Variables
2. أضف أي متغيرات بيئة مطلوبة

## ملفات الإعدادات

- `vercel.json`: إعدادات Vercel الرئيسية
- `package.json`: سكريبتات البناء
- `.pnpmrc`: إعدادات pnpm (Vercel يدعمها تلقائياً)

## المميزات

✅ Vercel يدعم pnpm بشكل كامل
✅ بناء سريع وموثوق
✅ نشر تلقائي عند كل push إلى main
✅ دعم المتغيرات البيئية
✅ SSL مجاني
✅ CDN عالمي

## عنوان النطاق المخصص

بعد النشر على Vercel:
1. اذهب إلى Settings → Domains
2. أضف النطاق `sharaka1447.com`
3. اتبع التعليمات لتحديث DNS

## استكشاف الأخطاء

إذا حدثت مشاكل:
1. تحقق من سجلات البناء في Vercel
2. تأكد من أن جميع متغيرات البيئة معيّنة
3. تأكد من أن `package.json` يحتوي على جميع الاعتماديات

## الدعم

- Vercel Support: https://vercel.com/support
- Vite Documentation: https://vitejs.dev
- pnpm Documentation: https://pnpm.io
