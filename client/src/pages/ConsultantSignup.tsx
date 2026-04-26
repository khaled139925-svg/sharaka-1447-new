import React from 'react';
import { useState } from "react";
<<<<<<< HEAD
import { supabase } from "../lib/supabase";
import { Upload, X } from 'lucide-react';
import { Button } from "../components/ui/button";
=======
>>>>>>> temp-preview

export default function ConsultantSignup() {
  const [accountType, setAccountType] = useState<"individual" | "company">(
    "individual"
  );

  const [ads, setAds] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const SERVICES = [
    "متجر",
    "جلسات فردية",
    "جلسات استشارية",
    "دورات تدريبية",
    "ورش عمل",
  ];

  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <div className="page">

      {/* زر الرئيسية (بدون أيقونات خارجية = حل مشكلة الشرارة) */}
      <div className="topbar">
        <div className="homeBtn" onClick={() => (window.location.href = "/")}>
          🏠 <span>الرئيسية</span>
        </div>
      </div>

      <div className="card">

        {/* العنوان */}
        <h1 className="title">
          إنشاء حساب جديد في منصة شراكة
        </h1>

        {/* نوع الحساب */}
        <div className="accountTypeRow">
          <button
            className={`typeBtn ${
              accountType === "individual" ? "activeOrange" : ""
            }`}
            onClick={() => setAccountType("individual")}
          >
            فرد
          </button>

          <button
            className={`typeBtn ${
              accountType === "company" ? "activeBlue" : ""
            }`}
            onClick={() => setAccountType("company")}
          >
            منشأة
          </button>
        </div>

        {/* المعلومات الأساسية */}
        <h3>المعلومات الأساسية</h3>

        <input
          className="input"
          placeholder={
            accountType === "individual" ? "الاسم الكامل" : "اسم المنشأة"
          }
        />
        <input className="input" placeholder="البريد الإلكتروني" />
        <input className="input" placeholder="رقم الهاتف" />
        <input className="input" placeholder="كلمة المرور" />
        <input className="input" placeholder="تأكيد كلمة المرور" />
        <input className="input" placeholder="الدولة" />
        <input className="input" placeholder="المدينة" />

        {/* صورة */}
        <label className="label">صورة شخصية / شعار</label>
        <input type="file" accept="image/*" className="inputFile" />

        {/* الخدمات */}
        <h3>الخدمات</h3>
        <div className="servicesRow">
          {SERVICES.map((s) => (
            <button
              key={s}
              className={`serviceBtn ${
                activeService === s ? "activeService" : ""
              }`}
              onClick={() => setActiveService(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* تفاصيل */}
        {activeService && activeService !== "متجر" && (
          <div className="box">
            <input
              className="input"
              placeholder="سعر الجلسة لكل ساعة"
            />
          </div>
        )}

        {/* المتجر */}
        {activeService === "متجر" && (
          <div className="box">
            {products.map((_, i) => (
              <div key={i} className="innerCard">

                <input className="input" placeholder="اسم المنتج" />
                <textarea className="input" placeholder="وصف المنتج" />

                <label>تحميل صورة</label>
                <input type="file" accept="image/*" multiple className="inputFile" />

                <label>تحميل فيديو</label>
                <input type="file" accept="video/*" multiple className="inputFile" />

                <input className="input" placeholder="السعر" />
                <input className="input" placeholder="طريقة التوصيل" />
                <input className="input" placeholder="المناطق التي يشملها التوصيل" />

                <button
                  className="deleteBtn"
                  onClick={() =>
                    setProducts(products.filter((_, x) => x !== i))
                  }
                >
                  حذف المنتج
                </button>
              </div>
            ))}

            <button
              className="addBlue"
              onClick={() => setProducts([...products, {}])}
            >
              + إضافة منتج
            </button>
          </div>
        )}

        {/* نبذة */}
        <h3>نبذة</h3>
        <textarea className="input big" placeholder="اكتب نبذة..." />

        {/* الاتصال */}
        <h3>طرق الاتصال</h3>
        <input className="input" placeholder="واتساب" />
        <input className="input" placeholder="مكالمة هاتفية" />
        <input className="input" placeholder="بريد إلكتروني" />
        <input className="input" placeholder="وسيلة تواصل أخرى" />

        {/* الروابط */}
        <h3>الموقع الإلكتروني والروابط</h3>
        <input className="input" placeholder="الموقع الإلكتروني" />
        <input className="input" placeholder="LinkedIn" />
        <input className="input" placeholder="Instagram" />
        <input className="input" placeholder="YouTube" />
        <input className="input" placeholder="TikTok" />
        <input className="input" placeholder="Telegram" />
        <input className="input" placeholder="Snapchat" />

        {/* الإعلانات */}
        <h3>الإعلانات</h3>

        {ads.map((_, i) => (
          <div key={i} className="innerCard">

            <input className="input" placeholder="عنوان الإعلان" />
            <textarea className="input" placeholder="وصف الإعلان" />

            <label>تحميل صورة</label>
            <input type="file" accept="image/*" className="inputFile" />

            <label>تحميل فيديو</label>
            <input type="file" accept="video/*" className="inputFile" />

            <input className="input" placeholder="السعر (اختياري)" />
            <input className="input" placeholder="رقم التواصل" />

            <button
              className="deleteBtn"
              onClick={() => setAds(ads.filter((_, x) => x !== i))}
            >
              حذف الإعلان
            </button>
          </div>
        ))}

        <button className="addBlue" onClick={() => setAds([...ads, {}])}>
          + إضافة إعلان
        </button>

        {/* الدفع */}
        <h3>طرق الدفع</h3>

        {payments.map((_, i) => (
          <div key={i} className="paymentRow">
            <input className="input" placeholder="طريقة الدفع" />
            <input className="input" placeholder="التفاصيل" />
            <button
              className="deleteBtn"
              onClick={() =>
                setPayments(payments.filter((_, x) => x !== i))
              }
            >
              ✕
            </button>
          </div>
        ))}

        <button
          className="addGreen"
          onClick={() => setPayments([...payments, {}])}
        >
          + إضافة طريقة دفع
        </button>

        {/* الشروط */}
        <div className="agree">
          <input type="checkbox" />
          <span>أوافق على الشروط والأحكام</span>
        </div>

        <button className="submit">إنشاء الحساب</button>
      </div>

      {/* CSS */}
      <style>{`
        .page {
          direction: rtl;
          background: #f5f5f5;
          min-height: 100vh;
          padding: 30px;
          font-family: Arabic Typesetting;
        }

        .topbar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }

        .homeBtn {
          color: #1976d2;
          font-size: 18px;
          cursor: pointer;
        }

        .card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          max-width: 900px;
          margin: auto;
        }

        .title {
          text-align: center;
          color: orange;
          font-size: 36px;
          margin-bottom: 20px;
        }

        h3 {
          color: #1976d2;
        }

        .input {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          border-radius: 10px;
          border: 1px solid #222;
        }

        .inputFile {
          margin: 10px 0;
        }

        .big {
          height: 180px;
        }

        .accountTypeRow {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .typeBtn {
          flex: 1;
          margin: 0 5px;
          padding: 15px;
          border-radius: 12px;
          font-size: 18px;
        }

        .activeOrange {
          background: #fff3e0;
          border: 2px solid orange;
          color: orange;
        }

        .activeBlue {
          background: #e3f2fd;
          border: 2px solid #1976d2;
          color: #1976d2;
        }

        .servicesRow {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .serviceBtn {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #aaa;
        }

        .activeService {
          background: #e3f2fd;
          border: 2px solid #1976d2;
        }

        .box {
          background: #fafafa;
          padding: 15px;
          border-radius: 10px;
          margin-top: 10px;
        }

        .innerCard {
          background: #fff;
          padding: 15px;
          border-radius: 10px;
          margin: 10px 0;
          border: 1px solid #ddd;
        }

        .addBlue {
          background: #1976d2;
          color: white;
          padding: 10px;
          border-radius: 10px;
        }

        .addGreen {
          background: #2e7d32;
          color: white;
          padding: 10px;
          border-radius: 10px;
        }

        .deleteBtn {
          background: #e91e63;
          color: white;
          padding: 8px;
          border-radius: 8px;
        }

        .paymentRow {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .submit {
          width: 100%;
          background: orange;
          color: white;
          padding: 15px;
          border-radius: 10px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
