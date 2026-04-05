import React, { useState } from 'react';
import { motion } from 'framer-motion';
import bonitaImg from '../assets/bonita.jpg';
import uggImg from '../assets/ugg.png';

interface PhotoProps {
  onReturn: () => void;
}

export const Photo: React.FC<PhotoProps> = ({ onReturn }) => {
  const [activePhoto, setActivePhoto] = useState<'diva' | 'ugly'>('diva');

  return (
    <div className="flex-1 w-full max-w-5xl p-6 flex flex-col items-center justify-center">
      <motion.div 
        className="relative bg-[#FFFDF5] p-6 die-cut-border sticker-shadow flex flex-col items-center justify-center"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 2 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] overflow-hidden die-cut-border flex items-center justify-center mb-6 relative bg-lavender-sky transition-colors duration-500">
            {activePhoto === 'diva' ? (
                <img src={bonitaImg} alt="Bonita" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
                <img src={uggImg} alt="Ugg" className="absolute inset-0 w-full h-full object-cover" />
            )}
        </div>

        <h2 className="font-headline text-3xl font-black mb-2 text-center uppercase tracking-wider">
           Happy Birthday, Selena!
        </h2>
        <p className="font-bold text-sm text-on-surface/60 italic mb-6">"You're the best!"</p>

        {/* Custom Buttons */}
        <div className="flex gap-4 mb-6">
            {/* Ice Sparkly Button */}
            <button 
                onClick={() => setActivePhoto('diva')}
                className="relative overflow-hidden px-6 py-3 rounded-full die-cut-border sticker-shadow font-black uppercase text-sm group hover:-translate-y-1 transition-all"
                style={{ background: 'linear-gradient(135deg, #F9A8D4 0%, #D8B4FE 50%, #A78BFA 100%)', color: '#4C1D95' }}
            >
                {/* Sparkles */}
                <div className="absolute top-1 left-2 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">✨</div>
                <div className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">✨</div>
                <div className="absolute inset-0 bg-white/40 blur-sm -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <span className="relative z-10 tracking-wider">💅 Diva Photo</span>
            </button>

            {/* Green Drip Button */}
            <button 
                onClick={() => setActivePhoto('ugly')}
                className="relative px-6 py-3 bg-[#4ade80] text-[#064e3b] font-black rounded-full die-cut-border sticker-shadow uppercase text-sm group hover:-translate-y-1 transition-all"
            >
                {/* CSS Drips using pseudo-elements directly with absolute spans */}
                <div className="absolute -bottom-2 left-4 w-2 h-4 bg-[#4ade80] rounded-b-full group-hover:h-6 transition-all duration-300"></div>
                <div className="absolute -bottom-3 left-10 w-2.5 h-6 bg-[#4ade80] rounded-b-full group-hover:h-8 transition-all duration-300 delay-75"></div>
                <div className="absolute -bottom-1.5 right-6 w-1.5 h-3 bg-[#4ade80] rounded-b-full group-hover:h-5 transition-all duration-300 delay-150"></div>
                
                <span className="relative z-10 tracking-wider">🤢 Gremlin Pic</span>
            </button>
        </div>

        <button 
           onClick={onReturn}
           className="px-8 py-3 bg-primary text-white font-black rounded-full die-cut-border sticker-shadow hover:pressed-shadow transition-all uppercase text-sm active:translate-y-1"
        >
           Return to System
        </button>
      </motion.div>
    </div>
  );
};
