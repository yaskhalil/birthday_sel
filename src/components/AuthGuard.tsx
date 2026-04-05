import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AuthGuardProps {
  onSuccess: () => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'you-really-couldnt-wait') {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const handleCheckBirthday = () => {
    const today = new Date();
    const birthday = new Date(2026, 3, 12); // April 12, 2026 (Month is 0-indexed)
    
    if (today >= birthday) {
        onSuccess();
    } else {
        alert("Nope, still not your birthday! 🤦‍♀️");
        setError(true);
        setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-lavender-sky flex items-center justify-center p-6 overflow-hidden">
      {/* Background Sprinkles or Shapes could go here */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-10 rounded-[3rem] die-cut-border sticker-shadow max-w-sm w-full flex flex-col items-center text-center relative"
      >
        <div className="text-7xl mb-6 select-none drop-shadow-lg">🤦‍♀️</div>
        <h2 className="font-headline text-3xl font-black mb-4 uppercase leading-tight text-on-surface">
          not your birthday loser be patient
        </h2>
        
        <form onSubmit={handleSubmit} className="w-full mt-4 flex flex-col gap-4">
          <div className="relative">
            <label className="block text-[10px] font-black uppercase tracking-widest mb-1 opacity-60 text-left ml-2">
              yaseen password
            </label>
            <motion.input 
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-4 rounded-2xl border-4 font-bold text-center outline-none transition-colors ${error ? 'border-error bg-error/10' : 'border-sticker-border bg-surface-container-low focus:bg-white'}`}
              placeholder="••••••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="px-8 py-4 bg-primary text-white font-black rounded-full die-cut-border sticker-shadow hover:pressed-shadow transition-all uppercase text-sm active:translate-y-1 w-full"
          >
            Enter OS
          </button>

          <button 
            type="button"
            onClick={handleCheckBirthday}
            className="px-8 py-4 bg-secondary text-on-surface font-black rounded-full die-cut-border sticker-shadow hover:pressed-shadow transition-all uppercase text-sm active:translate-y-1 w-full"
          >
            is it your birthday? check
          </button>
        </form>

        <div className="mt-8 text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">
          Unauthorized access is boring
        </div>
      </motion.div>
    </div>
  );
};
