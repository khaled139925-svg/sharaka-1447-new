import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AddPost() {
  const [mediaFile, setMediaFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const uploadMedia = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `posts/${fileName}`;
    const { error } = await supabase.storage.from("media").upload(filePath, file);
    if (error) return null;
    const { data } = supabase.storage.from("media").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mediaFile) {
      setError("اختر ملف");
      return;
    }
    setLoading(true);
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setError("سجل دخول أولاً");
      navigate("/login");
      return;
    }
    const user = JSON.parse(userStr);
    const mediaUrl = await uploadMedia(mediaFile);
    if (!mediaUrl) {
      setError("فشل رفع الملف");
      setLoading(false);
      return;
    }
    const mediaType = mediaFile.type.startsWith("image") ? "image" : "video";
    const { error: insertError } = await supabase.from("posts").insert([{ user_id: user.id, media_url: mediaUrl, media_type: mediaType, caption }]);
    if (insertError) setError(insertError.message);
    else navigate(`/profile/${user.id}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">منشور جديد</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="file" accept="image/*,video/*" onChange={e => setMediaFile(e.target.files?.[0])} className="w-full border p-2 rounded" required />
          <textarea placeholder="وصف (اختياري)" value={caption} onChange={e => setCaption(e.target.value)} className="w-full border p-2 rounded" rows={3} />
          {error && <div className="text-red-500">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-2 rounded">{loading ? "نشر..." : "نشر"}</button>
        </form>
      </div>
    </div>
  );
}