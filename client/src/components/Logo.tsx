import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Logo() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/")}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 220,
        cursor: "pointer"
      }}
    >
      <img
        src={logo}
        alt="logo"
        style={{
          width: 180,
          animation: "pulse 2.5s infinite ease-in-out"
        }}
      />
    </div>
  );
}