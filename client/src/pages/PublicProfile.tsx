import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function PublicProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [loading, setLoading] = useState(true);

  // States للتفاعلات
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikesMap, setUserLikesMap] = useState<Record<string, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePostId, setSharePostId] = useState<string | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const viewUserStr = localStorage.getItem("viewUser");
    if (!viewUserStr) {
      navigate("/");
      return;
    }
    const viewUser = JSON.parse(viewUserStr);
    setUser(viewUser);
    loadUserData(viewUser.id);
    checkIfFollowing(viewUser.id);
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
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const likesCounts: Record<string, number> = {};
    const userLikes: Record<string, boolean> = {};
    const comments: Record<string, any[]> = {};

    for (const post of postsArray) {
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);
      likesCounts[post.id] = count || 0;

      if (currentUser.id) {
        const { data: likeData } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", currentUser.id)
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

  async function checkIfFollowing(followingId: number) {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!currentUser.id) {
      setIsFollowing(false);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", currentUser.id)
      .eq("following_id", followingId)
      .maybeSingle();
    setIsFollowing(!!data);
    setLoading(false);
  }

  const handleFollow = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!currentUser.id) {
      alert("يجب تسجيل الدخول أولاً");
      return;
    }

    if (isFollowing) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUser.id)
        .eq("following_id", user.id);
      if (!error) {
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        alert("✅ تم إلغاء المتابعة");
        loadFollowLists(user.id);
      } else {
        alert("❌ فشل إلغاء المتابعة: " + error.message);
      }
    } else {
      const { error } = await supabase
        .from("follows")
        .insert({ follower_id: currentUser.id, following_id: user.id });
      if (!error) {
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        alert("✅ تمت المتابعة");
        loadFollowLists(user.id);
      } else {
        alert("❌ فشلت المتابعة: " + error.message);
      }
    }
  };

  const handleLike = async (postId: string) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!currentUser.id) {
      alert("يجب تسجيل الدخول أولاً");
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
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!currentUser.id) {
      alert("يجب تسجيل الدخول أولاً");
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

  const openShareModal = async (postId: string) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const { data } = await supabase
      .from("consultants")
      .select("id, full_name, avatar_url")
      .neq("id", currentUser.id || 0);
    setUsersList(data || []);
    setSharePostId(postId);
    setSelectedUser(null);
    setShareMessage("");
    setShowShareModal(true);
  };

  const sendInternalShare = async () => {
    if (!selectedUser || !sharePostId) return;
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const post = posts.find(p => p.id === sharePostId);
    const messageText = shareMessage || `شاركك ${currentUser.full_name} منشوراً: ${post?.content || "منشور"}`;
    await supabase.from("messages").insert({
      sender_id: currentUser.id,
      receiver_id: selectedUser.id,
      post_id: sharePostId,
      content: messageText
    });
    alert(`✅ تم إرسال المنشور إلى ${selectedUser.full_name}`);
    setShowShareModal(false);
  };

  const shareWhatsApp = (post: any) => {
    const url = window.location.origin + `/post/${post.id}`;
    const text = `${post.content || "شاهد هذا المنشور"} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleWhatsAppMessage = () => {
    if (!user.phone) {
      alert(`عذراً، ${user.full_name} لم يُضف رقم هاتف للتواصل عبر واتساب بعد.`);
      return;
    }
    let phone = user.phone.replace(/[\s\-\(\)]/g, '');
    if (phone.startsWith('0')) {
      phone = phone.substring(1);
    }
    const whatsappLink = `https://wa.me/${phone}`;
    window.open(whatsappLink, '_blank');
  };

  if (!user) return <div style={{ padding: 20 }}>⚠️ جاري التحميل...</div>;
  if (loading) return <div style={{ padding: 20 }}>⏳ جاري التحقق...</div>;

  return (
    // تصميم جديد بنفس طريقة Profile: بدون maxWidth وبدون card، وشريط علوي بسيط
    <div style={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      {/* شريط الرجوع */}
      <div style={{ padding: "10px 16px", background: "#fff", borderBottom: "1px solid #dbdbdb" }}>
        <button onClick={() => {
          localStorage.removeItem("viewUser");
          navigate("/");
        }} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>←</button>
      </div>

      {/* معلومات الحساب (بدون حدود جانبية) */}
      <div style={{ padding: "16px", background: "#fff", borderBottom: "1px solid #dbdbdb" }}>
        <div style={avatar}>
          {user.avatar_url ? (
            <img src={user.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : "👤"}
        </div>
        <h2>{user.full_name}</h2>
        <p>{user.bio || "لا يوجد نبذة"}</p>
        <div style={{ margin: "10px 0", color: "#555" }}>
          <div>📧 {user.email || "غير مضاف"}</div>
          <div>📞 {user.phone || "غير مضاف"}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, margin: "10px 0" }}>
          <span>📌 {posts.length} منشور</span>
          <span>👥 {followersCount} متابع</span>
        </div>
        <div style={btnRow}>
          <button style={btnDark} onClick={handleWhatsAppMessage}>💬 واتساب</button>
          <button style={isFollowing ? btnRed : btnGreen} onClick={handleFollow}>
            {isFollowing ? "إلغاء المتابعة" : "متابعة"}
          </button>
        </div>
      </div>

      {/* عرض المنشورات - بعرض كامل بدون إطارات */}
      <div>
        {posts.length === 0 && <p style={{ textAlign: "center", padding: 20 }}>لا توجد منشورات بعد</p>}
        {posts.map(post => (
          <div key={post.id} style={{ marginBottom: 20, backgroundColor: "#fff" }}>
            <div style={{ position: "relative" }}>
              {post.media_type === "image" ? (
                <img
                  src={post.media_url}
                  style={{ width: "100%", display: "block", cursor: "pointer" }}
                  onClick={() => setSelectedPost(post)}
                />
              ) : (
                <video
                  src={post.media_url}
                  controls
                  style={{ width: "100%", display: "block", cursor: "pointer" }}
                  onClick={() => setSelectedPost(post)}
                />
              )}
              <button
                onClick={() => setSelectedPost(post)}
                style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 20, padding: "5px 10px", cursor: "pointer" }}
              >
                🔍 تكبير
              </button>
            </div>
            {post.content && <p style={{ padding: "8px 12px", margin: 0 }}>{post.content}</p>}
            <div style={{ padding: "4px 12px 12px", display: "flex", gap: 20 }}>
              <button style={actionBtn} onClick={() => handleLike(post.id)}>
                {userLikesMap[post.id] ? "❤️" : "🤍"} {likesMap[post.id] || 0}
              </button>
              <button style={actionBtn} onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}>
                💬 {commentsMap[post.id]?.length || 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* مودال التعليقات (نافذة منبثقة كبيرة) */}
      {Object.keys(showComments).some(key => showComments[key]) && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            backgroundColor: "#fff",
            width: "90%",
            maxWidth: 500,
            maxHeight: "80%",
            borderRadius: 12,
            overflow: "auto",
            padding: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <h4>التعليقات</h4>
              <button onClick={() => setShowComments({})} style={btnRedSmall}>إغلاق</button>
            </div>
            {(() => {
              const postId = Object.keys(showComments).find(key => showComments[key]);
              if (!postId) return null;
              return (
                <>
                  {commentsMap[postId]?.map((c: any) => (
                    <div key={c.id} style={{ marginBottom: 8 }}>
                      <strong>{c.consultants?.full_name || "مستخدم"}</strong>: {c.content}
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
                    <input
                      type="text"
                      placeholder="اكتب تعليقاً..."
                      value={newComment[postId] || ""}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [postId]: e.target.value }))}
                      style={{ flex: 1, padding: 8, borderRadius: 20, border: "1px solid #ddd" }}
                    />
                    <button style={btnSmall} onClick={() => handleAddComment(postId)}>نشر</button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* مودال تكبير المنشور (ملء الشاشة) */}
      {selectedPost && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#000",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }} onClick={() => setSelectedPost(null)}>
          <button
            onClick={() => setSelectedPost(null)}
            style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "#fff", fontSize: 30, cursor: "pointer" }}
          >✖</button>
          {selectedPost.media_type === "image" ? (
            <img src={selectedPost.media_url} style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }} />
          ) : (
            <video src={selectedPost.media_url} controls autoPlay style={{ maxWidth: "90%", maxHeight: "90%" }} />
          )}
          {selectedPost.content && <p style={{ color: "#fff", marginTop: 10 }}>{selectedPost.content}</p>}
        </div>
      )}

      {/* مودال المشاركة الداخلية */}
      {showShareModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }} onClick={() => setShowShareModal(false)}>
          <div style={{
            backgroundColor: "#fff",
            width: "90%",
            maxWidth: 400,
            padding: 20,
            borderRadius: 12,
          }} onClick={(e) => e.stopPropagation()}>
            <h4>إرسال المنشور إلى عضو</h4>
            <select onChange={(e) => {
              const user = usersList.find(u => u.id === parseInt(e.target.value));
              setSelectedUser(user);
            }} style={{ width: "100%", padding: 8, marginBottom: 10 }}>
              <option value="">اختر عضواً</option>
              {usersList.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
            </select>
            <textarea placeholder="رسالة (اختياري)" value={shareMessage} onChange={(e) => setShareMessage(e.target.value)} style={input} rows={3} />
            <button style={btnGreen} onClick={sendInternalShare}>إرسال</button>
            <button style={btnRed} onClick={() => setShowShareModal(false)}>إلغاء</button>
          </div>
        </div>
      )}

      {/* قوائم المتابعة - تفتح كصفحة كاملة */}
      {(showFollowing || showFollowers) && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#fff",
          zIndex: 1000,
          overflowY: "auto",
          padding: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3>{showFollowing ? "الحسابات التي يتابعها" : "المتابعون"}</h3>
            <button onClick={() => { setShowFollowing(false); setShowFollowers(false); }} style={btnRedSmall}>إغلاق</button>
          </div>
          {(showFollowing ? followingList : followersList).length === 0 && <p>لا توجد بيانات</p>}
          {(showFollowing ? followingList : followersList).map(f => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", overflow: "hidden", background: "#ccc" }}>
                {f.avatar_url ? <img src={f.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
              </div>
              <div><strong>{f.full_name}</strong><br /><small>{f.specialty || ""}</small></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// الأنماط (تم الحفاظ على جميع الأنماط القديمة وإضافة الأنماط الجديدة)
const avatar = { width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "auto", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 };
const btnRow = { display: "flex", gap: 10, justifyContent: "center", marginTop: 15 };
const input = { width: "100%", padding: 10, marginTop: 10, borderRadius: 8, border: "1px solid #ddd", fontFamily: "inherit" };
const btnGreen = { background: "#22c55e", color: "#fff", padding: "10px 15px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnDark = { background: "#111827", color: "#fff", padding: "10px 15px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnRed = { background: "#ef4444", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8, marginBottom: 10, cursor: "pointer" };
const btnSmall = { background: "#e2e8f0", color: "#1e293b", padding: "6px 12px", border: "none", borderRadius: 20, cursor: "pointer", fontSize: 14 };
const btnRedSmall = { background: "#ef4444", color: "#fff", padding: "6px 12px", border: "none", borderRadius: 8, cursor: "pointer", marginTop: 10 };
const listContainer = { marginTop: 15, background: "#f8fafc", padding: 12, borderRadius: 12, maxHeight: 300, overflowY: "auto" as const, textAlign: "left" as const };
const listItem = { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #e2e8f0" };
const listAvatar = { width: 40, height: 40, borderRadius: "50%", overflow: "hidden", background: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" };
const postActions = { display: "flex", gap: 15, justifyContent: "space-around", marginTop: 10 };
const actionBtn = { background: "transparent", border: "none", cursor: "pointer", fontSize: 16, padding: "5px 10px", borderRadius: 20 };
const commentsSection = { marginTop: 10, padding: 10, background: "#f9f9f9", borderRadius: 8 };
const commentItem = { marginBottom: 5, fontSize: 14 };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalContent = { background: "#fff", padding: 20, borderRadius: 12, maxWidth: "90%", maxHeight: "90%", textAlign: "center" as const };
const modalContentSmall = { background: "#fff", padding: 20, borderRadius: 12, width: 300, textAlign: "center" as const };
const closeModalBtn = { position: "absolute", top: 10, right: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer" };