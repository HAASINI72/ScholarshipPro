import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

const Hero = ({ onGetStarted, onRegister }) => {
  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center overflow-hidden premium-gradient-bg">
      {/* Immersive Glassmorphic Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] -z-10 animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/4 right-1/4 w-[45vw] h-[45vw] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[140px] -z-10 animate-pulse duration-[12000ms]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] border border-[var(--text-color)]/[0.02] rounded-full -z-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] border border-[var(--text-color)]/[0.01] rounded-full -z-20 pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
            }
          }
        }}
        className="max-w-5xl mx-auto z-10"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--text-color)]/[0.04] border border-[var(--text-color)]/5 rounded-full text-[10px] uppercase tracking-[0.3em] font-semibold text-[var(--muted-color)] mb-10"
        >
          <Sparkles size={11} className="text-[var(--text-color)]" />
          <span>AI-Powered Funding Intelligence</span>
        </motion.div>
        
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl sm:text-7xl md:text-8xl font-serif font-black leading-[0.9] tracking-tight mb-8 text-[var(--text-color)] max-w-4xl mx-auto"
        >
          Find your <span className="italic font-normal">academic</span> precision matches.
        </motion.h1>
        
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 25 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-[var(--muted-color)] max-w-2xl mx-auto mb-14 font-light leading-relaxed"
        >
          A premium matching engine blending academic history with future aspirations. 
          Discover, apply, and secure the funding your talent deserves.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-10 py-5 bg-[var(--text-color)] text-[var(--bg-color)] rounded-full text-xs uppercase tracking-widest font-bold shadow-xl shadow-[var(--text-color)]/10 hover:shadow-2xl hover:shadow-[var(--text-color)]/20 hover:opacity-95 transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Start Your Profile</span>
            <ArrowRight size={14} />
          </motion.button>
          
          <motion.button
            onClick={onRegister}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-10 py-5 border border-[var(--text-color)]/20 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[var(--text-color)]/5 transition-all"
          >
            Create Account
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Stats micro-labels */}
      <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-[var(--muted-color)] font-medium">
        <div className="flex gap-12">
          <div>$42M+ Processed</div>
          <div>12k+ Active Students</div>
        </div>
        <div className="hidden sm:block">Scroll to explore catalog</div>
      </div>
    </section>
  );
};

export default Hero;
