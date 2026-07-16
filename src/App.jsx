import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScholarshipForm from './components/ScholarshipForm';
import ResultsList from './components/ResultsList';
import ScholarshipCard from './components/ScholarshipCard';
import UserProfile from './components/UserProfile';
import ScholarshipCalculator from './components/ScholarshipCalculator';
import Recommendations from './components/Recommendations';
import SuccessStories from './components/SuccessStories';
import AuthPage from './components/AuthPage';
import AIChatSupport from './components/AIChatSupport';
import EligibilityPredictor from './components/EligibilityPredictor';
import { getRecommendations, predictEligibility, getMe, updateProfile } from './lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, GraduationCap, Globe, Zap } from 'lucide-react';

const DISCOVER_SCHOLARSHIPS = [
  {
    name: 'Reliance Foundation Undergraduate Scholarship',
    type: 'Merit-based',
    amount: '₹2,00,000',
    deadline: 'October 15, 2026',
    eligibility: 'First-year UG students with >60% in Class 12',
    description: 'Supporting meritorious students from low-income families to pursue their professional education.',
    link: 'https://www.scholarships.reliancefoundation.org/',
    matchScore: 95,
    eligibilityReason: 'Aligned with your financial profile and academic record.',
    requiredDocuments: ['Income Certificate', 'Class 12 Marksheet', 'College ID']
  },
  {
    name: 'K.C. Mahindra Scholarships for Post-Graduate Studies Abroad',
    type: 'Merit-based',
    amount: '₹10,00,000',
    deadline: 'March 31, 2026',
    eligibility: 'Graduates with a first-class degree looking for overseas study.',
    description: 'Interest-free loan scholarships for higher studies abroad in diverse fields.',
    link: 'https://www.kcmet.org/what-we-do-Scholarships-Post-Graduate.aspx',
    matchScore: 88,
    eligibilityReason: 'Strong match for your aspirations for international post-graduation.',
    requiredDocuments: ['Admission Letter', 'GRE/TOEFL Scores', 'LORs']
  },
  {
    name: 'TATA Scholarship at Cornell University',
    type: 'Need-based',
    amount: 'Full Tuition',
    deadline: 'January 2, 2026',
    eligibility: 'Indian students accepted to Cornell Undergraduate programs.',
    description: 'Providing full or partial tuition support for undergraduate study at Cornell University.',
    link: 'https://admissions.cornell.edu/apply/international-students/tata-scholarship',
    matchScore: 82,
    eligibilityReason: 'Matches your nationality and target institution prestige.',
    requiredDocuments: ['Financial Documents', 'Acceptance Letter', 'Essay']
  },
  {
    name: 'Fulbright-Nehru Master’s Fellowships',
    type: 'Research',
    amount: 'Full Funding',
    deadline: 'May 15, 2026',
    eligibility: 'Outstanding Indians to pursue a master’s degree at select U.S. colleges.',
    description: 'Highly competitive fellowship covering tuition, airfare, and living expenses.',
    link: 'https://www.usief.org.in/Fulbright-Nehru-Masters-Fellowships.aspx',
    matchScore: 75,
    eligibilityReason: 'Ideal for your career stage and leadership potential.',
    requiredDocuments: ['CV', 'Statement of Purpose', '3 LORs']
  }
];

export default function App() {
  const [view, setView] = useState('home'); // home, form, results, dashboard, scholarship-detail, calculator, discover, auth
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [authMode, setAuthMode] = useState('login');
  const [formStep, setFormStep] = useState(1);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [results, setResults] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  // Check for existing session
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
          // If user has a profile, pre-fetch recommendations
          if (userData.profile?.cgpa) {
            const [recs, preds] = await Promise.all([
              getRecommendations(userData.profile),
              predictEligibility(userData.profile)
            ]);
            setResults(recs);
            setPredictions(preds);
          }
        } catch (err) {
          console.error('Session expired');
          localStorage.removeItem('token');
        }
      }
    };
    checkAuth();
  }, []);

  // Theme Management
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (mode = 'login') => {
    setAuthMode(mode);
    setView('auth');
  };

  const handleAuthComplete = (newUser) => {
    setUser(newUser);
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('home');
  };


  const toggleSave = (scholarship) => {
    setSavedScholarships(prev => {
      const isSaved = prev.find(s => s.name === scholarship.name);
      if (isSaved) {
        return prev.filter(s => s.name !== scholarship.name);
      }
      return [...prev, scholarship];
    });
  };

  const applyToScholarship = (scholarship) => {
    setApplications(prev => {
      const alreadyApplied = prev.find(a => a.name === scholarship.name);
      if (alreadyApplied) return prev;
      return [...prev, { 
        ...scholarship, 
        status: 'Under Review', 
        notes: '',
        appliedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      }];
    });
    
    // Redirect to official scholarship page
    if (scholarship.link && scholarship.link !== '#') {
      window.open(scholarship.link, '_blank', 'noopener,noreferrer');
    }
  };

  const updateApplication = (name, updates) => {
    setApplications(prev => prev.map(app => 
      app.name === name ? { ...app, ...updates } : app
    ));
  };

  const handleStart = () => {
    setFormStep(1);
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToForm = (step) => {
    setFormStep(step);
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (formData) => {
    const { documents, ...profile } = formData;
    setLoading(true);
    setPredicting(true);
    setError(null);
    try {
      // Save profile data into user state
      setUser(prev => ({
        ...prev,
        profile: { ...prev?.profile, ...profile },
        documents: { ...prev?.documents, ...documents }
      }));

      // If logged in, sync with backend
      if (localStorage.getItem('token')) {
        await updateProfile(profile);
      }
      
      // Run both parallel
      const [recs, preds] = await Promise.all([
        getRecommendations(profile),
        predictEligibility(profile)
      ]);
      setResults(recs);
      setPredictions(preds);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('An error occurred while matching. Please try again.');
    } finally {
      setLoading(false);
      setPredicting(false);
    }
  };

  const handleUpdateProfileAndGetRecs = async (newProfile) => {
    setPredicting(true);
    try {
      // Sync local user state
      setUser(prev => ({
        ...prev,
        profile: { ...prev?.profile, ...newProfile }
      }));

      // If logged in, sync with backend
      if (localStorage.getItem('token')) {
        await updateProfile(newProfile);
      }

      // Run parallel recommendations and eligibility prediction with Gemini
      const [recs, preds] = await Promise.all([
        getRecommendations(newProfile),
        predictEligibility(newProfile)
      ]);
      setResults(recs);
      setPredictions(preds);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setPredicting(false);
    }
  };

  const handleReset = () => {
    setResults([]);
    setPredictions([]);
    setSelectedScholarship(null);
    setView('home');
  };

  const missingFieldsCount = user ? [
    'name',
    'email',
    'nationality',
    'eduLevel',
    'college',
    'major',
    'cgpa',
    'income',
    'techSkills'
  ].filter(key => {
    // Check both profile and top level user properties
    if (user[key]) return false;
    if (user.profile && user.profile[key]) return false;
    return true;
  }).length : 9;

  const hasDocsCount = user?.documents ? Object.values(user.documents).filter(v => v !== null).length : 0;
  const totalDocsToTrack = 1; // Just track if at least one doc is uploaded for basic completion
  const hasDocs = hasDocsCount > 0;
  
  const totalWeight = 10; // 9 fields + 1 doc status
  const completedWeight = (9 - missingFieldsCount) + (hasDocs ? 1 : 0);
  const completionRate = user ? Math.round((completedWeight / totalWeight) * 100) : 0;

  const handleViewScholarship = (scholarship) => {
    setSelectedScholarship(scholarship);
    setView('scholarship-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      <Navbar 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        onNavigate={setView} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      <AIChatSupport />
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero 
                onGetStarted={handleStart} 
                onRegister={() => handleLogin('register')} 
              />
              
              {/* Feature Preview Section */}
              <section className="max-w-7xl mx-auto px-6 py-32 border-t border-[var(--text-color)]/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted-color)] mb-6 block">01 / Curated</span>
                    <h3 className="text-2xl font-serif font-bold mb-4 text-[var(--text-color)]">Hand-picked by AI</h3>
                    <p className="text-sm text-[var(--muted-color)] leading-relaxed font-light">
                      Our engines scan thousands of regional and global grants to find those that truly align with your specific path.
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted-color)] mb-6 block">02 / Verified</span>
                    <h3 className="text-2xl font-serif font-bold mb-4 text-[var(--text-color)]">Official Sources</h3>
                    <p className="text-sm text-[var(--muted-color)] leading-relaxed font-light">
                      Every recommendation includes verified links to the official provider, ensuring you're always applying to the right place.
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted-color)] mb-6 block">03 / Analytics</span>
                    <h3 className="text-2xl font-serif font-bold mb-4 text-[var(--text-color)]">Matching Score</h3>
                    <p className="text-sm text-[var(--muted-color)] leading-relaxed font-light">
                      We calculate a precision score for each opportunity based on your GPA, nationality, and research field.
                    </p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {view === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-20"
            >
              <ScholarshipForm onSubmit={handleSubmit} loading={loading} initialStep={formStep} />
              {error && (
                <div className="max-w-2xl mx-auto px-6 pb-20 text-red-500 text-xs uppercase tracking-widest font-bold">
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {view === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-20"
            >
              <ResultsList 
                results={results} 
                onSave={toggleSave}
                onApply={applyToScholarship}
                savedIds={savedScholarships.map(s => s.name)} 
                applications={applications}
              />
              <div className="flex justify-center pb-32">
                <button 
                  onClick={handleReset}
                  className="px-8 py-4 border border-[var(--text-color)]/20 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all"
                >
                  Start New Analysis
                </button>
              </div>
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-40 max-w-7xl mx-auto px-6 pb-32"
            >
              <div className="flex justify-between items-end mb-20">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[var(--muted-color)] mb-4 block">Personal Workspace</span>
                  <h2 className="text-5xl font-serif font-bold">Welcome back, <span className="italic font-normal">{user?.name}</span>.</h2>
                </div>
                <div className="flex gap-4">
                  <div className="p-6 bg-[var(--card-bg)] rounded-3xl border border-[var(--text-color)]/5 text-center px-10">
                    <div className="text-3xl font-serif font-bold mb-1">{applications.length}</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">Applied</div>
                  </div>
                  <div className="p-6 bg-[var(--card-bg)] rounded-3xl border border-[var(--text-color)]/5 text-center px-10">
                    <div className="text-3xl font-serif font-bold mb-1">{savedScholarships.length}</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">Saved</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                  {/* Dashboard Recommendations */}
                  {results.length > 0 && (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--muted-color)] flex items-center gap-2">
                          <Zap size={14} className="text-[var(--text-color)]" />
                          Recommended for You
                        </h3>
                        <button 
                          onClick={() => setView('results')}
                          className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-color)]/50 hover:text-[var(--text-color)] transition-colors"
                        >
                          View All
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {results.slice(0, 2).map((item, i) => (
                          <ScholarshipCard 
                            key={i}
                            item={item}
                            index={i}
                            onSave={toggleSave}
                            onApply={applyToScholarship}
                            isSaved={savedScholarships.find(s => s.name === item.name)}
                            hasApplied={applications.find(a => a.name === item.name)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dashboard Applications */}
                  <div className="space-y-8">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--muted-color)]">Active Tracker</h3>
                    {applications.length > 0 ? (
                      <div className="space-y-4">
                        {applications.map((app, i) => (
                          <div key={i} className="p-6 bg-[var(--card-bg)] rounded-2xl border border-[var(--text-color)]/5 flex justify-between items-center group hover:border-[var(--text-color)]/20 transition-all">
                            <div>
                              <div className="font-serif font-bold text-lg mb-1">{app.name}</div>
                              <div className="flex items-center gap-3">
                                <select 
                                  value={app.status}
                                  onChange={(e) => updateApplication(app.name, { status: e.target.value })}
                                  className="bg-transparent border-none text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] outline-none cursor-pointer hover:text-[var(--text-color)]"
                                >
                                  {['Submitted', 'Under Review', 'Interview Scheduled', 'Awarded', 'Rejected'].map(opt => (
                                    <option key={opt} value={opt} className="bg-[var(--bg-color)]">{opt}</option>
                                  ))}
                                </select>
                                <span className="text-[10px] text-[var(--muted-color)]/20">|</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">{app.appliedAt}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`w-2 h-2 rounded-full ${app.status === 'Awarded' ? 'bg-green-500' : 'bg-[var(--text-color)]'} animate-pulse`} />
                                <button 
                                  onClick={() => setView('profile')}
                                  className="w-10 h-10 rounded-full border border-[var(--text-color)]/10 flex items-center justify-center group-hover:bg-[var(--text-color)] group-hover:text-[var(--bg-color)] transition-all"
                                >
                                  <ArrowRight size={16} />
                                </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 border border-dashed border-[var(--text-color)]/10 rounded-3xl text-center">
                        <p className="text-[var(--muted-color)] font-light mb-6">No active applications yet.</p>
                      </div>
                    )}
                  </div>

                  {/* Dashboard Saved */}
                  <div className="space-y-8">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--muted-color)]">Saved Opportunities</h3>
                    {savedScholarships.length > 0 ? (
                      <div className="space-y-4">
                        {savedScholarships.map((r, i) => (
                          <div key={i} className="p-6 bg-[var(--card-bg)] rounded-2xl border border-[var(--text-color)]/5 flex justify-between items-center group hover:border-[var(--text-color)]/20 transition-all opacity-60 hover:opacity-100">
                            <div>
                              <div className="font-serif font-bold text-lg mb-1">{r.name}</div>
                              <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">{r.amount} • {r.deadline}</div>
                            </div>
                            <button className="w-10 h-10 rounded-full border border-[var(--text-color)]/10 flex items-center justify-center group-hover:bg-[var(--text-color)] group-hover:text-[var(--bg-color)] transition-all">
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--muted-color)]">Status Analytics</h3>
                  
                  <EligibilityPredictor predictions={predictions} loading={predicting} />

                  <div className="bg-[var(--text-color)] text-[var(--bg-color)] p-8 rounded-3xl">
                    <div className="text-[10px] uppercase font-bold tracking-widest opacity-40 mb-8">Verification Status</div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-sm font-medium">Profile {completionRate}% Complete</span>
                    </div>
                    <div className="w-full h-[2px] bg-[var(--bg-color)]/10 rounded-full overflow-hidden mb-8">
                      <div className={`h-full bg-[var(--bg-color)] transition-all duration-500`} style={{ width: `${completionRate}%` }} />
                    </div>
                    <button 
                      onClick={() => setView('profile')}
                      className="w-full py-4 bg-[var(--bg-color)]/10 rounded-full text-[10px] uppercase font-bold tracking-widest hover:bg-[var(--bg-color)]/20 transition-all font-bold"
                    >
                      {completionRate === 100 ? 'View Profile' : 'Complete Verification'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <UserProfile 
                user={user} 
                savedScholarships={savedScholarships} 
                applications={applications}
                predictions={predictions} 
                predicting={predicting} 
                onCompleteStep={navigateToForm}
                onUpdateApplication={updateApplication}
                onViewScholarship={handleViewScholarship}
                onNavigate={setView}
                onSave={toggleSave}
                onApply={applyToScholarship}
              />
            </motion.div>
          )}

          {view === 'scholarship-detail' && selectedScholarship && (
            <motion.div
              key="scholarship-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-40 pb-32 max-w-2xl mx-auto px-6"
            >
              <div className="mb-12 flex items-center justify-between">
                <button 
                  onClick={() => setView('profile')}
                  className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors"
                >
                  ← Back to Profile
                </button>
                <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-[var(--muted-color)]">Opportunity Detail</div>
              </div>
              
              <ScholarshipCard 
                item={selectedScholarship}
                index={0}
                onSave={toggleSave}
                onApply={applyToScholarship}
                isSaved={savedScholarships.find(s => s.name === selectedScholarship.name)}
                hasApplied={applications.find(a => a.name === selectedScholarship.name)}
              />
            </motion.div>
          )}

          {view === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-40 pb-32 max-w-5xl mx-auto px-6"
            >
              <div className="mb-12 flex items-center justify-between" id="calculator-header">
                <div>
                  <h2 className="text-4xl font-serif font-black mb-2 text-[var(--text-color)]">Estimate Your Funding</h2>
                  <p className="text-sm text-[var(--muted-color)] font-light">Fine-tune your details to see potential scholarship amounts.</p>
                </div>
                <button 
                  onClick={() => setView('dashboard')}
                  className="px-8 py-3 bg-[var(--bg-color)] border border-[var(--text-color)]/10 rounded-full text-[10px] uppercase font-bold tracking-widest hover:border-[var(--text-color)] transition-all"
                >
                  Dashboard
                </button>
              </div>
              <ScholarshipCalculator />
            </motion.div>
          )}

          {view === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-40 pb-32 max-w-7xl mx-auto px-6"
            >
              <div className="mb-16 text-center">
                <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[var(--muted-color)] mb-4 block">Marketplace</span>
                <h2 className="text-5xl font-serif font-bold mb-4 text-[var(--text-color)]">Discover <span className="italic font-normal">Global</span> Opportunities</h2>
                <p className="text-sm text-[var(--muted-color)] font-light max-w-xl mx-auto">Browse premium, real-world scholarship programs currently accepting applications from high-achieving candidates.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="discover-grid">
                {DISCOVER_SCHOLARSHIPS.map((item, i) => (
                  <ScholarshipCard 
                    key={i}
                    item={item}
                    index={i}
                    onSave={toggleSave}
                    onApply={applyToScholarship}
                    isSaved={savedScholarships.find(s => s.name === item.name)}
                    hasApplied={applications.find(a => a.name === item.name)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {view === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Recommendations 
                user={user}
                results={results}
                onSave={toggleSave}
                onApply={applyToScholarship}
                savedScholarships={savedScholarships}
                applications={applications}
                onNavigate={setView}
                onUpdateProfileAndGetRecs={handleUpdateProfileAndGetRecs}
              />
            </motion.div>
          )}

          {view === 'success-stories' && (
            <motion.div
              key="success-stories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SuccessStories />
            </motion.div>
          )}

          {view === 'auth' && (
            <AuthPage 
              initialMode={authMode} 
              onAuthComplete={handleAuthComplete}
              onBack={() => setView('home')}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-[var(--text-color)] text-[var(--bg-color)] py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="text-2xl font-serif font-bold tracking-tight mb-4 opacity-80">ScholarshipPro</div>
            <p className="opacity-40 text-sm max-w-xs font-light">
              Designing the future of academic funding through intelligence and elegant technology.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold mb-6 block opacity-40">Platform</span>
              <ul className="space-y-3 text-sm font-light opacity-70">
                <li><a href="#" className="hover:text-[var(--bg-color)]/80 transition-colors">Discover</a></li>
                <li><a href="#" className="hover:text-[var(--bg-color)]/80 transition-colors">Analyzer</a></li>
                <li><a href="#" className="hover:text-[var(--bg-color)]/80 transition-colors">Grants</a></li>
              </ul>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold mb-6 block opacity-40">Company</span>
              <ul className="space-y-3 text-sm font-light opacity-70">
                <li><a href="#" className="hover:text-[var(--bg-color)]/80 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[var(--bg-color)]/80 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[var(--bg-color)]/80 transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-[var(--bg-color)]/5 flex justify-between items-center text-[10px] uppercase tracking-widest opacity-20">
          <div>© 2026 ScholarshipPro Intelligence</div>
          <div>Crafted for Global Ambition</div>
        </div>
      </footer>
    </div>
  );
}
