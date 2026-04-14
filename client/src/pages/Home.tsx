import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("profiles").select("*");
    setProfiles(data || []);
  }

  return (
    <div>
      <img src="/logo.png" className="logo" onClick={() => navigate("/")} />
      <button className="btn" onClick={() => navigate("/create")}>
        إنشاء حساب
      </button>
      <div className="container">
        {profiles.map((p) => (
          <div key={p.id} className="card" onClick={() => navigate(`/profile/${p.id}`)}>
            <div className="avatar"></div>
            <div>
              <div className="name">{p.name}</div>
              <div className="title">{p.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}