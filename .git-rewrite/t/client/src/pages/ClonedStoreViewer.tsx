import { useState, useEffect } from 'react';
import { X, ShoppingCart, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClonedSite {
  id: string;
  originalUrl: string;
  title: string;
  description: string;
  html: string;
  clonedAt: number;
}

export default function ClonedStoreViewer({ 
  siteId, 
  pointsRatio,
  onClose 
}: { 
  siteId: string; 
  pointsRatio: number;
  onClose: () => void;
}) {
  const [site, setSite] = useState<ClonedSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClonedSite = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cloned-site/${siteId}`);
        
        if (!response.ok) {
          throw new Error('فشل في جلب الموقع المستنسخ');
        }

        const data = await response.json();
        setSite(data.site);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطأ غير معروف');
      } finally {
        setLoading(false);
      }
    };

    fetchClonedSite();
  }, [siteId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الموقع...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={onClose} className="w-full">إغلاق</Button>
        </div>
      </div>
    );
  }

  if (!site) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">{site.title}</h2>
          <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
            <Gift className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">
              {Math.round(pointsRatio * 100)}% نقاط
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <iframe
          srcDoc={site.html}
          className="w-full h-full border-none"
          title="Cloned Store"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>

      {/* Footer with Points Info */}
      <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          كل عملية شراء من هذا المتجر ستكسبك نقاط إضافية
        </div>
        <Button 
          onClick={onClose}
          variant="outline"
          className="gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          متابعة التسوق
        </Button>
      </div>
    </div>
  );
}
