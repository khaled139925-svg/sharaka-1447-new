import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function CreateProfile() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [contact, setContact] = useState("");

  const navigate = useNavigate();

  async function handleSubmit() {
    const { error } = await supabase.from("profiles").insert([
      { name, title, bio, contact }
    ]);

    if (error) {
      alert("خطأ");
      return;
    }

    navigate("/");
  }

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>إنشاء حساب</h2>

      <input placeholder="الاسم" onChange={(e) => setName(e.target.value)} />
      <input placeholder="المجال" onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="نبذة" onChange={(e) => setBio(e.target.value)} />
      <input placeholder="رقم / واتساب" onChange={(e) => setContact(e.target.value)} />

      <button onClick={handleSubmit}>حفظ</button>
    </div>
  );
}