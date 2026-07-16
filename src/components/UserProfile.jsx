import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, GraduationCap, Globe, BookOpen, Settings, Bell, ShieldCheck, ChevronDown, Edit2, Save, FileText, ExternalLink, Clock, AlertCircle, Calculator, Check, TrendingUp, Bookmark } from 'lucide-react';
import EligibilityPredictor from './EligibilityPredictor';

const STATUS_OPTIONS = ['Submitted', 'Under Review', 'Interview Scheduled', 'Awarded', 'Rejected'];

const calculateDaysLeft = (deadlineStr) => {
  if (!deadlineStr) return null;
  try {
    const deadline = new Date(deadlineStr);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (e) {
    return null;
  }
};

const UserProfile = ({ user, savedScholarships = [], applications = [], predictions = [], predicting = false, onCompleteStep, onUpdateApplication, onViewScholarship, onNavigate, onSave, onApply }) => {
  const [editingApp, setEditingApp] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('applications'); // applications, saved

  const missingFields = [
    { key: 'nationality', label: 'Region Details', step: 1 },
    { key: 'eduLevel', label: 'Education Level', step: 2 },
    { key: 'cgpa', label: 'Academic Grades', step: 2 },
    { key: 'income', label: 'Financial Info', step: 3 },
    { key: 'techSkills', label: 'Skills & Portfolio', step: 4 },
  ].filter(f => !user?.profile?.[f.key]);

  const hasDocs = user?.documents && Object.values(user.documents).some(v => v !== null);
  const totalSteps = 6;
  const completedSteps = (5 - missingFields.length) + (hasDocs ? 1 : 0);
  const completionRate = Math.round((completedSteps / totalSteps) * 100);

  if (!hasDocs) {
    missingFields.push({ key: 'documents', label: 'Document Vault', step: 5, isDoc: true });
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-40 px-6">
      {/* Profile Completion Guide */}
      {missingFields.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 p-8 bg-[var(--card-bg)] border border-[var(--text-color)]/10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-8">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[var(--text-color)]/5" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * completionRate) / 100} className="text-[var(--text-color)]" />
              </svg>
              <span className="absolute text-sm font-serif font-bold">{completionRate}%</span>
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold mb-1">Complete your profile.</h3>
              <p className="text-xs text-[var(--muted-color)] font-light">Add {missingFields.length} more details to unlock precision scholarship matching.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {missingFields.map((f) => (
              <button 
                key={f.key}
                onClick={() => onCompleteStep(f.step)}
                className="px-6 py-3 bg-[var(--bg-color)] border border-[var(--text-color)]/10 rounded-full text-[10px] uppercase font-bold tracking-widest hover:border-[var(--text-color)] transition-all"
              >
                + {f.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Header / Basic Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 mb-24">
        <div className="flex items-center gap-10">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-[var(--text-color)]/5 border border-[var(--text-color)]/10 flex items-center justify-center relative group">
            <User className="w-16 h-16 text-[var(--text-color)]/20" />
            <div className="absolute inset-0 bg-[var(--text-color)]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[var(--bg-color)] text-[10px] uppercase tracking-widest font-bold cursor-pointer">
              Edit
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[var(--muted-color)] mb-4 block">Student Member</span>
            <h1 className="text-5xl font-serif font-bold mb-4">{user?.name}</h1>
            <div className="flex items-center gap-6 text-[var(--muted-color)]">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span className="text-xs font-light">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-600" />
                <span className="text-xs font-light">Verified Account</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button className="p-4 rounded-full border border-[var(--text-color)]/10 hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all">
            <Settings size={18} />
          </button>
          <button className="p-4 rounded-full border border-[var(--text-color)]/10 relative hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all">
            <Bell size={18} />
            <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-color)]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column: Academic Profile */}
        <div className="space-y-12">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--muted-color)] mb-8">Academic Persona</h3>
            <div className="space-y-6">
              <div className={`flex justify-between items-center py-4 border-b transition-colors ${!user?.profile?.eduLevel ? 'border-red-200' : 'border-[var(--text-color)]/5'}`}>
                <div className="flex items-center gap-3">
                  <GraduationCap size={16} className={`${!user?.profile?.eduLevel ? 'text-red-400' : 'text-[var(--muted-color)]'}`} />
                  <span className="text-xs font-light">Education Level {!user?.profile?.eduLevel && <span className="text-red-500">*</span>}</span>
                </div>
                <span className={`text-sm font-medium ${!user?.profile?.eduLevel ? 'text-red-600 italic opacity-60' : 'text-[var(--text-color)]'}`}>
                  {user?.profile?.eduLevel || 'Not Set'}
                </span>
              </div>
              <div className={`flex justify-between items-center py-4 border-b transition-colors ${!user?.profile?.college ? 'border-red-200' : 'border-[var(--text-color)]/5'}`}>
                <div className="flex items-center gap-3">
                  <BookOpen size={16} className={`${!user?.profile?.college ? 'text-red-400' : 'text-[var(--muted-color)]'}`} />
                  <span className="text-xs font-light">Institution {!user?.profile?.college && <span className="text-red-500">*</span>}</span>
                </div>
                <span className={`text-sm font-medium ${!user?.profile?.college ? 'text-red-600 italic opacity-60' : 'text-[var(--text-color)]'}`}>
                  {user?.profile?.college || 'Not Set'}
                </span>
              </div>
              <div className={`flex justify-between items-center py-4 border-b transition-colors ${!user?.profile?.major ? 'border-red-200' : 'border-[var(--text-color)]/5'}`}>
                <div className="flex items-center gap-3">
                  <GraduationCap size={16} className={`${!user?.profile?.major ? 'text-red-400' : 'text-[var(--muted-color)]'}`} />
                  <span className="text-xs font-light">Major / Specialization {!user?.profile?.major && <span className="text-red-500">*</span>}</span>
                </div>
                <span className={`text-sm font-medium ${!user?.profile?.major ? 'text-red-600 italic opacity-60' : 'text-[var(--text-color)]'}`}>
                  {user?.profile?.major || 'Not Set'}
                </span>
              </div>
              <div className={`flex justify-between items-center py-4 border-b transition-colors ${!user?.profile?.cgpa ? 'border-red-200' : 'border-[var(--text-color)]/5'}`}>
                <div className="flex items-center gap-3">
                  <TrendingUp size={16} className={`${!user?.profile?.cgpa ? 'text-red-400' : 'text-[var(--muted-color)]'}`} />
                  <span className="text-xs font-light">Current CGPA {!user?.profile?.cgpa && <span className="text-red-500">*</span>}</span>
                </div>
                <span className={`text-sm font-medium ${!user?.profile?.cgpa ? 'text-red-600 italic opacity-60' : 'text-[var(--text-color)]'}`}>
                  {user?.profile?.cgpa ? `${user.profile.cgpa} / 10.0` : 'Not Set'}
                </span>
              </div>
              <div className={`flex justify-between items-center py-4 border-b transition-colors ${!user?.profile?.nationality ? 'border-red-200' : 'border-[var(--text-color)]/5'}`}>
                <div className="flex items-center gap-3">
                  <Globe size={16} className={`${!user?.profile?.nationality ? 'text-red-400' : 'text-[var(--muted-color)]'}`} />
                  <span className="text-xs font-light">Nationality {!user?.profile?.nationality && <span className="text-red-500">*</span>}</span>
                </div>
                <span className={`text-sm font-medium ${!user?.profile?.nationality ? 'text-red-600 italic opacity-60' : 'text-[var(--text-color)]'}`}>
                  {user?.profile?.nationality || 'Not Set'}
                </span>
              </div>
            </div>
          </div>

          {missingFields.length > 0 && (
            <div className="p-8 bg-[var(--text-color)]/5 border border-dashed border-[var(--text-color)]/20 rounded-[2rem]">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-6">Profile Action Items</h4>
              <div className="space-y-5">
                {missingFields.map((f) => (
                  <div key={f.key} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-color)]/20 group-hover:bg-[var(--text-color)] transition-colors" />
                      <span className="text-xs font-medium text-[var(--text-color)]/70">{f.label}</span>
                    </div>
                    <button 
                      onClick={() => onCompleteStep(f.step)}
                      className="text-[9px] uppercase font-bold tracking-[0.2em] text-[var(--text-color)] border-b border-[var(--text-color)]/30 pb-0.5 hover:border-[var(--text-color)] transition-all"
                    >
                      Complete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-8 bg-[var(--card-bg)] border border-[var(--text-color)]/10 rounded-[2rem]">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">Verified Documents</h4>
              <FileText size={16} className="text-[var(--text-color)]/20" />
            </div>
            <div className="space-y-4">
              {[
                { id: 'resume', label: 'Resume / CV' },
                { id: 'transcript', label: 'Academic Transcript' },
                { id: 'incomeProof', label: 'Income Certificate' },
                { id: 'idProof', label: 'Government ID' },
                { id: 'lor', label: 'Recommendation Letter' },
              ].map((doc) => {
                const value = user?.documents?.[doc.id];
                return (
                  <div key={doc.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    value ? 'bg-[var(--bg-color)]/50 border-[var(--text-color)]/5' : 'bg-red-50/10 border-red-100 border-dashed'
                  }`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        value ? 'bg-[var(--text-color)]/5 text-[var(--text-color)]/40' : 'bg-red-100/50 text-red-400'
                      }`}>
                        <FileText size={12} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-[9px] uppercase font-bold tracking-widest ${value ? 'text-[var(--text-color)]/60' : 'text-red-500'}`}>
                          {doc.label} {!value && '*'}
                        </span>
                        <span className={`text-[10px] font-medium truncate max-w-[120px] ${value ? 'text-[var(--text-color)]' : 'text-red-400 italic opacity-60'}`}>
                          {value || 'Missing'}
                        </span>
                      </div>
                    </div>
                    {value ? (
                      <ExternalLink size={12} className="text-[var(--text-color)]/20 cursor-pointer hover:text-[var(--text-color)]" />
                    ) : (
                      <button 
                        onClick={() => onCompleteStep(5)}
                        className="text-[8px] uppercase font-bold text-red-600 hover:underline"
                      >
                        Upload
                      </button>
                    )}
                  </div>
                );
              })}
              <button 
                onClick={() => onCompleteStep(5)}
                className="w-full mt-4 py-3 border border-[var(--text-color)]/5 rounded-xl text-[9px] uppercase font-bold tracking-widest text-[var(--muted-color)] hover:border-[var(--text-color)]/20 hover:text-[var(--text-color)] transition-all"
              >
                Manage Vault
              </button>
            </div>
          </div>

          <EligibilityPredictor predictions={predictions} loading={predicting} />

          {/* Deadline Reminders Sidebar */}
          {applications.some(a => calculateDaysLeft(a.deadline) !== null && calculateDaysLeft(a.deadline) <= 14) && (
            <div className="p-8 bg-red-50/50 border border-red-100 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle size={16} className="text-red-600" />
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-red-900">Critical Deadlines</h4>
              </div>
              <div className="space-y-4">
                {applications
                  .filter(a => {
                    const days = calculateDaysLeft(a.deadline);
                    return days !== null && days <= 14 && days >= 0;
                  })
                  .map((app, idx) => (
                    <div key={idx} className="flex justify-between items-center group cursor-pointer" onClick={() => setEditingApp(app.name)}>
                      <span className="text-xs font-serif font-bold text-red-900 truncate max-w-[140px]">{app.name}</span>
                      <span className="text-[9px] font-bold px-2 py-1 bg-red-100 text-red-700 rounded-md">
                        {calculateDaysLeft(app.deadline)}d left
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="p-10 bg-[var(--text-color)] text-[var(--bg-color)] rounded-[2rem]">
            <h4 className="text-xs uppercase tracking-widest font-bold opacity-40 mb-6">Pro Tip</h4>
            <p className="text-sm font-light leading-relaxed mb-8">
              Students with a completed research portfolio are 45% more likely to secure high-value grants.
            </p>
            <button className="w-full py-4 bg-[var(--bg-color)]/10 rounded-full text-[10px] uppercase font-bold tracking-widest hover:bg-[var(--bg-color)]/20 transition-all">
              Update Portfolio
            </button>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => onNavigate('calculator')}
            className="p-10 bg-[var(--card-bg)] border border-[var(--text-color)]/10 rounded-[2rem] cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[var(--text-color)] text-[var(--bg-color)] rounded-xl group-hover:rotate-12 transition-transform">
                <Calculator size={20} />
              </div>
              <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--text-color)]">Funding Estimator</h4>
            </div>
            <p className="text-sm font-light text-[var(--muted-color)] leading-relaxed mb-6">
              Calculate exactly how much scholarship funding you can expect based on your academic and financial profile.
            </p>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-color)] border-b border-[var(--text-color)]/20 pb-1 group-hover:border-[var(--text-color)] transition-all">
              Try Calculator →
            </span>
          </motion.div>
        </div>

        {/* Right Column: Activity & Applications */}
        <div className="lg:col-span-2 space-y-16">
          {/* Applications Section */}
          <div>
            <div className="flex items-end justify-between mb-8">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--muted-color)]">Active Applications</h3>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-color)]">{applications.length} Items</span>
            </div>
            
            <div className="space-y-6">
              {applications.length > 0 ? applications.map((app, i) => {
                const currentStageIdx = app.status === 'Awarded' || app.status === 'Rejected' ? 3 : STATUS_OPTIONS.indexOf(app.status);
                
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[var(--card-bg)] rounded-[2rem] border border-[var(--text-color)]/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h4 className="font-serif font-bold text-xl mb-1">{app.name}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted-color)]">Applied on {app.appliedAt}</span>
                            {calculateDaysLeft(app.deadline) !== null && (
                              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${
                                calculateDaysLeft(app.deadline) <= 7 ? 'bg-red-50 text-red-600' : 'bg-[var(--text-color)]/5 text-[var(--muted-color)]'
                              }`}>
                                <Clock size={10} />
                                <span className="text-[9px] font-bold">
                                  {calculateDaysLeft(app.deadline) <= 0 ? 'Passed' : `${calculateDaysLeft(app.deadline)}d remaining`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${
                            app.status === 'Awarded' ? 'bg-green-50 text-green-700 border-green-200' : 
                            app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-[var(--text-color)]/5 border-[var(--text-color)]/10 text-[var(--text-color)]/80'
                          }`}>
                            {app.status}
                          </span>
                          <button 
                            onClick={() => setEditingApp(editingApp === app.name ? null : app.name)}
                            className="p-3 rounded-full border border-[var(--text-color)]/5 hover:bg-[var(--text-color)]/5 transition-colors"
                          >
                            {editingApp === app.name ? <ChevronDown size={14} /> : <Edit2 size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Visual Progress Tracker */}
                      <div className="relative flex justify-between items-center px-2">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[var(--text-color)]/5 -translate-y-1/2 -z-1" />
                        <div 
                          className="absolute top-1/2 left-0 h-[1px] bg-[var(--text-color)] -translate-y-1/2 -z-1 transition-all duration-500" 
                          style={{ width: `${(currentStageIdx / 3) * 100}%` }}
                        />

                        {['Submitted', 'Under Review', 'Interview', 'Decision'].map((stage, idx) => {
                          const isCompleted = currentStageIdx >= idx;
                          const isTerminal = idx === 3 && (app.status === 'Awarded' || app.status === 'Rejected');
                          
                          return (
                            <div 
                              key={stage} 
                              className="flex flex-col items-center gap-3 relative z-10"
                            >
                              <button
                                onClick={() => {
                                  let targetStatus = stage;
                                  if (idx === 2) targetStatus = 'Interview Scheduled';
                                  if (idx === 3) targetStatus = 'Awarded'; 
                                  onUpdateApplication(app.name, { status: targetStatus });
                                }}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isCompleted 
                                    ? (idx === 3 && app.status === 'Rejected' ? 'bg-red-500 border-red-500' : 'bg-[var(--text-color)] border-[var(--text-color)]') 
                                    : 'bg-[var(--bg-color)] border-[var(--text-color)]/10 hover:border-[var(--text-color)]/30'
                                }`}
                              >
                                {currentStageIdx > idx || (idx === 3 && isCompleted) ? (
                                  <Check size={12} className="text-[var(--bg-color)]" />
                                ) : (
                                  <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-[var(--bg-color)]' : 'bg-[var(--text-color)]/20'}`} />
                                )}
                              </button>
                              <span className={`text-[8px] uppercase font-bold tracking-widest ${isCompleted ? 'text-[var(--text-color)]' : 'text-[var(--muted-color)]'}`}>
                                {idx === 3 && isCompleted ? (app.status === 'Awarded' ? 'Awarded' : 'Rejected') : stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  <AnimatePresence>
                    {editingApp === app.name && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8 border-t border-[var(--text-color)]/5 bg-[var(--text-color)]/5"
                      >
                        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-3 block">Update Status</label>
                            <select 
                              value={app.status}
                              onChange={(e) => onUpdateApplication(app.name, { status: e.target.value })}
                              className="w-full bg-[var(--bg-color)] border border-[var(--text-color)]/10 rounded-xl px-4 py-3 text-xs font-medium focus:ring-1 focus:ring-[var(--text-color)] outline-none text-[var(--text-color)]"
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-3 block">Application Notes</label>
                            <textarea 
                              value={app.notes || ''}
                              onChange={(e) => onUpdateApplication(app.name, { notes: e.target.value })}
                              placeholder="Add follow-up dates, contact info, or next steps..."
                              className="w-full bg-[var(--bg-color)] border border-[var(--text-color)]/10 rounded-xl px-4 py-3 text-xs font-medium focus:ring-1 focus:ring-[var(--text-color)] outline-none min-h-[100px] resize-none text-[var(--text-color)]"
                            />
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button 
                            onClick={() => setEditingApp(null)}
                            className="flex items-center gap-2 px-6 py-3 bg-[var(--text-color)] text-[var(--bg-color)] rounded-full text-[10px] uppercase font-bold tracking-widest hover:opacity-90 transition-all"
                          >
                            <Save size={12} />
                            Save Update
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            }) : (
                <div className="p-12 border border-dashed border-[var(--text-color)]/10 rounded-3xl text-center">
                  <p className="text-[var(--muted-color)] font-light">No active applications found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Saved Section */}
          <div>
            <div className="flex items-end justify-between mb-8">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--muted-color)]">Saved for Later</h3>
              <button className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-color)] border-b border-[var(--text-color)] pb-1">Manage List</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedScholarships.length > 0 ? savedScholarships.map((app, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 bg-[var(--text-color)]/5 rounded-2xl border border-[var(--text-color)]/5 group hover:border-[var(--text-color)]/20 transition-all relative"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-serif font-bold text-lg truncate flex-1 pr-2 text-[var(--text-color)]">{app.name}</h4>
                    <button 
                      onClick={() => onSave(app)}
                      className="text-[var(--text-color)] hover:text-red-500 transition-colors"
                    >
                      <Bookmark size={14} fill="currentColor" />
                    </button>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted-color)] mb-4">{app.amount}</p>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[9px] text-[var(--muted-color)]">{app.deadline}</span>
                    <div className="flex gap-4">
                      {!applications.some(a => a.name === app.name) && (
                        <button 
                          onClick={() => onApply && onApply(app)}
                          className="text-[9px] uppercase font-bold tracking-widest text-[var(--text-color)] hover:opacity-70 transition-opacity"
                        >
                          Apply
                        </button>
                      )}
                      <button 
                        onClick={() => onViewScholarship(app)}
                        className="text-[9px] uppercase font-bold tracking-widest text-[var(--text-color)] hover:opacity-70 transition-opacity"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="col-span-2 p-10 border border-dashed border-[var(--text-color)]/10 rounded-3xl text-center">
                  <p className="text-[var(--muted-color)] font-light">Your saved items will appear here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-12 border-t border-[var(--text-color)]/5">
             <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--muted-color)] mb-8">Matching Intelligence Summary</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="p-8 bg-[var(--text-color)]/5 rounded-3xl border border-[var(--text-color)]/5 text-[var(--text-color)]">
                 <div className="text-4xl font-serif font-bold mb-2">{savedScholarships.length + applications.length}</div>
                 <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">Interactions Analyzed</div>
               </div>
               <div className="p-8 bg-[var(--text-color)]/5 rounded-3xl border border-[var(--text-color)]/5 text-[var(--text-color)]">
                 <div className="text-4xl font-serif font-bold mb-2">92%</div>
                 <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)]">Profile Accuracy Score</div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
