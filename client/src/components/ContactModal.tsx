import React from 'react';
import { useState } from "react";
import emailjs from '@emailjs/browser';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // المفاتيح الصحيحة من اللقطات
  const EMAILJS_SERVICE_ID = "tariq-t14";                // ثابت
const EMAILJS_TEMPLATE_ID = "template_iessin7";        // كما في الصورة السابقة
const EMAILJS_PUBLIC_KEY = "0qJ4oOyxix3uq051A";       // المفتاح الجديد
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        setError("حدث خطأ في الإرسال");
      }
    } catch (err: any) {
      console.error("خطأ EmailJS:", err);
      setError(err.text || "حدث خطأ في الإرسال");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full" dir="rtl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-[#FF9800]">تواصل معنا</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">الاسم</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
              placeholder="أدخل اسمك"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">الرسالة</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FF9800] resize-none"
              placeholder="اكتب رسالتك هنا..."
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm">
              تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF9800] text-white font-bold py-3 rounded-xl hover:bg-orange-500 transition disabled:opacity-50"
          >
            {loading ? "جاري الإرسال..." : "إرسال"}
          </button>
        </form>
      </div>
    </div>
  );
}