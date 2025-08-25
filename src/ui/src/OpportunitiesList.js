// redesign para mag fit sa homepage

import React from 'react';
import { TrendingUp } from 'lucide-react';

const OpportunitiesList = ({ onAnalyze }) => {
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
      profileText: "Healthcare fintech startup providing instant medical loans to underserved populations. Uses AI for credit scoring and partners with major healthcare providers. Strong growth trajectory with 40% month-over-month user acquisition.",
      transactionsFile: "health-loans-transactions.csv",
      paymentsFile: "health-loans-payments.csv"
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
      profileText: "Insurtech company offering climate-risk insurance for farmers and small businesses. Uses satellite data and weather analytics for precise risk assessment. Growing demand due to climate change impacts.",
      transactionsFile: "climate-insurance-transactions.csv",
      paymentsFile: "climate-insurance-payments.csv"
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
      profileText: "Fintech platform providing working capital loans to rural micro, small and medium enterprises. Focus on agricultural supply chain financing with digital-first approach and alternative credit scoring.",
      transactionsFile: "rural-msmes-transactions.csv",
      paymentsFile: "rural-msmes-payments.csv"
    }
  ];

  const handleAnalyze = (opportunity) => {
    if (onAnalyze) {
      onAnalyze({
        profileText: opportunity.profileText,
        transactionsFile: opportunity.transactionsFile,
        paymentsFile: opportunity.paymentsFile,
        opportunityTitle: opportunity.title
      });
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f7',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      padding: '40px 20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
      fontSize: '28px',
      fontWeight: 'bold'
    },
    logoIcon: {
      width: '36px',
      height: '36px',
      marginRight: '10px',
      background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      margin: '0 0 6px 0'
    },
    subtitle: {
      fontSize: '14px',
      opacity: 0.9,
      margin: 0
    },
    content: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '16px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.04)'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1d1d1f',
      margin: '0 0 6px 0',
      flex: 1
    },
    priorityBadge: {
      fontSize: '11px',
      fontWeight: '600',
      padding: '3px 10px',
      borderRadius: '10px',
      color: 'white',
      marginLeft: '10px'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px'
    },
    metric: {
      display: 'flex',
      flexDirection: 'column'
    },
    metricLabel: {
      fontSize: '12px',
      color: '#86868b',
      marginBottom: '3px',
      fontWeight: '500'
    },
    metricValue: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1d1d1f'
    },
    partnersSection: {
      marginBottom: '16px'
    },
    partnersLabel: {
      fontSize: '12px',
      color: '#86868b',
      marginBottom: '6px',
      fontWeight: '500'
    },
    partnersContainer: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap'
    },
    partnerTag: {
      fontSize: '11px',
      padding: '4px 10px',
      borderRadius: '12px',
      backgroundColor: '#f5f5f7',
      color: '#1d1d1f',
      border: '1px solid #d2d2d7'
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    confidence: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '12px',
      color: '#34c759'
    },
    confidenceDot: {
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      backgroundColor: '#34c759',
      marginRight: '5px'
    },
    analyzeButton: {
      backgroundColor: '#ff6b35',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <TrendingUp size={18} />
          </div>
          Grip
        </div>
        <h1 style={styles.title}>AI-Discovered Opportunities</h1>
        <p style={styles.subtitle}>{opportunities.length} Active</p>
      </div>

      <div style={styles.content}>
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>{opportunity.title}</h2>
              <span 
                style={{
                  ...styles.priorityBadge,
                  backgroundColor: opportunity.priorityColor
                }}
              >
                {opportunity.priority}
              </span>
            </div>

            <div style={styles.metricsGrid}>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>Projected ROI</span>
                <span style={styles.metricValue}>{opportunity.projectedROI}</span>
              </div>
              <div style={styles.metric}>
                <span style={styles.metricLabel}>Timeline</span>
                <span style={styles.metricValue}>{opportunity.timeline}</span>
              </div>
            </div>

            <div style={styles.partnersSection}>
              <div style={styles.partnersLabel}>Key Partners</div>
              <div style={styles.partnersContainer}>
                {opportunity.partners.map((partner, idx) => (
                  <span key={idx} style={styles.partnerTag}>{partner}</span>
                ))}
              </div>
            </div>

            <div style={styles.footer}>
              <div style={styles.confidence}>
                <span style={styles.confidenceDot}></span>
                Confidence: {opportunity.confidence}
              </div>
              <button 
                style={styles.analyzeButton}
                onClick={() => handleAnalyze(opportunity)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e55a2b';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ff6b35';
                }}
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

export default OpportunitiesList;