import React, { useState, useCallback } from 'react';

const ContractAnalyzer = ({ onBack }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFile = (file) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('File size must be less than 10MB.');
      return;
    }
    
    setSelectedFile(file);
    setError('');
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      handleFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const analyzeContract = async () => {
    if (!selectedFile || !question.trim()) {
      setError('Please upload a PDF file and enter a question.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf_file', selectedFile);
    formData.append('question', question.trim());

    setIsLoading(true);
    setResults(null);
    setError('');

    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:8002/ask', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to analyze contract. Please check your API connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAnalyzeDisabled = !selectedFile || !question.trim() || isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 p-5">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-blue-800 to-blue-600 text-white p-10 text-center relative">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors duration-200"
            title="Back to Dashboard"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <h1 className="text-4xl font-bold mb-2">Contract Strategy Analyzer</h1>
          <p className="text-lg opacity-90">Upload your contract and get expert strategic advice powered by AI</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
              📋 Contract Analysis
            </h2>
            
            {/* File Upload Area */}
            <div
              className={`border-3 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer mb-5 ${
                isDragOver 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : selectedFile 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
              }`}
              onClick={() => document.getElementById('fileInput').click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className={`text-5xl mb-4 ${selectedFile ? 'text-green-500' : 'text-gray-400'}`}>
                📄
              </div>
              <div className="text-lg text-gray-600 mb-2">Click to upload or drag & drop your PDF contract</div>
              <div className="text-sm text-gray-400">Maximum file size: 10MB</div>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".pdf"
                onChange={handleFileInputChange}
              />
            </div>
            
            {/* File Info */}
            {selectedFile && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-5">
                <div className="font-semibold text-gray-800">{selectedFile.name}</div>
                <div className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</div>
              </div>
            )}
            
            {/* Question Input */}
            <div className="mb-6">
              <label htmlFor="questionInput" className="block mb-3 font-semibold text-gray-800">
                What would you like to know about this contract?
              </label>
              <textarea
                id="questionInput"
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-base resize-y min-h-32 font-inherit transition-colors duration-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                placeholder="E.g., 'What are the potential risks in this contract?' or 'What clauses should I negotiate?' or 'What are my termination options?'"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            
            {/* Analyze Button */}
            <button
              className={`w-full py-4 px-10 rounded-xl text-lg font-semibold transition-all duration-300 ${
                isAnalyzeDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-300'
              }`}
              onClick={analyzeContract}
              disabled={isAnalyzeDisabled}
            >
              Analyze Contract
            </button>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-red-700 mt-4">
                {error}
              </div>
            )}
            
            {/* Tips */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-5 mt-5">
              <div className="font-semibold mb-3 text-teal-800">💡 Tips for better analysis:</div>
              <ul className="space-y-2">
                {[
                  'Be specific with your questions',
                  'Ask about risks, opportunities, or specific clauses',
                  'Consider asking about termination, liability, or payment terms',
                  'Upload clear, text-readable PDF contracts'
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-800">
                    <span className="text-teal-600 font-bold">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
              🎯 Strategic Advice
            </h2>
            
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-10">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-5"></div>
                <p className="text-gray-600">Analyzing your contract... This may take a moment.</p>
              </div>
            )}
            
            {/* Results */}
            {results && !isLoading && (
              <div>
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border-l-4 border-indigo-500 leading-relaxed whitespace-pre-wrap">
                  {results.advice}
                </div>
                
                {/* Sources */}
                {results.sources && results.sources.length > 0 && (
                  <div className="mt-6">
                    <div className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      📚 Sources Referenced
                    </div>
                    <div className="space-y-3">
                      {results.sources.map((source, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                          <strong>Source {index + 1}:</strong> {JSON.stringify(source, null, 2)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Empty State */}
            {!results && !isLoading && (
              <div className="text-center py-10 text-gray-400">
                <div className="text-5xl mb-4">⚖️</div>
                <p>Upload a contract and ask a question to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractAnalyzer;