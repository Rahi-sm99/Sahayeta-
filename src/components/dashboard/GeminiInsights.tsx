import { useState } from 'react';
import { Brain, Sparkles, RefreshCw, Target, MapPin, Users } from 'lucide-react';
import { generateCrisisInsights } from '../../lib/gemini';
import { motion } from 'framer-motion';

export function GeminiInsights({ tasks }: { tasks: any[] }) {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchInsights = async () => {
    if (tasks.length === 0) return;
    setLoading(true);
    const text = await generateCrisisInsights(tasks);
    setInsights(text);
    setLoading(false);
    setHasLoaded(true);
  };

  return (
    <div className="glass-card" style={{ padding: '20px', marginTop: '20px', border: '1px solid rgba(138, 43, 226, 0.3)', background: 'linear-gradient(135deg, rgba(20, 10, 40, 0.7) 0%, rgba(10, 10, 20, 0.8) 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <Brain size={16} color="#000" />
          </div>
          <h3 style={{ fontSize: '0.8rem', letterSpacing: '2px', margin: 0, color: 'var(--primary)' }}>GEMINI STRATEGIC INSIGHTS</h3>
        </div>
        <button 
          onClick={fetchInsights} 
          disabled={loading}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          <span style={{ fontSize: '0.6rem' }}>{hasLoaded ? 'REFRESH' : 'GENERATE'}</span>
        </button>
      </div>

      {/* Algorithm Context Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,153,51,0.08)', border: '1px solid rgba(255,153,51,0.2)', borderRadius: '8px', padding: '4px 10px' }}>
          <Target size={10} color="var(--primary)" />
          <span style={{ fontSize: '0.55rem', color: 'var(--primary)' }}>50% SKILL MATCH</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(19,136,8,0.08)', border: '1px solid rgba(19,136,8,0.2)', borderRadius: '8px', padding: '4px 10px' }}>
          <MapPin size={10} color="var(--secondary)" />
          <span style={{ fontSize: '0.55rem', color: 'var(--secondary)' }}>30% HAVERSINE PROXIMITY</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(100,149,237,0.08)', border: '1px solid rgba(100,149,237,0.2)', borderRadius: '8px', padding: '4px 10px' }}>
          <Users size={10} color="#6495ED" />
          <span style={{ fontSize: '0.55rem', color: '#6495ED' }}>20% AVAILABILITY</span>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Sparkles className="animate-pulse" size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Gemini 2.0 analyzing {tasks.length} missions with skill + proximity data...</div>
        </div>
      ) : !hasLoaded ? (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Click <strong style={{ color: 'var(--primary)' }}>GENERATE</strong> to run Gemini 2.0 AI analysis on {tasks.length} active missions using skill-matching + Haversine proximity data.
          </p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: 1.6 }}
        >
          {insights.split('\n').filter(l => l.trim()).map((line, i) => (
            <p key={i} style={{ marginBottom: '8px' }}>
              {line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line.trim()) ? (
                <span style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--primary)' }}>•</span>
                  <span dangerouslySetInnerHTML={{ __html: line.replace(/^[-*\d.]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--primary)">$1</strong>') }} />
                </span>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--primary)">$1</strong>') }} />
              )}
            </p>
          ))}
        </motion.div>
      )}

      <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>Algorithm: rankVolunteers() → Gemini 2.0 Strategic Layer</span>
        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={10} /> POWERED BY GOOGLE GEMINI 2.0 FLASH
        </span>
      </div>
    </div>
  );
}
