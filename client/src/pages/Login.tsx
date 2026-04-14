import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/")}
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 40,
        cursor: "pointer"
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "2px solid #2563eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "#2563eb",
          fontSize: 26,
          animation: "pulse 2s infinite"
        }}
      >
        SH
      </div>
    </div>
  );
}