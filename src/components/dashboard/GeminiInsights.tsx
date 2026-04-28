import React, { useState } from 'react';
import { Cpu, Zap, Activity, Eye, Sparkles, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getTacticalBriefing, getRegionalStrategy } from '../../lib/gemini';
import ReactMarkdown from 'react-markdown';

interface GeminiInsightsProps {
  tasks: any[];
}

export function GeminiInsights({ tasks }: GeminiInsightsProps) {
  const [activeTab, setActiveTab] = useState<'tactical' | 'strategic' | 'vision'>('strategic');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ tactical?: string; strategic?: string; vision?: string }>({});
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const runAnalysis = async () => {
    setLoading(true);
    try {
      if (activeTab === 'strategic') {
        const strategy = await getRegionalStrategy(tasks);
        setResults(prev => ({ ...prev, strategic: strategy }));
      } else if (activeTab === 'tactical' && selectedTaskId) {
        const task = tasks.find(t => (t.id || t.task_id) === selectedTaskId);
        if (task) {
          const briefing = await getTacticalBriefing(task);
          setResults(prev => ({ ...prev, tactical: briefing }));
        }
      }
    } catch (error) {
      console.error('AI Suite Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px', marginTop: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', borderRadius: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '12px', color: '#000' }}>
          <Cpu size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '1px', margin: 0 }}>SAHAYETA INTELLIGENCE SUITE</h3>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '2px' }}>MULTI-MODEL ANALYTICS</div>
        </div>
      </div>

      {/* Specialist Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'strategic', label: 'STRATEGIC ANALYST', icon: Sparkles, color: 'var(--primary)', model: '1.5 Pro' },
          { id: 'tactical', label: 'TACTICAL AGENT', icon: Zap, color: 'var(--secondary)', model: '1.5 Flash' },
          { id: 'vision', label: 'VISUAL SENTINEL', icon: Eye, color: 'var(--accent)', model: '1.5 Flash' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: '10px 4px',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.05)',
              background: activeTab === tab.id ? `${tab.color}15` : 'transparent',
              color: activeTab === tab.id ? tab.color : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <tab.icon size={14} />
            <span style={{ fontSize: '0.55rem', fontWeight: 900 }}>{tab.label}</span>
            <span style={{ fontSize: '0.45rem', opacity: 0.5 }}>{tab.model}</span>
          </button>
        ))}
      </div>

      <div style={{ minHeight: '200px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px' }}>
        {activeTab === 'strategic' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>REGIONAL IMPACT ANALYSIS</span>
              </div>
              <button 
                onClick={runAnalysis} 
                disabled={loading}
                className="btn-premium" 
                style={{ padding: '6px 16px', fontSize: '0.6rem', background: 'var(--primary)', color: '#000' }}
              >
                {loading ? 'ANALYZING...' : 'GENERATE STRATEGY'}
              </button>
            </div>
            
            {results.strategic ? (
              <div style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: 1.6 }} className="markdown-content">
                <ReactMarkdown>{results.strategic}</ReactMarkdown>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <Activity size={32} style={{ marginBottom: '15px', opacity: 0.2 }} />
                <p style={{ fontSize: '0.75rem' }}>Click Generate to analyze {tasks.length} active missions with Gemini 1.5 Pro.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tactical' && (
          <div className="animate-fade-in">
             <div style={{ marginBottom: '15px' }}>
               <select 
                value={selectedTaskId} 
                onChange={(e) => setSelectedTaskId(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '10px', fontSize: '0.7rem' }}
               >
                 <option value="">SELECT MISSION FOR BRIEFING</option>
                 {tasks.map(t => (
                   <option key={t.id || t.task_id} value={t.id || t.task_id}>{t.ngo_name} - {t.location}</option>
                 ))}
               </select>
             </div>
             
             {selectedTaskId && (
               <button 
                onClick={runAnalysis} 
                disabled={loading}
                className="btn-premium" 
                style={{ width: '100%', padding: '10px', fontSize: '0.7rem', background: 'var(--secondary)', color: '#000', marginBottom: '15px' }}
               >
                 {loading ? 'COMMUNICATING...' : 'GET TACTICAL BRIEFING'}
               </button>
             )}

             {results.tactical ? (
               <div style={{ padding: '15px', background: 'rgba(19,136,8,0.05)', border: '1px solid var(--secondary)', borderRadius: '12px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--secondary)' }}>
                   <MessageSquare size={14} />
                   <span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '1px' }}>SECURE FIELD COMMS</span>
                 </div>
                 <p style={{ fontSize: '0.8rem', color: '#eee', fontStyle: 'italic' }}>"{results.tactical}"</p>
               </div>
             ) : (
               <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
                 <Zap size={32} style={{ marginBottom: '15px', opacity: 0.2 }} />
                 <p style={{ fontSize: '0.75rem' }}>Select a mission to receive a tactical field briefing from Gemini 1.5 Flash.</p>
               </div>
             )}
          </div>
        )}

        {activeTab === 'vision' && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div style={{ padding: '20px', border: '2px dashed #222', borderRadius: '20px', marginBottom: '20px' }}>
              <Eye size={40} style={{ color: 'var(--accent)', marginBottom: '15px', opacity: 0.5 }} />
              <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '5px' }}>FIELD ANALYSIS ACTIVE</div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Upload mission photos from the Sahayeta Mobile App to trigger AI damage assessment.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#ffb84d' }}>
              <AlertTriangle size={14} />
              <span style={{ fontSize: '0.6rem', fontWeight: 800 }}>MOCK MODE: WAITING FOR MOBILE STREAM</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
        <div style={{ fontSize: '0.5rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={8} /> GOOGLE CLOUD PROJECT ID: sahayeta-2026
        </div>
        <div style={{ fontSize: '0.5rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={8} /> ENCRYPTION ACTIVE
        </div>
      </div>
      
      <style>{`
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          font-size: 0.85rem;
          color: var(--primary);
          margin-top: 15px;
          margin-bottom: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }
        .markdown-content ul {
          padding-left: 15px;
          margin-bottom: 10px;
        }
        .markdown-content li {
          margin-bottom: 5px;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
