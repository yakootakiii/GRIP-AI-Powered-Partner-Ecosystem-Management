import React, { useState } from 'react';
import Opportunities from './pages/OpportunitiesNew';
import InvestorDashboard from './InvestorDashboard';
import ContractAnalyzer from './ContractAnalyzer';
import Homepage from './Homepage';

const App = () => {
  const [currentView, setCurrentView] = useState('homepage'); // Default: Homepage
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);


  // --- Navigation Handlers ---
  const handleAnalyze = (opportunityData) => {
    console.log("App received analysisData:", opportunityData);
    setAnalysisData(opportunityData);
    setCurrentView('dashboard');
  };

  const handleBackToOpportunities = () => {
    setCurrentView('opportunities');
    setAnalysisData(null);
  };

  const handleContractStrategist = () => {
    setCurrentView('contract-strategist');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleGoToOpportunities = () => {
    setCurrentView('opportunities');
  };

  

  // --- Render Views ---
  return (
    <>
      {currentView === 'homepage' && (
        <Homepage 
          onGoToOpportunities={handleGoToOpportunities}
        />
      )}

      {currentView === 'opportunities' && (
        <Opportunities 
          isMobile={false} 
          onAnalyze={handleAnalyze} 
        />
      )}

      {currentView === 'dashboard' && (
        <InvestorDashboard 
          initialData={analysisData} 
          onBack={handleBackToOpportunities}
          onNavigateToContractStrategist={handleContractStrategist}
        />
      )}

      {currentView === 'contract-strategist' && (
        <ContractAnalyzer onBack={handleBackToDashboard} />
      )}
    </>
  );
};

export default App;
