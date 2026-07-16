import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, GraduationCap, Globe, User, Check, FileText, Upload, Plus, AlertCircle, RotateCcw } from 'lucide-react';

const ScholarshipForm = ({ onSubmit, loading, initialStep = 1 }) => {
  const [step, setStep] = useState(initialStep);
  const [uploadStates, setUploadStates] = useState({});
  const [formData, setFormData] = useState({
    // Personal
    name: '', email: '', phone: '', gender: '', dob: '', nationality: '', city: '', category: '', religion: '',
    // Academic
    eduLevel: '', major: '', course: '', college: '', univ: '', year: '', cgpa: '', perc10: '', perc12: '',
    // Entrance
    jee: '', neet: '', cet: '', gre: '', toefl: '', ielts: '',
    // Financial
    income: '', certificate: 'No', needLevel: 'Medium',
    // Background
    firstGen: 'No', setting: 'Urban', disability: 'No', status: 'None', minority: 'No',
    // Career
    careerGoal: '', targetField: '', targetCountry: '', preferredType: 'Merit-based',
    // Skills
    techSkills: '', certs: '', research: '', extra: '', leadership: '',
    // Documents
    documents: {
      resume: null,
      incomeCert: null,
      marksheets: null,
      idProof: null,
      casteCert: null,
      disabilityCert: null,
      lor: null
    }
  });

  const handleFileUpload = (type, file) => {
    // Reset state for this upload
    setUploadStates(prev => ({
      ...prev,
      [type]: { status: 'uploading', progress: 0, error: null }
    }));

    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 30;
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Randomly simulate success or failure
        const isSuccess = Math.random() > 0.15; // 85% success rate
        
        if (isSuccess) {
          setUploadStates(prev => ({
            ...prev,
            [type]: { status: 'completed', progress: 100, error: null }
          }));
          setFormData(prev => ({
            ...prev,
            documents: { ...prev.documents, [type]: file.name }
          }));
        } else {
          setUploadStates(prev => ({
            ...prev,
            [type]: { status: 'failed', progress: 0, error: 'Connection Error' }
          }));
        }
      } else {
        setUploadStates(prev => ({
          ...prev,
          [type]: { ...prev[type], progress: currentProgress }
        }));
      }
    }, 400);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const steps = [
    {
      id: 1,
      title: "Personal Profile",
      icon: <User className="w-5 h-5" />,
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Enter your full name" />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="form-input">
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="form-input">
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Nationality</label>
            <input name="nationality" value={formData.nationality} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">City / State</label>
            <input name="city" value={formData.city} onChange={handleChange} className="form-input" />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Academic History",
      icon: <GraduationCap className="w-5 h-5" />,
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Education Level</label>
            <select name="eduLevel" value={formData.eduLevel} onChange={handleChange} className="form-input">
               <option value="">Select</option>
              <option value="School">School</option>
              <option value="Ug">Undergraduate</option>
              <option value="Pg">Postgraduate</option>
              <option value="Phd">PhD</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">College / School</label>
            <input name="college" value={formData.college} onChange={handleChange} className="form-input" placeholder="e.g. Stanford University" />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Current CGPA</label>
            <input name="cgpa" value={formData.cgpa} onChange={handleChange} className="form-input" placeholder="e.g. 9.2" />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">10th/12th Perc</label>
            <div className="flex gap-2">
              <input name="perc10" value={formData.perc10} onChange={handleChange} className="form-input" placeholder="10th %" />
              <input name="perc12" value={formData.perc12} onChange={handleChange} className="form-input" placeholder="12th %" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Exams (JEE/NEET/GRE/IELTS)</label>
            <input name="jee" value={formData.jee} onChange={handleChange} className="form-input" placeholder="e.g. JEE Rank: 1200, GRE: 320, IELTS: 8.0" />
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Financial & Background",
      icon: <Globe className="w-5 h-5" />,
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Annual Family Income (₹)</label>
            <input name="income" value={formData.income} onChange={handleChange} className="form-input" placeholder="e.g. 5,00,000" />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Need Level</label>
            <select name="needLevel" value={formData.needLevel} onChange={handleChange} className="form-input">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Disability Status</label>
            <select name="disability" value={formData.disability} onChange={handleChange} className="form-input">
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">First Gen Student</label>
            <select name="firstGen" value={formData.firstGen} onChange={handleChange} className="form-input">
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Skills & Goals",
      icon: <Sparkles className="w-5 h-5" />,
      fields: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Skills & Certifications</label>
            <textarea name="techSkills" value={formData.techSkills} onChange={handleChange} className="form-input h-24 resize-none" placeholder="e.g. Python, AWS Cert, Debating..." />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Career Goals</label>
            <input name="careerGoal" value={formData.careerGoal} onChange={handleChange} className="form-input" placeholder="e.g. Machine Learning Researcher" />
          </div>
          <div>
             <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">Preferred Scholarship Type</label>
             <select name="preferredType" value={formData.preferredType} onChange={handleChange} className="form-input">
               <option value="Merit-based">Merit-based</option>
               <option value="Need-based">Need-based</option>
               <option value="Research">Research</option>
               <option value="Women-specific">Women-specific</option>
             </select>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Document Vault",
      icon: <FileText className="w-5 h-5" />,
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'resume', label: 'Resume / CV' },
            { id: 'marksheets', label: 'Academic Marksheets' },
            { id: 'incomeCert', label: 'Income Certificate' },
            { id: 'idProof', label: 'Identity Proof (Aadhar/Passport)' },
            { id: 'casteCert', label: 'Caste Certificate (If applicable)' },
            { id: 'disabilityCert', label: 'Disability Cert (If applicable)' },
            { id: 'lor', label: 'Recommendation Letter' },
          ].map((doc) => {
            const upload = uploadStates[doc.id] || {};
            const isUploading = upload.status === 'uploading';
            const isCompleted = upload.status === 'completed' || formData.documents[doc.id];
            const isFailed = upload.status === 'failed';

            return (
              <div key={doc.id} className="relative group">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-color)] mb-2 block">{doc.label}</label>
                <div className={`relative flex flex-col p-4 rounded-xl border-2 border-dashed transition-all ${
                  isCompleted ? 'border-[var(--text-color)]/20 bg-[var(--text-color)]/5' : 
                  isFailed ? 'border-red-200 bg-red-50/10' :
                  isUploading ? 'border-[var(--text-color)]/10 bg-[var(--text-color)]/5' :
                  'border-[var(--text-color)]/5 hover:border-[var(--text-color)]/10 cursor-pointer'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isCompleted ? 'bg-[var(--text-color)] text-[var(--bg-color)]' : 
                        isFailed ? 'bg-red-500 text-white' :
                        'bg-[var(--text-color)]/5 text-[var(--text-color)]/40'
                      }`}>
                        {isFailed ? <AlertCircle size={14} /> : <FileText size={14} />}
                      </div>
                      <div className="flex flex-col text-[var(--text-color)]">
                        <span className={`text-[10px] font-medium truncate ${
                          isFailed ? 'text-red-600' : 
                          isCompleted ? 'text-[var(--text-color)]' : 'text-[var(--muted-color)]'
                        }`}>
                          {formData.documents[doc.id] || (isUploading ? 'Uploading...' : isFailed ? 'Upload Failed' : 'Select file')}
                        </span>
                        {isUploading && (
                          <span className="text-[8px] text-[var(--muted-color)] font-bold tracking-widest mt-0.5">
                            {Math.round(upload.progress)}%
                          </span>
                        )}
                      </div>
                    </div>

                    {!isUploading && !isCompleted && !isFailed && <Plus size={14} className="text-[var(--text-color)]/20" />}
                    {isFailed && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <RotateCcw size={12} />
                      </button>
                    )}
                    {isCompleted && <Check size={14} className="text-green-600" />}
                  </div>

                  {isUploading && (
                    <div className="mt-3 w-full h-[2px] bg-[var(--text-color)]/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${upload.progress}%` }}
                        className="h-full bg-[var(--text-color)]"
                      />
                    </div>
                  )}

                  {!isUploading && (
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(doc.id, e.target.files[0])}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="w-full max-w-2xl mx-auto py-20 px-6">
      {/* Enhanced Progress Tracker */}
      <div className="mb-20 px-4 md:px-10 relative">
        <div className="flex justify-between items-center relative z-10">
          {steps.map((s) => {
            const isCompleted = step > s.id;
            const isActive = step === s.id;
            
            return (
              <div 
                key={s.id} 
                className={`flex flex-col items-center flex-1 relative ${s.id < steps.length ? 'group' : ''}`}
              >
                 <motion.button
                   whileHover={s.id < step ? { scale: 1.1 } : {}}
                   whileTap={s.id < step ? { scale: 0.95 } : {}}
                   onClick={() => s.id < step && setStep(s.id)}
                   disabled={s.id >= step}
                   className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${
                     isCompleted 
                       ? 'bg-[var(--text-color)] border-[var(--text-color)] text-[var(--bg-color)] cursor-pointer' 
                       : isActive 
                         ? 'bg-[var(--text-color)] border-[var(--text-color)] text-[var(--bg-color)] shadow-lg shadow-[var(--text-color)]/20' 
                         : 'bg-[var(--bg-color)] border-[var(--text-color)]/10 text-[var(--muted-color)] cursor-default'
                   }`}
                 >
                   {isCompleted ? <Check className="w-5 h-5" /> : s.icon}
                 </motion.button>
                 
                 <div className="absolute -bottom-8 w-max text-center">
                   <span className={`text-[8px] uppercase tracking-[0.2em] font-bold transition-all duration-500 whitespace-nowrap ${
                     isActive ? 'opacity-100 text-[var(--text-color)] translate-y-0' : 'opacity-40 text-[var(--muted-color)] translate-y-1'
                   }`}>
                     {s.title}
                   </span>
                 </div>
              </div>
            );
          })}
        </div>
        
        {/* Progress Line Background */}
        <div className="absolute top-5 left-10 md:left-20 right-10 md:right-20 h-[1px] bg-[var(--text-color)]/5 -z-0" />
        
        {/* Active Progress Line */}
        <div className="absolute top-5 left-10 md:left-20 right-10 md:right-20 h-[1px] -z-0 overflow-hidden">
           <motion.div 
             initial={false}
             animate={{ width: `${(step - 1) / (steps.length - 1) * 100}%` }}
             className="h-full bg-[var(--text-color)]"
             transition={{ duration: 0.5, ease: "easeInOut" }}
           />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[450px]"
        >
          <div className="flex items-center gap-3 text-[var(--muted-color)] mb-2">
            {currentStep.icon}
            <span className="text-[10px] uppercase tracking-widest font-bold">{currentStep.title}</span>
          </div>
          <h2 className="text-4xl font-serif font-bold mb-12 text-[var(--text-color)]">Tell us about your <span className="italic font-normal">journey</span>.</h2>
          
          {currentStep.fields}

          <div className="mt-16 flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                className="text-xs uppercase tracking-widest font-bold text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors"
                disabled={loading}
              >
                Back
              </button>
            ) : <div />}

            {step < steps.length ? (
              <motion.button
                whileHover={{ gap: '1.25rem' }}
                onClick={nextStep}
                className="flex items-center gap-4 text-xs uppercase tracking-widest font-bold text-[var(--text-color)] border-b border-[var(--text-color)] pb-1"
                disabled={loading}
              >
                Continue <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button
                onClick={() => onSubmit(formData)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="px-10 py-5 bg-[var(--text-color)] text-[var(--bg-color)] rounded-full text-xs uppercase tracking-widest font-bold shadow-xl flex items-center gap-3"
              >
                {loading ? 'Processing...' : 'Run Analysis'}
                {!loading && <Sparkles size={16} />}
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ScholarshipForm;
