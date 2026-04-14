import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  const [p, setP] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    setP(data);
  }

  if (!p) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>{p.name}</h2>
      <p>{p.title}</p>
      <p>{p.bio}</p>

      <a href={`https://wa.me/${p.contact}`}>
        تواصل واتساب
      </a>
    </div>
  );
}