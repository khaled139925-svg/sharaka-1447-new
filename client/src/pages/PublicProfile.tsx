import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// دالة تنظيف رقم الهاتف لواتساب (تحذف كل ما ليس رقماً وتزيل 00 من البداية)
const normalizePhone = (phone: string) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.substring(2);
  }
  return cleaned;
};

export default function PublicProfile() {
  const navigate = useNavigate();
  const [viewUser, setViewUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikesMap, setUserLikesMap] = useState<Record<string, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    receiver_name: "",
    receiver_phone: "",
    service: "",
    price: "",
    payment_method: ""
  });

  useEffect(() => {
    const storedCurrentUser = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(storedCurrentUser);

    const viewUserStr = localStorage.getItem("viewUser");
    if (!viewUserStr) {
      navigate("/");
      return;
    }
    const viewUserObj = JSON.parse(viewUserStr);
    setViewUser(viewUserObj);

    const isOwn = storedCurrentUser && storedCurrentUser.id === viewUserObj.id;
    setIsOwnProfile(isOwn);

    loadUserData(viewUserObj.id);
    setLoading(false);
  }, []);

  async function loadUserData(userId: number) {
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setPosts(postsData || []);
    if (postsData) {
      await loadPostsInteractions(postsData);
    }

    const { count } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", userId);
    setFollowersCount(count || 0);

    await loadFollowLists(userId);
  }

  async function loadPostsInteractions(postsArray: any[]) {
    const currentUserId = currentUser?.id;
    const likesCounts: Record<string, number> = {};
    const userLikes: Record<string, boolean> = {};
    const comments: Record<string, any[]> = {};

    for (const post of postsArray) {
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);
      likesCounts[post.id] = count || 0;

      if (currentUserId) {
        const { data: likeData } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", currentUserId)
          .maybeSingle();
        userLikes[post.id] = !!likeData;
      }

      const { data: commentsData } = await supabase
        .from("comments")
        .select("*, consultants(full_name, avatar_url)")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });
      comments[post.id] = commentsData || [];
    }
    setLikesMap(likesCounts);
    setUserLikesMap(userLikes);
    setCommentsMap(comments);
  }

  async function loadFollowLists(userId: number) {
    const { data: following } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId);
    if (following && following.length > 0) {
      const followingIds = following.map(f => f.following_id);
      const { data: followingUsers } = await supabase
        .from("consultants")
        .select("id, full_name, avatar_url, specialty")
        .in("id", followingIds);
      setFollowingList(followingUsers || []);
    } else {
      setFollowingList([]);
    }

    const { data: followers } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("following_id", userId);
    if (followers && followers.length > 0) {
      const followerIds = followers.map(f => f.follower_id);
      const { data: followersUsers } = await supabase
        .from("consultants")
        .select("id, full_name, avatar_url, specialty")
        .in("id", followerIds);
      setFollowersList(followersUsers || []);
    } else {
      setFollowersList([]);
    }
  }

  const handleLike = async (postId: string) => {
    if (!currentUser?.id) {
      alert("يجب تسجيل الدخول أولاً للإعجاب");
      return;
    }
    if (userLikesMap[postId]) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", currentUser.id);
      setLikesMap(prev => ({ ...prev, [postId]: prev[postId] - 1 }));
      setUserLikesMap(prev => ({ ...prev, [postId]: false }));
    } else {
      await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: currentUser.id });
      setLikesMap(prev => ({ ...prev, [postId]: prev[postId] + 1 }));
      setUserLikesMap(prev => ({ ...prev, [postId]: true }));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!currentUser?.id) {
      alert("يجب تسجيل الدخول أولاً لإضافة تعليق");
      return;
    }
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;
    const { error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: currentUser.id, content: commentText });
    if (!error) {
      const { data: commentsData } = await supabase
        .from("comments")
        .select("*, consultants(full_name, avatar_url)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      setCommentsMap(prev => ({ ...prev, [postId]: commentsData || [] }));
      setNewComment(prev => ({ ...prev, [postId]: "" }));
    }
  };

  const handleEdit = () => navigate("/profile");

  if (!viewUser) return <div style={{ padding: 20 }}>⚠️ جاري التحميل...</div>;
  if (loading) return <div style={{ padding: 20 }}>⏳ جاري التحقق...</div>;

  const mediaContainer = {
    position: "relative" as const,
    width: "100%",
    aspectRatio: "1 / 1",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
  };
  const mediaStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    cursor: "pointer",
  };
  const zoomBtn = {
    position: "absolute" as const,
    top: 10,
    right: 10,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: 12,
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <button onClick={() => { localStorage.removeItem("viewUser"); navigate("/"); }} style={btnRed}>رجوع</button>
      <div style={card}>
        <div style={avatar}>
          {viewUser.avatar_url ? <img src={viewUser.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
        </div>
        <h2>{viewUser.full_name}</h2>
        <p>{viewUser.bio || "لا يوجد نبذة"}</p>
        <div style={{ margin: "10px 0", color: "#555" }}>
          {/* رقم الهاتف قابل للضغط ويفتح واتساب مباشرة */}
          {viewUser.phone && (
            <div style={{ marginBottom: 5 }}>
              <strong>واتساب:</strong>{" "}
              <a
                href={`https://wa.me/${normalizePhone(viewUser.phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#25D366",
                  fontWeight: "bold",
                  textDecoration: "none",
                  direction: "ltr",
                  display: "inline-block",
                  background: "#25D366",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: 6,
                  marginTop: 4,
                }}
              >
                📱 {viewUser.phone}
              </a>
            </div>
          )}
          {isOwnProfile && viewUser.email && <div>📧 {viewUser.email}</div>}
          {viewUser.specialty && <div>🔧 {viewUser.specialty}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, margin: "10px 0" }}>
          <span>📌 {posts.length} منشور</span>
          <span>👥 {followersCount} متابع</span>
        </div>

        {/* أزرار صاحب الحساب فقط (بدون متابعة) */}
        <div style={btnRow}>
          {isOwnProfile && (
            <>
              <button style={btnBlue} onClick={handleEdit}>✏️ تعديل الحساب</button>
              <button style={btnPurple} onClick={() => navigate("/add-store")}>🏪 إضافة متجر</button>
              <button style={btnGreen} onClick={() => setShowInvoiceModal(true)}>🧾 أفادير</button>
              <button style={btnBlue} onClick={() => navigate("/my-invoices")}>📂 فواتيري</button>
            </>
          )}
        </div>

        <div style={{ marginTop: 30 }}>
          <h3>المنشورات</h3>
          {posts.length === 0 && <p>لا توجد منشورات بعد</p>}
          {posts.map((post) => (
            <div key={post.id} style={postCard}>
              <div style={mediaContainer}>
                {post.media_type === "image" ? (
                  <img src={post.media_url} style={mediaStyle} onClick={() => setSelectedPost(post)} />
                ) : (
                  <video src={post.media_url} controls style={mediaStyle} onClick={() => setSelectedPost(post)} />
                )}
                <button onClick={() => setSelectedPost(post)} style={zoomBtn}>🔍 تكبير</button>
              </div>
              {post.content && <p style={{ marginTop: 8 }}>{post.content}</p>}
              <div style={postActions}>
                <button style={actionBtn} onClick={() => handleLike(post.id)}>
                  {userLikesMap[post.id] ? "❤️" : "🤍"} {likesMap[post.id] || 0}
                </button>
                <button style={actionBtn} onClick={() => setShowComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}>
                  💬 {commentsMap[post.id]?.length || 0}
                </button>
              </div>
              {showComments[post.id] && (
                <div style={commentsSection}>
                  {commentsMap[post.id]?.map((c: any) => (
                    <div key={c.id} style={commentItem}>
                      <strong>{c.consultants?.full_name || "مستخدم"}</strong>: {c.content}
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
                    <input
                      type="text"
                      placeholder="اكتب تعليقاً..."
                      value={newComment[post.id] || ""}
                      onChange={(e) => setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      style={{ flex: 1, padding: 5, borderRadius: 8, border: "1px solid #ddd" }}
                    />
                    <button style={btnSmall} onClick={() => handleAddComment(post.id)}>نشر</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedPost && (
          <div style={modalOverlay} onClick={() => setSelectedPost(null)}>
            <div style={modalContent} onClick={(e) => e.stopPropagation()}>
              <button style={closeModalBtn} onClick={() => setSelectedPost(null)}>✖</button>
              {selectedPost.media_type === "image" ? (
                <img src={selectedPost.media_url} style={{ maxWidth: "90%", maxHeight: "80vh" }} />
              ) : (
                <video src={selectedPost.media_url} controls autoPlay style={{ maxWidth: "90%", maxHeight: "80vh" }} />
              )}
              {selectedPost.content && <p>{selectedPost.content}</p>}
            </div>
          </div>
        )}

        {isOwnProfile && showInvoiceModal && (
          <div style={modalOverlay} onClick={() => setShowInvoiceModal(false)}>
            <div style={modalContentSmallStyle} onClick={(e) => e.stopPropagation()}>
              <h3>إنشاء فاتورة</h3>
              <input placeholder="اسم المستلم" value={invoiceData.receiver_name} onChange={e => setInvoiceData({ ...invoiceData, receiver_name: e.target.value })} style={input} />
              <input placeholder="رقم الجوال" value={invoiceData.receiver_phone} onChange={e => setInvoiceData({ ...invoiceData, receiver_phone: e.target.value })} style={input} />
              <input placeholder="الخدمة" value={invoiceData.service} onChange={e => setInvoiceData({ ...invoiceData, service: e.target.value })} style={input} />
              <input placeholder="السعر" type="number" value={invoiceData.price} onChange={e => setInvoiceData({ ...invoiceData, price: e.target.value })} style={input} />
              <input placeholder="طريقة الدفع" value={invoiceData.payment_method} onChange={e => setInvoiceData({ ...invoiceData, payment_method: e.target.value })} style={input} />
              <button style={btnGreen} onClick={async () => {
                let phone = normalizePhone(invoiceData.receiver_phone);
                if (!phone) phone = invoiceData.receiver_phone.replace(/\D/g, "");
                const invoiceText = `🧾 فاتورة جديدة\n\n👤 من: ${currentUser.full_name}\n📞 إلى: ${invoiceData.receiver_phone}\n\n🛠 الخدمة: ${invoiceData.service}\n💰 السعر: ${invoiceData.price}\n💳 الدفع: ${invoiceData.payment_method}`;
                const url = `https://wa.me/${phone}?text=${encodeURIComponent(invoiceText)}`;
                window.open(url, '_blank');
                const { error } = await supabase.from("invoices").insert({
                  sender_id: currentUser.id,
                  sender_name: currentUser.full_name,
                  sender_logo: currentUser.avatar_url,
                  receiver_id: viewUser.id,
                  receiver_name: invoiceData.receiver_name,
                  receiver_phone: invoiceData.receiver_phone,
                  service: invoiceData.service,
                  price: Number(invoiceData.price),
                  payment_method: invoiceData.payment_method
                });
                if (!error) { alert("✅ تم إرسال الفاتورة وحفظها"); setShowInvoiceModal(false); }
                else alert("❌ " + error.message);
              }}>إرسال الفاتورة</button>
              <button style={btnRed} onClick={() => setShowInvoiceModal(false)}>إلغاء</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 20, borderTop: "1px solid #eee", paddingTop: 15 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            <button style={btnSmall} onClick={() => { setShowFollowing(true); setShowFollowers(false); }}>👥 يتابعهم ({followingList.length})</button>
            <button style={btnSmall} onClick={() => { setShowFollowers(true); setShowFollowing(false); }}>👤 متابعوه ({followersList.length})</button>
          </div>
          {showFollowing && (
            <div style={listContainer}>
              <h4>الحسابات التي يتابعها {viewUser.full_name}</h4>
              {followingList.length === 0 && <p>لا يتابع أي حساب بعد</p>}
              {followingList.map(f => (
                <div key={f.id} style={listItem}>
                  <div style={listAvatar}>{f.avatar_url ? <img src={f.avatar_url} style={{ width: 30, height: 30, borderRadius: "50%" }} /> : "👤"}</div>
                  <div><strong>{f.full_name}</strong><br /><small>{f.specialty || ""}</small></div>
                </div>
              ))}
              <button style={btnRedSmall} onClick={() => setShowFollowing(false)}>إغلاق</button>
            </div>
          )}
          {showFollowers && (
            <div style={listContainer}>
              <h4>المتابعون لـ {viewUser.full_name}</h4>
              {followersList.length === 0 && <p>لا يوجد متابعون بعد</p>}
              {followersList.map(f => (
                <div key={f.id} style={listItem}>
                  <div style={listAvatar}>{f.avatar_url ? <img src={f.avatar_url} style={{ width: 30, height: 30, borderRadius: "50%" }} /> : "👤"}</div>
                  <div><strong>{f.full_name}</strong><br /><small>{f.specialty || ""}</small></div>
                </div>
              ))}
              <button style={btnRedSmall} onClick={() => setShowFollowers(false)}>إغلاق</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// الأنماط (نفس الـ styles)
const card = { background: "#fff", padding: 20, borderRadius: 16, textAlign: "center" as const, boxShadow: "0 5px 20px rgba(0,0,0,0.1)" };
const avatar = { width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "auto", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 };
const btnRow = { display: "flex", gap: 10, justifyContent: "center", marginTop: 15 };
const input = { width: "100%", padding: 10, marginTop: 10, borderRadius: 8, border: "1px solid #ddd", fontFamily: "inherit" };
const btnBlue = { background: "#3b82f6", color: "#fff", padding: "10px 15px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnGreen = { background: "#22c55e", color: "#fff", padding: "10px 15px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnPurple = { background: "#8b5cf6", color: "#fff", padding: "10px 15px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnDark = { background: "#111827", color: "#fff", padding: "10px 15px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnRed = { background: "#ef4444", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8, marginBottom: 10, cursor: "pointer" };
const btnSmall = { background: "#e2e8f0", color: "#1e293b", padding: "6px 12px", border: "none", borderRadius: 20, cursor: "pointer", fontSize: 14 };
const btnRedSmall = { background: "#ef4444", color: "#fff", padding: "6px 12px", border: "none", borderRadius: 8, cursor: "pointer", marginTop: 10 };
const listContainer = { marginTop: 15, background: "#f8fafc", padding: 12, borderRadius: 12, maxHeight: 300, overflowY: "auto" as const, textAlign: "left" as const };
const listItem = { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #e2e8f0" };
const listAvatar = { width: 40, height: 40, borderRadius: "50%", overflow: "hidden", background: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" };
const postCard = { marginBottom: 20, border: "1px solid #eee", borderRadius: 12, padding: 10 };
const postActions = { display: "flex", gap: 15, justifyContent: "space-around", marginTop: 10 };
const actionBtn = { background: "transparent", border: "none", cursor: "pointer", fontSize: 16, padding: "5px 10px", borderRadius: 20 };
const commentsSection = { marginTop: 10, padding: 10, background: "#f9f9f9", borderRadius: 8 };
const commentItem = { marginBottom: 5, fontSize: 14 };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalContent = { background: "#fff", padding: 20, borderRadius: 12, maxWidth: "90%", maxHeight: "90%", textAlign: "center" as const };
const modalContentSmallStyle = { background: "#fff", padding: 20, borderRadius: 12, width: "90%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 };
const closeModalBtn = { position: "absolute", top: 10, right: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer" };