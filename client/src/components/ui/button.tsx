import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, style, ...props }: ButtonProps) => {
  return (
    <button
      style={{
        background: "#FF9800",
        color: "#fff",
        padding: "12px 25px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};