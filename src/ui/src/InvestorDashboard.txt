import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { TrendingUp, Clock, Upload, FileText, DollarSign, BarChart3, Target, Shield, AlertTriangle, Download, Calculator, ArrowLeft, Scale, Radius } from 'lucide-react';


const InvestorDashboard = ({ initialData, onBack, onNavigateToContractStrategist, isMobile }) => {
  const location = useLocation(); // Access the location object
  console.log(">>> Using REAL InvestorDashboard component");
  console.log("InvestorDashboard initialData prop:", initialData);

  const [formData, setFormData] = useState({
    profileText: initialData?.profileText || '',
    // store filenames for now; loadCSVFiles will convert them into File objects later
    transactionsFile: initialData?.transactionsFile || null,
    paymentsFile: initialData?.paymentsFile || null
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileLoadStatus, setFileLoadStatus] = useState('');
  const displayTitle = initialData?.title || initialData?.opportunityTitle || 'Investment Analysis Request';


  useEffect(() => {
    console.log('InvestorDashboard initialData changed:', initialData);
  }, [initialData]);

  useEffect(() => {
    if (!initialData?.profileText) return;
    setFormData(prev => {
      if (prev.profileText === initialData.profileText) return prev;
      return { ...prev, profileText: initialData.profileText };
    });
  }, [initialData?.profileText]); // only run when profileText changes

  useEffect(() => {
    const loadCSVFiles = async () => {
      if (!initialData?.transactionsFile && !initialData?.paymentsFile) return;
      setFileLoadStatus('Loading CSV files...');

      const fetchAndValidate = async (filename) => {
        try {
          const url = `/${filename}`; // ensures an absolute path from the server root
          console.log('Attempting to fetch CSV at', url);
          console.log('Attempting to fetch CSV at', url);
          const res = await fetch(url);
          if (!res.ok) {
            console.warn(`Failed to fetch ${url} - status ${res.status}`);
            const maybeText = await res.text().catch(()=>null);
            console.warn('Response preview:', maybeText ? maybeText.slice(0,300) : 'no body');
            return null;
          }

          const text = await res.text();
          const lines = text.split(/\r?\n/).filter(Boolean);
          if (lines.length === 0) {
            console.warn(`${filename} appears empty`);
            return null;
          }

          if (!lines[0].includes(',')) {
            console.warn(`${filename} header doesn't contain comma - header:`, lines[0]);
          }

          const blob = new Blob([text], { type: 'text/csv' });
          console.log(`${filename} fetched ok — preview:`, lines.slice(0,6));
          return new File([blob], filename, { type: 'text/csv' });
        } catch (err) {
          console.error('Error fetching', filename, err);
          return null;
        }
      };

      try {
        const [transactionsFile, paymentsFile] = await Promise.all([
          initialData.transactionsFile ? fetchAndValidate(initialData.transactionsFile) : null,
          initialData.paymentsFile ? fetchAndValidate(initialData.paymentsFile) : null
        ]);

        setFormData(prev => ({ ...prev, transactionsFile, paymentsFile }));

        if (transactionsFile || paymentsFile) {
          setFileLoadStatus(`✓ Loaded ${transactionsFile ? '1' : '0'} transactions file${transactionsFile && paymentsFile ? ' and 1 payments file' : paymentsFile ? ' and 1 payments file' : ''}`);
        } else {
          setFileLoadStatus('⚠️ Could not load CSV files from public directory (check console for details)');
        }
      } catch (err) {
        setFileLoadStatus('❌ Failed to load CSV files');
        console.error('Error loading CSV files:', err);
      }
    };

    loadCSVFiles();
  }, [initialData]);

  
  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
    setFileLoadStatus('');
  };

  const handleSubmit = async () => {
    if (!formData.profileText || !formData.transactionsFile) {
      setError('Please provide company profile and transactions file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataObj = new FormData();
      formDataObj.append('profile_text', formData.profileText);
      formDataObj.append('transactions_file', formData.transactionsFile);
      if (formData.paymentsFile) {
        formDataObj.append('payments_file', formData.paymentsFile);
      }

      const response = await fetch('http://localhost:8000/investor_opportunity', {
        method: 'POST',
        body: formDataObj
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error + (data.detail ? ': ' + data.detail : ''));
      } else {
        setResults(data);
      }
    } catch (err) {
      setError('Failed to analyze opportunity: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await fetch('http://localhost:8000/download_report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results)
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'investment_report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download report: ' + err.message);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(1)}%`;
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return { color: '#16a34a', backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0' };
      case 'medium': return { color: '#ca8a04', backgroundColor: '#fefce8', border: '2px solid #fde047' };
      case 'high': return { color: '#dc2626', backgroundColor: '#fef2f2', border: '2px solid #fecaca' };
      default: return { color: '#6b7280', backgroundColor: '#f9fafb', border: '2px solid #d1d5db' };
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '50px'
    },
    backButton: {
      position: 'fixed',
      top: '20px',
      left: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid #e5e7eb',
      borderRadius: '50px',
      padding: '12px 20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      zIndex: 1000,
      transition: 'all 0.2s'
    },
    innerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 16px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '48px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#6b7280',
      maxWidth: '600px',
      margin: '0 auto'
    },
    opportunityBadge: {
      fontSize: '1.1rem',
      color: '#2563eb',
      fontWeight: '600',
      marginTop: '8px',
      backgroundColor: '#dbeafe',
      padding: '8px 16px',
      borderRadius: '20px',
      display: 'inline-block'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid #e5e7eb',
      marginBottom: '32px',
      overflow: 'hidden'
    },
    cardHeader: {
      // background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
      padding: '24px 32px',
      color: 'black'
    },
    cardHeaderTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: 0
    },
    cardContent: {
      padding: '32px'
    },
    grid: {
      display: 'grid',
      gap: '32px'
    },
    gridCols2: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    },
    gridCols4: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    },
    fullWidth: {
      gridColumn: '1 / -1'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '12px'
    },
    required: {
      color: '#dc2626'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '1rem',
      resize: 'vertical',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    fileUpload: {
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      padding: '24px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'border-color 0.2s',
      backgroundColor: '#fafafa'
    },
    fileUploadLoaded: {
      border: '2px solid #16a34a',
      backgroundColor: '#f0fdf4'
    },
    fileInput: {
      display: 'none'
    },
    uploadText: {
      color: '#3b82f6',
      fontWeight: '500',
      fontSize: '1rem'
    },
    uploadSubtext: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginTop: '4px'
    },
    successText: {
      fontSize: '0.875rem',
      color: '#16a34a',
      marginTop: '8px'
    },
    statusText: {
      fontSize: '0.875rem',
      color: '#2563eb',
      marginTop: '8px',
      fontWeight: '500'
    },
    errorContainer: {
      marginTop: '24px',
      padding: '16px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px'
    },
    errorContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#b91c1c'
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px',
      marginTop: '32px',
      flexWrap: 'wrap'
    },
    button: {
      flex: 1,
      minWidth: '280px',
      background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
      color: 'white',
      padding: '16px 32px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1.125rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    contractButton: {
      flex: 1,
      minWidth: '280px',
      background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
      color: 'white',
      padding: '16px 32px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1.125rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none'
    },
    spinner: {
      width: '24px',
      height: '24px',
      border: '2px solid transparent',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    metricCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '24px'
    },
    metricHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    metricLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#6b7280'
    },
    metricValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    dataRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6'
    },
    dataLabel: {
      color: '#6b7280'
    },
    dataValue: {
      fontWeight: '600'
    },
    riskBadge: {
      display: 'inline-flex',
      padding: '8px 16px',
      borderRadius: '20px',
      fontWeight: '600',
      fontSize: '0.875rem'
    },
    listItem: {
      display: 'flex',
      alignItems: 'flex-start',
      fontSize: '0.875rem',
      marginBottom: '8px'
    },
    bullet: {
      width: '8px',
      height: '8px',
      backgroundColor: '#6b7280',
      borderRadius: '50%',
      marginTop: '6px',
      marginRight: '12px',
      flexShrink: 0
    },
    gradientCard: {
      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
      borderRadius: '12px',
      border: '1px solid #93c5fd',
      padding: '32px'
    },
    strategyItem: {
      display: 'flex',
      alignItems: 'flex-start',
      backgroundColor: 'white',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      marginBottom: '8px'
    },
    riskItem: {
      display: 'flex',
      alignItems: 'flex-start',
      backgroundColor: 'white',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      marginBottom: '8px'
    },
    downloadButton: {
      background: 'linear-gradient(135deg, #16a34a 0%, #2563eb 100%)',
      color: 'white',
      padding: '16px 32px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1.125rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px'
    },
    centerText: {
      textAlign: 'center'
    }
  };

  // Add CSS animation for spinner
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);


  return (
    <div style={styles.container}>
    <div style={{padding: "16px"}}>
      {onBack && (
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#f97316",     // Orange background
          color: "white",                 // White text
          padding: "10px 16px",
          borderRadius: "10px",
          border: "none",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          transition: "all 0.2s ease-in-out",
          marginBottom: "4px",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#ea580c"; // Darker orange on hover
          e.target.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#f97316";
          e.target.style.transform = "translateY(0)";
        }}
      >
        <span style={{ fontSize: "16px" }}>←</span> Back to Opportunities
      </button>
    )}
    </div>      
    {/* {onBack && (
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#f97316",     // Orange background
          color: "white",                 // White text
          padding: "10px 16px",
          borderRadius: "10px",
          border: "none",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          transition: "all 0.2s ease-in-out",
          marginBottom: "20px",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#ea580c"; // Darker orange on hover
          e.target.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#f97316";
          e.target.style.transform = "translateY(0)";
        }}
      >
        <span style={{ fontSize: "16px" }}>←</span> Back to Opportunities
      </button>
    )} */}

      

      <div style={styles.innerContainer}>

        {/* Input Form */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardHeaderTitle}>
              <FileText size={24} />
              {displayTitle}
            </h2>
          </div>
          
          <div style={styles.cardContent}>
            <div style={styles.grid}>
              <div style={styles.fullWidth}>
                <label style={styles.label}>
                  Company Profile & Description
                </label>
                <textarea
                  style={styles.textarea}
                  rows="6"
                  placeholder="Describe the company, business model, market opportunity, team, and any other relevant details..."
                  value={formData.profileText}
                  onChange={(e) => setFormData(prev => ({ ...prev, profileText: e.target.value }))}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
              
              <div>
                <label style={styles.label}>
                  <span style={styles.required}>*</span> Transactions File
                </label>
                <div 
                  style={{
                    ...styles.fileUpload,
                    ...(formData.transactionsFile ? styles.fileUploadLoaded : {})
                  }}
                  onClick={() => document.getElementById('transactions').click()}
                  onMouseEnter={(e) => e.target.style.borderColor = '#3b82f6'}
                  onMouseLeave={(e) => e.target.style.borderColor = formData.transactionsFile ? '#16a34a' : '#d1d5db'}
                >
                  <Upload size={32} color="#9ca3af" style={{margin: '0 auto 8px'}} />
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => handleFileChange('transactionsFile', e.target.files[0])}
                    style={styles.fileInput}
                    id="transactions"
                  />
                  <div>
                    <span style={styles.uploadText}>Upload CSV or Excel</span>
                    <p style={styles.uploadSubtext}>Must contain: date, revenue, cost columns</p>
                  </div>
                  {formData.transactionsFile && (
                    <p style={styles.successText}>✓ {formData.transactionsFile.name}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label style={styles.label}>
                  Payments File (Optional)
                </label>
                <div 
                  style={{
                    ...styles.fileUpload,
                    ...(formData.paymentsFile ? styles.fileUploadLoaded : {})
                  }}
                  onClick={() => document.getElementById('payments').click()}
                  onMouseEnter={(e) => e.target.style.borderColor = '#3b82f6'}
                  onMouseLeave={(e) => e.target.style.borderColor = formData.paymentsFile ? '#16a34a' : '#d1d5db'}
                >
                  <Upload size={32} color="#9ca3af" style={{margin: '0 auto 8px'}} />
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => handleFileChange('paymentsFile', e.target.files[0])}
                    style={styles.fileInput}
                    id="payments"
                  />
                  <div>
                    <span style={styles.uploadText}>Upload CSV or Excel</span>
                    <p style={styles.uploadSubtext}>Should contain: amount_paid column</p>
                  </div>
                  {formData.paymentsFile && (
                    <p style={styles.successText}>✓ {formData.paymentsFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* File load status */}
            {fileLoadStatus && (
              <div style={styles.statusText}>
                {fileLoadStatus}
              </div>
            )}
            
            {error && (
              <div style={styles.errorContainer}>
                <div style={styles.errorContent}>
                  <AlertTriangle size={20} />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <div style={styles.buttonContainer}>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {})
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={styles.spinner}></div>
                    Analyzing Investment Opportunity...
                  </>
                ) : (
                  <>
                    <BarChart3 size={24} />
                    Analyze Investment Opportunity
                  </>
                )}
              </button>

              {onNavigateToContractStrategist && (
                <button
                  style={styles.contractButton}
                  onClick={onNavigateToContractStrategist}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(22, 163, 74, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <Scale size={24} />
                  Contract Strategist
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Results section - keeping your existing results display */}
        {results && (
          <div style={styles.grid}>
            {/* Key Metrics Cards */}
            <div style={{...styles.grid, ...styles.gridCols4, ...styles.fullWidth}}>
              <div style={styles.metricCard}>
                <div style={styles.metricHeader}>
                  <div>
                    <p style={styles.metricLabel}>Total Revenue</p>
                    <p style={styles.metricValue}>{formatCurrency(results.metrics?.total_revenue)}</p>
                  </div>
                  <DollarSign size={32} color="#16a34a" />
                </div>
              </div>
              
              <div style={styles.metricCard}>
                <div style={styles.metricHeader}>
                  <div>
                    <p style={styles.metricLabel}>Net Profit</p>
                    <p style={styles.metricValue}>{formatCurrency(results.metrics?.net_profit)}</p>
                  </div>
                  <Target size={32} color="#2563eb" />
                </div>
              </div>
              
              <div style={styles.metricCard}>
                <div style={styles.metricHeader}>
                  <div>
                    <p style={styles.metricLabel}>Growth Rate</p>
                    <p style={styles.metricValue}>{formatPercent(results.metrics?.growth_rate_percent)}</p>
                  </div>
                  <TrendingUp size={32} color="#9333ea" />
                </div>
              </div>
              
              <div style={styles.metricCard}>
                <div style={styles.metricHeader}>
                  <div>
                    <p style={styles.metricLabel}>Data Period</p>
                    <p style={styles.metricValue}>{results.metrics?.months_of_data} mo</p>
                  </div>
                  <Clock size={32} color="#f59e0b" />
                </div>
              </div>
            </div>

            {/* Valuation and Risk */}
            <div style={{...styles.grid, ...styles.gridCols2, ...styles.fullWidth}}>
              <div style={styles.card}>
                <div style={styles.cardContent}>
                  <h3 style={styles.sectionTitle}>
                    <Calculator size={24} color="#2563eb" />
                    Valuation & Investment Range
                  </h3>
                  <div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Estimated Valuation</span>
                      <span style={{...styles.dataValue, fontSize: '1.125rem'}}>{formatCurrency(results.valuation_estimate)}</span>
                    </div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Investment Range (Min)</span>
                      <span style={styles.dataValue}>{formatCurrency(results.recommended_investment_range?.min)}</span>
                    </div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Investment Range (Max)</span>
                      <span style={styles.dataValue}>{formatCurrency(results.recommended_investment_range?.max)}</span>
                    </div>
                    <div style={styles.dataRow}>
                      <span style={styles.dataLabel}>Annualized Revenue</span>
                      <span style={styles.dataValue}>{formatCurrency(results.annualized_revenue_estimate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardContent}>
                  <h3 style={styles.sectionTitle}>
                    <Shield size={24} color="#dc2626" />
                    Risk Assessment
                  </h3>
                  <div>
                    <div style={{...styles.riskBadge, ...getRiskColor(results.risk?.risk_score)}}>
                      {results.risk?.risk_score || 'Unknown'} Risk
                    </div>
                    <div style={{marginTop: '16px'}}>
                      <p style={{...styles.metricLabel, marginBottom: '8px'}}>Risk Factors:</p>
                      <div>
                        {results.risk?.drivers?.map((driver, idx) => (
                          <div key={idx} style={styles.listItem}>
                            <span style={styles.bullet}></span>
                            {driver}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Projections */}
            <div style={{...styles.card, ...styles.fullWidth}}>
              <div style={styles.cardContent}>
                <h3 style={styles.sectionTitle}>
                  <TrendingUp size={24} color="#16a34a" />
                  ROI Projections
                </h3>
                <div style={{...styles.grid, ...styles.gridCols2}}>
                  <div>
                    <h4 style={{fontWeight: '600', color: '#374151', marginBottom: '16px'}}>Baseline ROI</h4>
                    <div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                        <span style={styles.dataLabel}>Min Investment ROI</span>
                        <span style={styles.dataValue}>{formatPercent(results.roi_projections?.baseline?.roi_percent_min_investment)}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span style={styles.dataLabel}>Max Investment ROI</span>
                        <span style={styles.dataValue}>{formatPercent(results.roi_projections?.baseline?.roi_percent_max_investment)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 style={{fontWeight: '600', color: '#374151', marginBottom: '16px'}}>With Growth Uplift</h4>
                    <div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                        <span style={styles.dataLabel}>Projected Min ROI</span>
                        <span style={{...styles.dataValue, color: '#16a34a'}}>{formatPercent(results.roi_projections?.with_uplift?.projected_roi_percent_min_investment)}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span style={styles.dataLabel}>Projected Max ROI</span>
                        <span style={{...styles.dataValue, color: '#16a34a'}}>{formatPercent(results.roi_projections?.with_uplift?.projected_roi_percent_max_investment)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Investment Advice */}
            {results.llm_investment_advice && (
              <div style={{...styles.gradientCard, ...styles.fullWidth}}>
                <h3 style={styles.sectionTitle}>
                  <Target size={24} color="#2563eb" />
                  AI Investment Recommendation
                </h3>
                
                <div style={{...styles.grid, ...styles.gridCols2}}>
                  <div>
                    <div style={{marginBottom: '24px'}}>
                      <h4 style={{fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Investment Summary</h4>
                      <p style={{color: '#1f2937', backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb'}}>{results.llm_investment_advice.investment_summary}</p>
                    </div>
                    
                    <div style={{marginBottom: '24px'}}>
                      <h4 style={{fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Recommended Amount</h4>
                      <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#2563eb'}}>{formatCurrency(results.llm_investment_advice.recommended_investment_amount)}</p>
                    </div>
                    
                    <div style={{marginBottom: '24px'}}>
                      <h4 style={{fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Expected Payback</h4>
                      <p style={{fontSize: '1.125rem', fontWeight: '600', color: '#1f2937'}}>{results.llm_investment_advice.expected_payback_months} months</p>
                    </div>
                    
                    <div>
                      <h4 style={{fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Confidence Level</h4>
                      <p style={{color: '#1f2937', backgroundColor: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb'}}>{results.llm_investment_advice.confidence}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{marginBottom: '24px'}}>
                      <h4 style={{fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Investment Strategy</h4>
                      <div>
                        {results.llm_investment_advice.high_level_strategy?.map((item, idx) => (
                          <div key={idx} style={styles.strategyItem}>
                            <span style={{width: '8px', height: '8px', backgroundColor: '#2563eb', borderRadius: '50%', marginTop: '8px', marginRight: '12px', flexShrink: 0}}></span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 style={{fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Main Risks</h4>
                      <div>
                        {results.llm_investment_advice.main_risks?.map((risk, idx) => (
                          <div key={idx} style={styles.riskItem}>
                            <AlertTriangle size={16} color="#dc2626" style={{marginTop: '4px', marginRight: '12px', flexShrink: 0}} />
                            {risk}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Download Report Button */}
            <div style={{ ...styles.centerText, ...styles.fullWidth }}>
              <button
                onClick={downloadReport}
                style={styles.downloadButton}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 10px 25px rgba(22, 163, 74, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <Download size={24} />
                Download Investment Report (PDF)
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorDashboard;
