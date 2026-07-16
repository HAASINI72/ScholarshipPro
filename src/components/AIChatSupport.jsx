import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, User, Bot } from 'lucide-react';
import axios from 'axios';

const AIChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Scholarship Assistant. How can I help you find funding today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // We'll reuse the existing Gemini logic or a simpler endpoint if we had one.
      // For now, let's assume we can add a generic chat endpoint.
      const response = await axios.post('/api/chat', { 
        messages: [...messages, userMessage] 
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-96 h-[500px] bg-[var(--card-bg)] rounded-3xl shadow-2xl border border-[var(--text-color)]/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-[var(--text-color)] text-[var(--bg-color)] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Sparkles size={18} />
                <span className="text-xs uppercase tracking-widest font-bold">AI Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-60 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--bg-color)]/20">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'user' 
                    ? 'bg-[var(--text-color)] text-[var(--bg-color)] rounded-tr-none' 
                    : 'bg-[var(--card-bg)] text-[var(--text-color)] border border-[var(--text-color)]/5 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--card-bg)] p-4 rounded-2xl rounded-tl-none border border-[var(--text-color)]/5 space-x-1 flex">
                    <div className="w-1.5 h-1.5 bg-[var(--text-color)]/20 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-[var(--text-color)]/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-[var(--text-color)]/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-[var(--card-bg)] border-t border-[var(--text-color)]/5 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about scholarships..."
                className="flex-1 bg-[var(--text-color)]/5 border-none rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 ring-[var(--text-color)]/10 text-[var(--text-color)]"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="w-10 h-10 bg-[var(--text-color)] text-[var(--bg-color)] rounded-xl flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[var(--text-color)] text-[var(--bg-color)] rounded-full shadow-xl flex items-center justify-center relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[var(--bg-color)]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <MessageSquare size={24} className="relative z-10" />
      </motion.button>
    </div>
  );
};

export default AIChatSupport;
