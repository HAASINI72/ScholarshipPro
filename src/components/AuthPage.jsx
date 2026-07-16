import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, AlertCircle } from 'lucide-react';
import { login, register } from '../lib/api';

const AuthPage = ({ initialMode = 'login', onAuthComplete, onBack }) => {
  const [mode, setMode] = useState(initialMode); // login, register
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }
      
      onAuthComplete(result.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[var(--muted-color)] mb-4 block">
            {mode === 'login' ? 'Welcome Back' : 'Get Started'}
          </span>
          <h2 className="text-4xl font-serif font-bold text-[var(--text-color)]">
            {mode === 'login' ? 'Sign in to ' : 'Create your '}
            <span className="italic font-normal">Account</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--card-bg)] p-10 rounded-[2.5rem] border border-[var(--text-color)]/5 shadow-xl shadow-[var(--text-color)]/[0.02]"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 text-red-500 text-xs rounded-2xl flex items-center gap-3 border border-red-500/20"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted-color)] ml-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-color)]" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/5 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-[var(--text-color)]/20 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted-color)] ml-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-color)]" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/5 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-[var(--text-color)]/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted-color)] ml-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-color)]" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[var(--text-color)]/5 border border-[var(--text-color)]/5 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-[var(--text-color)]/20 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--text-color)] text-[var(--bg-color)] rounded-2xl py-5 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[var(--bg-color)]/20 border-t-[var(--bg-color)] rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-[var(--text-color)]/5 text-center">
            <p className="text-sm text-[var(--muted-color)] font-light mb-6">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-[var(--text-color)] font-bold ml-2 hover:underline"
              >
                {mode === 'login' ? 'Register now' : 'Sign in'}
              </button>
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] flex-1 bg-[var(--text-color)]/5" />
              <span className="text-[10px] uppercase font-bold text-[var(--muted-color)]/40">or continue with</span>
              <div className="h-[1px] flex-1 bg-[var(--text-color)]/5" />
            </div>

            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-3 py-4 border border-[var(--text-color)]/10 rounded-2xl text-xs font-bold hover:bg-[var(--text-color)]/5 transition-all">
                <Chrome size={16} />
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-3 py-4 border border-[var(--text-color)]/10 rounded-2xl text-xs font-bold hover:bg-[var(--text-color)]/5 transition-all">
                <Github size={16} />
                Github
              </button>
            </div>
          </div>
        </motion.div>

        <button
          onClick={onBack}
          className="mt-8 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted-color)] hover:text-[var(--text-color)] transition-colors block mx-auto"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
