import React, { useState } from 'react';
import OpportunitiesList from './OpportunitiesList';
import InvestorDashboard from './InvestorDashboard';

const App = () => {
  const [currentView, setCurrentView] = useState('opportunities');
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalyze = (opportunityData) => {
    setAnalysisData(opportunityData);
    setCurrentView('dashboard');
  };

  const handleBackToOpportunities = () => {
    setCurrentView('opportunities');
    setAnalysisData(null);
  };

  return (
    <>
      {currentView === 'opportunities' && (
        <OpportunitiesList onAnalyze={handleAnalyze} />
      )}
      {currentView === 'dashboard' && (
        <InvestorDashboard 
          initialData={analysisData} 
          onBack={handleBackToOpportunities} 
        />
      )}
    </>
  );
};

export default App;