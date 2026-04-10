import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/globe-icon.png";

export default function Home() {
  const navigate = useNavigate();
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  // أنماط الأزرار
  const orangeButtonStyle = {
    background: "#FF9800",
    color: "#fff",
    border: "2px solid #e68900",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s",
    fontWeight: "bold",
  };
  const blueButtonStyle = {
    ...orangeButtonStyle,
    background: "#1976D2",
    border: "2px solid #0d5ba0",
  };
  const smallOrangeButton = {
    ...orangeButtonStyle,
    padding: "6px 16px",
    fontSize: "14px",
  };
  const smallBlueButton = {
    ...blueButtonStyle,
    padding: "6px 16px",
    fontSize: "14px",
  };

  // حركة الشعار
  const logoAnimation = {
    animation: "logoOrbit 5s ease-in-out infinite",
    width: "250px",
    height: "auto",
    display: "block",
    margin: "0 auto 20px",
    mixBlendMode: "multiply",
  };

  // الشعار الصغير
  const smallLogoContainer = {
    width: "50px",
    height: "50px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
  };
  const smallLogoStyle = {
    width: "35px",
    height: "auto",
  };

  // keyframes للحركة
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes logoOrbit {
        0% { transform: rotate(0deg) translateY(0px) scale(1); }
        25% { transform: rotate(2deg) translateY(-8px) scale(1.03); }
        50% { transform: rotate(0deg) translateY(-14px) scale(1.06); }
        75% { transform: rotate(-2deg) translateY(-8px) scale(1.03); }
        100% { transform: rotate(0deg) translateY(0px) scale(1); }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // إزالة هوامش الجذر
  useEffect(() => {
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  // محتوى "من نحن" (ضع النص الكامل هنا)
  const aboutFullText = `عن منصة شراكة
شراكة — منصة تجمع الخبرة والخدمة والمنتج في مكان واحد
شراكة منصة رقمية عالمية تجمع بين الخبرات والاستشارات والخدمات والمنتجات والفرص في بيئة واحدة تساعد الأفراد والمؤسسات على الوصول إلى المعرفة والتواصل والتعاون وبناء العلاقات المهنية.
تتيح المنصة لكل شخص أن يستفيد مما يقدمه الآخرون من خبرات وخدمات، كما تتيح له في الوقت نفسه عرض ما يمتلكه من مهارات أو خدمات أو منتجات أو أفكار ليصل بها إلى جمهور واسع من المهتمين.
وبذلك تصبح شراكة مساحة تجمع بين التعلم والعمل والتبادل المهني في إطار منظم واحترافي.
لماذا تعتبر شراكة منصة مختلفة؟
تختلف منصة شراكة عن كثير من المنصات الرقمية لأنها لا تقتصر على تقديم نوع واحد من الخدمات، بل تجمع بين مجالات متعددة في منصة واحدة.
ففي شراكة يمكن للمستخدم أن:
يحصل على استشارة متخصصة
يجد خدمة يحتاجها
يتعلم مهارة جديدة
يتواصل مع خبراء أو مؤسسات
يعرض خدماته أو خبراته
يسوق منتجاته أو مشاريعه
وهذا يجعل المنصة مساحة تجمع بين المعرفة والخدمة والتسويق والتعاون المهني في بيئة رقمية واحدة.
من نحن
شراكة منصة تهدف إلى ربط الناس بالخبرات والمعرفة والخدمات والفرص التي تساعدهم على تطوير حياتهم وأعمالهم.
المنصة توفر مساحة مفتوحة يلتقي فيها من يبحث عن المعرفة أو الخدمة أو المنتج مع من يمتلك الخبرة أو القدرة على تقديمها.
كما تتيح المنصة للأفراد والمؤسسات عرض خبراتهم وخدماتهم ومنتجاتهم، والتواصل مع جمهور واسع يبحث عنها.
الرؤية
أن تكون شراكة منصة عالمية رائدة تجمع الخبرات والخدمات والمنتجات والمعرفة في مكان واحد، وتوفر بيئة رقمية متكاملة تسهم في تطوير الأفراد والمجتمعات.
الرسالة
تمكين الأفراد والمؤسسات من الوصول إلى المعرفة والخبرة والخدمات التي يحتاجونها، وفي الوقت نفسه تمكينهم من عرض ما لديهم من مهارات وخبرات ومنتجات وفرص.
أهداف المنصة
تسعى منصة شراكة إلى تحقيق مجموعة من الأهداف، من أهمها:
تسهيل الوصول إلى الخبرات والاستشارات المتخصصة
تمكين الأفراد من عرض خدماتهم وخبراتهم
دعم التعلم المستمر وتبادل المعرفة
خلق فرص تعاون بين الأفراد والمؤسسات
دعم المشاريع والأفكار والمبادرات
توفير بيئة تساعد على عرض المنتجات والخدمات والتعريف بها
قيم المنصة
تعتمد منصة شراكة في عملها على مجموعة من القيم الأساسية، من أهمها:
الشفافية – الجودة – الثقة – الابتكار
منصة تفتح أبوابها للجميع
تم تصميم شراكة لتكون منصة مفتوحة لكل إنسان، مهما كان عمره أو مجاله أو اهتماماته.
المنصة تخدم مختلف فئات المجتمع، مثل:
الرجال والنساء الباحثين عن تطوير مهني أو خدمات متخصصة
الشباب الذين يسعون لاكتساب الخبرة أو بدء مشاريعهم
الطلاب الذين يحتاجون إلى الإرشاد الأكاديمي أو المهني
الأطفال وأولياء الأمور الباحثين عن التعليم والتطوير
رواد الأعمال وأصحاب المشاريع
الموظفين الذين يرغبون في تطوير مهاراتهم المهنية
المستثمرين الباحثين عن المعرفة والفرص
المدربين والمعلمين
الرياضيين ومن يهتم بالصحة واللياقة
المبدعين وأصحاب الهوايات
المهنيين والمتخصصين
كل شخص يمتلك معرفة أو مهارة أو تجربة يمكن أن تفيد الآخرين
بكلمات بسيطة:
شراكة منصة لكل إنسان يبحث عن معرفة أو فرصة أو خدمة، ولكل إنسان يمتلك شيئًا يمكن أن يقدمه للآخرين.
منصة تلبي احتياجات الحياة
في عالم اليوم أصبحت المعرفة والخبرة والخدمة والمنتج جزءًا أساسيًا من حياة الناس اليومية.
ولهذا جاءت شراكة لتكون منصة تجمع كل ذلك في مكان واحد.
من خلال شراكة يمكن للإنسان أن:
يجد الخبرة التي يحتاجها
يصل إلى الخدمة المناسبة
يتعلم مهارة جديدة
يحصل على استشارة متخصصة
يطور مشروعه أو عمله
يعرض خبرته أو خدماته أو منتجاته
كما تتيح المنصة لكل شخص تحويل ما يمتلكه من معرفة أو مهارة أو تجربة إلى قيمة حقيقية يستفيد منها الآخرون.
منصة تجمع الخبرة والخدمة والمنتج
لا تقتصر منصة شراكة على الاستشارات فقط، بل تمتد لتشمل مجالات متعددة يمكن من خلالها تبادل القيمة بين المستخدمين.
فمن خلال المنصة يمكن عرض أو الحصول على:
الاستشارات المهنية والمتخصصة
الخدمات المهنية أو العملية
الدورات التدريبية والبرامج التعليمية
الخبرات والتجارب العملية
المنتجات الرقمية أو المعرفية
المنتجات التجارية المختلفة
عرض المتاجر والخدمات التجارية
الترويج للمشاريع والمبادرات
فرص التعاون والعمل بين الأفراد والمؤسسات
وبذلك تصبح شراكة منصة تجمع بين المعرفة والخدمة والمنتج والتسويق والفرص في بيئة واحدة.
كيف تعمل المنصة
تعمل منصة شراكة بطريقة بسيطة وسهلة الاستخدام:
يقوم المستخدم بإنشاء حساب في المنصة.
يمكنه تصفح الخبراء أو الخدمات أو المنتجات المتاحة.
اختيار الاستشارة أو الخدمة المناسبة.
تنظيم اجتماع أو جلسة استشارة.
كما يمكن لأي مستخدم عرض خدماته أو خبراته أو منتجاته والوصول إلى المهتمين بها عبر المنصة.
الأسئلة الشائعة
هل يمكن لأي شخص التسجيل في المنصة؟
نعم، يمكن لأي شخص إنشاء حساب والاستفادة من خدمات المنصة.
هل يمكنني عرض خدماتي أو خبراتي عبر المنصة؟
نعم، تتيح المنصة للأفراد والمؤسسات عرض خدماتهم وخبراتهم.
هل يمكن عرض المنتجات أو المتاجر في المنصة؟
نعم، يمكن عرض المنتجات التجارية أو الخدمات أو المتاجر والتعريف بها عبر المنصة.
كيف يمكنني التواصل مع المستشارين أو مقدمي الخدمات؟
يمكن التواصل وتنظيم الاجتماعات أو جلسات الاستشارة عبر المنصة بسهولة.
سياسة الخصوصية
تحرص منصة شراكة على حماية بيانات المستخدمين واحترام خصوصيتهم، ولا يتم استخدام المعلومات الشخصية إلا بما يخدم تشغيل المنصة وتحسين خدماتها وفق الأنظمة والقوانين.
الشروط والأحكام
باستخدام منصة شراكة يوافق المستخدم على الالتزام بالشروط والقواعد التالية:
1. الاستخدام المشروع للمنصة
يجب استخدام المنصة للأغراض المشروعة فقط، وعدم استخدامها في أي نشاط مخالف للقوانين أو الأنظمة.
2. صحة المعلومات
يلتزم المستخدم بتقديم معلومات صحيحة عند إنشاء الحساب أو عرض الخدمات أو الخبرات أو المنتجات.
3. احترام المستخدمين الآخرين
يجب على جميع المستخدمين التعامل باحترام ومهنية، وعدم الإساءة أو التشهير أو نشر محتوى غير لائق.
4. جودة الخدمات والاستشارات
يتحمل مقدم الخدمة أو الاستشارة المسؤولية عن جودة ما يقدمه من معلومات أو خدمات أو منتجات.
5. منع الأنشطة غير المشروعة
يمنع استخدام المنصة في:
الاحتيال أو التضليل
نشر معلومات مضللة
الترويج لأنشطة غير قانونية
انتهاك حقوق الملكية الفكرية
6. حماية الخصوصية
يجب على المستخدمين احترام خصوصية الآخرين وعدم استخدام بياناتهم الشخصية دون إذن.
7. مسؤولية المحتوى
كل مستخدم مسؤول عن المحتوى الذي ينشره أو يقدمه عبر المنصة سواء كان استشارة أو خدمة أو منتجًا أو مادة تعليمية.
8. حق المنصة في تنظيم المحتوى
تحتفظ منصة شراكة بالحق في إزالة أو تعديل أي محتوى يخالف سياسات المنصة أو يضر بالمستخدمين.
9. تحديث الشروط
يجوز للمنصة تحديث الشروط والأحكام عند الحاجة، ويعد استمرار استخدام المنصة موافقة على هذه التحديثات.
إخلاء المسؤولية
الاستشارات والخدمات المقدمة عبر المنصة تمثل آراء وخبرات مقدميها، ولا تتحمل المنصة المسؤولية عن القرارات التي يتخذها المستخدم بناءً على تلك الاستشارات.
`;

  const paragraphs = aboutFullText.split("\n").filter(p => p.trim() !== "");
  const titles = [
    "عن منصة شراكة",
    "لماذا تعتبر شراكة منصة مختلفة؟",
    "من نحن",
    "الرؤية",
    "الرسالة",
    "أهداف المنصة",
    "قيم المنصة",
    "منصة تفتح أبوابها للجميع",
    "منصة تلبي احتياجات الحياة",
    "منصة تجمع الخبرة والخدمة والمنتج",
    "كيف تعمل المنصة",
    "الأسئلة الشائعة",
    "سياسة الخصوصية",
    "الشروط والأحكام",
    "إخلاء المسؤولية",
    "تواصل معنا"
  ];

  // وظيفة للتوجيه مع التحقق من وجود الصفحة (للتجربة)
  const handleNavigate = (path: string) => {
    // إذا كان المسار هو /consultant-signup ونريد التأكد من وجود الصفحة
    if (path === "/consultant-signup") {
      console.log("التوجيه إلى صفحة التسجيل");
      navigate(path);
    } else {
      navigate(path);
    }
  };

  return (
    <div style={{ direction: "rtl", fontFamily: "Arabic Typesetting", margin: 0, padding: 0 }}>
      {/* Header */}
      <div style={{
        background: "#fff",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 0,
      }}>
        <div style={smallLogoContainer} onClick={() => handleNavigate("/")}>
          <img src={logo} alt="Sharaka" style={smallLogoStyle} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={smallOrangeButton} onClick={() => handleNavigate("/consultant-signup")}>تسجيل</button>
          <button style={smallBlueButton} onClick={() => handleNavigate("/login")}>دخول</button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "30px 20px",
      }}>
        <img src={logo} alt="Sharaka" style={logoAnimation} />
        <h1 style={{ fontSize: "48px", marginBottom: "15px", color: "#FF9800" }}>اعرض ما لديك… واحصل على ما تريد</h1>
        <p style={{ fontSize: "28px", maxWidth: "700px", lineHeight: "1.5", marginBottom: "12px", color: "#1976D2" }}>شريك نجاحك</p>
        <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
          <button style={orangeButtonStyle} onClick={() => handleNavigate("/consultant-signup")}>انضم إلينا</button>
          <button style={blueButtonStyle} onClick={() => handleNavigate("/browse")}>تصفح الخدمات</button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#1976D2", color: "#fff", textAlign: "center", padding: "70px 20px" }}>
        <h1 style={{ fontSize: "42px", marginBottom: "15px" }}>شراكة… منصة تجمع الخبرة والخدمة والفرص</h1>
        <p style={{ fontSize: "22px", maxWidth: "700px", margin: "0 auto 30px", lineHeight: "1.8" }}>
          في شراكة يستطيع الأفراد والمؤسسات عرض ما لديهم من معرفة أو خدمة أو منتج، كما يمكنهم الوصول إلى ما يحتاجون إليه من خبرة أو خدمة أو فرصة في مكان واحد.
        </p>
        <button style={orangeButtonStyle} onClick={() => setAboutModalOpen(true)}>من نحن</button>
      </div>

      {/* Modal من نحن */}
      {aboutModalOpen && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 1000,
          }}
          onClick={() => setAboutModalOpen(false)}
        >
          <div
            style={{
              background: "#fff", width: "90%", maxWidth: "800px", maxHeight: "90%",
              borderRadius: "12px", overflow: "auto", padding: "20px", position: "relative",
              direction: "rtl",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAboutModalOpen(false)}
              style={{ position: "absolute", top: "10px", left: "10px", background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
            >
              ✕
            </button>
            <h2 style={{ textAlign: "center", color: "#FF9800", marginBottom: "20px" }}>من نحن</h2>
            <div style={{ lineHeight: "1.8" }}>
              {paragraphs.map((p, idx) => {
                const isTitle = titles.includes(p.trim());
                return (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "16px",
                      fontWeight: isTitle ? "bold" : "normal",
                      fontSize: isTitle ? "1.5rem" : "1rem",
                      color: isTitle ? "#1976D2" : "#333",
                      textAlign: "justify",
                    }}
                  >
                    {p}
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button style={orangeButtonStyle} onClick={() => setContactModalOpen(true)}>تواصل معنا</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal تواصل */}
      {contactModalOpen && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 1100,
          }}
          onClick={() => setContactModalOpen(false)}
        >
          <div
            style={{
              background: "#fff", width: "90%", maxWidth: "500px", borderRadius: "12px",
              padding: "20px", position: "relative", direction: "rtl",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setContactModalOpen(false)}
              style={{ position: "absolute", top: "10px", left: "10px", background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
            >
              ✕
            </button>
            <h2 style={{ textAlign: "center", color: "#FF9800", marginBottom: "20px" }}>تواصل معنا</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input
                type="text"
                placeholder="الاسم"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
              />
              <textarea
                placeholder="الرسالة"
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
              />
              <button
                style={orangeButtonStyle}
                onClick={() => {
                  alert("تم إرسال رسالتك (سيتم تفعيل الإرسال لاحقاً)");
                  setContactModalOpen(false);
                }}
              >
                إرسال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}