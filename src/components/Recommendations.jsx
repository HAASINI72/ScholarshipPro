import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, User, FileText, ArrowRight, RefreshCw, Key, HelpCircle, GraduationCap, DollarSign, Brain } from 'lucide-react';
import ScholarshipCard from './ScholarshipCard';

const FEATURED_PREMIUM_RECOMMENDATIONS = [
  {
    name: 'Rhodes Scholarship at Oxford',
    type: 'Merit-based',
    amount: 'Full Tuition & Stipend (approx. £19,000/yr)',
    deadline: 'October 1, 2026',
    eligibility: 'Outstanding graduates with an exceptional academic record and leadership potential.',
    description: 'The oldest and perhaps most prestigious international fellowship, supporting postgraduate study at the University of Oxford.',
    link: 'https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/',
    matchScore: 92,
    eligibilityReason: 'Identified as pre-eligible based on outstanding research focus and academic criteria.',
    requiredDocuments: ['6 References', 'Academic Statement', 'CV', 'Transcript']
  },
  {
    name: 'Erasmus Mundus Joint Master Degrees',
    type: 'Research',
    amount: 'Full coverage (Tuition, travel, allowance up to €49,000)',
    deadline: 'February 15, 2026',
    eligibility: 'Undergraduate degrees completed or in final year, open globally.',
    description: 'High-level integrated study programs delivered by an international consortium of higher education institutions.',
    link: 'https://ec.europa.eu/programmes/erasmus-plus/opportunities/individuals/students/erasmus-mundus-joint-master-degrees_en',
    matchScore: 89,
    eligibilityReason: 'Matches international study intent and collaborative research framework.',
    requiredDocuments: ['Motivation Letter', 'Language Certificate', 'Two LORs', 'Marksheet']
  },
  {
    name: 'Gates Cambridge Scholarship',
    type: 'Research',
    amount: 'Full Cost of Study at Cambridge + £18,000/yr stipend',
    deadline: 'December 3, 2025',
    eligibility: 'Citizens of any country outside the United Kingdom to pursue a postgraduate degree.',
    description: 'Funding outstanding applicants from countries outside the UK to pursue a full-time postgraduate degree at Cambridge.',
    link: 'https://www.gatescambridge.org/',
    matchScore: 85,
    eligibilityReason: 'Perfect match for candidates targeting elite institutions for advanced master/PhD research.',
    requiredDocuments: ['Cambridge Application', 'Gates Reference', 'Research Proposal']
  }
];

const Recommendations = ({ 
  user, 
  results = [], 
  onSave, 
  onApply, 
  savedScholarships = [], 
  applications = [],
  onNavigate,
  onUpdateProfileAndGetRecs 
}) => {
  const [profileForm, setProfileForm] = useState({
    cgpa: user?.profile?.cgpa || '',
    eduLevel: user?.profile?.eduLevel || 'Undergraduate',
    course: user?.profile?.course || user?.profile?.major || '',
    income: user?.profile?.income || '',
    category: user?.profile?.category || 'General',
    city: user?.profile?.city || user?.profile?.state || '',
    skills: user?.profile?.techSkills || user?.profile?.skills || '',
    interests: user?.profile?.careerGoal || user?.profile?.interests || '',
    gender: user?.profile?.gender || 'Male',
    firstGen: user?.profile?.firstGen || false,
    disability: user?.profile?.disability || false,
    minority: user?.profile?.minority || false
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const activeResults = results && results.length > 0 ? results : [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    try {
      if (onUpdateProfileAndGetRecs) {
        await onUpdateProfileAndGetRecs(profileForm);
      }
    } catch (err) {
      console.error(err);
      setError('Could not generate recommendations. Ensure you filled in valid info and your API keys are correct.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-32 px-6">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[var(--muted-color)] mb-4">AI Recommendation Hub</span>
        <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-[var(--text-color)] mb-6">
          Tailored <span className="italic font-normal">Recommendations</span> for You
        </h1>
        <p className="text-sm font-light text-[var(--muted-color)] max-w-xl leading-relaxed">
          Unlock personalized, fully-vetted real-world scholarship opportunities generated automatically using deep matching algorithms.
        </p>
      </div>

      {!user ? (
        /* Guest Mode showing Featured Elite Scholarships */
        <div className="space-y-16">
          <div className="bg-[var(--text-color)] text-[var(--bg-color)] p-8 md:p-12 rounded-3xl border border-[var(--text-color)]/5 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto shadow-xl shadow-[var(--text-color)]/5">
            <div className="space-y-4 max-w-xl text-left">
              <span className="text-[9px] uppercase tracking-widest font-extrabold bg-[var(--bg-color)] text-[var(--text-color)] px-3 py-1 rounded-full">Personalized Analysis</span>
              <h3 className="text-2xl font-serif font-bold">Want to receive customized AI matches?</h3>
              <p className="text-xs font-light tracking-wide opacity-80 leading-relaxed">
                Connect your account or register a profile in seconds. We construct a secure academic passport to align millions of dollars in grants directly with your GPA, income constraints, and career milestones.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
              <button
                onClick={() => onNavigate('auth')}
                className="px-8 py-4 bg-[var(--bg-color)] text-[var(--text-color)] rounded-full text-[10px] uppercase tracking-widest font-black hover:opacity-90 transition-all text-center"
              >
                Sign In & Match
              </button>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex flex-col items-start max-w-5xl mx-auto">
              <h2 className="text-2xl font-serif font-bold tracking-tight text-[var(--text-color)]">Featured Elite Grants</h2>
              <p className="text-xs text-[var(--muted-color)] font-light mt-1">Globally accessible top-tier scholarship opportunities currently accepting candidates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {FEATURED_PREMIUM_RECOMMENDATIONS.map((item, i) => (
                <ScholarshipCard
                  key={i}
                  item={item}
                  index={i}
                  onSave={onSave}
                  onApply={onApply}
                  isSaved={savedScholarships.some(s => s.name === item.name)}
                  hasApplied={applications.some(a => a.name === item.name)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Logged In Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left panel: Edit matches parameters */}
          <div className="lg:col-span-1 bg-[var(--card-bg)] p-8 rounded-3xl border border-[var(--border-color)] h-fit space-y-8">
            <div>
              <h3 className="text-lg font-serif font-bold flex items-center gap-2">
                <Brain size={18} className="text-[var(--text-color)]" />
                Matching Context
              </h3>
              <p className="text-2xs text-[var(--muted-color)] uppercase tracking-widest mt-1">Refine your profiling data</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)] block mb-1">Academic CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  value={profileForm.cgpa}
                  onChange={handleInputChange}
                  placeholder="e.g. 8.5"
                  className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--text-color)]/30 text-[var(--text-color)]"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)] block mb-1">Education Level</label>
                <select
                  name="eduLevel"
                  value={profileForm.eduLevel}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--text-color)]/30 text-[var(--text-color)]"
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD / Doctorate">PhD / Doctorate</option>
                  <option value="High School">High School</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)] block mb-1">Course / Major</label>
                <input
                  type="text"
                  name="course"
                  value={profileForm.course}
                  onChange={handleInputChange}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--text-color)]/30 text-[var(--text-color)]"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)] block mb-1">Annual family Income (₹)</label>
                <input
                  type="number"
                  name="income"
                  value={profileForm.income}
                  onChange={handleInputChange}
                  placeholder="e.g. 450000"
                  className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--text-color)]/30 text-[var(--text-color)]"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)] block mb-1">Category</label>
                <select
                  name="category"
                  value={profileForm.category}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--text-color)]/30 text-[var(--text-color)]"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted-color)] block mb-1">Gender</label>
                <select
                  name="gender"
                  value={profileForm.gender}
                  onChange={handleInputChange}
                  className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--text-color)]/30 text-[var(--text-color)]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="pt-2 space-y-3 border-t border-[var(--text-color)]/5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="firstGen"
                    checked={profileForm.firstGen}
                    onChange={handleInputChange}
                    className="rounded border-[var(--text-color)]/20 text-[var(--text-color)] focus:ring-[var(--text-color)]"
                  />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-color)]">First Gen Student</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="disability"
                    checked={profileForm.disability}
                    onChange={handleInputChange}
                    className="rounded border-[var(--text-color)]/20 text-[var(--text-color)] focus:ring-[var(--text-color)]"
                  />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-color)]">With Disability</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="minority"
                    checked={profileForm.minority}
                    onChange={handleInputChange}
                    className="rounded border-[var(--text-color)]/20 text-[var(--text-color)] focus:ring-[var(--text-color)]"
                  />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-color)]">Minority Category</span>
                </label>
              </div>

              {error && (
                <div className="text-[10px] text-red-500 font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-500/10">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-3.5 bg-[var(--text-color)] text-[var(--bg-color)] rounded-xl text-[10px] uppercase tracking-widest font-black hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    Generating Matches...
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    Refresh Recommendations
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right panel: Matches List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[var(--text-color)]">Personalized Target Grants</h2>
                <p className="text-xs text-[var(--muted-color)] font-light mt-1">
                  We matched you on {activeResults.length} high-probability opportunities based on your profile context.
                </p>
              </div>
            </div>

            {activeResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeResults.map((item, i) => (
                  <ScholarshipCard
                    key={i}
                    item={item}
                    index={i}
                    onSave={onSave}
                    onApply={onApply}
                    isSaved={savedScholarships.some(s => s.name === item.name)}
                    hasApplied={applications.some(a => a.name === item.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-16 border border-dashed border-[var(--text-color)]/15 rounded-3xl text-center flex flex-col items-center justify-center space-y-4">
                <Brain size={36} className="text-[var(--muted-color)] opacity-65" />
                <h4 className="text-lg font-serif font-bold text-[var(--text-color)]">No Recommendations Generated Yet</h4>
                <p className="text-xs text-[var(--muted-color)] max-w-sm leading-relaxed font-light">
                  Please update your parameters on the left and hit the <strong>Refresh Recommendations</strong> button to initiate our real-time Gemini recommendation agent.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
