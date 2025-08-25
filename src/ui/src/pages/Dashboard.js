import React, {useState} from 'react';
import InsightCard from '../components/InsightCard';
import ToolCard from '../components/ToolCard';
import StatCard from '../components/StatCard';
import ContractStrategist from './ContractStrategist';
import { Home, Users, Target, AlertTriangle, Lightbulb, BarChart3, FileText, TrendingUp } from 'lucide-react';

const Dashboard = ({ isMobile }) => {
  const [showContractStrategist, setShowContractStrategist] = useState(false);

  if (showContractStrategist) {
    return (
      <ContractStrategist 
        isMobile={isMobile} 
        onBack={() => setShowContractStrategist(false)}
      />
    );
  }

  return (
    <div style={{ flex: 1, padding: isMobile ? "16px 16px 80px 16px" : "16px" }}>
      
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

      {/* Desktop Layout */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: '32px', height: '100%' }}>
          {/* Left Column - Stats */}
          <div style={{ width: '50%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <StatCard title="Total Partners" value="127" isMobile={isMobile} />
              <StatCard title="Avg Trust Score" value="89.5" isMobile={isMobile} />
              <StatCard title="Opportunities" value="24" isMobile={isMobile} />
              <StatCard title="Risk Alerts" value="7" isMobile={isMobile} />
            </div>
          </div>

          {/* Right Column - AI Insights & Tools */}
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* AI Insights */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '24px'
              }}>AI Insights</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <InsightCard 
                  icon={Lightbulb}
                  title="Ecosystem Simulator"  
                  subtitle="Run what-if scenarios"
                />
                <InsightCard 
                  icon={Target}
                  title="New Opportunity Detected"
                  subtitle="Combining Ayala Land + BPI Housing Loans"
                />
                <InsightCard 
                  icon={Lightbulb}
                  title="Ecosystem Simulator"
                  subtitle="Run what-if scenarios"
                />
              </div>
            </div>

            {/* Tools */}
            <ToolCard 
              icon={BarChart3}
              title="Ecosystem Simulator"
              subtitle="Run what-if scenarios"
            />
            <ToolCard 
              icon={FileText}
              title="Contract Strategist"
              subtitle="Review and Optimize terms"
              onClick={() => setShowContractStrategist(true)}
            />

          </div>
        </div>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <div>
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <StatCard title="Total Partners" value="127" isMobile={isMobile} />
            <StatCard title="Avg Trust Score" value="89.5" isMobile={isMobile} />
            <StatCard title="Opportunities" value="24" isMobile={isMobile} />
            <StatCard title="Risk Alerts" value="7" isMobile={isMobile} />
          </div>

          {/* AI Insights */}
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
            }}>AI Insights</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <InsightCard 
                icon={Lightbulb}
                title="Ecosystem Simulator"
                subtitle="Run what-if scenarios"
              />
              <InsightCard 
                icon={Target}
                title="New Opportunity Detected"
                subtitle="Combining Ayala Land + BPI Housing Loans"
              />
              <InsightCard 
                icon={Lightbulb}
                title="Ecosystem Simulator"
                subtitle="Run what-if scenarios"
              />
            </div>
          </div>

          {/* Tools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ToolCard 
              icon={BarChart3}
              title="Ecosystem Simulator"
              subtitle="Run what-if scenarios"
            />
            <ToolCard 
              icon={FileText}
              title="Contract Strategist"
              subtitle="Review and Optimize terms"
              onClick={() => setShowContractStrategist(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;