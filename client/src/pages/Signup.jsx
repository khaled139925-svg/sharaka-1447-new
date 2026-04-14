import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function signup() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (!data.user) return;

    await supabase.from("users").insert([
      {
        id: data.user.id,
        name: name,
      },
    ]);

    navigate(`/profile/${data.user.id}`);
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>تسجيل</h2>

      <input placeholder="الاسم" onChange={(e) => setName(e.target.value)} />
      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={signup}>تسجيل</button>
    </div>
  );
}