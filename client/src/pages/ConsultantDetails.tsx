import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ConsultantDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [c, setC] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("consultants")
        .select("*")
        .eq("id", id)
        .single();

      setC(data);
    };
    load();
  }, [id]);

  if (!c) return <div>جاري التحميل...</div>;

  return (
    <div style={{ padding: 20 }}>

      <button onClick={() => navigate("/browse")}>
        ← رجوع
      </button>

      <img src={c.profile_image} style={{ width: 200 }} />

      <h2>{c.name}</h2>

      <p>{c.specialty}</p>
      <p>{c.sub_specialty}</p>

      <p>{c.bio}</p>

      <button onClick={() => window.location.href = `tel:${c.phone}`}>
        اتصال
      </button>

      <button onClick={() => window.location.href = `mailto:${c.email}`}>
        ايميل
      </button>

    </div>
  );
}