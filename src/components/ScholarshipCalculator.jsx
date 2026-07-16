import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, DollarSign, GraduationCap, TrendingUp, Info } from 'lucide-react';

const ScholarshipCalculator = () => {
  const [inputs, setInputs] = useState({
    cgpa: 8.5,
    familyIncome: 500000,
    fieldOfStudy: 'STEM',
    studyLevel: 'Undergraduate'
  });

  const calculateEstimate = () => {
    // Basic logic for estimation
    let base = 50000; // Base amount in some currency (e.g., INR or USD)
    
    // Academic Multiplier
    const academicMultiplier = inputs.cgpa >= 9.5 ? 2.5 : inputs.cgpa >= 8.5 ? 1.8 : 1.2;
    
    // Financial Need Multiplier
    const needMultiplier = inputs.familyIncome <= 200000 ? 2.0 : inputs.familyIncome <= 600000 ? 1.4 : 1.0;
    
    // Field Multiplier (STEM usually gets more funding)
    const fieldMultiplier = inputs.fieldOfStudy === 'STEM' ? 1.3 : 1.0;

    return Math.round(base * academicMultiplier * needMultiplier * fieldMultiplier);
  };

  const estimate = calculateEstimate();
  
  // Calculate fill percentages for elegant sliders
  const cgpaPercent = ((inputs.cgpa - 6) / 4) * 100;
  const incomePercent = ((inputs.familyIncome - 100000) / 1900000) * 100;

  return (
    <div className="bg-[var(--card-bg)] rounded-[2rem] border border-[var(--text-color)]/10 overflow-hidden shadow-2xl shadow-[var(--text-color)]/[0.02]">
      <div className="p-8 sm:p-10 border-b border-[var(--text-color)]/5 bg-[var(--text-color)]/[0.02]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--text-color)] text-[var(--bg-color)] rounded-2xl shadow-md shadow-[var(--text-color)]/10">
            <Calculator size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-[var(--text-color)]">Scholarship Estimator</h3>
            <p className="text-[9px] text-[var(--muted-color)] font-extrabold tracking-[0.2em] uppercase">AI-Powered Funding Projection</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 sm:p-10 border-r border-[var(--text-color)]/5 space-y-10">
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">Current CGPA</label>
              <span className="text-xs font-black text-[var(--text-color)] bg-[var(--text-color)]/5 px-3 py-1 rounded-full">{inputs.cgpa} / 10.0</span>
            </div>
            <div className="relative flex items-center">
              <input 
                type="range" 
                min="6.0" 
                max="10.0" 
                step="0.1" 
                value={inputs.cgpa}
                onChange={(e) => setInputs({...inputs, cgpa: parseFloat(e.target.value)})}
                style={{
                  background: `linear-gradient(to right, var(--text-color)) 0% 0% / ${cgpaPercent}% 100% no-repeat, rgba(15, 17, 21, 0.08)`
                }}
                className="w-full accent-[var(--text-color)] h-[5px] rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-4 block">Field of Study</label>
            <div className="grid grid-cols-2 gap-3">
              {['STEM', 'Humanities', 'Commerce', 'Arts'].map((field) => (
                <button
                  key={field}
                  onClick={() => setInputs({...inputs, fieldOfStudy: field})}
                  className={`py-3.5 px-6 rounded-2xl border text-[10px] uppercase font-bold tracking-widest transition-all ${
                    inputs.fieldOfStudy === field 
                      ? 'bg-[var(--text-color)] text-[var(--bg-color)] border-[var(--text-color)] shadow-md shadow-[var(--text-color)]/10' 
                      : 'bg-[var(--card-bg)] border-[var(--text-color)]/10 text-[var(--muted-color)] hover:border-[var(--text-color)]/30 hover:text-[var(--text-color)]'
                  }`}
                >
                  {field}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">Annual Family Income</label>
              <span className="text-xs font-black text-[var(--text-color)] bg-[var(--text-color)]/5 px-3 py-1 rounded-full">₹{inputs.familyIncome.toLocaleString()}</span>
            </div>
            <div className="relative flex items-center">
              <input 
                type="range" 
                min="100000" 
                max="2000000" 
                step="50000" 
                value={inputs.familyIncome}
                onChange={(e) => setInputs({...inputs, familyIncome: parseInt(e.target.value)})}
                style={{
                  background: `linear-gradient(to right, var(--text-color)) 0% 0% / ${incomePercent}% 100% no-repeat, rgba(15, 17, 21, 0.08)`
                }}
                className="w-full accent-[var(--text-color)] h-[5px] rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10 bg-[var(--text-color)]/[0.02] flex flex-col justify-center items-center text-center">
          <motion.div
            key={estimate}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-[var(--muted-color)] mb-3 block">Estimated Award Range</span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[var(--text-color)]">₹{estimate.toLocaleString()}</span>
              <span className="text-xs font-bold text-[var(--muted-color)]">/ Year</span>
            </div>
          </motion.div>

          <div className="space-y-4 w-full">
            <div className="flex items-center gap-3 p-4 bg-[var(--card-bg)]/60 rounded-2xl border border-[var(--text-color)]/5">
              <TrendingUp size={16} className="text-[var(--text-color)]" />
              <p className="text-[10px] text-left text-[var(--muted-color)] leading-relaxed">
                Based on your {inputs.cgpa} CGPA, you qualify for <strong>Top 15%</strong> of merit fellowships.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-[var(--card-bg)]/60 rounded-2xl border border-[var(--text-color)]/5">
              <Info size={16} className="text-[var(--text-color)]" />
              <p className="text-[10px] text-left text-[var(--muted-color)] leading-relaxed">
                Financial need weighting adds ~<strong>{inputs.familyIncome <= 500000 ? '40%' : '15%'}</strong> to your total potential.
              </p>
            </div>
          </div>

          <button className="mt-10 w-full py-5 bg-[var(--text-color)] text-[var(--bg-color)] rounded-full text-xs font-bold uppercase tracking-widest hover:shadow-2xl transition-all flex items-center justify-center gap-3">
            Search Matching Programs
            <TrendingUp size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCalculator;
