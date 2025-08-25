import React from "react";

const StatCard = ({ title, value, isMobile, style = {} }) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      border: "1px solid #f3f4f6",
      height: isMobile ? "auto" : "128px", // ✅ uses isMobile
      ...style,
    }}
  >
    <h3 style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
      {title}
    </h3>
    <p style={{ fontSize: "30px", fontWeight: "bold", color: "#111827" }}>
      {value}
    </p>
  </div>
);

export default StatCard;
