import React from 'react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="flex items-center space-x-2 mx-auto">
                    <img src="/logo.png" alt="Grip Logo" className="w-20 h-auto" />
                    <p className="text-2xl font-bold text-orange-500">Grip</p>
                </div>
        </div>
        <p className="text-gray-300 text-lg mb-12 max-w-md mx-auto">
          AI-Powered Partner Ecosystem Management
        </p>
        <div className="space-y-4">
          <button 
            onClick={() => onNavigate('register')}
            className="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            Get Started
          </button>
          <div className="block sm:hidden">
            <button 
              onClick={() => onNavigate('login')}
              className="w-full px-8 py-3 bg-transparent border border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;