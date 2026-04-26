import React, { useState, useEffect } from "react";
import { Menu, X, Home, User, Settings, LogOut, Shield, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MenuDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setCurrentUser(user);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("viewUser");
    setCurrentUser(null);
    navigate("/");
    closeMenu();
  };

  return (
    <>
      <button onClick={toggleMenu} style={menuButton}>
        <Menu size={28} color="#333" />
      </button>

      {isOpen && <div style={overlay} onClick={closeMenu} />}

      <div style={{ ...drawer, transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={drawerHeader}>
          <h3>القائمة</h3>
          <button onClick={closeMenu} style={closeBtn}>
            <X size={24} />
          </button>
        </div>
        <div style={drawerContent}>
          <button onClick={() => { navigate("/"); closeMenu(); }} style={menuItem}>
            <Home size={20} /> الرئيسية
          </button>
          {currentUser ? (
            <>
              <button onClick={() => { navigate("/profile"); closeMenu(); }} style={menuItem}>
                <User size={20} /> ملفي الشخصي
              </button>
              {/* زر فواتيري */}
              <button onClick={() => { navigate("/my-invoices"); closeMenu(); }} style={menuItem}>
                <FileText size={20} /> فواتيري
              </button>
              {currentUser.is_admin && (
                <>
                  <button onClick={() => { navigate("/admin"); closeMenu(); }} style={menuItem}>
                    <Shield size={20} /> لوحة التحكم
                  </button>
                  <button onClick={() => { navigate("/admin-settings"); closeMenu(); }} style={menuItem}>
                    <Settings size={20} /> إعدادات الاشتراك
                  </button>
                </>
              )}
              <button onClick={handleLogout} style={{ ...menuItem, color: "#ef4444" }}>
                <LogOut size={20} /> تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { navigate("/login"); closeMenu(); }} style={menuItem}>
                تسجيل الدخول
              </button>
              <button onClick={() => { navigate("/signup"); closeMenu(); }} style={menuItem}>
                إنشاء حساب
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const menuButton: React.CSSProperties = {
  position: "fixed",
  top: "16px",
  left: "16px",
  zIndex: 100,
  background: "#fff",
  border: "none",
  borderRadius: "50%",
  width: "44px",
  height: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const overlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 1000,
};

const drawer: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  width: "280px",
  backgroundColor: "#fff",
  boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
  zIndex: 1001,
  transition: "transform 0.3s ease",
  display: "flex",
  flexDirection: "column",
};

const drawerHeader: React.CSSProperties = {
  padding: "20px",
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const closeBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

const drawerContent: React.CSSProperties = {
  flex: 1,
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const menuItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  background: "transparent",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
  width: "100%",
  textAlign: "left",
  transition: "background 0.2s",
};

export default MenuDrawer;