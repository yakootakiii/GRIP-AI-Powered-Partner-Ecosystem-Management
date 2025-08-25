import React, {useState} from "react";
import InvestorDashboard from "../InvestorDashboard";

const Opportunities = ({ isMobile, onAnalyze }) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const opportunities = [
    {
      id: 1,
      title: "Instant health loans",
      priority: "High Priority",
      priorityColor: "#f97316",
      projectedROI: "340%",
      timeline: "6 months",
      partners: ["Ayala Healthcare", "Globe Telecom"],
      confidence: "93%",
      profileText:
        "Healthcare fintech startup providing instant medical loans to underserved populations. Uses AI for credit scoring and partners with major healthcare providers. Strong growth trajectory with 40% month-over-month user acquisition.",
      transactionsFile: "health-loans-transactions.csv",
      paymentsFile: "health-loans-payments.csv",
    },
    {
      id: 2,
      title: "Climate-based Insurance",
      priority: "Medium Priority",
      priorityColor: "#eab308",
      projectedROI: "185%",
      timeline: "8 months",
      partners: ["Weather Analytics", "AgriTech Corp"],
      confidence: "78%",
      profileText:
        "Insurtech company offering climate-risk insurance for farmers and small businesses. Uses satellite data and weather analytics for precise risk assessment. Growing demand due to climate change impacts.",
      transactionsFile: "climate-insurance-transactions.csv",
      paymentsFile: "climate-insurance-payments.csv",
    },
    {
      id: 3,
      title: "Rural MSMEs Cash Flow",
      priority: "High Priority",
      priorityColor: "#f97316",
      projectedROI: "185%",
      timeline: "6 months",
      partners: ["AgriTech Corp", "Rural Bank Network"],
      confidence: "78%",
      profileText:
        "Fintech platform providing working capital loans to rural micro, small and medium enterprises. Focus on agricultural supply chain financing with digital-first approach and alternative credit scoring.",
      transactionsFile: "rural-msmes-transactions.csv",
      paymentsFile: "rural-msmes-payments.csv",
    },
  ];

if (selectedOpportunity) {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      <InvestorDashboard
        initialData={selectedOpportunity}
        onBack={() => setSelectedOpportunity(null)}
      />
    </div>
  );
}



  // const handleAnalyze = (opportunity) => {
  //   const payload = {
  //     profileText: opportunity.profileText,
  //     transactionsFile: opportunity.transactionsFile,
  //     paymentsFile: opportunity.paymentsFile,
  //     title: opportunity.title,
  //   };

  //   console.log("Opportunities -> onAnalyze payload:", payload);

  //   if (onAnalyze) {
  //     onAnalyze(payload);  // ✅ This will go back to App.js
  //   } else {
  //     console.warn("onAnalyze prop is not provided");
  //   }
  // };

  console.log("✅ Opportunities component mounted");
  console.log("onAnalyze prop received:", onAnalyze);

 return (
  <div style={{ padding: isMobile ? "16px" : "24px" }}>
    {isMobile && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src="/logo.png"
            alt="Grip Logo"
            style={{
              width: "40px",
              height: "32px",
              borderRadius: "8px",
            }}
          />
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            Grip
          </span>
        </div>
      </div>
    )}

    {/* Page Header */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        flexDirection: isMobile ? "column" : "row",
        marginBottom: "24px",
        gap: isMobile ? "8px" : 0,
      }}
    >
      <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#111827" }}>
        AI-Discovered Opportunities
      </h1>
      <p style={{ color: "#6b7280", fontSize: "14px" }}>
        {opportunities.length} Active
      </p>
    </div>

    {/* Cards */}
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {opportunities.map((opportunity) => (
        <div
          key={opportunity.id}
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "20px",
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {/* Title + Priority */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1d1d1f",
              }}
            >
              {opportunity.title}
            </h2>
            <span
              style={{
                backgroundColor: opportunity.priorityColor,
                color: "white",
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {opportunity.priority}
            </span>
          </div>

          {/* Metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Projected ROI
              </p>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                {opportunity.projectedROI}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                Timeline
              </p>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                {opportunity.timeline}
              </p>
            </div>
          </div>

          {/* Partners */}
          <div style={{ marginBottom: "16px" }}>
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginBottom: "6px",
              }}
            >
              Key Partners
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {opportunity.partners.map((partner, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "11px",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    color: "#111827",
                  }}
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                }}
              />
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                Confidence: {opportunity.confidence}
              </span>
            </div>
            <button
              style={{
                backgroundColor: "#f97316",
                color: "white",
                padding: "6px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => setSelectedOpportunity(opportunity)}
            >
              Analyze
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default Opportunities;
