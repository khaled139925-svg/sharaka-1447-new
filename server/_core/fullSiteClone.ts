import axios from 'axios';
import * as cheerio from 'cheerio';
import { storagePut } from '../storage';

interface ClonedSite {
  id: string;
  originalUrl: string;
  title: string;
  description: string;
  html: string;
  images: Map<string, string>; // original URL -> stored URL
  clonedAt: number;
}

const clonedSites = new Map<string, ClonedSite>();

/**
 * جلب الموقع كاملاً مع جميع الموارد
 */
export async function cloneFullWebsite(url: string): Promise<ClonedSite> {
  try {
    // التحقق من صحة الرابط
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // جلب محتوى الموقع
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const images = new Map<string, string>();

    // استخراج العنوان والوصف
    const title = $('title').text() || $('h1').first().text() || 'Cloned Site';
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || 
                       $('p').first().text() || '';

    // جلب وحفظ جميع الصور
    const imgElements = $('img');
    for (let i = 0; i < imgElements.length; i++) {
      const img = $(imgElements[i]);
      const src = img.attr('src');
      
      if (src) {
        try {
          // تحويل الرابط النسبي إلى مطلق
          let absoluteUrl = src;
          if (!src.startsWith('http')) {
            const baseUrl = new URL(url);
            absoluteUrl = new URL(src, baseUrl).href;
          }

          // جلب الصورة وحفظها
          const imageResponse = await axios.get(absoluteUrl, {
            responseType: 'arraybuffer',
            timeout: 10000
          });

          const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
          const fileName = `cloned-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
          const fileKey = `cloned-sites/${fileName}`;

          const { url: storedUrl } = await storagePut(fileKey, imageResponse.data, contentType);
          images.set(src, storedUrl);

          // تحديث الرابط في HTML
          img.attr('src', storedUrl);
        } catch (err) {
          console.error(`Failed to clone image: ${src}`, err);
        }
      }
    }

    // جلب وحفظ CSS من الروابط الخارجية
    const linkElements = $('link[rel="stylesheet"]');
    for (let i = 0; i < linkElements.length; i++) {
      const link = $(linkElements[i]);
      const href = link.attr('href');
      
      if (href && href.startsWith('http')) {
        try {
          const cssResponse = await axios.get(href, { timeout: 10000 });
          const cssContent = cssResponse.data;
          
          // إنشاء style tag بدلاً من link tag
          const styleTag = `<style>${cssContent}</style>`;
          $('head').append(styleTag);
          link.remove();
        } catch (err) {
          console.error(`Failed to clone CSS: ${href}`, err);
        }
      }
    }

    // إزالة الروابط الخارجية التي قد تسبب مشاكل
    $('script[src]').remove();
    $('link[rel="icon"]').remove();
    $('meta[http-equiv]').remove();

    // إنشاء معرف فريد للموقع المستنسخ
    const siteId = `cloned-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const clonedSite: ClonedSite = {
      id: siteId,
      originalUrl: url,
      title: cleanText(title),
      description: cleanText(description),
      html: $.html(),
      images,
      clonedAt: Date.now()
    };

    // حفظ الموقع المستنسخ
    clonedSites.set(siteId, clonedSite);

    return clonedSite;
  } catch (error) {
    console.error('Error cloning website:', error);
    throw new Error(`Failed to clone website: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * الحصول على الموقع المستنسخ
 */
export function getClonedSite(siteId: string): ClonedSite | undefined {
  return clonedSites.get(siteId);
}

/**
 * تنظيف النص من الأحرف الزائدة
 */
function cleanText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .substring(0, 500);
}

/**
 * جلب قائمة الروابط من الموقع
 */
export async function extractLinksFromWebsite(url: string): Promise<string[]> {
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const links: string[] = [];

    $('a').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && (href.startsWith('http') || href.startsWith('/'))) {
        links.push(href);
      }
    });

    return links;
  } catch (error) {
    console.error('Error extracting links:', error);
    return [];
  }
}
