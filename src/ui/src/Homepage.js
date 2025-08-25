// src/Homepage.js

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import { Home, Users, Target, AlertTriangle, TrendingUp } from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import Opportunities from "./pages/OpportunitiesNew";
import Risk from "./pages/Risk";
import InvestorDashboard from "./InvestorDashboard";

const GripDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sidebar nav style
  const getNavButtonStyle = (path) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 6px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    backgroundColor: currentPath === path ? "#fff7ed" : "transparent",
    color: currentPath === path ? "#c2410c" : "#374151",
    textDecoration: "none"
  });

  // Bottom nav style
  const getBottomNavButtonStyle = (path) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "8px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: currentPath === path ? "#ea580c" : "#6b7280",
    textDecoration: "none"
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        maxWidth: isMobile ? "448px" : "100%",
        margin: "0 auto"
      }}
    >
      {/* Desktop Header */}
      {!isMobile && (
        <div
          style={{
            backgroundColor: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: "24px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              maxWidth: "1280px",
              margin: "0 auto"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src="public/logo.png"
                alt="Grip Logo"
                style={{ width: "40px", height: "32px", borderRadius: "8px" }}
              />
              <span
                style={{ fontSize: "30px", fontWeight: "bold", color: "#111827" }}
              >
                Grip
              </span>
            </div>
            <div style={{ display: "flex", gap: "32px", color: "#6b7280" }}>
              <span>
                Total Partners:{" "}
                <span style={{ fontWeight: "600", color: "#111827" }}>127</span>
              </span>
              <span>
                Avg Trust Score:{" "}
                <span style={{ fontWeight: "600", color: "#111827" }}>89.5</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div style={{ flex: 1, display: isMobile ? "block" : "flex" }}>
        {/* Sidebar (desktop only) */}
        {!isMobile && (
          <div
            style={{
              width: "320px",
              backgroundColor: "white",
              borderRight: "1px solid #e5e7eb",
              padding: "24px"
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link to="/" style={getNavButtonStyle("/")}>
                <Home style={{ width: "24px", height: "24px" }} /> Dashboard
              </Link>
              <Link to="/partners" style={getNavButtonStyle("/partners")}>
                <Users style={{ width: "24px", height: "24px" }} /> Partners
              </Link>
              <Link to="/opportunities" style={getNavButtonStyle("/opportunities")}>
                <Target style={{ width: "24px", height: "24px" }} /> AI Opportunities
              </Link>
              <Link to="/risk" style={getNavButtonStyle("/risk")}>
                <AlertTriangle style={{ width: "24px", height: "24px" }} /> Risk Metrics
              </Link>
            </nav>
          </div>
        )}

        {/* Page Content */}
        <div style={{ flex: 1, padding: isMobile ? "0" : "24px" }}>
          <div
            style={{
              backgroundColor: isMobile ? "transparent" : "white",
              borderRadius: isMobile ? "0" : "16px",
              boxShadow: isMobile ? "none" : "0 1px 3px rgba(0,0,0,0.1)",
              border: isMobile ? "none" : "1px solid #f3f4f6",
              minHeight: isMobile ? "auto" : "600px"
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard isMobile={isMobile} />} />
              <Route path="/partners" element={<Partners isMobile={isMobile} />} />
              <Route
                path="/opportunities"
                element={
                  <Opportunities
                    isMobile={isMobile}
                    onAnalyze={(data) => {
                      navigate("/investor-dashboard", { state: { analysisData: data } });
                    }}
                  />
                }
              />
              <Route path="/risk" element={<Risk isMobile={isMobile} />} />
              <Route path="/investor-dashboard" element={<InvestorDashboard />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* Bottom Nav (mobile only) */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderTop: "1px solid #e5e7eb",
            padding: "8px 16px"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              maxWidth: "448px",
              margin: "0 auto"
            }}
          >
            <Link to="/" style={getBottomNavButtonStyle("/")}>
              <TrendingUp style={{ width: "20px", height: "20px" }} />{" "}
              <span style={{ fontSize: "12px" }}>Home</span>
            </Link>
            <Link to="/partners" style={getBottomNavButtonStyle("/partners")}>
              <Users style={{ width: "20px", height: "20px" }} />{" "}
              <span style={{ fontSize: "12px" }}>Partners</span>
            </Link>
            <Link to="/opportunities" style={getBottomNavButtonStyle("/opportunities")}>
              <Target style={{ width: "20px", height: "20px" }} />{" "}
              <span style={{ fontSize: "12px" }}>Opportunities</span>
            </Link>
            <Link to="/risk" style={getBottomNavButtonStyle("/risk")}>
              <AlertTriangle style={{ width: "20px", height: "20px" }} />{" "}
              <span style={{ fontSize: "12px" }}>Risk</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrap GripDashboard in Router
const App = () => (
  <Router>
    <GripDashboard />
  </Router>
);

export default App;
