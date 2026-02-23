import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadFieldProps {
  label?: string;
  value?: string;
  onChange?: (url: string) => void;
  required?: boolean;
}

export function ImageUploadField({
  label = 'الصورة',
  value,
  onChange,
  required = false,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار صورة فقط');
      return;
    }

    // التحقق من حجم الملف
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة كبير جداً. الحد الأقصى 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل تحميل الصورة');
      }

      const data = await response.json();
      // تأكد من أن الـ URL موجود
      if (data.url) {
        onChange?.(data.url);
      } else {
        throw new Error('لم يتم الحصول على رابط الصورة');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ في تحميل الصورة';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />

        {value ? (
          <div className="space-y-3">
            <img
              src={value}
              alt="معاينة الصورة"
              className="w-32 h-32 object-cover rounded-lg mx-auto"
            />
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 ml-2" />
                تغيير الصورة
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <X className="w-4 h-4 ml-2" />
                حذف
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {uploading ? 'جاري التحميل...' : 'انقر لتحميل صورة'}
              </p>
              <p className="text-xs text-muted-foreground">
                أو اسحب الصورة هنا (الحد الأقصى 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
