import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    // 1️⃣ إنشاء حساب
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) return;

    // 2️⃣ حفظ في جدول users
    const { error: dbError } = await supabase.from("users").insert([
      {
        id: user.id,
        name: name,
        email: email,
        category: "جديد",
        bio: "",
        avatar: "",
      },
    ]);

    if (dbError) {
      console.log(dbError);
      alert("خطأ في حفظ البيانات");
      return;
    }

    // 3️⃣ تحويل إلى البروفايل
    navigate(`/profile/${user.id}`);
  }

  return (
    <div className="page">

      <h2>إنشاء حساب</h2>

      <input
        placeholder="الاسم"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="كلمة المرور"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>تسجيل</button>

    </div>
  );
}