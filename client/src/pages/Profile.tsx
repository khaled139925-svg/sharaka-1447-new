import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

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
    const localUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!localUser) {
      navigate("/");
      return;
    }
    setUser(localUser);
    loadUserData(localUser.id);
  }, []);

  async function loadUserData(userId: string) {
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

  async function loadFollowLists(userId: string) {
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

  const handleUpload = async () => {
    if (!file || !user) {
      alert("❌ اختر ملف أولاً");
      return;
    }
    setUploading(true);
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const safeFileName = `${timestamp}.${extension}`;
    const filePath = `posts/${safeFileName}`;
    const { error: uploadError } = await supabase.storage.from("posts").upload(filePath, file);
    if (uploadError) {
      alert("❌ فشل رفع الملف: " + uploadError.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("posts").getPublicUrl(filePath);
    const mediaUrl = urlData.publicUrl;
    const { error: dbError } = await supabase.from("posts").insert({
      user_id: user.id,
      media_url: mediaUrl,
      media_type: file.type.startsWith("video") ? "video" : "image",
      content: content || "",
    });
    if (dbError) {
      alert("❌ خطأ في حفظ المنشور: " + dbError.message);
      setUploading(false);
      return;
    }
    alert("✅ تم النشر بنجاح");
    setShowUpload(false);
    setContent("");
    setFile(null);
    setUploading(false);
    loadUserData(user.id);
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
    const { data } = await supabase
      .from("consultants")
      .select("id, full_name, avatar_url")
      .neq("id", user.id);
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

  const handleDeletePost = async (postId: any, mediaUrl: string) => {
    if (!confirm("⚠️ هل أنت متأكد من حذف هذا المنشور؟ لا يمكن التراجع.")) return;

    console.log("محاولة حذف المنشور باستخدام media_url:", mediaUrl);

    const { data: post, error: findError } = await supabase
      .from("posts")
      .select("id")
      .eq("media_url", mediaUrl)
      .maybeSingle();

    if (findError || !post) {
      console.error("لم يتم العثور على المنشور:", findError);
      alert("❌ لم يتم العثور على المنشور");
      return;
    }

    console.log("تم العثور على المنشور بالمعرف:", post.id);

    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    if (deleteError) {
      console.error("خطأ في حذف المنشور:", deleteError);
      alert("❌ فشل حذف المنشور: " + deleteError.message);
      return;
    }

    try {
      const filePath = mediaUrl.split('/posts/')[1];
      if (filePath) {
        const { error: storageError } = await supabase.storage.from("posts").remove([filePath]);
        if (storageError) console.error("خطأ في حذف الملف:", storageError);
        else console.log("تم حذف الملف:", filePath);
      }
    } catch (err) {
      console.error("استثناء أثناء حذف الملف:", err);
    }

    setPosts(prevPosts => prevPosts.filter(p => p.media_url !== mediaUrl));
    alert("✅ تم حذف المنشور");
    await loadUserData(user.id);
  };

  const handleEdit = () => {
    setEditing(true);
    setNewName(user.full_name || "");
    setNewBio(user.bio || "");
    setNewSpecialty(user.specialty || "");
    setNewPhone(user.phone || "");
    setNewEmail(user.email || "");
    setNewPassword("");
    setNewAvatar(null);
  };

  const uploadNewAvatar = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `avatar_${user.id}_${Date.now()}.${ext}`;
    const filePath = `avatars/${fileName}`;
    const { error } = await supabase.storage.from("media").upload(filePath, file);
    if (error) return null;
    const { data } = supabase.storage.from("media").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const saveEdit = async () => {
    const updates: any = {};
    if (newName !== user.full_name) updates.full_name = newName;
    if (newBio !== user.bio) updates.bio = newBio;
    if (newSpecialty !== user.specialty) updates.specialty = newSpecialty;
    if (newPhone !== user.phone) updates.phone = newPhone;
    if (newEmail !== user.email) updates.email = newEmail;
    if (newPassword.trim() !== "") updates.password = newPassword;

    let avatarUrl = user.avatar_url;
    if (newAvatar) {
      setAvatarUploading(true);
      const uploadedUrl = await uploadNewAvatar(newAvatar);
      if (uploadedUrl) avatarUrl = uploadedUrl;
      else alert("⚠️ فشل رفع الصورة");
      setAvatarUploading(false);
    }
    if (avatarUrl !== user.avatar_url) updates.avatar_url = avatarUrl;

    if (Object.keys(updates).length === 0 && avatarUrl === user.avatar_url) {
      setEditing(false);
      return;
    }

    const { error } = await supabase
      .from("consultants")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      alert("❌ فشل التعديل: " + error.message);
      return;
    }

    const updatedUser = { ...user, ...updates, avatar_url: avatarUrl };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("✅ تم تعديل الحساب");
    setEditing(false);
    window.location.reload();
  };

  if (!user) return <div style={{ padding: 20 }}>⚠️ جاري التحميل...</div>;

  // هنا تم التعديل: إزالة maxWidth و padding و card، وجعل المنشورات بعرض كامل
  return (
    <div style={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      {/* شريط الرجوع (تم تعديل موقعه قليلاً ليتناسب مع التصميم الجديد) */}
      <div style={{ padding: "10px 16px", background: "#fff", borderBottom: "1px solid #dbdbdb" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>←</button>
      </div>

      {/* معلومات الحساب (بطاقة خارجية ولكن بدون حدود جانبية) */}
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
          <div>🔧 {user.specialty || "بدون تخصص"}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, margin: "10px 0" }}>
          <span>📌 {posts.length} منشور</span>
          <span>👥 {followersCount} متابع</span>
        </div>

        {editing && (
          <div style={{ marginTop: 10 }}>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} style={input} placeholder="الاسم الكامل" />
            <textarea value={newBio} onChange={(e) => setNewBio(e.target.value)} style={input} placeholder="نبذة" rows={2} />
            <input value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} style={input} placeholder="التخصص" />
            <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} style={input} placeholder="رقم الجوال" />
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={input} placeholder="البريد الإلكتروني" />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={input} placeholder="كلمة مرور جديدة" />
            <input type="file" accept="image/*" onChange={(e) => setNewAvatar(e.target.files?.[0] || null)} />
            <button style={btnGreen} onClick={saveEdit} disabled={avatarUploading}>
              {avatarUploading ? "جاري رفع الصورة..." : "حفظ جميع التعديلات"}
            </button>
            <button style={{ ...btnRed, marginTop: 5 }} onClick={() => setEditing(false)}>إلغاء</button>
          </div>
        )}

        <div style={btnRow}>
          <button style={btnBlue} onClick={handleEdit}>تعديل الحساب</button>
          <button style={btnPurple} onClick={() => setShowUpload(true)}>إضافة منشور</button>
        </div>

        {showUpload && (
          <div style={{ marginTop: 20 }}>
            <textarea placeholder="اكتب وصفاً (اختياري)..." value={content} onChange={(e) => setContent(e.target.value)} style={input} rows={2} />
            <input type="file" accept="image/*,video/*" onChange={(e: any) => setFile(e.target.files[0])} />
            <button style={btnPurple} onClick={handleUpload} disabled={uploading}>
              {uploading ? "جاري النشر..." : "نشر"}
            </button>
            <button style={btnRed} onClick={() => setShowUpload(false)}>إلغاء</button>
          </div>
        )}
      </div>

      {/* عرض المنشورات - بدون أي إطارات، بعرض كامل */}
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
              <button
                onClick={() => handleDeletePost(post.id, post.media_url)}
                style={{ position: "absolute", top: 10, left: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: 20, padding: "5px 10px", cursor: "pointer", fontSize: 12, zIndex: 2 }}
              >
                🗑️ حذف
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

      {/* مودال التعليقات - نافذة منبثقة كبيرة */}
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

      {/* مودال عرض المنشور مكبر (ملء الشاشة) */}
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

      {/* مودال المشاركة الداخلية - نافذة أكبر */}
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
            <h3>{showFollowing ? "الحسابات التي أتابعها" : "المتابعون لي"}</h3>
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

// الأنماط (جميعها موجودة ولم نمسح شيئاً)
const card = { background: "#fff", padding: 20, borderRadius: 16, textAlign: "center" as const, boxShadow: "0 5px 20px rgba(0,0,0,0.1)" };
const avatar = { width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "auto", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 };
const btnRow = { display: "flex", gap: 10, justifyContent: "center", marginTop: 15 };
const input = { width: "100%", padding: 10, marginTop: 10, borderRadius: 8, border: "1px solid #ddd", fontFamily: "inherit" };
const btnBlue = { background: "#3b82f6", color: "#fff", padding: "10px 15px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnGreen = { background: "#22c55e", color: "#fff", padding: "10px 15px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnPurple = { background: "#8b5cf6", color: "#fff", padding: "10px 15px", border: "none", borderRadius: 8, cursor: "pointer" };
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
const modalContentSmall = { background: "#fff", padding: 20, borderRadius: 12, width: 300, textAlign: "center" as const };
const closeModalBtn = { position: "absolute", top: 10, right: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer" };