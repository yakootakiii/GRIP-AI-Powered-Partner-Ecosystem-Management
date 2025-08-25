import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ContractRiskDetail from './ContractRiskDetail';
import PerformanceRiskDetail from './PerformanceRiskDetail';
import RegulatoryRiskDetail from './RegulatoryRiskDetail';

const Risk = ({ isMobile }) => {
  const [showContractRiskDetail, setShowContractRiskDetail] = useState(false);
  const [showPerformanceRiskDetail, setShowPerformanceRiskDetail] = useState(false);
  const [showRegulatoryRiskDetail, setShowRegulatoryRiskDetail] = useState(false);

  const handleContractRiskClick = () => {
    setShowContractRiskDetail(true);
  };

  const handlePerformanceRiskClick = () => {
    setShowPerformanceRiskDetail(true);
  }

  const handleRegulatoryRiskClick = () => {
    setShowRegulatoryRiskDetail(true);
  }

  const handleBackToRisk = () => {
    setShowContractRiskDetail(false);
    setShowPerformanceRiskDetail(false);
    setShowRegulatoryRiskDetail(false);
  };

  const handleResolveRisk = () => {
    // Handle resolve action
    alert('Risk marked as resolved');
    setShowContractRiskDetail(false);
    setShowPerformanceRiskDetail(false);
    setShowRegulatoryRiskDetail(false);
  };

  const handleDismissRisk = () => {
    // Handle dismiss action
    alert('Risk dismissed');
    setShowContractRiskDetail(false);
    setShowPerformanceRiskDetail(false);
    setShowRegulatoryRiskDetail(false);
  };

  if (showContractRiskDetail) {
    return (
      <ContractRiskDetail 
        onBack={handleBackToRisk}
        onResolve={handleResolveRisk}
        onDismiss={handleDismissRisk}
        isMobile={isMobile}
      />
    );
  }

  if (showPerformanceRiskDetail) {
    return (
      <PerformanceRiskDetail
        onBack={handleBackToRisk}
        onResolve={handleResolveRisk}
        onDismiss={handleDismissRisk}
        isMobile={isMobile}
      />
    )
  }

  if (showRegulatoryRiskDetail) {
    return (
      <RegulatoryRiskDetail
        onBack={handleBackToRisk}
        onResolve={handleResolveRisk}
        onDismiss={handleDismissRisk}
        isMobile={isMobile}
      />
    )
  }

  return (
    <div style={{
      flex: 1,
      padding: isMobile ? '16px 16px 80px 16px' : '16px'
    }}>
      {/* Mobile Header */}
      {isMobile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/logo.png" 
              alt="Grip Logo"
              style={{
                width: '40px',
                height: '32px',
                borderRadius: '8px'
              }}
            />
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827'
            }}>Grip</span>
          </div>
        </div>
      )}

      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '24px'
      }}>Risk Metrics</h1>

      {/* Risk Overview */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Operational Risk */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                fontWeight: '600',
                color: '#111827',
                fontSize: '16px'
              }}>Operational Risk</span>
              <span style={{
                fontWeight: '600',
                color: '#10b981',
                fontSize: '14px'
              }}>Low</span>
            </div>
            <div style={{
              height: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: '25%',
                backgroundColor: '#10b981',
                borderRadius: '4px'
              }} />
            </div>
          </div>

          {/* Financial Risk */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                fontWeight: '600',
                color: '#111827',
                fontSize: '16px'
              }}>Financial Risk</span>
              <span style={{
                fontWeight: '600',
                color: '#10b981',
                fontSize: '14px'
              }}>Low</span>
            </div>
            <div style={{
              height: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: '30%',
                backgroundColor: '#10b981',
                borderRadius: '4px'
              }} />
            </div>
          </div>

          {/* Regulatory Risk */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                fontWeight: '600',
                color: '#111827',
                fontSize: '16px'
              }}>Regulatory Risk</span>
              <span style={{
                fontWeight: '600',
                color: '#f59e0b',
                fontSize: '14px'
              }}>Medium</span>
            </div>
            <div style={{
              height: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: '60%',
                backgroundColor: '#f59e0b',
                borderRadius: '4px'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Alerts */}
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '24px'
      }}>Risk Alerts</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Contract Risk Alert - Now Clickable */}
        <div 
          onClick={handleContractRiskClick}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, 0.1)';
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#f59e0b',
                borderRadius: '50%'
              }} />
              <h3 style={{
                fontWeight: '600',
                color: '#111827',
                fontSize: '16px'
              }}>Contract Risk</h3>
            </div>
            <span style={{
              color: '#9ca3af',
              fontSize: '14px'
            }}>2h</span>
          </div>
          <p style={{
            color: '#111827',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '4px'
          }}>TechVendor Inc</p>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '16px'
          }}>ESG compliance clause outdated</p>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleContractRiskClick();
              }}
              style={{
                backgroundColor: '#ea580c',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Review
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle dismiss
              }}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>

        {/* Performance Risk Alert */}
        <div 
          onClick={handlePerformanceRiskClick}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, 0.1)';
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#374151',
                borderRadius: '50%'
              }} />
              <h3 style={{
                fontWeight: '600',
                color: '#111827',
                fontSize: '16px'
              }}>Performance Risk</h3>
            </div>
            <span style={{
              color: '#9ca3af',
              fontSize: '14px'
            }}>4h</span>
          </div>
          <p style={{
            color: '#111827',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '4px'
          }}>Payment Gateway</p>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '16px'
          }}>Response time degraded by 15%</p>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePerformanceRiskClick();
              }}
              style={{
                backgroundColor: '#ea580c',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Review
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle dismiss
              }}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>

        {/* Regulatory Risk Alert */}
        <div 
          onClick={handleRegulatoryRiskClick}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, 0.1)';
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#f59e0b', // Yellow for medium severity
                borderRadius: '50%'
              }} />
              <h3 style={{
                fontWeight: '600',
                color: '#111827',
                fontSize: '16px'
              }}>Regulatory Risk</h3>
            </div>
            <span style={{
              color: '#9ca3af',
              fontSize: '14px'
            }}>1d</span>
          </div>
          <p style={{
            color: '#111827',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '4px'
          }}>Global Supply Co</p>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '16px'
          }}>New data protection regulation enforcement pending</p>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleRegulatoryRiskClick();
              }}
              style={{
                backgroundColor: '#ea580c',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Review
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDismissRisk();
              }}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Risk;