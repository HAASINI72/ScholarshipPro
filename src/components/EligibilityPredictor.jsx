import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Target, Lightbulb } from 'lucide-react';

const EligibilityPredictor = ({ predictions, loading }) => {
  if (loading) {
    return (
      <div className="p-10 bg-[var(--card-bg)] rounded-[2rem] border border-[var(--text-color)]/5 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[var(--text-color)] border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">Calculating Probabilities...</span>
      </div>
    );
  }

  if (!predictions || predictions.length === 0) return null;

  return (
    <div className="p-10 bg-[var(--card-bg)] rounded-[2rem] border border-[var(--text-color)]/5">
      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">AI Forecasting</span>
          <h3 className="text-2xl font-serif font-bold text-[var(--text-color)]">Eligibility <span className="italic font-normal">Forecast</span></h3>
        </div>
        <TrendingUp className="text-[var(--text-color)]/20" size={32} />
      </div>

      <div className="space-y-8">
        {predictions.map((p, i) => (
          <div key={i} className="group">
            <div className="flex justify-between items-end mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-color)]/70">{p.category}</span>
              <span className="text-lg font-serif font-bold text-[var(--text-color)]">{p.probability}%</span>
            </div>
            
            <div className="w-full h-[6px] bg-[var(--text-color)]/10 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${p.probability}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                className="h-full bg-[var(--text-color)] rounded-full"
              />
            </div>

            <div className="flex items-start gap-2 bg-[var(--text-color)]/5 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-[var(--text-color)]">
              <Lightbulb size={12} className="text-[var(--text-color)] mt-0.5 flex-shrink-0" />
              <p className="text-[10px] leading-relaxed font-medium text-[var(--text-color)]/60">
                <span className="text-[var(--text-color)] font-bold lowercase tracking-normal">AI Insight:</span> {p.tip}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-[var(--text-color)]/5">
        <p className="text-[9px] text-[var(--muted-color)] uppercase tracking-widest leading-relaxed text-center">
          Predictions are based on historical matching data and profile synchronization.
        </p>
      </div>
    </div>
  );
};

export default EligibilityPredictor;
