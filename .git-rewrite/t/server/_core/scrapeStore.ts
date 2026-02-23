import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * استنساخ موقع كامل وتحويله إلى متجر
 * يجلب جميع البيانات والصور من الموقع
 */
export async function scrapeStoreFromUrl(url: string) {
  try {
    // التحقق من أن الرابط صحيح
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // جلب محتوى الموقع
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // استخراج البيانات الأساسية
    let title = $('title').text() || $('h1').first().text() || 'متجر جديد';
    // إزالة كلمات غير مرغوبة من الاسم
    title = title.replace(/مستنسخ|cloned|clone/gi, '').trim();
    if (!title) title = 'متجر جديد';
    
    let description = 
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      $('p').first().text() ||
      'وصف المتجر';
    // إزالة كلمات غير مرغوبة من الوصف
    description = description.replace(/مستنسخ|cloned|clone/gi, '').trim();
    if (!description) description = 'وصف المتجر';

    // استخراج الصورة الرئيسية
    let logoUrl = 
      $('meta[property="og:image"]').attr('content') ||
      $('img').first().attr('src') ||
      '';

    // تحويل الروابط النسبية إلى روابط مطلقة
    if (logoUrl && !logoUrl.startsWith('http')) {
      try {
        const baseUrl = new URL(url);
        logoUrl = new URL(logoUrl, baseUrl.origin).href;
      } catch (e) {
        logoUrl = '';
      }
    }
    
    // إذا لم نجد شعار، تركه فارغاً
    if (!logoUrl || logoUrl.includes('placeholder')) {
      logoUrl = '';
    }

    // استخراج المنتجات من الموقع
    const products: any[] = [];
    
    // محاولة استخراج المنتجات من عناصر مختلفة
    $('[data-product], .product, .item, .card').each((index: number, element: any) => {
      if (index >= 5) return; // حد أقصى 5 منتجات

      const $el = $(element);
      const productName = 
        $el.find('[data-name], .name, .title, h3, h2').first().text() ||
        $el.text().substring(0, 50);
      
      const productPrice = 
        parseFloat(
          $el.find('[data-price], .price, .cost').first().text().replace(/[^\d.]/g, '')
        ) || Math.random() * 500 + 50;

      const productImage = 
        $el.find('img').first().attr('src') ||
        $el.find('[data-image]').first().attr('data-image') ||
        logoUrl;

      const productDescription = 
        $el.find('[data-description], .description, p').first().text() ||
        productName;

      if (productName.trim()) {
        products.push({
          id: Date.now().toString() + index,
          name: productName.trim(),
          price: productPrice,
          image: productImage.startsWith('http') ? productImage : new URL(productImage, new URL(url).origin).href,
          description: productDescription.trim(),
          points: Math.floor(productPrice * 0.1),
          quantity: Math.floor(Math.random() * 20) + 5
        });
      }
    });

    // إذا لم نجد منتجات، أنشئ منتجات افتراضية
    if (products.length === 0) {
      products.push({
        id: '1',
        name: 'منتج من ' + title,
        price: 99.99,
        image: logoUrl,
        description: description,
        points: 10,
        quantity: 10
      });
    }

    // إنشاء كائن المتجر
    const store = {
      id: Date.now().toString(),
      name: title.trim(),
      description: description.trim(),
      category: '', // المستخدم سيختار الفئة بنفسه
      logo: logoUrl,
      ownerName: 'مالك الموقع الأصلي',
      ownerEmail: 'contact@example.com',
      ownerPhone: '+966501234567',
      pointsRatio: 0.1,
      products: products
    };

    return store;
  } catch (error) {
    console.error('خطأ في استنساخ الموقع:', error);
    throw new Error(
      'فشل استنساخ الموقع. تأكد من أن الرابط صحيح والموقع متاح: ' +
      (error instanceof Error ? error.message : 'خطأ غير معروف')
    );
  }
}
