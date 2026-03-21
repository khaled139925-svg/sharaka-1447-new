import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ConsultantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [c, setC] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("consultants")
      .select("*")
      .eq("id", id)
      .single();

    setC(data);
  };

  if (!c) return <div className="p-6">جاري التحميل...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* زر رجوع */}
      <button
        onClick={() => navigate("/browse")}
        className="mb-4 bg-gray-300 px-4 py-2 rounded"
      >
        ← رجوع
      </button>

      <img
        src={c.profile_image || "/no-image.png"}
        className="w-full h-60 object-cover rounded mb-4"
      />

      <h1 className="text-2xl font-bold text-blue-600">
        {c.full_name}
      </h1>

      <p className="text-gray-500">
        {c.specialty} - {c.sub_specialty}
      </p>

      <p className="mt-4">{c.bio}</p>

      <div className="mt-4 space-y-2">

        {c.email && <p>📧 {c.email}</p>}
        {c.phone && <p>📱 {c.phone}</p>}
        {c.country && <p>🌍 {c.country} - {c.city}</p>}
        {c.price && <p>💰 {c.price} {c.currency}</p>}

        {c.website && <a href={c.website}>🌐 موقع</a>}
        {c.whatsapp && <p>واتساب: {c.whatsapp}</p>}
        {c.linkedin && <p>LinkedIn</p>}
        {c.instagram && <p>Instagram</p>}
        {c.youtube && <p>YouTube</p>}

      </div>

    </div>
  );
}