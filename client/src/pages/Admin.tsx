import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ posts: 0, follows: 0, likes: 0, comments: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // تحقق من الدخول عبر 10 ضغطات (يمكن إضافة كلمة سر بسيطة)
  useEffect(() => {
    checkAccess();
    loadData();
  }, []);

  async function checkAccess() {
    // اختياري: يمكن إضافة كلمة مرور بسيطة أو الاعتماد على الضغطات فقط
    // نسمح بالدخول لأي شخص يصل إلى /admin (لأن الضغطات تفتح الرابط)
  }

  async function loadData() {
    setLoading(true);
    // جلب جميع المستخدمين
    const { data: usersData } = await supabase.from("consultants").select("*");
    setUsers(usersData || []);

    // إحصائيات
    const { count: postsCount } = await supabase.from("posts").select("*", { count: "exact", head: true });
    const { count: followsCount } = await supabase.from("follows").select("*", { count: "exact", head: true });
    const { count: likesCount } = await supabase.from("likes").select("*", { count: "exact", head: true });
    const { count: commentsCount } = await supabase.from("comments").select("*", { count: "exact", head: true });
    setStats({
      posts: postsCount || 0,
      follows: followsCount || 0,
      likes: likesCount || 0,
      comments: commentsCount || 0,
    });
    setLoading(false);
  }

  async function deleteUser(userId: number) {
    if (!confirm("هل أنت متأكد من حذف هذا الحساب نهائياً؟")) return;
    const { error } = await supabase.from("consultants").delete().eq("id", userId);
    if (error) {
      setMessage("❌ فشل الحذف: " + error.message);
    } else {
      setMessage("✅ تم حذف الحساب");
      loadData();
    }
  }

  async function toggleUserStatus(userId: number, currentStatus: string) {
    // نقوم بتجميد الحساب عن طريق إضافة حقل suspended في جدول consultants (يجب إضافته أولاً)
    // إذا لم يكن لديك حقل suspended، يمكننا استخدام حقل موجود مثل 'active' أو إضافته الآن.
    // سنفترض وجود عمود 'is_active' (boolean). إذا لم يكن موجوداً، نضيفه.
    // لتجنب التعقيد، سنقوم بتعطيل الحساب مؤقتاً عن طريق تغيير كلمة المرور إلى قيمة عشوائية؟ لا، الأفضل إضافة عمود.
    // الأوامر SQL لإضافة عمود is_active:
    // ALTER TABLE consultants ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    // سننفذ هذا تلقائياً من الكود.
    
    // تحقق من وجود العمود
    const { data: columnExists } = await supabase
      .from("consultants")
      .select("is_active")
      .limit(1);
    if (!columnExists || columnExists.length === 0 || !("is_active" in (columnExists[0] || {}))) {
      // إضافة العمود
      await supabase.rpc('add_column_if_not_exists', { table_name: 'consultants', column_name: 'is_active', column_type: 'boolean' });
      // أو استخدام SQL مباشرة: await supabase.from('consultants').update({}).select() غير مناسب. سنستخدم raw SQL.
      // بدلاً من ذلك، ننفذ استعلام SQL عبر REST:
      await fetch(`${supabase.supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: { 'apikey': supabase.supabaseKey, 'Authorization': `Bearer ${supabase.supabaseKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'ALTER TABLE consultants ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;' })
      }).catch(() => console.log("لا يمكن إضافة العمود، تأكد من صلاحيات RPC"));
    }
    
    // الآن تحديث الحالة
    const newStatus = currentStatus === "active" ? false : true;
    const { error } = await supabase
      .from("consultants")
      .update({ is_active: newStatus })
      .eq("id", userId);
    if (error) {
      setMessage("❌ فشل تغيير الحالة: " + error.message);
    } else {
      setMessage(`✅ تم ${newStatus ? "تفعيل" : "تجميد"} الحساب`);
      loadData();
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto", direction: "rtl" }}>
      <button onClick={() => navigate("/")} style={btnRed}>رجوع للرئيسية</button>
      <h1>لوحة الإدارة</h1>
      {message && <div style={{ background: "#e0f2fe", padding: 10, borderRadius: 8, marginBottom: 10 }}>{message}</div>}
      
      <div style={{ display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 20 }}>
        <div style={statCard}>📄 المنشورات: {stats.posts}</div>
        <div style={statCard}>🤝 المتابعات: {stats.follows}</div>
        <div style={statCard}>❤️ الإعجابات: {stats.likes}</div>
        <div style={statCard}>💬 التعليقات: {stats.comments}</div>
      </div>

      <h2>إدارة الأعضاء</h2>
      {loading && <div>جاري التحميل...</div>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr><th style={th}>ID</th><th style={th}>الاسم</th><th style={th}>البريد</th><th style={th}>الحالة</th><th style={th}>إجراءات</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={td}>{user.id}</td>
              <td style={td}>{user.full_name}</td>
              <td style={td}>{user.email}</td>
              <td style={td}>{user.is_active !== false ? "نشط" : "مجمد"}</td>
              <td style={td}>
                <button style={btnSmall} onClick={() => toggleUserStatus(user.id, user.is_active !== false ? "active" : "inactive")}>
                  {user.is_active !== false ? "تجميد" : "تفعيل"}
                </button>
                <button style={{ ...btnSmall, background: "#ef4444", color: "#fff" }} onClick={() => deleteUser(user.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const statCard = { background: "#f1f5f9", padding: "10px 15px", borderRadius: 12, fontWeight: "bold" };
const th = { borderBottom: "1px solid #ddd", padding: "8px", textAlign: "right" };
const td = { borderBottom: "1px solid #eee", padding: "8px" };
const btnRed = { background: "#ef4444", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8, marginBottom: 10, cursor: "pointer" };
const btnSmall = { background: "#3b82f6", color: "#fff", padding: "4px 8px", border: "none", borderRadius: 6, cursor: "pointer", marginLeft: 5 };