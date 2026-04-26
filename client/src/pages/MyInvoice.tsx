import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function MyInvoice() {
  const [invoice, setInvoice] = useState(null);
  const [status, setStatus] = useState('not_issued');
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!currentUser?.id) return;
    const fetchData = async () => {
      const { data: user } = await supabase.from('consultants').select('invoice_status').eq('id', currentUser.id).single();
      setStatus(user.invoice_status);
      if (user.invoice_status === 'issued') {
        const { data } = await supabase.from('invoices').select('*').eq('consultant_id', currentUser.id).order('created_at', { ascending: false }).limit(1).single();
        setInvoice(data);
      }
    };
    fetchData();
  }, [currentUser]);

  if (status === 'not_issued') {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h3>⚠️ لم تصدر لك فاتورة بعد</h3>
        <p>سيتم إشعارك عند إصدار الفاتورة.</p>
      </div>
    );
  }

  if (!invoice) return <div>جاري التحميل...</div>;

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>فاتورة الاشتراك</h2>
      <p><strong>رقم الفاتورة:</strong> {invoice.invoice_number}</p>
      <p><strong>المبلغ:</strong> {invoice.amount} ريال</p>
      <p><strong>تاريخ الإصدار:</strong> {invoice.issue_date}</p>
      <p><strong>تاريخ الاستحقاق:</strong> {invoice.due_date}</p>
      <p><strong>الحالة:</strong> {invoice.status === 'paid' ? 'مدفوعة ✅' : 'غير مدفوعة ⏳'}</p>
    </div>
  );
}