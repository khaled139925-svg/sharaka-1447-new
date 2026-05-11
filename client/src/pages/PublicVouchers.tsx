import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("00")) cleaned = cleaned.substring(2);
  if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);
  if (cleaned.length <= 9) cleaned = "92" + cleaned;
  return cleaned;
};

export default function PublicVouchers() {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [locale, setLocale] = useState<"ar" | "en">(() => {
    const saved = localStorage.getItem("appLocale");
    return saved === "en" ? "en" : "ar";
  });

  // متغيرات الطلبات والعداد
  const [requestsCount, setRequestsCount] = useState<Record<string, number>>({});
  const [userRequested, setUserRequested] = useState<Record<string, boolean>>({});
  const [showRequestersList, setShowRequestersList] = useState<Record<string, any[]>>({});
  const [modalOpen, setModalOpen] = useState<string | null>(null);

  // State لنافذة التعديل
  const [editingVoucher, setEditingVoucher] = useState<any>(null);
  const [editItems, setEditItems] = useState<any[]>([]);
  const [editPaymentMethod, setEditPaymentMethod] = useState("");
  const [editReceiverName, setEditReceiverName] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [editUpdating, setEditUpdating] = useState(false);

  const t = {
    ar: {
      title: "🎁 بنك الهدايا والقسائم الشرائية",
      sub: "استعرض أحدث القسائم والعروض المتاحة للجمهور",
      typePurchase: "قسيمة شراء",
      typeGift: "قسيمة هدية",
      typeInvoice: "فاتورة",
      typeQuote: "عرض سعر",
      from: "من:",
      total: "المجموع",
      date: "التاريخ",
      view: "عرض التفاصيل",
      back: "رجوع",
      noData: "لا توجد قسائم عامة حتى الآن",
      loadingMsg: "⏳ جاري التحميل...",
      edit: "✏️ تعديل",
      delete: "🗑️ حذف",
      resend: "📤 إعادة إرسال",
      confirmDelete: "هل أنت متأكد من حذف هذه القسيمة؟ لا يمكن التراجع.",
      editTitle: "تعديل القسيمة",
      receiverName: "اسم المستلم",
      paymentMethod: "طريقة الدفع",
      items: "البنود",
      description: "البيان",
      price: "السعر",
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
      requests: "طلبات",
      showRequests: "عرض الطلبات",
      requesterName: "الاسم",
      requesterPhone: "الهاتف",
      requestDate: "تاريخ الطلب",
      noRequests: "لا توجد طلبات بعد",
      close: "إغلاق",
    },
    en: {
      title: "🎁 Gift & Purchase Vouchers Bank",
      sub: "Browse the latest public vouchers and offers",
      typePurchase: "Purchase Voucher",
      typeGift: "Gift Voucher",
      typeInvoice: "Invoice",
      typeQuote: "Quote",
      from: "From:",
      total: "Total",
      date: "Date",
      view: "View Details",
      back: "Back",
      noData: "No public vouchers yet",
      loadingMsg: "⏳ Loading...",
      edit: "✏️ Edit",
      delete: "🗑️ Delete",
      resend: "📤 Resend",
      confirmDelete: "Are you sure you want to delete this voucher? This cannot be undone.",
      editTitle: "Edit Voucher",
      receiverName: "Receiver name",
      paymentMethod: "Payment method",
      items: "Items",
      description: "Description",
      price: "Price",
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
    loadPublicVouchers();
  }, []);

  async function loadPublicVouchers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else {
      setVouchers(data || []);
      await loadAllRequestsCounts(data || []);
      if (currentUser) await loadUserRequests(data || []);
    }
    setLoading(false);
  }

  async function loadAllRequestsCounts(vouchersList: any[]) {
    const counts: Record<string, number> = {};
    for (const v of vouchersList) {
      const { count, error } = await supabase
        .from("voucher_requests")
        .select("*", { count: "exact", head: true })
        .eq("voucher_id", v.id);
      if (!error) counts[v.id] = count || 0;
      else counts[v.id] = 0;
    }
    setRequestsCount(counts);
  }

  async function loadUserRequests(vouchersList: any[]) {
    if (!currentUser) return;
    const requested: Record<string, boolean> = {};
    for (const v of vouchersList) {
      const { data, error } = await supabase
        .from("voucher_requests")
        .select("id")
        .eq("voucher_id", v.id)
        .eq("requester_id", String(currentUser.id))
        .maybeSingle();
      if (!error && data) requested[v.id] = true;
    }
    setUserRequested(requested);
  }

  async function handleRequest(voucherId: string, senderId: number, senderName: string) {
    if (!currentUser) {
      alert(texts.loginRequired);
      return;
    }
    if (userRequested[voucherId]) {
      alert(texts.alreadyRequested);
      return;
    }
    const { error } = await supabase.from("voucher_requests").insert({
      voucher_id: voucherId,
      requester_id: String(currentUser.id),
      requester_name: currentUser.full_name,
      requester_phone: currentUser.phone || "",
      status: "pending",
    });
    if (error) alert("❌ " + error.message);
    else {
      alert(texts.requestSuccess);
      setUserRequested(prev => ({ ...prev, [voucherId]: true }));
      setRequestsCount(prev => ({ ...prev, [voucherId]: (prev[voucherId] || 0) + 1 }));
    }
  }

  async function openRequestersModal(voucherId: string) {
    const { data, error } = await supabase
      .from("voucher_requests")
      .select("*")
      .eq("voucher_id", voucherId)
      .order("created_at", { ascending: false });
    if (!error) {
      setShowRequestersList(prev => ({ ...prev, [voucherId]: data || [] }));
      setModalOpen(voucherId);
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "purchase_voucher": return texts.typePurchase;
      case "gift_voucher": return texts.typeGift;
      case "invoice": return texts.typeInvoice;
      case "quote": return texts.typeQuote;
      default: return type;
    }
  };

  async function handleDelete(voucher: any) {
    if (!confirm(texts.confirmDelete)) return;
    if (voucher.pdf_url) {
      const fileName = voucher.pdf_url.split("/").pop();
      if (fileName) {
        await supabase.storage.from("invoices").remove([fileName]);
      }
    }
    const { error } = await supabase.from("invoices").delete().eq("id", voucher.id);
    if (error) alert("❌ " + error.message);
    else {
      alert(texts.deleteSuccess);
      loadPublicVouchers();
    }
  }

  async function handleResend(voucher: any) {
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

  function openEdit(voucher: any) {
    setEditingVoucher(voucher);
    setEditReceiverName(voucher.receiver_name);
    setEditPaymentMethod(voucher.payment_method || "");
    setEditItems(voucher.items.map((item: any) => ({ description: item.description, price: item.price })));
    setEditIsPublic(voucher.is_public);
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

  async function saveEdit() {
    if (!editingVoucher) return;
    setEditUpdating(true);
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
    const total = editItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    tempDiv.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2>${editingVoucher.type === "invoice" ? "فاتورة" : editingVoucher.type === "quote" ? "عرض سعر" : editingVoucher.type === "purchase_voucher" ? "قسيمة شراء" : "قسيمة هدية"}</h2>
          <p>رقم: ${editingVoucher.id}</p>
          <p>التاريخ: ${new Date().toLocaleDateString()}</p>
        </div>
        <img src="${editingVoucher.sender_logo || ""}" style="width:80px" crossorigin="anonymous" />
      </div>
      <hr/>
      <div style="display:flex; justify-content:space-between; margin-top:20px">
        <div><h4>من:</h4><p>${editingVoucher.sender_name}</p><p>${editingVoucher.sender_phone}</p></div>
        <div><h4>إلى:</h4><p>${editReceiverName}</p><p>${editingVoucher.receiver_phone}</p></div>
      </div>
      <table style="width:100%; margin-top:30px; border-collapse:collapse">
        <thead><tr style="background:#f3f4f6"><th style="border:1px solid #ddd; padding:10px">البيان</th><th style="border:1px solid #ddd; padding:10px">السعر</th></tr></thead>
        <tbody>${editItems.map(item => `<td><td style="border:1px solid #ddd; padding:10px">${item.description}</td><td style="border:1px solid #ddd; padding:10px">${item.price}</td></tr>`).join("")}</tbody>
      </table>
      <div style="margin-top:20px; font-weight:bold">المجموع: ${total}</div>
      <div style="margin-top:20px"><p><strong>طريقة الدفع:</strong> ${editPaymentMethod}</p></div>
      <div style="display:flex; justify-content:space-between; margin-top:60px">
        <div><p>الختم</p><img src="${editingVoucher.sender_logo || ""}" width="120"/></div>
        <div><p>التوقيع</p><img src="${editingVoucher.sender_logo || ""}" width="120"/></div>
      </div>
    `;
    document.body.appendChild(tempDiv);
    const canvas = await html2canvas(tempDiv, { useCORS: true, scale: 2 });
    document.body.removeChild(tempDiv);
    canvas.toBlob(async (blob) => {
      if (!blob) { alert("❌ فشل إنشاء الصورة"); setEditUpdating(false); return; }
      const fileName = `invoice-${editingVoucher.id}.png`;
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
      }).eq("id", editingVoucher.id);
      if (updateError) alert("❌ " + updateError.message);
      else {
        alert(texts.updateSuccess);
        setEditingVoucher(null);
        loadPublicVouchers();
      }
      setEditUpdating(false);
    });
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={() => navigate("/")} style={btnBack}>← {texts.back}</button>
        <button onClick={() => {
          const newLocale = locale === "ar" ? "en" : "ar";
          setLocale(newLocale);
          localStorage.setItem("appLocale", newLocale);
        }} style={langBtn}>{locale === "ar" ? "English" : "العربية"}</button>
      </div>
      <h1 style={{ textAlign: "center" }}>{texts.title}</h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: 30 }}>{texts.sub}</p>
      {loading && <p style={{ textAlign: "center" }}>{texts.loadingMsg}</p>}
      {!loading && vouchers.length === 0 && <p style={{ textAlign: "center" }}>{texts.noData}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {vouchers.map(v => {
          const isOwner = currentUser && String(currentUser.id) === String(v.sender_id);
          return (
            <div key={v.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <span style={badge}>{getTypeName(v.type)}</span>
                  <h3 style={{ margin: "8px 0 4px" }}>{v.sender_name}</h3>
                  <small style={{ color: "#888" }}>{texts.date}: {new Date(v.created_at).toLocaleDateString()}</small>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: "bold" }}>{texts.total}: {v.total} {v.type === "gift_voucher" && "🎁"}</div>
                  {isOwner && (
                    <button onClick={() => openRequestersModal(v.id)} style={btnRequests}>
                      📋 {texts.requests} ({requestsCount[v.id] || 0})
                    </button>
                  )}
                </div>
              </div>
              <div style={{ marginTop: 12, borderTop: "1px solid #eee", paddingTop: 12, display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button onClick={() => navigate(`/voucher/${v.id}`)} style={btnView}>{texts.view}</button>
                {isOwner && (
                  <>
                    <button onClick={() => openEdit(v)} style={btnEdit}>{texts.edit}</button>
                    <button onClick={() => handleDelete(v)} style={btnDelete}>{texts.delete}</button>
                    <button onClick={() => handleResend(v)} style={btnResend}>{texts.resend}</button>
                  </>
                )}
                {currentUser && !isOwner && (
                  <button
                    onClick={() => handleRequest(v.id, v.sender_id, v.sender_name)}
                    style={userRequested[v.id] ? btnRequested : btnRequest}
                    disabled={userRequested[v.id]}
                  >
                    {userRequested[v.id] ? texts.alreadyRequested : texts.request}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* نافذة عرض قائمة الطلاب */}
      {modalOpen && showRequestersList[modalOpen] && (
        <div style={modalOverlay} onClick={() => setModalOpen(null)}>
          <div style={modalContentLarge} onClick={e => e.stopPropagation()}>
            <h3>{texts.requests}</h3>
            {showRequestersList[modalOpen]?.length === 0 && <p>{texts.noRequests}</p>}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>{texts.requesterName}</th>
                  <th>{texts.requesterPhone}</th>
                  <th>{texts.requestDate}</th>
                </tr>
              </thead>
              <tbody>
                {showRequestersList[modalOpen]?.map((req: any) => (
                  <tr key={req.id}>
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>{req.requester_name}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>{req.requester_phone || "—"}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>{new Date(req.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setModalOpen(null)} style={btnClose}>{texts.close}</button>
          </div>
        </div>
      )}

      {/* نافذة التعديل */}
      {editingVoucher && (
        <div style={modalOverlay} onClick={() => setEditingVoucher(null)}>
          <div style={{ ...modalContent, width: "90%", maxWidth: 500, maxHeight: "80%", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <h3>{texts.editTitle}</h3>
            <input type="text" placeholder={texts.receiverName} value={editReceiverName} onChange={e => setEditReceiverName(e.target.value)} style={inputStyle} />
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
              <button style={btnRed} onClick={() => setEditingVoucher(null)}>{texts.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  border: "1px solid #eee",
};
const badge: React.CSSProperties = {
  background: "#f97316",
  color: "#fff",
  padding: "4px 12px",
  borderRadius: 20,
  fontSize: 12,
  display: "inline-block",
};
const btnBack: React.CSSProperties = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 8,
  cursor: "pointer",
};
const langBtn: React.CSSProperties = {
  background: "#f0f0f0",
  border: "none",
  borderRadius: 30,
  padding: "6px 12px",
  cursor: "pointer",
  fontWeight: "bold",
};
const btnView: React.CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
};
const btnEdit: React.CSSProperties = {
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
};
const btnDelete: React.CSSProperties = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
};
const btnResend: React.CSSProperties = {
  background: "#10b981",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
};
const btnRequest: React.CSSProperties = {
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
};
const btnRequested: React.CSSProperties = {
  background: "#9ca3af",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "default",
};
const btnRequests: React.CSSProperties = {
  background: "#6b7280",
  color: "#fff",
  border: "none",
  padding: "4px 8px",
  borderRadius: 20,
  fontSize: 12,
  cursor: "pointer",
  marginTop: 5,
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  boxSizing: "border-box",
};
const btnGreen: React.CSSProperties = {
  background: "#22c55e",
  color: "#fff",
  padding: "8px 16px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
const btnRed: React.CSSProperties = {
  background: "#ef4444",
  color: "#fff",
  padding: "8px 16px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
const btnGreenSmall: React.CSSProperties = {
  background: "#22c55e",
  color: "#fff",
  padding: "6px 12px",
  fontSize: "12px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
const btnRedSmall: React.CSSProperties = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};
const modalContent: React.CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  textAlign: "center",
};
const modalContentLarge: React.CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  width: "90%",
  maxWidth: 500,
  maxHeight: "80%",
  overflowY: "auto",
};
const btnClose: React.CSSProperties = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  marginTop: 15,
  cursor: "pointer",
};