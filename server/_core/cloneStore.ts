/**
 * Clone Store API
 * يتيح استنساخ محتويات متجر موجود من رابط
 */

interface CloneStoreRequest {
  storeUrl: string;
}

interface ClonedStoreData {
  name: string;
  description: string;
  logo: string;
  products: Array<{
    name: string;
    price: number;
    image: string;
    description: string;
    quantity: number;
  }>;
  category?: string;
  pointsRatio?: number;
}

/**
 * استنساخ بيانات المتجر من الرابط
 * يجلب الصورة والمنتجات والوصف
 */
export async function cloneStoreFromUrl(url: string): Promise<ClonedStoreData> {
  try {
    // التحقق من صحة الرابط
    const urlObj = new URL(url);
    
    // جلب صفحة المتجر
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('فشل جلب بيانات المتجر من الرابط');
    }

    const html = await response.text();
    
    // استخراج البيانات من الـ HTML
    // هذا مثال - قد تحتاج لتعديل حسب بنية الموقع الفعلية
    const storeData = extractStoreData(html, urlObj.origin);
    
    return storeData;
  } catch (error) {
    throw new Error(`خطأ في استنساخ المتجر: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
  }
}

/**
 * استخراج بيانات المتجر من HTML
 */
function extractStoreData(html: string, baseUrl: string): ClonedStoreData {
  // استخراج اسم المتجر
  let nameMatch = html.match(/<title>(.*?)<\/title>/i);
  let name = nameMatch ? nameMatch[1].trim() : 'متجر جديد';
  // إزالة كلمات غير مرغوبة
  name = name.replace(/مستنسخ|cloned|clone/gi, '').trim();
  if (!name) name = 'متجر جديد';

  // استخراج الوصف
  const descriptionMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  let description = descriptionMatch ? descriptionMatch[1] : 'وصف المتجر';
  // إزالة كلمات غير مرغوبة
  description = description.replace(/مستنسخ|cloned|clone/gi, '').trim();
  if (!description) description = 'وصف المتجر';

  // استخراج الصورة (الشعار)
  const logoMatch = html.match(/<img[^>]*src="([^"]*)"[^>]*(?:alt="logo"|class="[^"]*logo[^"]*")[^>]*>/i) ||
                    html.match(/<img[^>]*(?:alt="logo"|class="[^"]*logo[^"]*")[^>]*src="([^"]*)"[^>]*>/i);
  
  let logo = logoMatch ? logoMatch[1] : '';
  // تحويل الرابط النسبي إلى مطلق
  if (logo && !logo.startsWith('http')) {
    try {
      logo = new URL(logo, baseUrl).href;
    } catch (e) {
      logo = '';
    }
  }
  // إذا لم نجد شعار، تركه فارغاً
  if (!logo || logo.includes('placeholder')) {
    logo = '';
  }

  // استخراج المنتجات (مثال بسيط)
  const products: ClonedStoreData['products'] = [];
  const productMatches = html.matchAll(/<div[^>]*class="[^"]*product[^"]*"[^>]*>[\s\S]*?<\/div>/gi);
  
  for (const match of productMatches) {
    const productHtml = match[0];
    
    // استخراج اسم المنتج
    const productNameMatch = productHtml.match(/<h[2-4][^>]*>([^<]*)<\/h[2-4]>/i);
    const productName = productNameMatch ? productNameMatch[1].trim() : '';
    
    // استخراج السعر
    const priceMatch = productHtml.match(/[\$£€]?\s*(\d+(?:[.,]\d{2})?)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
    
    // استخراج الصورة
    const productImageMatch = productHtml.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
    let productImage = productImageMatch ? productImageMatch[1] : '';
    if (productImage && !productImage.startsWith('http')) {
      productImage = new URL(productImage, baseUrl).href;
    }
    
    // استخراج الوصف
    const productDescMatch = productHtml.match(/<p[^>]*>([^<]*)<\/p>/i);
    const productDesc = productDescMatch ? productDescMatch[1].trim() : '';

    if (productName && price > 0) {
      products.push({
        name: productName,
        price,
        image: productImage,
        description: productDesc,
        quantity: 10, // كمية افتراضية
      });
    }
  }

  return {
    name: name.substring(0, 50), // تحديد الحد الأقصى للاسم
    description: description.substring(0, 200),
    logo,
    products: products.slice(0, 20), // تحديد الحد الأقصى للمنتجات
    category: '',
    pointsRatio: 0.1,
  };
}

/**
 * تنزيل الصورة وحفظها محلياً
 */
export async function downloadAndSaveImage(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('فشل تنزيل الصورة');
    }

    const buffer = await response.buffer();
    const filename = `cloned-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const filepath = `/uploads/${filename}`;

    // حفظ الصورة (يتم التعامل معها في الـ API)
    return filepath;
  } catch (error) {
    throw new Error(`خطأ في تنزيل الصورة: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
  }
}
