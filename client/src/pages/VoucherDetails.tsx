import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import html2canvas from "html2canvas";

const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("00")) cleaned = cleaned.substring(2);
  if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);
  if (cleaned.length <= 9) cleaned = "92" + cleaned;
  return cleaned;
};

export default function VoucherDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locale, setLocale] = useState<"ar" | "en">(() => {
    const saved = localStorage.getItem("appLocale");
    return saved === "en" ? "en" : "ar";
  });
  const [currentUser, setCurrentUser] = useState<any>(null);

  // --- حالات الطلبات والعداد ---
  const [requestsCount, setRequestsCount] = useState(0);
  const [userRequested, setUserRequested] = useState(false);
  const [showRequesters, setShowRequesters] = useState(false);
  const [requestersList, setRequestersList] = useState<any[]>([]);

  // نافذة التعديل
  const [showEditModal, setShowEditModal] = useState(false);
  const [editReceiverName, setEditReceiverName] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("");
  const [editItems, setEditItems] = useState<any[]>([]);
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [editUpdating, setEditUpdating] = useState(false);

  const t = {
    ar: {
      back: "رجوع",
      loading: "جاري التحميل...",
      notFound: "القسيمة غير موجودة أو غير متاحة للعامة",
      from: "من",
      to: "إلى",
      date: "التاريخ",
      items: "البنود",
      description: "البيان",
      price: "السعر",
      total: "المجموع",
      paymentMethod: "طريقة الدفع",
      stamp: "الختم",
      signature: "التوقيع",
      edit: "✏️ تعديل",
      delete: "🗑️ حذف",
      resend: "📤 إعادة إرسال",
      confirmDelete: "هل أنت متأكد من حذف هذه القسيمة؟ لا يمكن التراجع.",
      editTitle: "تعديل القسيمة",
      addItem: "+ إضافة بيان",
      save: "حفظ التعديلات",
      cancel: "إلغاء",
      makePublic: "نشر للجمهور",
      updateSuccess: "تم تحديث القسيمة بنجاح",
      deleteSuccess: "تم حذف القسيمة",
      resendSuccess: "تم إرسال رابط القسيمة عبر واتساب",
      noPhone: "لا يوجد رقم هاتف للمستلم لإرسال الواتساب",
      request: "📩 طلب القسيمة",
      alreadyRequested: "لقد طلبت هذه القسيمة مسبقاً",
      requestSuccess: "تم إرسال طلبك إلى صاحب القسيمة بنجاح",
      loginRequired: "يجب تسجيل الدخول لتقديم طلب",
      requests: "الطلبات",
      showRequests: "عرض الطلبات",
      requesterName: "الاسم",
      requesterPhone: "الهاتف",
      requestDate: "تاريخ الطلب",
      noRequests: "لا توجد طلبات بعد",
      close: "إغلاق",
    },
    en: {
      back: "Back",
      loading: "Loading...",
      notFound: "Voucher not found or not public",
      from: "From",
      to: "To",
      date: "Date",
      items: "Items",
      description: "Description",
      price: "Price",
      total: "Total",
      paymentMethod: "Payment method",
      stamp: "Stamp",
      signature: "Signature",
      edit: "✏️ Edit",
      delete: "🗑️ Delete",
      resend: "📤 Resend",
      confirmDelete: "Are you sure you want to delete this voucher? This cannot be undone.",
      editTitle: "Edit Voucher",
      addItem: "+ Add item",
      save: "Save changes",
      cancel: "Cancel",
      makePublic: "Make public",
      updateSuccess: "Voucher updated successfully",
      deleteSuccess: "Voucher deleted",
      resendSuccess: "Voucher link resent via WhatsApp",
      noPhone: "No receiver phone number to send WhatsApp",
      request: "📩 Request Voucher",
      alreadyRequested: "You have already requested this voucher",
      requestSuccess: "Your request has been sent to the owner",
      loginRequired: "Please login to request",
      requests: "Requests",
      showRequests: "Show requests",
      requesterName: "Name",
      requesterPhone: "Phone",
      requestDate: "Date",
      noRequests: "No requests yet",
      close: "Close",
    },
  };
  const texts = locale === "ar" ? t.ar : t.en;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(user);
    if (id) loadVoucher(id);
  }, [id]);

  async function loadVoucher(voucherId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", voucherId)
      .eq("is_public", true)
      .maybeSingle();
    if (error || !data) {
      setError(texts.notFound);
    } else {
      setVoucher(data);
      await loadRequestsData(data.id);
    }
    setLoading(false);
  }

  async function loadRequestsData(voucherId: string) {
    const { count, error } = await supabase
      .from("voucher_requests")
      .select("*", { count: "exact", head: true })
      .eq("voucher_id", voucherId);
    if (!error) setRequestsCount(count || 0);

    if (currentUser) {
      const { data, error } = await supabase
        .from("voucher_requests")
        .select("id")
        .eq("voucher_id", voucherId)
        .eq("requester_id", String(currentUser.id)) // التعديل: تحويل إلى نص
        .maybeSingle();
      if (!error && data) setUserRequested(true);
      else setUserRequested(false);
    }
  }

  async function handleRequest() {
    if (!currentUser) {
      alert(texts.loginRequired);
      return;
    }
    if (userRequested) {
      alert(texts.alreadyRequested);
      return;
    }
    const { error } = await supabase.from("voucher_requests").insert({
      voucher_id: voucher.id,
      requester_id: String(currentUser.id), // التعديل: تحويل إلى نص
      requester_name: currentUser.full_name,
      requester_phone: currentUser.phone || "",
      status: "pending",
    });
    if (error) alert("❌ " + error.message);
    else {
      alert(texts.requestSuccess);
      setUserRequested(true);
      setRequestsCount(prev => prev + 1);
    }
  }

  async function showRequestersModal() {
    const { data, error } = await supabase
      .from("voucher_requests")
      .select("*")
      .eq("voucher_id", voucher.id)
      .order("created_at", { ascending: false });
    if (!error) {
      setRequestersList(data || []);
      setShowRequesters(true);
    }
  }

  // حذف القسيمة
  async function handleDelete() {
    if (!confirm(texts.confirmDelete)) return;
    if (voucher.pdf_url) {
      const fileName = voucher.pdf_url.split("/").pop();
      if (fileName) await supabase.storage.from("invoices").remove([fileName]);
    }
    const { error } = await supabase.from("invoices").delete().eq("id", voucher.id);
    if (error) alert("❌ " + error.message);
    else {
      alert(texts.deleteSuccess);
      navigate("/vouchers");
    }
  }

  // إعادة إرسال الرابط
  async function handleResend() {
    const cleanedPhone = formatPhoneNumber(voucher.receiver_phone);
    if (!cleanedPhone || cleanedPhone.length < 10) {
      alert(texts.noPhone);
      return;
    }
    const message = `${voucher.type === "invoice" ? "فاتورة" : voucher.type === "quote" ? "عرض سعر" : voucher.type === "purchase_voucher" ? "قسيمة شراء" : "قسيمة هدية"}\nرقم: ${voucher.id}\n\n${voucher.items.map((i: any) => `• ${i.description} - ${i.price}`).join("\n")}\n\nالمجموع: ${voucher.total}\n\nرابط القسيمة:\n${voucher.pdf_url}`;
    const encoded = encodeURIComponent(message);
    const waLink1 = `https://wa.me/${cleanedPhone}?text=${encoded}`;
    const waLink2 = `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${encoded}`;
    const win = window.open(waLink1, "_blank");
    setTimeout(() => { if (!win || win.closed) window.open(waLink2, "_blank"); }, 800);
    alert(texts.resendSuccess);
  }

  // فتح نافذة التعديل
  function openEdit() {
    setEditReceiverName(voucher.receiver_name);
    setEditPaymentMethod(voucher.payment_method || "");
    setEditItems(voucher.items.map((item: any) => ({ description: item.description, price: item.price })));
    setEditIsPublic(voucher.is_public);
    setShowEditModal(true);
  }

  function addEditItem() {
    setEditItems([...editItems, { description: "", price: "" }]);
  }

  function updateEditItem(idx: number, field: string, value: string) {
    const newItems = [...editItems];
    newItems[idx][field] = value;
    setEditItems(newItems);
  }

  function removeEditItem(idx: number) {
    const newItems = editItems.filter((_, i) => i !== idx);
    setEditItems(newItems);
  }

  // حفظ التعديلات
  async function saveEdit() {
    if (!voucher) return;
    setEditUpdating(true);
    const total = editItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.top = "-9999px";
    tempDiv.style.left = "-9999px";
    tempDiv.style.width = "800px";
    tempDiv.style.padding = "30px";
    tempDiv.style.backgroundColor = "#fff";
    tempDiv.style.fontFamily = "Arial";
    tempDiv.style.direction = "rtl";
    tempDiv.style.color = "#000";
    tempDiv.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2>${voucher.type === "invoice" ? "فاتورة" : voucher.type === "quote" ? "عرض سعر" : voucher.type === "purchase_voucher" ? "قسيمة شراء" : "قسيمة هدية"}</h2>
          <p>رقم: ${voucher.id}</p>
          <p>التاريخ: ${new Date().toLocaleDateString()}</p>
        </div>
        <img src="${voucher.sender_logo || ""}" style="width:80px" crossorigin="anonymous" />
      </div>
      <hr/>
      <div style="display:flex; justify-content:space-between; margin-top:20px">
        <div><h4>من:</h4><p>${voucher.sender_name}</p><p>${voucher.sender_phone}</p></div>
        <div><h4>إلى:</h4><p>${editReceiverName}</p><p>${voucher.receiver_phone}</p></div>
      </div>
      <table style="width:100%; margin-top:30px; border-collapse:collapse">
        <thead><tr style="background:#f3f4f6"><th style="border:1px solid #ddd; padding:10px">البيان</th><th style="border:1px solid #ddd; padding:10px">السعر</th></tr></thead>
        <tbody>${editItems.map(item => `<tr><td style="border:1px solid #ddd; padding:10px">${item.description}</td><td style="border:1px solid #ddd; padding:10px">${item.price}</td></tr>`).join("")}</tbody>
      </table>
      <div style="margin-top:20px; font-weight:bold">المجموع: ${total}</div>
      <div style="margin-top:20px"><p><strong>طريقة الدفع:</strong> ${editPaymentMethod}</p></div>
      <div style="display:flex; justify-content:space-between; margin-top:60px">
        <div><p>الختم</p><img src="${voucher.sender_logo || ""}" width="120"/></div>
        <div><p>التوقيع</p><img src="${voucher.sender_logo || ""}" width="120"/></div>
      </div>
    `;
    document.body.appendChild(tempDiv);
    const canvas = await html2canvas(tempDiv, { useCORS: true, scale: 2 });
    document.body.removeChild(tempDiv);
    canvas.toBlob(async (blob) => {
      if (!blob) { alert("❌ فشل إنشاء الصورة"); setEditUpdating(false); return; }
      const fileName = `invoice-${voucher.id}.png`;
      const { error: uploadError } = await supabase.storage.from("invoices").upload(fileName, blob, { contentType: "image/png", upsert: true });
      if (uploadError) { alert("❌ فشل رفع الصورة: " + uploadError.message); setEditUpdating(false); return; }
      const { data: urlData } = supabase.storage.from("invoices").getPublicUrl(fileName);
      const newPdfUrl = urlData.publicUrl;
      const { error: updateError } = await supabase.from("invoices").update({
        receiver_name: editReceiverName,
        payment_method: editPaymentMethod,
        items: editItems,
        total: total,
        pdf_url: newPdfUrl,
        is_public: editIsPublic,
      }).eq("id", voucher.id);
      if (updateError) alert("❌ " + updateError.message);
      else {
        alert(texts.updateSuccess);
        setShowEditModal(false);
        loadVoucher(voucher.id);
      }
      setEditUpdating(false);
    });
  }

  if (loading) return <div style={container}><p>{texts.loading}</p></div>;
  if (error) return <div style={container}><p>{error}<br/><button onClick={() => navigate("/")} style={btnBack}>{texts.back}</button></p></div>;
  if (!voucher) return null;

  // التعديل: تحويل المعرفين إلى نص للمقارنة
  const isOwner = currentUser && String(currentUser.id) === String(voucher.sender_id);

  return (
    <div style={container}>
      <div style={header}>
        <button onClick={() => navigate(-1)} style={btnBack}>← {texts.back}</button>
        <button onClick={() => {
          const newLocale = locale === "ar" ? "en" : "ar";
          setLocale(newLocale);
          localStorage.setItem("appLocale", newLocale);
        }} style={langBtn}>{locale === "ar" ? "English" : "العربية"}</button>
      </div>
      <div style={card}>
        {voucher.pdf_url ? (
          <img src={voucher.pdf_url} alt="Voucher" style={{ width: "100%", borderRadius: 12 }} />
        ) : (
          <div>
            <h2>{voucher.type === "purchase_voucher" ? "قسيمة شراء" : voucher.type === "gift_voucher" ? "قسيمة هدية" : voucher.type}</h2>
            <p><strong>{texts.from}:</strong> {voucher.sender_name}</p>
            <p><strong>{texts.to}:</strong> {voucher.receiver_name}</p>
            <p><strong>{texts.date}:</strong> {new Date(voucher.created_at).toLocaleDateString()}</p>
            <h4>{texts.items}</h4>
            <table style={tableStyle}>
              <thead><tr><th>{texts.description}</th><th>{texts.price}</th></tr></thead>
              <tbody>
                {voucher.items?.map((item: any, idx: number) => (
                  <tr key={idx}><td>{item.description}</td><td style={{ padding: 8, border: "1px solid #ddd" }}>{item.price}</td></tr>
                ))}
              </tbody>
            </table>
            <p><strong>{texts.total}:</strong> {voucher.total}</p>
            <p><strong>{texts.paymentMethod}:</strong> {voucher.payment_method || "—"}</p>
          </div>
        )}
        <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "#888" }}>
          🧾 تم إنشاؤها بواسطة {voucher.sender_name}
        </div>
        {isOwner && (
          <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center", borderTop: "1px solid #eee", paddingTop: 15, flexWrap: "wrap" }}>
            <button onClick={openEdit} style={btnEdit}>{texts.edit}</button>
            <button onClick={handleDelete} style={btnDelete}>{texts.delete}</button>
            <button onClick={handleResend} style={btnResend}>{texts.resend}</button>
            <button onClick={showRequestersModal} style={btnRequests}>
              📋 {texts.requests} ({requestsCount})
            </button>
          </div>
        )}
        {!isOwner && currentUser && (
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
            <button
              onClick={handleRequest}
              style={userRequested ? btnRequested : btnRequest}
              disabled={userRequested}
            >
              {userRequested ? texts.alreadyRequested : texts.request}
            </button>
          </div>
        )}
      </div>

      {/* نافذة عرض الطلبات */}
      {showRequesters && (
        <div style={modalOverlay} onClick={() => setShowRequesters(false)}>
          <div style={modalContentLarge} onClick={e => e.stopPropagation()}>
            <h3>{texts.requests}</h3>
            {requestersList.length === 0 && <p>{texts.noRequests}</p>}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr><th>{texts.requesterName}</th><th>{texts.requesterPhone}</th><th>{texts.requestDate}</th></tr>
              </thead>
              <tbody>
                {requestersList.map(req => (
                  <tr key={req.id}>
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>{req.requester_name}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>{req.requester_phone || "—"}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>{new Date(req.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setShowRequesters(false)} style={btnClose}>{texts.close}</button>
          </div>
        </div>
      )}

      {/* نافذة التعديل المنبثقة */}
      {showEditModal && (
        <div style={modalOverlay} onClick={() => setShowEditModal(false)}>
          <div style={{ ...modalContent, width: "90%", maxWidth: 500, maxHeight: "80%", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <h3>{texts.editTitle}</h3>
            <input type="text" placeholder={texts.to} value={editReceiverName} onChange={e => setEditReceiverName(e.target.value)} style={inputStyle} />
            <input type="text" placeholder={texts.paymentMethod} value={editPaymentMethod} onChange={e => setEditPaymentMethod(e.target.value)} style={inputStyle} />
            <label>{texts.items}</label>
            {editItems.map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                <input type="text" placeholder={texts.description} value={item.description} onChange={e => updateEditItem(idx, "description", e.target.value)} style={{ flex: 2, ...inputStyle }} />
                <input type="text" placeholder={texts.price} value={item.price} onChange={e => updateEditItem(idx, "price", e.target.value)} style={{ flex: 1, ...inputStyle }} />
                {editItems.length > 1 && <button onClick={() => removeEditItem(idx)} style={{ ...btnRedSmall, padding: "0 10px" }}>✖</button>}
              </div>
            ))}
            <button onClick={addEditItem} style={btnGreenSmall}>{texts.addItem}</button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
              <input type="checkbox" checked={editIsPublic} onChange={e => setEditIsPublic(e.target.checked)} id="editPublic" />
              <label htmlFor="editPublic">{texts.makePublic}</label>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 15 }}>
              <button style={btnGreen} onClick={saveEdit} disabled={editUpdating}>{editUpdating ? "جاري الحفظ..." : texts.save}</button>
              <button style={btnRed} onClick={() => setShowEditModal(false)}>{texts.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const container: React.CSSProperties = { padding: 20, maxWidth: 800, margin: "0 auto" };
const header: React.CSSProperties = { display: "flex", justifyContent: "space-between", marginBottom: 20 };
const card: React.CSSProperties = { background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
const btnBack: React.CSSProperties = { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer" };
const langBtn: React.CSSProperties = { background: "#f0f0f0", border: "none", borderRadius: 30, padding: "6px 12px", cursor: "pointer", fontWeight: "bold" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", marginTop: 10, border: "1px solid #ddd" };
const btnEdit: React.CSSProperties = { background: "#f59e0b", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer" };
const btnDelete: React.CSSProperties = { background: "#dc2626", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer" };
const btnResend: React.CSSProperties = { background: "#10b981", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer" };
const btnRequest: React.CSSProperties = { background: "#3b82f6", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer" };
const btnRequested: React.CSSProperties = { background: "#9ca3af", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "default" };
const btnRequests: React.CSSProperties = { background: "#6b7280", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box" };
const btnGreen: React.CSSProperties = { background: "#22c55e", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnRed: React.CSSProperties = { background: "#ef4444", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnGreenSmall: React.CSSProperties = { background: "#22c55e", color: "#fff", padding: "6px 12px", fontSize: "12px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnRedSmall: React.CSSProperties = { background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" };
const modalOverlay: React.CSSProperties = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalContent: React.CSSProperties = { background: "#fff", padding: 20, borderRadius: 12, textAlign: "center" };
const modalContentLarge: React.CSSProperties = { background: "#fff", padding: 20, borderRadius: 12, width: "90%", maxWidth: 500, maxHeight: "80%", overflowY: "auto" };
const btnClose: React.CSSProperties = { background: "#ef4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, marginTop: 15, cursor: "pointer" };