import React from 'react';
import { Search, User, Menu, Sparkles, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

const Navbar = ({ user, onLogin, onLogout, onNavigate, theme, onToggleTheme }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-color)]/80 backdrop-blur-md border-b border-[var(--text-color)]/5 pt-6 pb-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => onNavigate('home')}
        >
          <span className="text-2xl font-serif font-extrabold tracking-tight text-[var(--text-color)]">
            Scholarship<span className="italic font-normal text-amber-700 dark:text-amber-400">Pro</span>
          </span>
        </motion.div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-12">
          {['Discover', 'Calculator', 'Recommendations', 'Success Stories'].map((item, i) => {
            const viewName = item.toLowerCase().replace(' ', '-');
            return (
              <motion.a
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(viewName);
                }}
                className="text-xs uppercase tracking-widest font-bold text-[var(--text-color)]/70 hover:text-[var(--text-color)] transition-colors"
              >
                {item}
              </motion.a>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <motion.button 
            onClick={() => onNavigate('form')}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold px-4 py-2 border border-[var(--text-color)]/20 rounded-full hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all"
          >
            <Sparkles size={14} />
            Find Matching
          </motion.button>
          
          <div className="flex items-center gap-4 text-[var(--text-color)]/60">
            <button 
              onClick={onToggleTheme}
              className="hover:text-[var(--text-color)] transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="hover:text-[var(--text-color)] transition-colors">
              <Search size={20} />
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onNavigate('profile')}
                  className="hover:text-[var(--text-color)] transition-colors flex items-center gap-2"
                >
                  <User size={20} />
                  <span className="text-[10px] uppercase font-bold tracking-widest hidden lg:block">{user.name}</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="text-[10px] uppercase font-bold tracking-widest hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onLogin('login')}
                  className="hover:text-[var(--text-color)] transition-colors text-[10px] uppercase font-bold tracking-widest"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onLogin('register')}
                  className="px-5 py-2 bg-[var(--text-color)] text-[var(--bg-color)] rounded-full text-[10px] uppercase tracking-widest font-bold hover:opacity-90 transition-all shadow-sm"
                >
                  Register
                </button>
              </div>
            )}

            <button className="md:hidden hover:text-[var(--text-color)] transition-colors">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
