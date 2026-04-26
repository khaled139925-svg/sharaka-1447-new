import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminInvoices() {
  const [users, setUsers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!currentUser?.is_admin) return;
    fetchUsersWithoutInvoice();
    fetchAllInvoices();
  }, []);

  async function fetchUsersWithoutInvoice() {
    const { data } = await supabase
      .from('consultants')
      .select('id, full_name, phone')
      .eq('invoice_status', 'not_issued');
    setUsers(data || []);
  }

  async function fetchAllInvoices() {
    const { data } = await supabase
      .from('invoices')
      .select('*, consultants(full_name)')
      .order('created_at', { ascending: false });
    setInvoices(data || []);
  }

  async function issueInvoice(userId, amount) {
    setLoading(true);
    const invoiceNumber = `INV-${Date.now()}-${userId}`;
    const issueDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    
    const { error } = await supabase.from('invoices').insert({
      invoice_number: invoiceNumber,
      consultant_id: userId,
      amount: amount,
      issue_date: issueDate,
      due_date: dueDate,
      status: 'unpaid',
      issued_by: currentUser.id,
    });
    if (error) {
      alert('❌ فشل إصدار الفاتورة: ' + error.message);
    } else {
      await supabase.from('consultants').update({ invoice_status: 'issued' }).eq('id', userId);
      alert('✅ تم إصدار الفاتورة بنجاح');
      fetchUsersWithoutInvoice();
      fetchAllInvoices();
    }
    setLoading(false);
  }

  async function markAsPaid(invoiceId) {
    const { error } = await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId);
    if (error) {
      alert('❌ فشل تحديث السداد: ' + error.message);
    } else {
      alert('✅ تم تسجيل السداد');
      fetchAllInvoices();
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>إدارة الفواتير</h2>
      
      <h3>📋 المستخدمون بدون فاتورة</h3>
      {users.length === 0 && <p>جميع المستخدمين لديهم فواتير</p>}
      {users.map(user => (
        <div key={user.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10, borderRadius: 8 }}>
          <div><strong>{user.full_name}</strong> - {user.phone}</div>
          <input type="number" id={`amount-${user.id}`} placeholder="المبلغ" style={{ width: 100, marginRight: 10 }} />
          <button onClick={() => {
            const amount = document.getElementById(`amount-${user.id}`).value;
            if (amount) issueInvoice(user.id, parseFloat(amount));
            else alert('أدخل المبلغ');
          }} disabled={loading} style={btnStyle}>إصدار فاتورة</button>
        </div>
      ))}

      <h3>📄 الفواتير الصادرة</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={thStyle}>العميل</th><th style={thStyle}>المبلغ</th><th style={thStyle}>تاريخ الإصدار</th><th style={thStyle}>الاستحقاق</th><th style={thStyle}>الحالة</th><th style={thStyle}>إجراء</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td style={tdStyle}>{inv.consultants?.full_name}</td>
              <td style={tdStyle}>{inv.amount} ريال</td>
              <td style={tdStyle}>{inv.issue_date}</td>
              <td style={tdStyle}>{inv.due_date}</td>
              <td style={tdStyle}>{inv.status === 'paid' ? '✅ مدفوعة' : '⏳ غير مدفوعة'}</td>
              <td style={tdStyle}>
                {inv.status === 'unpaid' && (
                  <button onClick={() => markAsPaid(inv.id)} style={btnSmall}>تم السداد</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const btnStyle = { background: '#3b82f6', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: 6, cursor: 'pointer' };
const btnSmall = { background: '#22c55e', color: '#fff', padding: '4px 8px', border: 'none', borderRadius: 4, cursor: 'pointer' };
const thStyle = { border: '1px solid #ddd', padding: 8, textAlign: 'right' };
const tdStyle = { border: '1px solid #ddd', padding: 8 };