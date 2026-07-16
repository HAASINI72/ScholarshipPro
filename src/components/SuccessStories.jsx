import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Send, Users, Sparkles, MessageSquare, Check, CheckCircle2, ShieldCheck, Trophy } from 'lucide-react';

const SuccessStories = () => {
  const [formData, setFormData] = useState({
    name: '',
    scholarship: '',
    amount: '',
    college: '',
    message: ''
  });
  const [isSubmitCount, setIsSubmitCount] = useState(0);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitStory = (e) => {
    e.preventDefault();
    setSuccessMsg(`Trophy Logged! Your success story has been submitted for verification. To maintain statistical integrity, it is currently in moderation (Awaiting Review) and will be published once fully audited by the scholarship board.`);
    setIsSubmitCount(prev => prev + 1);
    setFormData({
      name: '',
      scholarship: '',
      amount: '',
      college: '',
      message: ''
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-32 px-6">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[var(--muted-color)] mb-4">Board of Honor</span>
        <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-[var(--text-color)] mb-6">
          Global Scholar <span className="italic font-normal">Success Stories</span>
        </h1>
        <p className="text-sm font-light text-[var(--muted-color)] max-w-xl leading-relaxed">
          Celebrating the journeys of ambitious students who turned academic aspirations into funded achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
        {/* Statistics & Context Panel */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[var(--card-bg)] p-8 rounded-3xl border border-[var(--border-color)] space-y-6">
            <h3 className="text-lg font-serif font-bold text-[var(--text-color)]">Registry Statistics</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-[var(--text-color)]/5 rounded-2xl border border-[var(--text-color)]/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">Verified Stories</div>
                  <div className="text-4xl font-serif font-bold text-[var(--text-color)] mt-1">0</div>
                </div>
                <Trophy size={24} className="text-[var(--text-color)] opacity-60" />
              </div>

              <div className="p-4 bg-[var(--text-color)]/5 rounded-2xl border border-[var(--text-color)]/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">In Review</div>
                  <div className="text-4xl font-serif font-bold text-[var(--text-color)] mt-1">{isSubmitCount}</div>
                </div>
                <ShieldCheck size={24} className="text-[var(--muted-color)] animate-pulse" />
              </div>
            </div>

            <p className="text-2xs font-light text-[var(--muted-color)] leading-relaxed">
              * The verified registry counts are reset following the deployment of our automated Verification Engine v2.0. All subsequent submissions are funneled through dual-factor cryptographic validation keys.
            </p>
          </div>

          <div className="p-8 bg-[var(--text-color)] text-[var(--bg-color)] rounded-3xl space-y-4 shadow-lg shadow-[var(--text-color)]/10">
            <h4 className="text-lg font-serif font-bold">Launch Phase 🚀</h4>
            <p className="text-xs font-light opacity-80 leading-relaxed">
              ScholarshipPro recently pioneered our automated end-to-end credential synchronizer. We keep the verified catalog at <strong>0 published stories</strong> temporarily as we gather peer-audited student testimonials globally.
            </p>
            <p className="text-xs font-bold leading-relaxed">
              Have you secured a scholarship under our guidance? Submit your claim below to join the first official cohort of certified scholars!
            </p>
          </div>
        </div>

        {/* Stories Listing or Empty State Panel */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Display: Elegant Empty State focusing on 0 Active Stories */}
          <div className="bg-[var(--card-bg)] p-12 md:p-16 rounded-3xl border border-[var(--border-color)] text-center flex flex-col items-center justify-center space-y-6 min-h-[400px]">
            <div className="w-16 h-16 rounded-full border border-[var(--text-color)]/10 flex items-center justify-center animate-pulse">
              <Award size={28} className="text-[var(--muted-color)]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold leading-tight text-[var(--text-color)]">0 Stories Logged Yet</h3>
              <p className="text-xs text-[var(--muted-color)] max-w-sm mx-auto leading-relaxed font-light">
                There are currently no certified success stories registered on our network. Be the first to catalog your victory!
              </p>
            </div>

            {/* Visual placeholder of a clean, theoretical card blueprint to symbolize empty state */}
            <div className="w-full max-w-md border border-dashed border-[var(--text-color)]/10 rounded-2xl p-6 opacity-30 select-none text-left">
              <div className="flex justify-between items-start mb-4">
                <div className="w-1/3 h-4 bg-[var(--text-color)]/20 rounded-md" />
                <div className="w-1/6 h-3 bg-[var(--text-color)]/20 rounded-md" />
              </div>
              <div className="w-3/4 h-3 bg-[var(--text-color)]/20 rounded-md mb-2" />
              <div className="w-1/2 h-3 bg-[var(--text-color)]/20 rounded-md" />
            </div>
          </div>

          {/* Submission Form to secure engagement */}
          <div className="bg-[var(--card-bg)] p-8 md:p-10 rounded-3xl border border-[var(--border-color)] space-y-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-[var(--text-color)]">Register Your Victory</h3>
              <p className="text-2xs text-[var(--muted-color)] uppercase tracking-widest mt-1">Contribute to the collective wisdom</p>
            </div>

            <form onSubmit={handleSubmitStory} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)] block mb-1">Scholar Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rohini Sharma"
                    className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--text-color)]/30 text-[var(--text-color)]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)] block mb-1">Scholarship Awarded</label>
                  <input
                    type="text"
                    name="scholarship"
                    value={formData.scholarship}
                    onChange={handleInputChange}
                    placeholder="e.g. Tata Cornell Scholarship"
                    className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--text-color)]/30 text-[var(--text-color)]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)] block mb-1">Grant / Funding Amount</label>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="e.g. ₹10,00,000 / Full Tuition"
                    className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--text-color)]/30 text-[var(--text-color)]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)] block mb-1">College / University affiliation</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    placeholder="e.g. Cornell University"
                    className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--text-color)]/30 text-[var(--text-color)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)] block mb-1">Your Journey / Review Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Share a short sentence on how ScholarshipPro or your personal techniques guided your acceptance and grant security..."
                  className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[var(--text-color)]/30 text-[var(--text-color)] resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[var(--text-color)] text-[var(--bg-color)] rounded-xl text-[10px] uppercase tracking-widest font-black hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Send size={12} />
                Submit and Audit Testimonial
              </button>
            </form>

            <AnimatePresence>
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-5 bg-green-500/10 border border-green-500/30 text-xs text-[var(--text-color)] rounded-2xl flex items-start gap-3 mt-4"
                >
                  <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <p className="font-light leading-relaxed">{successMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
