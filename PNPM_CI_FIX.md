# حل مشكلة ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY

## 🔴 المشكلة

عند محاولة نشر المشروع على Manus أو أي بيئة CI، يحدث الخطأ التالي:

```
ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY
Aborted removal of modules directory due to no TTY
If you are running pnpm in CI, set the CI environment variable to "true".
```

هذا الخطأ يحدث لأن pnpm يحاول حذف مجلد `node_modules` في بيئة غير تفاعلية (بدون واجهة مستخدم) ولا يمكنه الحصول على تأكيد من المستخدم.

## ✅ الحل

تم تطبيق حل شامل يتضمن:

### 1. تحديث `.pnpmrc`

ملف الإعدادات الحرج يحتوي على:

```ini
ci-mode=true          # إخبار pnpm أنه في بيئة CI
force=true            # فرض حذف المجلدات بدون تأكيد TTY
interactive=false     # تعطيل الوضع التفاعلي
```

### 2. سكريبت `ci-install.sh`

سكريبت bash آمن يقوم بـ:
- تعيين متغيرات البيئة `CI=true`
- التأكد من إعدادات `.pnpmrc` الصحيحة
- تنظيف أي حالة معطوبة
- تثبيت الحزم بدون frozen lockfile

### 3. متغيرات البيئة

تأكد من تعيين هذه المتغيرات في بيئة النشر:

```bash
export CI=true
export NODE_ENV=production
export npm_config_loglevel=warn
```

## 🚀 كيفية الاستخدام

### للنشر على Manus:

1. تأكد من أن `.pnpmrc` موجود في جذر المشروع
2. Manus سيقرأ هذا الملف تلقائياً عند البناء
3. لا تحتاج لفعل شيء إضافي

### للاختبار المحلي:

```bash
# تشغيل سكريبت البناء الآمن
bash ci-install.sh

# أو تشغيل البناء مباشرة
CI=true pnpm install --no-frozen-lockfile --force
CI=true pnpm build
```

## 📋 الملفات المعدلة

- `.pnpmrc` - إعدادات pnpm لبيئة CI
- `ci-install.sh` - سكريبت البناء الآمن
- `package.json` - تحديث السكريبتات

## 🔍 التحقق من النجاح

بعد تطبيق الحل، تحقق من:

1. ✅ البناء ينجح بدون أخطاء TTY
2. ✅ جميع الحزم مثبتة بنجاح
3. ✅ ملف `dist` يحتوي على الملفات المبنية
4. ✅ الخادم يعمل بدون أخطاء

## 📞 إذا استمرت المشكلة

إذا استمرت المشكلة بعد تطبيق هذا الحل:

1. تأكد من أن `.pnpmrc` موجود في جذر المشروع
2. تأكد من أن `pnpm --version` يعيد إصدار >= 8
3. جرب حذف `pnpm-lock.yaml` وإعادة تثبيت الحزم
4. جرب استخدام `npm` بدلاً من `pnpm` كحل مؤقت

## 🎯 الخطوات التالية

1. **النشر على Manus**: اذهب إلى Management UI → Publish
2. **ربط النطاق**: Settings → Domains → أضف `sharaka1447.com`
3. **تحديث DNS**: اتبع التعليمات لتحديث DNS لديك
