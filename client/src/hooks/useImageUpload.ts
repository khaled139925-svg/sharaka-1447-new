import { useState } from 'react';

interface UploadResponse {
  success: boolean;
  url: string;
  filename: string;
  size: number;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
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

      const data: UploadResponse = await response.json();
      setImageUrl(data.url);
      return data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ في تحميل الصورة';
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

    await uploadImage(file);
  };

  const resetUpload = () => {
    setImageUrl(null);
    setError(null);
  };

  return {
    uploading,
    error,
    imageUrl,
    uploadImage,
    handleFileSelect,
    resetUpload,
  };
}
