import React from 'react';

const ToolCard = ({ icon: Icon, title, subtitle, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        ':hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.15)'
        } : {}
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: '#fef3f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon style={{ 
            width: '24px', 
            height: '24px', 
            color: '#ea580c' 
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            margin: 0,
            marginBottom: '4px'
          }}>{title}</h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>{subtitle}</p>
        </div>
        {onClick && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolCard;