import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [follows, setFollows] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const localUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!localUser) {
      navigate("/");
      return;
    }
    // التحقق من صلاحية المدير من قاعدة البيانات
    const { data, error } = await supabase
      .from("consultants")
      .select("is_admin")
      .eq("id", localUser.id)
      .single();
    if (error || !data?.is_admin) {
      alert("ليس لديك صلاحية للوصول إلى لوحة التحكم");
      navigate("/");
      return;
    }
    setCurrentAdmin(localUser);
    loadData();
  }

  async function loadData() {
    setLoading(true);
    // جلب جميع المستخدمين
    const { data: usersData } = await supabase.from("consultants").select("*").order("id");
    setUsers(usersData || []);
    // جلب جميع المنشورات
    const { data: postsData } = await supabase.from("posts").select("*");
    setPosts(postsData || []);
    // جلب جميع المتابعات
    const { data: followsData } = await supabase.from("follows").select("*");
    setFollows(followsData || []);
    setLoading(false);
  }

  async function toggleUserStatus(userId: number, currentActive: boolean) {
    const newStatus = !currentActive;
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

  async function deleteUser(userId: number) {
    if (!confirm("هل أنت متأكد من حذف هذا الحساب نهائياً؟")) return;
    const { error } = await supabase.from("consultants").delete().eq("id", userId);
    if (error) {
      setMessage("❌ فشل حذف الحساب: " + error.message);
    } else {
      setMessage("✅ تم حذف الحساب");
      loadData();
    }
  }

  async function resetPassword(userId: number, newPassword: string) {
    if (!newPassword.trim()) {
      setMessage("❌ الرجاء إدخال كلمة مرور جديدة");
      return;
    }
    const { error } = await supabase
      .from("consultants")
      .update({ password: newPassword })
      .eq("id", userId);
    if (error) {
      setMessage("❌ فشل تغيير كلمة المرور: " + error.message);
    } else {
      setMessage("✅ تم تغيير كلمة المرور");
    }
  }

  async function toggleAdmin(userId: number, currentIsAdmin: boolean) {
    const newAdminStatus = !currentIsAdmin;
    const { error } = await supabase
      .from("consultants")
      .update({ is_admin: newAdminStatus })
      .eq("id", userId);
    if (error) {
      setMessage("❌ فشل تغيير صلاحية المدير: " + error.message);
    } else {
      setMessage(`✅ تم ${newAdminStatus ? "ترقية" : "إزالة"} صلاحية المدير`);
      loadData();
    }
  }

  if (loading) return <div style={{ padding: 20 }}>⏳ جاري تحميل البيانات...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>لوحة التحكم - الإدارة</h1>
        <button onClick={() => navigate("/")} style={btnRed}>رجوع إلى الرئيسية</button>
      </div>
      {message && <div style={{ background: "#e0f2fe", padding: 10, borderRadius: 8, marginBottom: 15 }}>{message}</div>}
      
      {/* إحصائيات سريعة */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30, flexWrap: "wrap" }}>
        <div style={statCard}>👥 عدد الأعضاء: {users.length}</div>
        <div style={statCard}>📸 عدد المنشورات: {posts.length}</div>
        <div style={statCard}>🤝 عدد المتابعات: {follows.length}</div>
      </div>

      {/* جدول الأعضاء */}
      <h2>إدارة الأعضاء</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={table}>
          <thead>
            <tr>
              <th>المعرف</th><th>الاسم</th><th>البريد</th><th>الجوال</th><th>الحالة</th><th>مدير؟</th><th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ background: user.is_active === false ? "#fee2e2" : "white" }}>
                <td>{user.id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>{user.is_active ? "✅ نشط" : "❌ مجمد"}</td>
                <td>{user.is_admin ? "👑 مدير" : "👤 عادي"}</td>
                <td>
                  <button style={btnSmallGreen} onClick={() => toggleUserStatus(user.id, user.is_active)}>
                    {user.is_active ? "تجميد" : "تفعيل"}
                  </button>
                  <button style={btnSmallBlue} onClick={() => {
                    const newPass = prompt("أدخل كلمة المرور الجديدة:");
                    if (newPass) resetPassword(user.id, newPass);
                  }}>تغيير كلمة المرور</button>
                  <button style={btnSmallOrange} onClick={() => toggleAdmin(user.id, user.is_admin)}>
                    {user.is_admin ? "إزالة المدير" : "جعله مديراً"}
                  </button>
                  <button style={btnSmallRed} onClick={() => deleteUser(user.id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// الأنماط
const statCard = { background: "#f1f5f9", padding: "15px 25px", borderRadius: 12, fontSize: 18, fontWeight: "bold" };
const table = { width: "100%", borderCollapse: "collapse" as const, background: "#fff", borderRadius: 12, overflow: "hidden" };
const btnSmallGreen = { background: "#22c55e", color: "#fff", border: "none", borderRadius: 6, padding: "5px 10px", margin: "0 3px", cursor: "pointer" };
const btnSmallBlue = { background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, padding: "5px 10px", margin: "0 3px", cursor: "pointer" };
const btnSmallOrange = { background: "#f97316", color: "#fff", border: "none", borderRadius: 6, padding: "5px 10px", margin: "0 3px", cursor: "pointer" };
const btnSmallRed = { background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "5px 10px", margin: "0 3px", cursor: "pointer" };
const btnRed = { background: "#ef4444", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 8, cursor: "pointer" };