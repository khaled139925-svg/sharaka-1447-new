import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ChatWindow from "../components/ChatWindow";

export default function ConsultantProfile() {
  const { id } = useParams(); // استلام id من الرابط
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  // فتح الدردشة تلقائياً إذا كان الرابط يحوي openChat=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("openChat") === "true") {
      setShowChat(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("consultants")
      .select("*")
      .eq("id", id)
      .single();
    setData(data);

    const { data: adsData } = await supabase
      .from("ads")
      .select("*")
      .eq("consultant_id", id);
    setAds(adsData || []);

    const { data: payData } = await supabase
      .from("payments")
      .select("*")
      .eq("consultant_id", id);
    setPayments(payData || []);
  };

  const handleMessage = () => {
    if (!currentUser) {
      localStorage.setItem("returnTo", window.location.pathname);
      localStorage.setItem("openChat", "true");
      navigate("/login");
      return;
    }
    setShowChat(true);
  };

  if (!data) return <div>تحميل...</div>;

  return (
    <div className="p-10">
      <img src={data.profile_image} className="w-40 h-40 rounded mb-4" />
      <h1>{data.name}</h1>
      <p>{data.specialty}</p>
      <p>{data.bio}</p>

      {/* زر المراسلة */}
      <button
        onClick={handleMessage}
        className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
      >
        💬 مراسلة
      </button>

      <h2 className="mt-6">الإعلانات</h2>
      {ads.map((a) => (
        <div key={a.id}>{a.title}</div>
      ))}

      <h2 className="mt-6">طرق الدفع</h2>
      {payments.map((p) => (
        <div key={p.id}>
          {p.method} - {p.details}
        </div>
      ))}

      {showChat && data.user_id && (
        <ChatWindow
          otherUserId={data.user_id}
          otherUserName={data.name}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}