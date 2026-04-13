import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const { id } = useParams();

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) getUser();
  }, [id]);

  async function getUser() {
    setLoading(true);

    // 🔥 جلب المستخدم بالـ ID
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log("خطأ:", error);
      setLoading(false);
      return;
    }

    setUser(userData);

    // 🔥 جلب المنشورات
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userData.id);

    setPosts(postsData || []);
    setLoading(false);
  }

  // ⛔ منع التعليق اللانهائي
  if (loading) return <p style={{ padding: 20 }}>جاري التحميل...</p>;

  if (!user) return <p style={{ padding: 20 }}>المستخدم غير موجود</p>;

  return (
    <div className="profile-page">

      {/* الهيدر */}
      <div className="profile-header">

        {/* الصورة */}
        <div
          className="profile-avatar"
          style={{
            backgroundImage: `url(${user.avatar || "https://via.placeholder.com/150"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100px",
            height: "100px",
            borderRadius: "50%"
          }}
        ></div>

        {/* المعلومات */}
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="bio">{user.bio || "لا يوجد وصف"}</p>

          <div className="actions">
            <button className="follow">متابعة</button>
            <button className="message">مراسلة</button>
          </div>
        </div>

      </div>

      {/* المنشورات */}
      <div className="posts-grid">
        {posts.length === 0 && <p>لا توجد منشورات</p>}

        {posts.map((p) => (
          <div key={p.id} className="post">
            <img
              src={p.image || "https://via.placeholder.com/300"}
              alt=""
            />
          </div>
        ))}
      </div>

    </div>
  );
}