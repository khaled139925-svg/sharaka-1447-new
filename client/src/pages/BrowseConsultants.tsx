import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function BrowseConsultants() {

  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("consultants").select("*");
      setData(data || []);
    };
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>

      {/* زر الرجوع */}
      <button onClick={() => navigate("/")}>
        ← الرئيسية
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 20 }}>

        {data.map((c) => (
          <div key={c.id} style={{ border: "1px solid #ccc", padding: 15, width: 250 }}>

            <img src={c.profile_image} style={{ width: "100%", height: 150 }} />

            <h3>{c.name}</h3>

            <p>{c.specialty}</p>

            <p>{c.bio?.slice(0, 40)}...</p>

            <button onClick={() => navigate(`/consultant/${c.id}`)}>
              التفاصيل
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}