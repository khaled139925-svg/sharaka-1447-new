import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import html2canvas from "html2canvas";

const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("00")) cleaned = cleaned.substring(2);
  if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);
  if (cleaned.length <= 9) cleaned = "92" + cleaned;
  return cleaned;
};

export default function Profile() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"ar" | "en">(() => {
    const saved = localStorage.getItem("appLocale");
    return saved === "en" ? "en" : "ar";
  });

  const translations = {
    ar: {
      back: "رجوع",
      loading: "⚠️ جاري التحميل...",
      check: "⏳ جاري التحقق...",
      editProfile: "تعديل الحساب",
      addPost: "إضافة منشور",
      invoice: "🧾 فاتورة",
      myInvoices: "📂 فواتيري",
      noBio: "لا يوجد نبذة",
      noEmail: "غير مضاف",
      noPhone: "غير مضاف",
      noSpecialty: "بدون تخصص",
      posts: "منشور",
      followers: "متابع",
      uploadTitle: "إضافة منشور",
      writeDesc: "اكتب وصفاً (اختياري)...",
      chooseFile: "اختر ملفاً",
      publish: "نشر",
      cancel: "إلغاء",
      publishing: "جاري النشر...",
      noPosts: "لا توجد منشورات بعد",
      zoom: "🔍 تكبير",
      delete: "🗑️ حذف",
      comments: "تعليقات",
      writeComment: "اكتب تعليقاً...",
      postComment: "نشر",
      shareToMember: "إرسال المنشور إلى عضو",
      selectMember: "اختر عضواً",
      optionalMsg: "رسالة (اختياري)",
      send: "إرسال",
      createDocument: "إنشاء مستند",
      receiverName: "اسم المستلم",
      receiverPhone: "رقم الجوال",
      paymentMethod: "طريقة الدفع (اختياري)",
      items: "البنود (بيان - سعر)",
      addItem: "+ إضافة بيان",
      total: "المجموع",
      sendDoc: "إرسال المستند",
      following: "👥 يتابعهم",
      followersList: "👤 متابعوه",
      noFollowing: "لا توجد بيانات",
      noFollowers: "لا توجد بيانات",
      close: "إغلاق",
      editAccount: "تعديل الحساب",
      saveAll: "حفظ جميع التعديلات",
      uploadingAvatar: "جاري رفع الصورة...",
      fullName: "الاسم الكامل",
      bioLabel: "نبذة",
      specialtyLabel: "التخصص",
      phoneLabel: "رقم الجوال",
      emailLabel: "البريد الإلكتروني",
      newPassword: "كلمة مرور جديدة",
      chooseAvatar: "اختر صورة",
      invoiceNumber: "رقم: غير محدد",
      date: "التاريخ",
      from: "من:",
      to: "إلى:",
      description: "البيان",
      price: "السعر",
      stamp: "الختم",
      signature: "التوقيع",
    },
    en: {
      back: "Back",
      loading: "⚠️ Loading...",
      check: "⏳ Checking...",
      editProfile: "Edit Profile",
      addPost: "Add Post",
      invoice: "🧾 Invoice",
      myInvoices: "📂 My Invoices",
      noBio: "No bio",
      noEmail: "Not added",
      noPhone: "Not added",
      noSpecialty: "No specialty",
      posts: "Posts",
      followers: "Followers",
      uploadTitle: "Add Post",
      writeDesc: "Write a description (optional)...",
      chooseFile: "Choose file",
      publish: "Publish",
      cancel: "Cancel",
      publishing: "Publishing...",
      noPosts: "No posts yet",
      zoom: "🔍 Zoom",
      delete: "🗑️ Delete",
      comments: "Comments",
      writeComment: "Write a comment...",
      postComment: "Post",
      shareToMember: "Share post to member",
      selectMember: "Select member",
      optionalMsg: "Message (optional)",
      send: "Send",
      createDocument: "Create document",
      receiverName: "Receiver name",
      receiverPhone: "Phone number",
      paymentMethod: "Payment method (optional)",
      items: "Items (description - price)",
      addItem: "+ Add item",
      total: "Total",
      sendDoc: "Send document",
      following: "👥 Following",
      followersList: "👤 Followers",
      noFollowing: "No data",
      noFollowers: "No data",
      close: "Close",
      editAccount: "Edit account",
      saveAll: "Save all changes",
      uploadingAvatar: "Uploading avatar...",
      fullName: "Full name",
      bioLabel: "Bio",
      specialtyLabel: "Specialty",
      phoneLabel: "Phone number",
      emailLabel: "Email",
      newPassword: "New password",
      chooseAvatar: "Choose image",
      invoiceNumber: "Number: not set",
      date: "Date",
      from: "From:",
      to: "To:",
      description: "Description",
      price: "Price",
      stamp: "Stamp",
      signature: "Signature",
    },
  };
  const t = translations[locale];
  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    setLocale(newLocale);
    localStorage.setItem("appLocale", newLocale);
  };

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

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    type: "invoice",
    receiver_name: "",
    receiver_phone: "",
    items: [{ description: "", price: "" }],
    payment_method: ""
  });
  const [signature, setSignature] = useState<File | null>(null);
  const [stamp, setStamp] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [stampPreview, setStampPreview] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const invoiceRef = useRef<HTMLDivElement>(null);

  const td = { border: "1px solid #ddd", padding: 10, textAlign: "center" as const };
  const total = invoiceData.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  const addItem = () => setInvoiceData({ ...invoiceData, items: [...invoiceData.items, { description: "", price: "" }] });
  const removeItem = (index: number) => setInvoiceData({ ...invoiceData, items: invoiceData.items.filter((_, i) => i !== index) });
  const handleItemChange = (index: number, field: "description" | "price", value: string) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = value;
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!localUser) { navigate("/"); return; }
    setUser(localUser);
    loadUserData(localUser.id);
  }, []);

  async function loadUserData(userId: string) {
    const { data: postsData } = await supabase.from("posts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setPosts(postsData || []);
    if (postsData) await loadPostsInteractions(postsData);
    const { count } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId);
    setFollowersCount(count || 0);
    await loadFollowLists(userId);
  }

  async function loadPostsInteractions(postsArray: any[]) {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const likesCounts: Record<string, number> = {};
    const userLikes: Record<string, boolean> = {};
    const comments: Record<string, any[]> = {};
    for (const post of postsArray) {
      const { count } = await supabase.from("likes").select("*", { count: "exact", head: true }).eq("post_id", post.id);
      likesCounts[post.id] = count || 0;
      if (currentUser.id) {
        const { data: likeData } = await supabase.from("likes").select("id").eq("post_id", post.id).eq("user_id", currentUser.id).maybeSingle();
        userLikes[post.id] = !!likeData;
      }
      const { data: commentsData } = await supabase.from("comments").select("*, consultants(full_name, avatar_url)").eq("post_id", post.id).order("created_at", { ascending: true });
      comments[post.id] = commentsData || [];
    }
    setLikesMap(likesCounts);
    setUserLikesMap(userLikes);
    setCommentsMap(comments);
  }

  async function loadFollowLists(userId: string) {
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

  const handleUpload = async () => {
    if (!file || !user) { alert("❌ اختر ملف أولاً"); return; }
    setUploading(true);
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const safeFileName = `${timestamp}.${extension}`;
    const filePath = `posts/${safeFileName}`;
    const { error: uploadError } = await supabase.storage.from("posts").upload(filePath, file);
    if (uploadError) { alert("❌ فشل رفع الملف: " + uploadError.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("posts").getPublicUrl(filePath);
    const mediaUrl = urlData.publicUrl;
    const { error: dbError } = await supabase.from("posts").insert({ user_id: user.id, media_url: mediaUrl, media_type: file.type.startsWith("video") ? "video" : "image", content: content || "" });
    if (dbError) { alert("❌ خطأ في حفظ المنشور: " + dbError.message); setUploading(false); return; }
    alert("✅ تم النشر بنجاح");
    setShowUpload(false); setContent(""); setFile(null); setUploading(false);
    loadUserData(user.id);
  };

  const handleLike = async (postId: string) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!currentUser.id) { alert("يجب تسجيل الدخول أولاً"); return; }
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
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!currentUser.id) { alert("يجب تسجيل الدخول أولاً"); return; }
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;
    const { error } = await supabase.from("comments").insert({ post_id: postId, user_id: currentUser.id, content: commentText });
    if (!error) {
      const { data: commentsData } = await supabase.from("comments").select("*, consultants(full_name, avatar_url)").eq("post_id", postId).order("created_at", { ascending: true });
      setCommentsMap(prev => ({ ...prev, [postId]: commentsData || [] }));
      setNewComment(prev => ({ ...prev, [postId]: "" }));
    }
  };

  const openShareModal = async (postId: string) => {
    const { data } = await supabase.from("consultants").select("id, full_name, avatar_url").neq("id", user.id);
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
    await supabase.from("messages").insert({ sender_id: currentUser.id, receiver_id: selectedUser.id, post_id: sharePostId, content: messageText });
    alert(`✅ تم إرسال المنشور إلى ${selectedUser.full_name}`);
    setShowShareModal(false);
  };

  const handleDeletePost = async (postId: any, mediaUrl: string) => {
    if (!confirm("⚠️ هل أنت متأكد من حذف هذا المنشور؟ لا يمكن التراجع.")) return;
    const { data: post, error: findError } = await supabase.from("posts").select("id").eq("media_url", mediaUrl).maybeSingle();
    if (findError || !post) { alert("❌ لم يتم العثور على المنشور"); return; }
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", post.id);
    if (deleteError) { alert("❌ فشل حذف المنشور: " + deleteError.message); return; }
    try {
      const filePath = mediaUrl.split('/posts/')[1];
      if (filePath) await supabase.storage.from("posts").remove([filePath]);
    } catch (err) { console.error(err); }
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
    if (Object.keys(updates).length === 0 && avatarUrl === user.avatar_url) { setEditing(false); return; }
    const { error } = await supabase.from("consultants").update(updates).eq("id", user.id);
    if (error) { alert("❌ فشل التعديل: " + error.message); return; }
    const updatedUser = { ...user, ...updates, avatar_url: avatarUrl };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("✅ تم تعديل الحساب");
    setEditing(false);
    window.location.reload();
  };

  const sendInvoice = async () => {
    if (!invoiceRef.current) { alert("❌ لم يتم العثور على الفاتورة"); return; }
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!currentUser.id) { alert("❌ يجب تسجيل الدخول"); return; }
    const cleanedPhone = formatPhoneNumber(invoiceData.receiver_phone);
    if (!cleanedPhone || cleanedPhone.length < 10) { alert("❌ رقم الهاتف غير صحيح"); return; }
    const invNumber = `INV-${Date.now()}`;
    setInvoiceNumber(invNumber);
    const pTag = invoiceRef.current.querySelector("p:first-of-type");
    if (pTag) pTag.innerHTML = `رقم: ${invNumber}`;
    const canvas = await html2canvas(invoiceRef.current, { useCORS: true, scale: 2 });
    canvas.toBlob(async (blob) => {
      if (!blob) { alert("❌ فشل إنشاء الصورة"); return; }
      const fileName = `invoice-${invNumber}.png`;
      const { error: uploadError } = await supabase.storage.from("invoices").upload(fileName, blob, { contentType: "image/png" });
      if (uploadError) { alert("❌ فشل رفع الصورة: " + uploadError.message); return; }
      const { data: urlData } = supabase.storage.from("invoices").getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;
      await supabase.from("invoices").insert({
        sender_id: currentUser.id, sender_name: currentUser.full_name, sender_phone: currentUser.phone, sender_logo: currentUser.avatar_url,
        receiver_name: invoiceData.receiver_name, receiver_phone: invoiceData.receiver_phone, type: invoiceData.type,
        items: invoiceData.items, total: total, payment_method: invoiceData.payment_method, pdf_url: imageUrl, status: "pending"
      });
      const message = `${invoiceData.type === "invoice" ? "فاتورة" : "عرض سعر"}\nرقم: ${invNumber}\n\n${invoiceData.items.map(i => `• ${i.description} - ${i.price}`).join("\n")}\n\nالمجموع: ${total}\n\nرابط الفاتورة:\n${imageUrl}`;
      const encodedMessage = encodeURIComponent(message);
      const waLink1 = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
      const waLink2 = `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${encodedMessage}`;
      const win = window.open(waLink1, "_blank");
      setTimeout(() => { if (!win || win.closed) window.open(waLink2, "_blank"); }, 800);
      alert("✅ تم إرسال الفاتورة وحفظها");
      setShowInvoiceModal(false);
      setInvoiceData({ type: "invoice", receiver_name: "", receiver_phone: "", items: [{ description: "", price: "" }], payment_method: "" });
      setSignature(null); setStamp(null); setSignaturePreview(null); setStampPreview(null); setInvoiceNumber("");
    });
  };

  if (!user) return <div style={{ padding: 20 }}>⚠️ {t.loading}</div>;

  return (
    <div style={{ padding: 20, maxWidth: "100%", margin: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={() => navigate("/")} style={btnRed}>{t.back}</button>
        <button onClick={toggleLanguage} style={{ background: "#f0f0f0", border: "none", borderRadius: 30, padding: "6px 12px", cursor: "pointer", fontWeight: "bold" }}>
          {locale === "ar" ? "🇸🇦 English" : "🇺🇸 العربية"}
        </button>
      </div>
      <div style={card}>
        <div style={avatar}>
          {user.avatar_url ? <img src={user.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
        </div>
        <h2>{user.full_name}</h2>
        <p>{user.bio || t.noBio}</p>
        <div style={{ margin: "10px 0", color: "#555" }}>
          <div>📧 {user.email || t.noEmail}</div>
          <div>📞 {user.phone || t.noPhone}</div>
          <div>🔧 {user.specialty || t.noSpecialty}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, margin: "10px 0" }}>
          <span>📌 {posts.length} {t.posts}</span>
          <span>👥 {followersCount} {t.followers}</span>
        </div>

        {editing && (
          <div style={{ marginTop: 10 }}>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} style={input} placeholder={t.fullName} />
            <textarea value={newBio} onChange={(e) => setNewBio(e.target.value)} style={input} placeholder={t.bioLabel} rows={2} />
            <input value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} style={input} placeholder={t.specialtyLabel} />
            <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} style={input} placeholder={t.phoneLabel} />
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={input} placeholder={t.emailLabel} />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={input} placeholder={t.newPassword} />
            <input type="file" accept="image/*" onChange={(e) => setNewAvatar(e.target.files?.[0] || null)} />
            <button style={btnGreen} onClick={saveEdit} disabled={avatarUploading}>{avatarUploading ? t.uploadingAvatar : t.saveAll}</button>
            <button style={{ ...btnRed, marginTop: 5 }} onClick={() => setEditing(false)}>{t.cancel}</button>
          </div>
        )}

        <div style={btnRow}>
          <button style={btnBlue} onClick={handleEdit}>{t.editProfile}</button>
          <button style={btnPurple} onClick={() => setShowUpload(true)}>{t.addPost}</button>
          <button style={btnGreen} onClick={() => setShowInvoiceModal(true)}>{t.invoice}</button>
          <button style={btnBlue} onClick={() => navigate("/my-invoices")}>{t.myInvoices}</button>
        </div>

        {showUpload && (
          <div style={{ marginTop: 20 }}>
            <textarea placeholder={t.writeDesc} value={content} onChange={(e) => setContent(e.target.value)} style={input} rows={2} />
            <input type="file" accept="image/*,video/*" onChange={(e: any) => setFile(e.target.files[0])} />
            <button style={btnPurple} onClick={handleUpload} disabled={uploading}>{uploading ? t.publishing : t.publish}</button>
            <button style={btnRed} onClick={() => setShowUpload(false)}>{t.cancel}</button>
          </div>
        )}

        <div style={{ marginTop: 30 }}>
          <h3>{t.posts}</h3>
          {posts.length === 0 && <p>{t.noPosts}</p>}
          {posts.map(post => (
            <div key={post.id} style={{ marginBottom: 20, backgroundColor: "#fff" }}>
              <div style={{ position: "relative" }}>
                {post.media_type === "image" ? (
                  <img src={post.media_url} style={{ width: "100%", display: "block", cursor: "pointer" }} onClick={() => setSelectedPost(post)} />
                ) : (
                  <video src={post.media_url} controls style={{ width: "100%", display: "block", cursor: "pointer" }} onClick={() => setSelectedPost(post)} />
                )}
                <button onClick={() => setSelectedPost(post)} style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 20, padding: "5px 10px", cursor: "pointer" }}>{t.zoom}</button>
                <button onClick={() => handleDeletePost(post.id, post.media_url)} style={{ position: "absolute", top: 10, left: 10, background: "#ef4444", color: "#fff", border: "none", borderRadius: 20, padding: "5px 10px", cursor: "pointer", fontSize: 12, zIndex: 2 }}>{t.delete}</button>
              </div>
              {post.content && <p style={{ padding: "8px 12px", margin: 0 }}>{post.content}</p>}
              <div style={{ padding: "4px 12px 12px", display: "flex", gap: 20 }}>
                <button style={actionBtn} onClick={() => handleLike(post.id)}>{userLikesMap[post.id] ? "❤️" : "🤍"} {likesMap[post.id] || 0}</button>
                <button style={actionBtn} onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}>💬 {commentsMap[post.id]?.length || 0}</button>
                <button style={actionBtn} onClick={() => openShareModal(post.id)}>📤 {t.shareToMember}</button>
              </div>
            </div>
          ))}
        </div>

        {Object.keys(showComments).some(key => showComments[key]) && (
          <div style={modalOverlay}>
            <div style={{ ...modalContent, width: "90%", maxWidth: 500, maxHeight: "80%", overflow: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><h4>{t.comments}</h4><button onClick={() => setShowComments({})} style={btnRedSmall}>{t.close}</button></div>
              {(() => {
                const postId = Object.keys(showComments).find(key => showComments[key]);
                if (!postId) return null;
                return (
                  <>
                    {commentsMap[postId]?.map((c: any) => <div key={c.id} style={{ marginBottom: 8 }}><strong>{c.consultants?.full_name || "مستخدم"}</strong>: {c.content}</div>)}
                    <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
                      <input type="text" placeholder={t.writeComment} value={newComment[postId] || ""} onChange={(e) => setNewComment(prev => ({ ...prev, [postId]: e.target.value }))} style={{ flex: 1, padding: 8, borderRadius: 20, border: "1px solid #ddd" }} />
                      <button style={btnSmall} onClick={() => handleAddComment(postId)}>{t.postComment}</button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {selectedPost && (
          <div style={modalOverlay} onClick={() => setSelectedPost(null)}>
            <div style={{ ...modalContent, backgroundColor: "#000" }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedPost(null)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "#fff", fontSize: 30, cursor: "pointer" }}>✖</button>
              {selectedPost.media_type === "image" ? <img src={selectedPost.media_url} style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }} /> : <video src={selectedPost.media_url} controls autoPlay style={{ maxWidth: "90%", maxHeight: "90%" }} />}
              {selectedPost.content && <p style={{ color: "#fff", marginTop: 10 }}>{selectedPost.content}</p>}
            </div>
          </div>
        )}

        {showShareModal && (
          <div style={modalOverlay} onClick={() => setShowShareModal(false)}>
            <div style={{ ...modalContentSmall, width: "90%", maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
              <h4>{t.shareToMember}</h4>
              <select onChange={(e) => { const u = usersList.find(u => u.id === parseInt(e.target.value)); setSelectedUser(u); }} style={{ width: "100%", padding: 8, marginBottom: 10 }}><option value="">{t.selectMember}</option>{usersList.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}</select>
              <textarea placeholder={t.optionalMsg} value={shareMessage} onChange={(e) => setShareMessage(e.target.value)} style={input} rows={3} />
              <button style={btnGreen} onClick={sendInternalShare}>{t.send}</button>
              <button style={btnRed} onClick={() => setShowShareModal(false)}>{t.cancel}</button>
            </div>
          </div>
        )}

        {showInvoiceModal && (
          <div style={modalOverlay} onClick={() => setShowInvoiceModal(false)}>
            <div style={{ ...modalContentSmallStyle, width: "90%", maxWidth: 500, maxHeight: "90%", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
              <h3>{t.createDocument}</h3>
              <select value={invoiceData.type} onChange={(e) => setInvoiceData({ ...invoiceData, type: e.target.value })} style={input}><option value="invoice">{t.invoice}</option><option value="quote">عرض سعر</option></select>
              <input placeholder={t.receiverName} value={invoiceData.receiver_name} onChange={e => setInvoiceData({ ...invoiceData, receiver_name: e.target.value })} style={input} />
              <input placeholder={t.receiverPhone} value={invoiceData.receiver_phone} onChange={e => setInvoiceData({ ...invoiceData, receiver_phone: e.target.value })} style={input} />
              <input placeholder={t.paymentMethod} value={invoiceData.payment_method} onChange={e => setInvoiceData({ ...invoiceData, payment_method: e.target.value })} style={input} />
              <label>{t.items}</label>
              {invoiceData.items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                  <input type="text" placeholder={`البيان ${idx + 1}`} value={item.description} onChange={(e) => handleItemChange(idx, "description", e.target.value)} style={{ flex: 2, ...input }} />
                  <input type="text" placeholder={t.price} value={item.price} onChange={(e) => handleItemChange(idx, "price", e.target.value)} style={{ flex: 1, ...input }} />
                  {invoiceData.items.length > 1 && <button onClick={() => removeItem(idx)} style={{ ...btnRedSmall, padding: "0 10px" }}>✖</button>}
                </div>
              ))}
              <button onClick={addItem} style={{ ...btnGreen, padding: "5px 12px", fontSize: 12 }}>{t.addItem}</button>
              <p style={{ marginTop: 10, fontWeight: "bold" }}>{t.total}: {total}</p>
              <div style={{ marginTop: 10 }}><input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) { setStamp(f); const reader = new FileReader(); reader.onloadend = () => setStampPreview(reader.result as string); reader.readAsDataURL(f); } }} /><br />
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) { setSignature(f); const reader = new FileReader(); reader.onloadend = () => setSignaturePreview(reader.result as string); reader.readAsDataURL(f); } }} /></div>
              {stampPreview && <img src={stampPreview} style={{ width: 50, height: 50 }} />}
              {signaturePreview && <img src={signaturePreview} style={{ width: 50, height: 50 }} />}
              <div ref={invoiceRef} id="invoice" style={{ width: 800, padding: 30, background: "#fff", fontFamily: "Arial", direction: "rtl", color: "#000", position: "absolute", top: -9999, left: -9999 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><h2>{invoiceData.type === "invoice" ? "فاتورة" : "عرض سعر"}</h2><p>{t.invoiceNumber} {invoiceNumber || "غير محدد"}</p><p>{t.date}: {new Date().toLocaleDateString()}</p></div>
                  {user.avatar_url && <img src={user.avatar_url} crossOrigin="anonymous" style={{ width: 80 }} />}
                </div>
                <hr />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                  <div><h4>{t.from}</h4><p>{user.full_name}</p><p>{user.phone}</p></div>
                  <div><h4>{t.to}</h4><p>{invoiceData.receiver_name}</p><p>{invoiceData.receiver_phone}</p></div>
                </div>
                <table style={{ width: "100%", marginTop: 30, borderCollapse: "collapse" }}>
                  <thead><tr style={{ background: "#f3f4f6" }}><th style={td}>{t.description}</th><th style={td}>{t.price}</th></tr></thead>
                  <tbody>{invoiceData.items.map((item, i) => <tr key={i}><td style={td}>{item.description}</td><td style={td}>{item.price}</td></tr>)}</tbody>
                </table>
                <div style={{ marginTop: 20, fontWeight: "bold" }}>{t.total}: {total}</div>
                <div style={{ marginTop: 20 }}><p><strong>{t.paymentMethod}:</strong> {invoiceData.payment_method}</p></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 60 }}>
                  <div><p>{t.stamp}</p>{stampPreview ? <img src={stampPreview} width="120" /> : (user.avatar_url && <img src={user.avatar_url} width="80" />)}</div>
                  <div><p>{t.signature}</p>{signaturePreview ? <img src={signaturePreview} width="120" /> : (user.avatar_url && <img src={user.avatar_url} width="80" />)}</div>
                </div>
              </div>
              <button style={btnGreen} onClick={sendInvoice}>{t.sendDoc}</button>
              <button style={btnRed} onClick={() => setShowInvoiceModal(false)}>{t.cancel}</button>
            </div>
          </div>
        )}

        {(showFollowing || showFollowers) && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#fff", zIndex: 1000, overflowY: "auto", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3>{showFollowing ? t.following : t.followersList}</h3>
              <button onClick={() => { setShowFollowing(false); setShowFollowers(false); }} style={btnRedSmall}>{t.close}</button>
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
    </div>
  );
}

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
const actionBtn = { background: "transparent", border: "none", cursor: "pointer", fontSize: 16, padding: "5px 10px", borderRadius: 20 };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalContent = { background: "#fff", padding: 20, borderRadius: 12, maxWidth: "90%", maxHeight: "90%", textAlign: "center" as const };
const modalContentSmall = { background: "#fff", padding: 20, borderRadius: 12, width: 300, textAlign: "center" as const };
const modalContentSmallStyle = { background: "#fff", padding: 20, borderRadius: 12, width: "90%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 10 };