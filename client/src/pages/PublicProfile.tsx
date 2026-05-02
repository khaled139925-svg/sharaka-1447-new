import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const normalizePhone = (phone: string) => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("00")) cleaned = cleaned.substring(2);
  return cleaned;
};

export default function PublicProfile() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"ar" | "en">(() => {
    const saved = localStorage.getItem("appLocale");
    return saved === "en" ? "en" : "ar";
  });

  const translations = {
    ar: {
      back: "رجوع",
      noBio: "لا يوجد نبذة",
      noSpecialty: "بدون تخصص",
      noPhone: "غير مضاف",
      postsCount: "منشور",
      followersCount: "متابع",
      editProfile: "✏️ تعديل الحساب",
      addStore: "🏪 إضافة متجر",
      invoice: "🧾 أفادير",
      myInvoices: "📂 فواتيري",
      postsTitle: "المنشورات",
      noPosts: "لا توجد منشورات بعد",
      zoom: "🔍 تكبير",
      comments: "تعليقات",
      writeComment: "اكتب تعليقاً...",
      postComment: "نشر",
      createInvoice: "إنشاء فاتورة",
      receiverName: "اسم المستلم",
      receiverPhone: "رقم الجوال",
      service: "الخدمة",
      price: "السعر",
      paymentMethod: "طريقة الدفع",
      sendInvoice: "إرسال الفاتورة",
      cancel: "إلغاء",
      following: "👥 يتابعهم",
      followers: "👤 متابعوه",
      noFollowing: "لا يتابع أي حساب بعد",
      noFollowers: "لا يوجد متابعون بعد",
      close: "إغلاق",
      readMore: "اقرأ المزيد",
      readLess: "عرض أقل",
    },
    en: {
      back: "Back",
      noBio: "No bio",
      noSpecialty: "No specialty",
      noPhone: "Not added",
      postsCount: "Posts",
      followersCount: "Followers",
      editProfile: "✏️ Edit Profile",
      addStore: "🏪 Add Store",
      invoice: "🧾 Invoice",
      myInvoices: "📂 My Invoices",
      postsTitle: "Posts",
      noPosts: "No posts yet",
      zoom: "🔍 Zoom",
      comments: "Comments",
      writeComment: "Write a comment...",
      postComment: "Post",
      createInvoice: "Create Invoice",
      receiverName: "Receiver name",
      receiverPhone: "Phone number",
      service: "Service",
      price: "Price",
      paymentMethod: "Payment method",
      sendInvoice: "Send invoice",
      cancel: "Cancel",
      following: "👥 Following",
      followers: "👤 Followers",
      noFollowing: "Not following anyone yet",
      noFollowers: "No followers yet",
      close: "Close",
      readMore: "Read more",
      readLess: "Show less",
    },
  };
  const t = translations[locale];
  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    setLocale(newLocale);
    localStorage.setItem("appLocale", newLocale);
  };

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
  const [expandedBio, setExpandedBio] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikesMap, setUserLikesMap] = useState<Record<string, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({ receiver_name: "", receiver_phone: "", service: "", price: "", payment_method: "" });

  useEffect(() => {
    const storedCurrentUser = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(storedCurrentUser);
    const viewUserStr = localStorage.getItem("viewUser");
    if (!viewUserStr) { navigate("/"); return; }
    const viewUserObj = JSON.parse(viewUserStr);
    setViewUser(viewUserObj);
    setIsOwnProfile(storedCurrentUser && storedCurrentUser.id === viewUserObj.id);
    loadUserData(viewUserObj.id);
    setLoading(false);
  }, []);

  async function loadUserData(userId: number) {
    const { data: postsData } = await supabase.from("posts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setPosts(postsData || []);
    if (postsData) await loadPostsInteractions(postsData);
    const { count } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId);
    setFollowersCount(count || 0);
    await loadFollowLists(userId);
  }

  async function loadPostsInteractions(postsArray: any[]) {
    const currentUserId = currentUser?.id;
    const likesCounts: Record<string, number> = {};
    const userLikes: Record<string, boolean> = {};
    const comments: Record<string, any[]> = {};
    for (const post of postsArray) {
      const { count } = await supabase.from("likes").select("*", { count: "exact", head: true }).eq("post_id", post.id);
      likesCounts[post.id] = count || 0;
      if (currentUserId) {
        const { data: likeData } = await supabase.from("likes").select("id").eq("post_id", post.id).eq("user_id", currentUserId).maybeSingle();
        userLikes[post.id] = !!likeData;
      }
      const { data: commentsData } = await supabase.from("comments").select("*, consultants(full_name, avatar_url)").eq("post_id", post.id).order("created_at", { ascending: true });
      comments[post.id] = commentsData || [];
    }
    setLikesMap(likesCounts);
    setUserLikesMap(userLikes);
    setCommentsMap(comments);
  }

  async function loadFollowLists(userId: number) {
    const { data: following } = await supabase.from("follows").select("following_id").eq("follower_id", userId);
    if (following?.length) {
      const followingIds = following.map(f => f.following_id);
      const { data: followingUsers } = await supabase.from("consultants").select("id, full_name, avatar_url, specialty").in("id", followingIds);
      setFollowingList(followingUsers || []);
    } else setFollowingList([]);
    const { data: followers } = await supabase.from("follows").select("follower_id").eq("following_id", userId);
    if (followers?.length) {
      const followerIds = followers.map(f => f.follower_id);
      const { data: followersUsers } = await supabase.from("consultants").select("id, full_name, avatar_url, specialty").in("id", followerIds);
      setFollowersList(followersUsers || []);
    } else setFollowersList([]);
  }

  const handleLike = async (postId: string) => {
    if (!currentUser?.id) { alert("يجب تسجيل الدخول أولاً للإعجاب"); return; }
    if (userLikesMap[postId]) {
      await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", currentUser.id);
      setLikesMap(prev => ({ ...prev, [postId]: prev[postId] - 1 }));
      setUserLikesMap(prev => ({ ...prev, [postId]: false }));
    } else {
      await supabase.from("likes").insert({ post_id: postId, user_id: currentUser.id });
      setLikesMap(prev => ({ ...prev, [postId]: prev[postId] + 1 }));
      setUserLikesMap(prev => ({ ...prev, [postId]: true }));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!currentUser?.id) { alert("يجب تسجيل الدخول أولاً لإضافة تعليق"); return; }
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;
    const { error } = await supabase.from("comments").insert({ post_id: postId, user_id: currentUser.id, content: commentText });
    if (!error) {
      const { data: commentsData } = await supabase.from("comments").select("*, consultants(full_name, avatar_url)").eq("post_id", postId).order("created_at", { ascending: true });
      setCommentsMap(prev => ({ ...prev, [postId]: commentsData || [] }));
      setNewComment(prev => ({ ...prev, [postId]: "" }));
    }
  };

  const handleEdit = () => navigate("/profile");

  // ✅ دالة PDF الجديدة التي تلتقط المعلومات الشخصية وكل منشور في صفحة منفصلة
  const generateFullPDF = async () => {
    if (!viewUser) return;
    
    const loadingToast = document.createElement("div");
    loadingToast.innerText = "جاري إنشاء PDF، يرجى الانتظار...";
    loadingToast.style.position = "fixed";
    loadingToast.style.bottom = "20px";
    loadingToast.style.left = "50%";
    loadingToast.style.transform = "translateX(-50%)";
    loadingToast.style.backgroundColor = "#333";
    loadingToast.style.color = "#fff";
    loadingToast.style.padding = "10px 20px";
    loadingToast.style.borderRadius = "8px";
    loadingToast.style.zIndex = "9999";
    document.body.appendChild(loadingToast);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // 1. التقاط معلومات الملف الشخصي (بدون المنشورات)
      const profileElement = document.getElementById("profile-info-only");
      if (profileElement) {
        // استنساخ وإخفاء الأزرار غير المرغوب فيها
        const cloneProfile = profileElement.cloneNode(true) as HTMLElement;
        const hiddenSelectors = [".zoom-btn", ".interaction-buttons", ".comment-input-area", ".profile-email", ".read-more-btn"];
        hiddenSelectors.forEach(sel => {
          cloneProfile.querySelectorAll(sel).forEach(el => (el as HTMLElement).style.display = "none");
        });
        cloneProfile.style.padding = "20px";
        cloneProfile.style.backgroundColor = "#fff";
        cloneProfile.style.width = "100%";
        cloneProfile.style.position = "absolute";
        cloneProfile.style.top = "-9999px";
        cloneProfile.style.left = "-9999px";
        document.body.appendChild(cloneProfile);
        const canvas = await html2canvas(cloneProfile, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
        document.body.removeChild(cloneProfile);
      }

      // 2. التقاط كل منشور على حدة
      const postElements = document.querySelectorAll(".post-item-for-pdf");
      for (let i = 0; i < postElements.length; i++) {
        const postEl = postElements[i] as HTMLElement;
        const clonePost = postEl.cloneNode(true) as HTMLElement;
        // إخفاء أزرار التكبير والتفاعلات
        const hiddenSelectors = [".zoom-btn", ".interaction-buttons", ".comment-input-area"];
        hiddenSelectors.forEach(sel => {
          clonePost.querySelectorAll(sel).forEach(el => (el as HTMLElement).style.display = "none");
        });
        clonePost.style.padding = "12px";
        clonePost.style.backgroundColor = "#fff";
        clonePost.style.width = "100%";
        clonePost.style.position = "absolute";
        clonePost.style.top = "-9999px";
        clonePost.style.left = "-9999px";
        document.body.appendChild(clonePost);
        const canvas = await html2canvas(clonePost, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
        document.body.removeChild(clonePost);
      }

      pdf.save(`${viewUser.full_name || "profile"}_full.pdf`);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إنشاء PDF");
    } finally {
      document.body.removeChild(loadingToast);
    }
  };

  if (!viewUser) return <div style={{ padding: 20 }}>⚠️ جاري التحميل...</div>;
  if (loading) return <div style={{ padding: 20 }}>⏳ جاري التحقق...</div>;

  const zoomBtnStyle = { position: "absolute" as const, top: 10, right: 10, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 20, padding: "5px 10px", cursor: "pointer", fontSize: 12, zIndex: 2 };

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      {/* شريط علوي مع زر PDF */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { localStorage.removeItem("viewUser"); navigate("/"); }} style={btnRed}>{t.back}</button>
          <button onClick={generateFullPDF} style={{ ...btnBlue, marginLeft: 0 }}>📄 PDF كامل</button>
        </div>
        <button onClick={toggleLanguage} style={{ background: "#f0f0f0", border: "none", borderRadius: 30, padding: "6px 12px", cursor: "pointer", fontWeight: "bold", fontSize: 14 }}>{locale === "ar" ? "🇸🇦 English" : "🇺🇸 العربية"}</button>
      </div>

      {/* المنطقة التي سيتم تصديرها (كل محتوى الملف الشخصي والمنشورات) */}
        {/* معلومات الملف الشخصي - مع id للتصدير */}
        <div id="profile-info-only" style={{ padding: "20px 16px", backgroundColor: "#fff", borderBottom: "1px solid #eee", textAlign: "center" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "0 auto 12px auto", background: "#eee" }}>
            {viewUser.avatar_url ? <img src={viewUser.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
          </div>
          <h2 style={{ margin: "0 0 4px 0" }}>{viewUser.full_name}</h2>
          <div style={{ marginTop: 8, textAlign: "center" }}>
            {viewUser.bio ? (
              <>
                <p className="profile-bio" style={{ whiteSpace: "pre-line", wordBreak: "break-word", margin: 0 }}>
                  {expandedBio ? viewUser.bio : `${viewUser.bio.substring(0, 100)}${viewUser.bio.length > 100 ? "..." : ""}`}
                </p>
                {viewUser.bio.length > 100 && (
                  <button className="read-more-btn" onClick={() => setExpandedBio(!expandedBio)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 13, marginTop: 4 }}>
                    {expandedBio ? t.readLess : t.readMore}
                  </button>
                )}
              </>
            ) : <p>{t.noBio}</p>}
          </div>
          <div style={{ marginTop: 12 }}>
            {viewUser.phone && (
              <div>
                <a href={`https://api.whatsapp.com/send?phone=${normalizePhone(viewUser.phone)}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#25D366", color: "#fff", padding: "6px 12px", borderRadius: 20, textDecoration: "none", fontSize: 14 }}>
                  📱 {viewUser.phone}
                </a>
              </div>
            )}
            {isOwnProfile && viewUser.email && (
              <div className="profile-email" style={{ marginTop: 4 }}>📧 {viewUser.email}</div>
            )}
            {viewUser.specialty && <div>🔧 {viewUser.specialty}</div>}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16 }}>
            <span>📌 {posts.length} {t.postsCount}</span>
            <span>👥 {followersCount} {t.followersCount}</span>
          </div>
          {isOwnProfile && (
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
              <button style={{ background: "#3b82f6", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 8, cursor: "pointer" }} onClick={handleEdit}>{t.editProfile}</button>
              <button style={{ background: "#8b5cf6", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 8, cursor: "pointer" }} onClick={() => navigate("/add-store")}>{t.addStore}</button>
              <button style={{ background: "#22c55e", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 8, cursor: "pointer" }} onClick={() => setShowInvoiceModal(true)}>{t.invoice}</button>
              <button style={{ background: "#3b82f6", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 8, cursor: "pointer" }} onClick={() => navigate("/my-invoices")}>{t.myInvoices}</button>
            </div>
          )}
        </div>

        {/* المنشورات - مع كلاس للتصدير */}
        <div>
          <h3 style={{ padding: "12px 16px", margin: 0, borderBottom: "1px solid #eee" }}>{t.postsTitle}</h3>
          {posts.length === 0 && <p style={{ padding: 20, textAlign: "center" }}>{t.noPosts}</p>}
          {posts.map((post) => (
            <div key={post.id} className="post-item-for-pdf" style={{ backgroundColor: "#fff", marginBottom: 16, borderBottom: "1px solid #eee" }}>
              <div style={{ position: "relative" }}>
                {post.media_type === "image" ? (
                  <img src={post.media_url} style={{ width: "100%", display: "block" }} />
                ) : (
                  <video src={post.media_url} controls style={{ width: "100%", display: "block" }} />
                )}
                <button className="zoom-btn" onClick={() => setSelectedPost(post)} style={zoomBtnStyle}>🔍 {t.zoom}</button>
              </div>
              {post.content && <p style={{ padding: 12, margin: 0 }}>{post.content}</p>}
              <div className="interaction-buttons" style={{ padding: "8px 12px", display: "flex", gap: 20, borderTop: "1px solid #f0f0f0" }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }} onClick={() => handleLike(post.id)}>{userLikesMap[post.id] ? "❤️" : "🤍"} {likesMap[post.id] || 0}</button>
                <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }} onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}>💬 {commentsMap[post.id]?.length || 0}</button>
              </div>
              {showComments[post.id] && (
                <div className="comment-input-area" style={{ padding: 12, borderTop: "1px solid #eee", backgroundColor: "#f9f9f9" }}>
                  {commentsMap[post.id]?.map((c: any) => <div key={c.id} style={{ marginBottom: 8 }}><strong>{c.consultants?.full_name || "مستخدم"}</strong>: {c.content}</div>)}
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input type="text" placeholder={t.writeComment} value={newComment[post.id] || ""} onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))} style={{ flex: 1, padding: 8, borderRadius: 20, border: "1px solid #ddd" }} />
                    <button style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 20, padding: "8px 16px", cursor: "pointer" }} onClick={() => handleAddComment(post.id)}>{t.postComment}</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      {/* باقي المودالات خارج منطقة التصدير */}
      {selectedPost && (
        <div style={modalOverlay} onClick={() => setSelectedPost(null)}>
          <div style={{ ...modalContent, backgroundColor: "#000" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedPost(null)} style={{ position: "absolute", top: 20, right: 20, background: "#ef4444", border: "none", borderRadius: "50%", width: 36, height: 36, color: "#fff", fontSize: 20, cursor: "pointer" }}>✖</button>
            {selectedPost.media_type === "image" ? <img src={selectedPost.media_url} style={{ maxWidth: "90%", maxHeight: "80vh", objectFit: "contain" }} /> : <video src={selectedPost.media_url} controls autoPlay style={{ maxWidth: "90%", maxHeight: "80vh" }} />}
            {selectedPost.content && <p style={{ color: "#fff", marginTop: 10 }}>{selectedPost.content}</p>}
          </div>
        </div>
      )}

      {showAvatarModal && viewUser.avatar_url && (
        <div style={modalOverlay} onClick={() => setShowAvatarModal(false)}>
          <div style={{ ...modalContent, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAvatarModal(false)} style={{ position: "absolute", top: 20, right: 20, background: "#ef4444", border: "none", borderRadius: "50%", width: 36, height: 36, color: "#fff", fontSize: 20, cursor: "pointer" }}>✖</button>
            <img src={viewUser.avatar_url} style={{ maxWidth: "90%", maxHeight: "80vh", objectFit: "contain", borderRadius: 8 }} />
          </div>
        </div>
      )}

      {isOwnProfile && showInvoiceModal && (
        <div style={modalOverlay} onClick={() => setShowInvoiceModal(false)}>
          <div style={{ ...modalContentSmallStyle, maxWidth: 500, width: "90%" }} onClick={(e) => e.stopPropagation()}>
            <h3>{t.createInvoice}</h3>
            <input placeholder={t.receiverName} value={invoiceData.receiver_name} onChange={e => setInvoiceData({ ...invoiceData, receiver_name: e.target.value })} style={inputModal} />
            <input placeholder={t.receiverPhone} value={invoiceData.receiver_phone} onChange={e => setInvoiceData({ ...invoiceData, receiver_phone: e.target.value })} style={inputModal} />
            <input placeholder={t.service} value={invoiceData.service} onChange={e => setInvoiceData({ ...invoiceData, service: e.target.value })} style={inputModal} />
            <input placeholder={t.price} type="number" value={invoiceData.price} onChange={e => setInvoiceData({ ...invoiceData, price: e.target.value })} style={inputModal} />
            <input placeholder={t.paymentMethod} value={invoiceData.payment_method} onChange={e => setInvoiceData({ ...invoiceData, payment_method: e.target.value })} style={inputModal} />
            <button style={{ background: "#22c55e", color: "#fff", padding: "10px", borderRadius: 8, border: "none", cursor: "pointer" }} onClick={async () => {
              let phone = normalizePhone(invoiceData.receiver_phone);
              if (!phone) phone = invoiceData.receiver_phone.replace(/\D/g, "");
              const invoiceText = `🧾 فاتورة جديدة\n\n👤 من: ${currentUser.full_name}\n📞 إلى: ${invoiceData.receiver_phone}\n\n🛠 الخدمة: ${invoiceData.service}\n💰 السعر: ${invoiceData.price}\n💳 الدفع: ${invoiceData.payment_method}`;
              window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(invoiceText)}`, '_blank');
              const { error } = await supabase.from("invoices").insert({ sender_id: currentUser.id, sender_name: currentUser.full_name, sender_logo: currentUser.avatar_url, receiver_id: viewUser.id, receiver_name: invoiceData.receiver_name, receiver_phone: invoiceData.receiver_phone, service: invoiceData.service, price: Number(invoiceData.price), payment_method: invoiceData.payment_method });
              if (!error) { alert("✅ تم إرسال الفاتورة وحفظها"); setShowInvoiceModal(false); } else alert("❌ " + error.message);
            }}>{t.sendInvoice}</button>
            <button style={{ background: "#ef4444", color: "#fff", padding: "10px", borderRadius: 8, border: "none", cursor: "pointer" }} onClick={() => setShowInvoiceModal(false)}>{t.cancel}</button>
          </div>
        </div>
      )}

      {(showFollowing || showFollowers) && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#fff", zIndex: 1100, overflowY: "auto", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3>{showFollowing ? t.following : t.followers}</h3>
            <button onClick={() => { setShowFollowing(false); setShowFollowers(false); }} style={{ background: "#ef4444", color: "#fff", padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer" }}>إغلاق</button>
          </div>
          {(showFollowing ? followingList : followersList).length === 0 && <p>{showFollowing ? t.noFollowing : t.noFollowers}</p>}
          {(showFollowing ? followingList : followersList).map(f => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", overflow: "hidden", background: "#ccc" }}>{f.avatar_url ? <img src={f.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}</div>
              <div><strong>{f.full_name}</strong><br /><small>{f.specialty || ""}</small></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const modalOverlay: any = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalContent: any = { background: "#fff", padding: 20, borderRadius: 12, maxWidth: "90%", maxHeight: "90%", textAlign: "center", position: "relative" };
const modalContentSmallStyle: any = { background: "#fff", padding: 20, borderRadius: 12, display: "flex", flexDirection: "column", gap: 10 };
const inputModal: any = { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd" };
const btnRed = { background: "#ef4444", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8, cursor: "pointer" };
const btnBlue = { background: "#3b82f6", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 8, cursor: "pointer" };