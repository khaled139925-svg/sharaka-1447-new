# منصة شراكة - تعليمات البناء والنشر

## المشكلة الأصلية
خطأ `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` في بيئات CI غير التفاعلية.

## الحل المطبق

### 1. إعدادات pnpm (.pnpmrc)
- `ci-mode=true`: إخبار pnpm أنه في بيئة CI
- `force=true`: فرض حذف المجلدات بدون تأكيد
- `interactive=false`: تعطيل الوضع التفاعلي

### 2. إعدادات npm (.npmrc)
- `legacy-peer-deps=true`: السماح بـ peer dependencies القديمة
- `ignore-scripts=false`: تشغيل build scripts

### 3. إعدادات package.json
- `packageManager: "pnpm@10.29.2"`: تحديد إصدار pnpm
- `--no-optional`: تخطي optional dependencies
- `--no-frozen-lockfile`: السماح بتحديث lockfile

### 4. سكريبت CI (ci-install.sh)
سكريبت bash يتعامل مع التثبيت في بيئات CI غير التفاعلية

## كيفية البناء محلياً

```bash
pnpm install
pnpm build
```

## كيفية البناء في CI

```bash
bash ci-install.sh
```

أو استخدم الأوامر مباشرة:

```bash
export CI=true
pnpm install --no-optional --no-frozen-lockfile
pnpm build
```

## متغيرات البيئة المهمة

- `CI=true`: إخبار pnpm أنه في بيئة CI
- `NODE_ENV=production`: بيئة الإنتاج
- `npm_config_loglevel=warn`: مستوى السجلات

## الملفات الحرجة

- `.pnpmrc`: إعدادات pnpm
- `.npmrc`: إعدادات npm
- `package.json`: تعريف المشروع والسكريبتات
- `ci-install.sh`: سكريبت البناء في CI

## النشر على Manus

1. تأكد من أن جميع الملفات أعلاه موجودة
2. استخدم زر "Publish" في لوحة التحكم
3. Manus سيستخدم إعدادات .pnpmrc و package.json تلقائياً
