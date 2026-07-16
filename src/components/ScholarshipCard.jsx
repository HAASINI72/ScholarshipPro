import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Calendar, DollarSign, Award, Bookmark } from 'lucide-react';

const ScholarshipCard = ({ 
  item, index, onSave, onApply, isSaved, hasApplied 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
      transition={{ delay: index * 0.05 }}
      className="group card-premium p-8 sm:p-10 hover:border-[var(--text-color)]/30 hover:shadow-[0_30px_60px_-15px_rgba(15,17,21,0.06)] dark:hover:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.015)] relative overflow-hidden transition-colors"
    >
      {/* Match Score Badge with a gorgeous organic pill shape */}
      <div className="absolute top-0 right-0 flex items-center">
        <div className="px-3.5 py-2.5 bg-[var(--bg-color)]/40 backdrop-blur-md border-[var(--text-color)]/5 border-l border-b text-[9px] uppercase tracking-[0.25em] font-extrabold text-[var(--muted-color)] rounded-bl-xl">
          {item.type}
        </div>
        <div className="px-5 py-2.5 bg-[var(--text-color)] text-[var(--bg-color)] text-[9px] uppercase tracking-widest font-black rounded-bl-[1.5rem] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          <span>{item.matchScore}% Match</span>
        </div>
      </div>
      
      <div className="flex justify-between items-start mb-8 mt-5">
        <div className="w-11 h-11 bg-[var(--text-color)]/[0.04] dark:bg-white/[0.04] rounded-2xl flex items-center justify-center text-[var(--text-color)] border border-[var(--text-color)]/5">
          <Award size={20} className="stroke-[1.5]" />
        </div>
        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => onSave(item)}
            className={`${isSaved ? 'text-[var(--text-color)] bg-[var(--text-color)]/5 border-[var(--text-color)]/10' : 'text-[var(--muted-color)] hover:text-[var(--text-color)]'} w-9 h-9 rounded-full border border-transparent transition-colors flex items-center justify-center`}
          >
            <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
          </motion.button>
          <motion.a 
            whileHover={{ scale: 1.12 }}
            href={item.link || '#'} 
            className="w-9 h-9 rounded-full border border-transparent hover:border-[var(--text-color)]/15 flex items-center justify-center text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={15} />
          </motion.a>
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-tight mb-4 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300 min-h-[3.5rem] line-clamp-2">{item.name}</h3>
      
      <div className="bg-[var(--text-color)]/[0.02] dark:bg-white/[0.015] border border-[var(--text-color)]/[0.03] p-4 rounded-2xl mb-6">
        <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-[var(--muted-color)] mb-1 block">AI Relevance analysis</span>
        <p className="text-2xs sm:text-xs text-[var(--text-color)]/95 leading-relaxed font-medium">
          {item.eligibilityReason}
        </p>
      </div>

      <p className="text-[var(--muted-color)] text-xs sm:text-sm font-light leading-relaxed mb-6 line-clamp-2 min-h-[2.5rem]">
        {item.description}
      </p>

      <div className="flex flex-wrap gap-5 py-5 border-t border-[var(--text-color)]/5">
        <div className="flex items-center gap-1.5">
          <DollarSign size={13} className="text-[var(--muted-color)]" />
          <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--text-color)]/90">{item.amount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={13} className="text-[var(--muted-color)]" />
          <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--text-color)]/90">{item.deadline}</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Required Verification Keys</span>
          <div className="flex flex-wrap gap-1.5">
            {item.requiredDocuments?.map((doc, idx) => (
              <span key={idx} className="text-[8px] px-2.5 py-1 bg-[var(--text-color)]/[0.03] dark:bg-white/[0.03] border border-[var(--text-color)]/5 rounded-full text-[var(--text-color)]/70 uppercase tracking-tight font-medium">
                {doc}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-1 block">Eligibility Boundary</span>
          <p className="text-[11px] text-[var(--text-color)]/80 leading-relaxed italic">
            {item.eligibility}
          </p>
        </div>
      </div>

      <div className="mt-8">
        {hasApplied ? (
          <div className="w-full py-4 bg-green-500/10 text-green-600 border border-green-500/15 rounded-xl text-[9px] uppercase font-black tracking-widest text-center">
            Applied • Under Review
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onApply && onApply(item)}
            className="w-full py-3.5 bg-[var(--text-color)] text-[var(--bg-color)] rounded-xl text-[9px] uppercase font-black tracking-widest hover:opacity-90 transition-all shadow-md shadow-[var(--text-color)]/5"
          >
            Apply Now
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ScholarshipCard;
