import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
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
  const { uploading, error, imageUrl, handleFileSelect, resetUpload } = useImageUpload();

  const displayUrl = imageUrl || value;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFileSelect(e);
    if (imageUrl) {
      onChange?.(imageUrl);
    }
  };

  const handleRemove = () => {
    resetUpload();
    onChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />

        {displayUrl ? (
          <div className="space-y-3">
            <img
              src={displayUrl}
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
