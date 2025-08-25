import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const RegulatoryRiskDetail = ({ onBack, onResolve, onDismiss, isMobile }) => {
  return (
    <div style={{
      padding: isMobile ? '16px 16px 80px 16px' : '16px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <button
          onClick={onBack}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#6b7280'
          }}
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#f59e0b',
            borderRadius: '50%'
          }} />
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0
          }}>Contract Risk</h1>
        </div>
      </div>

      <div style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '24px'
      }}>
        TechVendor Inc
      </div>

      {/* Risk Description */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '16px'
        }}>Risk Description</h2>
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.6',
          margin: 0
        }}>
          New BSP circular on digital banking partnerships requires additional compliance measures that affect our agreements with FinTech Solutions, Digital Wallet Pro, and Crypto Exchange Partner.
        </p>
      </div>

      {/* AI Recommendations */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '16px'
        }}>AI Recommendations</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            'Convene emergency compliance committee meeting',
            'Assess contract modifications needed for each affected partner',
            'Prepare compliance timeline and resource allocation',
            'Communicate changes to affected partners within 72 hours'
          ].map((recommendation, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>✓</span>
              </div>
              <span style={{
                color: '#374151',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>{recommendation}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout for Timeline and Stakeholders */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Timeline */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>Timeline</h2>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            margin: 0
          }}>
            Compliance deadline: 45 days
          </p>
        </div>

        {/* Key Stakeholders */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>Key Stakeholders</h2>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {['Legal Team', 'Sustainability Officer', 'Vendor Manager'].map((stakeholder, index) => (
              <li key={index} style={{
                color: '#6b7280',
                fontSize: '14px',
                marginBottom: '8px',
                paddingLeft: '16px',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#9ca3af',
                  borderRadius: '50%'
                }} />
                {stakeholder}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '12px'
      }}>
        <button
          onClick={onResolve}
          style={{
            flex: 1,
            backgroundColor: '#ea580c',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Mark as Resolved
        </button>
        <button
          onClick={onDismiss}
          style={{
            flex: 1,
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default RegulatoryRiskDetail;