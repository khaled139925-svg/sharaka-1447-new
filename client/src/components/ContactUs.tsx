import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Globe } from 'lucide-react';

interface ContactUsProps {
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
    telegram?: string;
  };
  businessHours?: string;
  mapLocation?: string;
  welcomeMessage?: string;
}

export default function ContactUs({
  contactInfo = {},
  socialLinks = {},
  businessHours,
  mapLocation,
  welcomeMessage
}: ContactUsProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 md:p-8 border border-blue-200">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <MessageCircle className="text-blue-600" size={32} />
          اتصل بنا
        </h2>
        {welcomeMessage && (
          <p className="text-gray-600 text-lg">{welcomeMessage}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">معلومات التواصل</h3>
          
          {contactInfo.phone && (
            <div className="flex items-start gap-3">
              <Phone className="text-blue-600 mt-1 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm text-gray-600">الهاتف</p>
                <a href={`tel:${contactInfo.phone}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                  {contactInfo.phone}
                </a>
              </div>
            </div>
          )}

          {contactInfo.email && (
            <div className="flex items-start gap-3">
              <Mail className="text-blue-600 mt-1 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                <a href={`mailto:${contactInfo.email}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                  {contactInfo.email}
                </a>
              </div>
            </div>
          )}

          {contactInfo.address && (
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm text-gray-600">العنوان</p>
                <p className="text-gray-800 font-semibold">{contactInfo.address}</p>
              </div>
            </div>
          )}

          {businessHours && (
            <div className="flex items-start gap-3">
              <Clock className="text-blue-600 mt-1 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm text-gray-600">ساعات العمل</p>
                <p className="text-gray-800 font-semibold">{businessHours}</p>
              </div>
            </div>
          )}
        </div>

        {/* Social Links & Map */}
        <div className="space-y-6">
          {/* Social Links */}
          {Object.keys(socialLinks).some(key => socialLinks[key as keyof typeof socialLinks]) && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">تابعنا على وسائل التواصل</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.whatsapp && (
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                  >
                    <Globe size={20} />
                    WhatsApp
                  </a>
                )}
                {socialLinks.telegram && (
                  <a
                    href={socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                  >
                    <Globe size={20} />
                    Telegram
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                  >
                    <Globe size={20} />
                    Facebook
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                  >
                    <Globe size={20} />
                    Instagram
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
                  >
                    <Globe size={20} />
                    Twitter
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Map Location */}
          {mapLocation && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">موقعنا على الخريطة</h3>
              {mapLocation.startsWith('http') ? (
                <a
                  href={mapLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  <MapPin size={20} />
                  عرض على الخريطة
                </a>
              ) : (
                <p className="text-gray-700 bg-white p-3 rounded border border-gray-300">
                  {mapLocation}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
