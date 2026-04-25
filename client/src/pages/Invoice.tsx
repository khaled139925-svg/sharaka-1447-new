import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Invoice() {
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('id');
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId) return;
    const fetchInvoice = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, consultants(full_name, email, phone)')
        .eq('id', invoiceId)
        .single();
      if (data) setInvoice(data);
      setLoading(false);
    };
    fetchInvoice();
  }, [invoiceId]);

  if (loading) return <div style={styles.container}>جاري التحميل...</div>;
  if (!invoice) return <div style={styles.container}>لم يتم العثور على الفاتورة</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>فاتورة اشتراك - منصة شراكة</h2>
        <div style={styles.row}><span style={styles.label}>رقم الفاتورة:</span> <span>{invoice.invoice_number}</span></div>
        <div style={styles.row}><span style={styles.label}>العميل:</span> <span>{invoice.consultants?.full_name}</span></div>
        <div style={styles.row}><span style={styles.label}>البريد الإلكتروني:</span> <span>{invoice.consultants?.email}</span></div>
        <div style={styles.row}><span style={styles.label}>رقم الجوال:</span> <span>{invoice.consultants?.phone}</span></div>
        <div style={styles.row}><span style={styles.label}>المبلغ:</span> <span>{invoice.amount} ريال</span></div>
        <div style={styles.row}><span style={styles.label}>تاريخ الإصدار:</span> <span>{new Date(invoice.issue_date).toLocaleDateString()}</span></div>
        <div style={styles.row}><span style={styles.label}>تاريخ الاستحقاق:</span> <span>{new Date(invoice.due_date).toLocaleDateString()}</span></div>
        <div style={styles.row}><span style={styles.label}>حالة الفاتورة:</span> <span>{invoice.status === 'sent' ? 'مرسلة' : 'مدفوعة'}</span></div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 500, margin: '40px auto', padding: 20, background: '#fafafa' },
  card: { background: '#fff', padding: 20, borderRadius: 16, boxShadow: '0 5px 20px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center' as const, marginBottom: 20 },
  row: { marginBottom: 10, display: 'flex', justifyContent: 'space-between' },
  label: { fontWeight: 'bold' }
};