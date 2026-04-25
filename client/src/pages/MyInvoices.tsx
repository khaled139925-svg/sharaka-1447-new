import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function MyInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .eq("sender_id", user.id)
      .order("created_at", { ascending: false });
    setInvoices(data || []);
  }

  async function markPaid(id: string) {
    await supabase.from("invoices").update({ status: "paid" }).eq("id", id);
    loadInvoices();
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>📂 فواتيري</h2>
      {invoices.length === 0 && <p>لا توجد فواتير حتى الآن.</p>}
      {invoices.map(inv => (
        <div key={inv.id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10, borderRadius: 8 }}>
          <p><strong>رقم الفاتورة:</strong> {inv.invoice_number}</p>
          <p><strong>العميل:</strong> {inv.receiver_name}</p>
          <p><strong>السعر:</strong> {inv.price} ريال</p>
          <p><strong>الحالة:</strong> {inv.status === "paid" ? "مدفوعة ✅" : "غير مدفوعة ⏳"}</p>
          <a href={inv.pdf_url} target="_blank" rel="noreferrer">📄 عرض الفاتورة</a><br />
          <button onClick={() => markPaid(inv.id)} style={{ background: "#22c55e", color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", marginTop: 8, cursor: "pointer" }}>
            ✔️ تم السداد
          </button>
          <button onClick={() => window.open(`https://wa.me/${inv.receiver_phone}?text=${encodeURIComponent(inv.pdf_url)}`, "_blank")} style={{ background: "#25D366", color: "#fff", border: "none", borderRadius: 6, padding: "4px 12px", marginTop: 8, marginLeft: 8, cursor: "pointer" }}>
            📱 إعادة إرسال
          </button>
        </div>
      ))}
    </div>
  );
}