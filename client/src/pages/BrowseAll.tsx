import { useEffect, useState } from "react";
import MemberCard from "../components/ui/MemberCard";

interface Member {
  id: number;
  name: string;
  specialty: string;
  country?: string;
  bio: string;
  image: string;
}

export default function BrowseAll() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => {
        if (!res.ok) throw new Error("فشل الاتصال");
        return res.json();
      })
      .then((data) => {
        setMembers(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", minHeight: "100vh", background: "#f5f7fb" }}>
        <p style={{ fontSize: "18px", color: "#1976D2" }}>جاري تحميل الأعضاء...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: "40px", textAlign: "center", minHeight: "100vh", background: "#f5f7fb" }}>
        <p style={{ fontSize: "18px", color: "red" }}>حدث خطأ أثناء تحميل البيانات.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", background: "#f5f7fb", minHeight: "100vh", direction: "rtl" }}>
      <h2 style={{ marginBottom: "30px", color: "#1976D2", fontSize: "26px", fontWeight: "bold" }}>
        تصفح جميع الأعضاء
      </h2>

      {members.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>
          لا يوجد أعضاء مسجلون حتى الآن.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}