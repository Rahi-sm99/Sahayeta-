import { useState, useEffect } from 'react';
import { Brain, Sparkles, RefreshCw } from 'lucide-react';
import { generateCrisisInsights } from '../../lib/gemini';
import { motion } from 'framer-motion';

export function GeminiInsights({ tasks }: { tasks: any[] }) {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    if (tasks.length === 0) return;
    setLoading(true);
    const text = await generateCrisisInsights(tasks);
    setInsights(text);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, [tasks.length]);

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
          <span style={{ fontSize: '0.6rem' }}>REFRESH</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Sparkles className="animate-pulse" size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Analyzing mission data with Gemini 1.5 Pro...</div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: 1.6 }}
        >
          {insights.split('\n').map((line, i) => (
            <p key={i} style={{ marginBottom: '8px' }}>
              {line.startsWith('-') || line.startsWith('*') ? (
                <span style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--primary)' }}>•</span>
                  <span>{line.replace(/^[-*]\s*/, '')}</span>
                </span>
              ) : line}
            </p>
          ))}
        </motion.div>
      )}

      <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={10} /> POWERED BY GOOGLE GEMINI 1.5 PRO
        </span>
      </div>
    </div>
  );
}
