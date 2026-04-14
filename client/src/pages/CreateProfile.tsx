import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function CreateProfile() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [contact, setContact] = useState("");

  const navigate = useNavigate();

  async function save() {
    await supabase.from("profiles").insert([
      { name, title, bio, contact }
    ]);
    navigate("/");
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>إنشاء حساب</h2>

      <input placeholder="الاسم" onChange={e => setName(e.target.value)} /><br /><br />
      <input placeholder="المجال" onChange={e => setTitle(e.target.value)} /><br /><br />
      <textarea placeholder="نبذة" onChange={e => setBio(e.target.value)} /><br /><br />
      <input placeholder="واتساب" onChange={e => setContact(e.target.value)} /><br /><br />

      <button onClick={save}>حفظ</button>
    </div>
  );
}