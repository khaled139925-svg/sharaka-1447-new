import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="logo-container">
      <img
        src="/logo.png"
        alt=""
        className="logo"
        onClick={() => navigate("/browse")}
      />
    </div>
  );
}