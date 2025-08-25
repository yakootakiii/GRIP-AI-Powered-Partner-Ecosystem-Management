import React from "react";

const InsightCard = ({ icon: Icon, title, subtitle }) => (
  <div style={{
    backgroundColor: "#fff7ed",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  }}>
    <div style={{
      width: "32px",
      height: "32px",
      backgroundColor: "#fed7aa",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {Icon && <Icon size={16} color="#c2410c" />}
    </div>
    <div>
      <h4 style={{ fontWeight: "600", fontSize: "14px", marginBottom: "2px" }}>
        {title}
      </h4>
      <p style={{ fontSize: "12px", color: "#6b7280" }}>{subtitle}</p>
    </div>
  </div>
);

export default InsightCard;
