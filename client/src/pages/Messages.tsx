import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Send, ArrowRight, MessageSquare, User, Mail, Phone } from 'lucide-react';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface User {
  id: number;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  profile_image: string;
  specialty: string;
}

export default function Messages() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [showConversations, setShowConversations] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (currentUser && userId) {
      loadOtherUser();
      loadMessages();
    } else if (currentUser && !userId) {
      loadConversations();
    }
  }, [currentUser, userId]);

  const checkUser = () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(userData));
    setLoading(false);
  };

  const loadOtherUser = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("consultants")
      .select("*")
      .eq("id", parseInt(userId))
      .single();
    if (data) setOtherUser(data);
  };

  const loadMessages = async () => {
    if (!currentUser || !userId) return;
    
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUser.id})`)
      .order("created_at", { ascending: true });
    
    if (data) {
      setMessages(data);
      // تحديث الرسائل كمقروءة
      const unreadMessages = data.filter(m => m.receiver_id === currentUser.id && !m.is_read);
      for (const msg of unreadMessages) {
        await supabase.from("messages").update({ is_read: true }).eq("id", msg.id);
      }
    }
  };

  const loadConversations = async () => {
    if (!currentUser) return;
    
    // جلب جميع المحادثات
    const { data: sentMessages } = await supabase
      .from("messages")
      .select("*")
      .eq("sender_id", currentUser.id);
    
    const { data: receivedMessages } = await supabase
      .from("messages")
      .select("*")
      .eq("receiver_id", currentUser.id);
    
    const allMessages = [...(sentMessages || []), ...(receivedMessages || [])];
    const userIds = new Set<number>();
    allMessages.forEach(m => {
      if (m.sender_id !== currentUser.id) userIds.add(m.sender_id);
      if (m.receiver_id !== currentUser.id) userIds.add(m.receiver_id);
    });
    
    const conversationsList = [];
    for (const uid of userIds) {
      const { data: userData } = await supabase
        .from("consultants")
        .select("id, full_name, company_name, email, phone, profile_image, specialty")
        .eq("id", uid)
        .single();
      
      const userMessages = allMessages.filter(m => m.sender_id === uid || m.receiver_id === uid);
      const lastMessage = userMessages.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      const unreadCount = userMessages.filter(m => m.receiver_id === currentUser.id && !m.is_read).length;
      
      if (userData) {
        conversationsList.push({
          user: userData,
          lastMessage: lastMessage,
          unreadCount: unreadCount
        });
      }
    }
    
    conversationsList.sort((a, b) => 
      new Date(b.lastMessage?.created_at).getTime() - new Date(a.lastMessage?.created_at).getTime()
    );
    
    setConversations(conversationsList);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !userId) return;
    
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      sender_id: currentUser.id,
      receiver_id: parseInt(userId),
      message: newMessage,
    });
    
    if (!error) {
      setNewMessage("");
      loadMessages();
      // تحديث المحادثات إذا كنا في صفحة المحادثات
      if (!userId) loadConversations();
    }
    setSending(false);
  };

  const selectConversation = (uid: number) => {
    setSelectedConversation(uid);
    navigate(`/messages/${uid}`);
    setShowConversations(false);
  };

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const { data } = supabase.storage.from('media').getPublicUrl(url);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9800] mx-auto"></div>
      </div>
    );
  }

  // إذا كان هناك userId في الرابط (محادثة مع شخص معين)
  if (userId && otherUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* رأس المحادثة */}
          <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex items-center justify-between">
            <button
              onClick={() => {
                navigate("/messages");
                setShowConversations(true);
              }}
              className="flex items-center gap-2 text-[#1976D2] hover:text-[#FF9800]"
            >
              <ArrowRight size={20} />
              <span>العودة للمحادثات</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1976D2] to-[#FF9800] flex items-center justify-center text-white">
                {(otherUser.full_name || otherUser.company_name || "م")[0]}
              </div>
              <div>
                <h2 className="font-bold">{otherUser.full_name || otherUser.company_name}</h2>
                <p className="text-xs text-gray-500">{otherUser.specialty || "مستشار"}</p>
              </div>
            </div>
          </div>
          
          {/* منطقة الرسائل */}
          <div className="bg-white rounded-2xl shadow-md h-[60vh] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMine = msg.sender_id === currentUser?.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${isMine ? "bg-[#1976D2] text-white" : "bg-gray-100 text-gray-800"}`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                  <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                  <p>لا توجد رسائل بعد</p>
                  <p className="text-sm">أرسل أول رسالة لبدء المحادثة</p>
                </div>
              )}
            </div>
            
            {/* منطقة كتابة الرسالة */}
            <div className="border-t p-4 flex gap-2">
              <textarea
                rows={1}
                className="flex-1 border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
                placeholder="اكتب رسالتك..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="bg-[#FF9800] text-white px-4 py-2 rounded-xl hover:bg-orange-500 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={18} />
                <span className="hidden sm:inline">إرسال</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // صفحة قائمة المحادثات
  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-[#FF9800]">الرسائل</h1>
          <p className="text-gray-500">المحادثات والمراسلات</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {conversations.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">لا توجد محادثات بعد</p>
              <p className="text-sm text-gray-400 mt-2">ابدأ بالتواصل مع المستشارين من صفحاتهم الشخصية</p>
              <button
                onClick={() => navigate("/browse")}
                className="mt-6 bg-[#1976D2] text-white px-6 py-2 rounded-lg hover:bg-[#1565C0]"
              >
                تصفح المستشارين
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => (
                <div
                  key={conv.user.id}
                  onClick={() => selectConversation(conv.user.id)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1976D2] to-[#FF9800] flex items-center justify-center text-white">
                      {(conv.user.full_name || conv.user.company_name || "م")[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{conv.user.full_name || conv.user.company_name}</h3>
                        {conv.unreadCount > 0 && (
                          <span className="bg-[#FF9800] text-white text-xs px-2 py-0.5 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {conv.lastMessage?.message || "بدء المحادثة"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {conv.lastMessage && new Date(conv.lastMessage.created_at).toLocaleString("ar-SA")}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}