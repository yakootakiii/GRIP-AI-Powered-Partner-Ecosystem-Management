import React, { useState } from 'react';
import { Search, Filter, ChevronRight, X, CheckCircle, Lightbulb } from 'lucide-react';

const Partners = ({ isMobile = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const partnersData = [
    {
      id: 1,
      name: 'Globe Telecom',
      type: 'Fintech Partner',
      trustScore: 94,
      engagementScore: 94,
      riskLevel: 'Low',
      opportunities: 3,
      color: '#10b981',
      contributions: '85%',
      recentActivities: [
        { type: 'success', title: 'Contract Renewed Successfully', time: '2 days ago' },
        { type: 'opportunity', title: 'New Opportunity Identified', time: '1 week ago' }
      ]
    },
    {
      id: 2,
      name: 'Ayala Healthcare',
      type: 'Group Company',
      trustScore: 98,
      riskLevel: 'Low',
      opportunities: 5,
      color: '#3b82f6',
      contributions: '92%',
      recentActivities: [
        { type: 'success', title: 'Quarterly Review Completed', time: '1 day ago' },
        { type: 'opportunity', title: 'Expansion Opportunity', time: '3 days ago' }
      ]
    },
    {
      id: 3,
      name: 'TechVendor Inc',
      type: 'IT Vendor',
      trustScore: 78,
      riskLevel: 'Medium',
      opportunities: 1,
      color: '#f59e0b',
      contributions: '67%',
      recentActivities: [
        { type: 'opportunity', title: 'Service Improvement Required', time: '5 days ago' }
      ]
    },
    {
      id: 4,
      name: 'Regulatory Corp',
      type: 'Compliance Partner',
      trustScore: 88,
      riskLevel: 'Low',
      opportunities: 2,
      color: '#8b5cf6',
      contributions: '78%',
      recentActivities: [
        { type: 'success', title: 'Compliance Audit Passed', time: '1 week ago' }
      ]
    }
  ];

  const filteredPartners = partnersData.filter(partner =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const PartnerCard = ({ partner }) => (
    <div 
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onClick={() => setSelectedPartner(partner)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: partner.color,
            borderRadius: '50%'
          }} />
          <h3 style={{
            fontWeight: '600',
            color: '#111827',
            fontSize: '16px',
            margin: 0
          }}>{partner.name}</h3>
        </div>
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          marginBottom: '12px',
          margin: '0 0 12px 0'
        }}>{partner.type}</p>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}>
          <div>
            <p style={{ color: '#6b7280', marginBottom: '2px', margin: '0 0 2px 0' }}>
              {partner.engagementScore ? 'Engagement Score' : 'Trust Score'}
            </p>
            <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>
              {partner.engagementScore || partner.trustScore}
            </p>
          </div>
          <div>
            <p style={{ color: '#6b7280', marginBottom: '2px', margin: '0 0 2px 0' }}>Risk Level</p>
            <p style={{ fontWeight: '600', color: getRiskColor(partner.riskLevel), margin: 0 }}>
              {partner.riskLevel}
            </p>
          </div>
          <div>
            <p style={{ color: '#6b7280', marginBottom: '2px', margin: '0 0 2px 0' }}>Opportunities</p>
            <p style={{ fontWeight: '600', color: '#8b5cf6', margin: 0 }}>{partner.opportunities}</p>
          </div>
        </div>
      </div>
      <ChevronRight size={20} color="#d1d5db" />
    </div>
  );

  const PartnerModal = ({ partner }) => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        maxWidth: '480px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={() => setSelectedPartner(null)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={24} color="#6b7280" />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: partner.color,
              borderRadius: '50%'
            }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0
            }}>{partner.name}</h2>
          </div>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            margin: 0
          }}>{partner.type}</p>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: '16px',
            flex: 1,
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>Trust Score</p>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0
            }}>{partner.trustScore}</p>
          </div>
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: '16px',
            flex: 1,
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>Contributions</p>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0
            }}>{partner.contributions}</p>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>Recent Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {partner.recentActivities.map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                {activity.type === 'success' ? (
                  <CheckCircle size={20} color="#10b981" />
                ) : (
                  <Lightbulb size={20} color="#f59e0b" />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827',
                    margin: '0 0 4px 0'
                  }}>{activity.title}</p>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: 0
                  }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
          <button style={{
            flex: 1,
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            View Contract
          </button>
          <button style={{
            flex: 1,
            backgroundColor: '#64748b',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Simulate Impact
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      flex: 1,
      padding: isMobile ? '16px 16px 80px 16px' : '16px',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
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
        marginBottom: '24px',
        margin: '0 0 24px 0'
      }}>Partners Page</h1>

      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          flex: 1,
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 44px',
              borderRadius: '24px',
              border: '1px solid #e5e7eb',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <Search
            size={18}
            color="#9ca3af"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
        </div>
        <button 
          onClick={() => setShowFilter(!showFilter)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            backgroundColor: showFilter ? '#f3f4f6' : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Filter size={18} color="#6b7280" />
        </button>
      </div>

      {/* Partners List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredPartners.map(partner => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#6b7280'
        }}>
          <p style={{ margin: 0 }}>No partners found matching your search.</p>
        </div>
      )}

      {/* Partner Detail Modal */}
      {selectedPartner && <PartnerModal partner={selectedPartner} />}
    </div>
  );
};

export default Partners;