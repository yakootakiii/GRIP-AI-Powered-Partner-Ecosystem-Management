import React, { useState, useRef } from 'react';
import { Send, FileText, TrendingUp, AlertCircle, CheckCircle, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

// Contract Strategist Main Component
const ContractStrategist = ({ isMobile, onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your Contract Strategist AI. I can help you analyze contracts, identify risks, suggest improvements, and optimize partnership terms. What would you like to work on today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // New states for upload modal + session persistence
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisQuestion, setAnalysisQuestion] = useState('');

  // persistent session info returned by backend after upload
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [activeFileName, setActiveFileName] = useState(null);

  const contractAnalytics = [
    { label: 'Active Contracts', value: '127', trend: '+5', color: '#10b981' },
    { label: 'Pending Reviews', value: '23', trend: '-3', color: '#f59e0b' },
    { label: 'Risk Alerts', value: '8', trend: '+2', color: '#ef4444' },
    { label: 'Avg Score', value: '89.5', trend: '+1.2', color: '#6366f1' }
  ];

  const quickActions = [
    { icon: FileText, label: 'Analyze New Contract', action: 'analyze' },
    { icon: AlertCircle, label: 'Review Risk Alerts', action: 'risks' },
    { icon: TrendingUp, label: 'Optimization Report', action: 'optimize' },
    { icon: CheckCircle, label: 'Compliance Check', action: 'compliance' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // send a plain question (uses session if present)
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);
    scrollToBottom();

    try {
      // POST question + session_id (if present) as JSON
      const payload = {
        question: newMessage.content,
        session_id: currentSessionId || null
      };

      const resp = await fetch('http://127.0.0.1:8002/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();

      if (data.error) {
        setMessages(prev => [...prev, { id: Date.now()+1, type: 'ai', content: `Server error: ${data.error}`, timestamp: new Date().toLocaleTimeString() }]);
      } else {
        const text = typeof data.advice === 'string' ? data.advice : JSON.stringify(data.advice, null, 2);
        // update session id if backend sent one (safe no-op)
        if (data.session_id) setCurrentSessionId(data.session_id);
        if (data.filename) setActiveFileName(data.filename);

        setMessages(prev => [...prev, { id: Date.now()+1, type: 'ai', content: text, timestamp: new Date().toLocaleTimeString() }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now()+1, type: 'ai', content: `Network error: ${err.message}`, timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  // Modified: if analyze action -> open upload modal
  const handleQuickAction = (action) => {
    if (action === 'analyze') {
      setShowUploadModal(true);
      setAnalysisQuestion('');
      setSelectedFile(null);
      return;
    }

    const actionMessages = {
      risks: "Please review the current risk alerts and provide recommendations.",
      optimize: "Can you generate an optimization report for our contract portfolio?",
      compliance: "I need to run a compliance check on our active contracts."
    };

    setInputValue(actionMessages[action] || '');
  };

  // New: analyze contract by uploading file -> returns session_id that becomes persistent
  const analyzeContract = async () => {
    if (!selectedFile) {
      alert("Please select a PDF contract file to analyze.");
      return;
    }

    // Build form data
    const formData = new FormData();
    formData.append('question', analysisQuestion || "Please analyze this contract for risks and opportunities.");
    formData.append('pdf_file', selectedFile, selectedFile.name);

    try {
      setShowUploadModal(false);
      setIsTyping(true);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'user',
          content: `Uploaded contract: ${selectedFile.name}\nQuestion: ${analysisQuestion || '(no question)'}`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      scrollToBottom();

      // POST to backend - backend returns advice and session_id
      const resp = await fetch('http://127.0.0.1:8002/ask', {
        method: 'POST',
        body: formData
      });

      const data = await resp.json();

      if (data.error) {
        setMessages(prev => [
          ...prev,
          { id: Date.now()+1, type: 'ai', content: `Server error: ${data.error}`, timestamp: new Date().toLocaleTimeString() }
        ]);
      } else {
        const adviceText = typeof data.advice === 'string' ? data.advice : JSON.stringify(data.advice, null, 2);

        // store session id so future questions reuse this pdf
        if (data.session_id) {
          setCurrentSessionId(data.session_id);
        }
        if (data.filename) {
          setActiveFileName(data.filename);
        } else {
          setActiveFileName(selectedFile.name);
        }

        setMessages(prev => [
          ...prev,
          { id: Date.now()+1, type: 'ai', content: adviceText, timestamp: new Date().toLocaleTimeString() }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: Date.now()+1, type: 'ai', content: `Network or server error: ${err.message}`, timestamp: new Date().toLocaleTimeString() }
      ]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  // Allow replacing the active contract (clears session info and opens upload modal)
  const replaceActiveContract = () => {
    setShowUploadModal(true);
    setSelectedFile(null);
    setAnalysisQuestion('');
    // Note: we don't auto-clear currentSessionId until user uploads and backend returns new session_id,
    // but we give the user a visual cue by clearing activeFileName on replace:
    setActiveFileName(null);
  };

  return (
    <div style={{
      flex: 1,
      padding: isMobile ? '16px 16px 80px 16px' : '16px',
      height: isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 200px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Mobile Header */}
      {isMobile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back
          </button>
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

      {/* Header */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px'
          }}>Contract Strategist</h1>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            margin: 0
          }}>
            Your AI-powered contract analysis assistant
          </p>
        </div>

        {/* small active file indicator + replace button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {activeFileName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff7ed', padding: '8px 12px', borderRadius: '12px', border: '1px solid #ffedd5' }}>
              <FileText style={{ width: '18px', height: '18px', color: '#ea580c' }} />
              <div style={{ fontSize: '13px', color: '#92400e' }}>{activeFileName}</div>
              <button onClick={replaceActiveContract} style={{ marginLeft: '8px', padding: '6px 8px', borderRadius: '8px', background: '#fff', border: '1px solid #e5e7eb', cursor: 'pointer' }}>Replace</button>
            </div>
          ) : (
            <button onClick={() => setShowUploadModal(true)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>
              Upload Contract
            </button>
          )}
        </div>
      </div>

      {/* Analytics Cards */}
      {!isMobile && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {contractAnalytics.map((metric, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '4px'
              }}>{metric.value}</div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '8px'
              }}>{metric.label}</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ArrowRight style={{ 
                  width: '12px', 
                  height: '12px', 
                  color: metric.color,
                  transform: metric.trend.startsWith('+') ? 'rotate(-45deg)' : 'rotate(45deg)'
                }} />
                <span style={{
                  fontSize: '12px',
                  color: metric.color,
                  fontWeight: '500'
                }}>{metric.trend}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Container */}
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Quick Actions */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '8px'
          }}>
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e2e8f0';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <IconComponent style={{ width: '20px', height: '20px', color: '#ea580c' }} />
                  <span style={{
                    fontSize: '12px',
                    color: '#374151',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          maxHeight: '400px'
        }}>
          {messages.map((message) => (
            <div key={message.id} style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px'
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: message.type === 'user' ? '#ea580c' : '#f8fafc',
                color: message.type === 'user' ? 'white' : '#374151',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.5',
                  marginBottom: '4px'
                }}>{message.content}</div>
                <div style={{
                  fontSize: '12px',
                  opacity: 0.7
                }}>{message.timestamp}</div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '16px'
            }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: '#f8fafc',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ea580c',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ea580c',
                    animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                  }} />
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ea580c',
                    animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                  }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-end'
          }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={currentSessionId ? "Ask about the uploaded contract..." : "Ask about contracts or upload one to use as context..."}
              style={{
                flex: 1,
                minHeight: '40px',
                maxHeight: '120px',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: inputValue.trim() ? '#ea580c' : '#e5e7eb',
                color: inputValue.trim() ? 'white' : '#9ca3af',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Upload modal (minimal, matches UI) */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60
        }}>
          <div style={{
            width: isMobile ? '92%' : '560px',
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ margin: 0 }}>Analyze New Contract</h3>
              <button onClick={() => setShowUploadModal(false)} style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '16px'
              }}>✕</button>
            </div>

            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '13px' }}>
              Select PDF contract
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                style={{ display: 'block', marginTop: '8px' }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '12px', color: '#374151', fontSize: '13px' }}>
              Short question / context (optional)
              <textarea
                value={analysisQuestion}
                onChange={(e) => setAnalysisQuestion(e.target.value)}
                placeholder="e.g., 'Focus on termination and liability clauses.'"
                style={{ display: 'block', width: '100%', minHeight: '64px', marginTop: '8px', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setShowUploadModal(false)} style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                cursor: 'pointer'
              }}>Cancel</button>
              <button onClick={analyzeContract} style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: '#ea580c',
                color: 'white',
                cursor: 'pointer'
              }}>Analyze</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ContractStrategist;
