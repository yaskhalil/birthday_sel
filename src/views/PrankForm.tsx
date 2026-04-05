import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PrankForm: React.FC = () => {
    const [submitting, setSubmitting] = useState(false);
    const [prankMessage, setPrankMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/prank', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ })
            });
            const data = await res.json();
            
            // Give a slight delay for dramatic effect
            setTimeout(() => {
                setPrankMessage(data.message || "Who enters their address on a random app?! 😂 Happy Birthday, Selena!");
                setSubmitting(false);
            }, 1000);
        } catch (err) {
            console.error(err);
            // Fallback if API fails
            setTimeout(() => {
                setPrankMessage("Who enters their address on a random app?! 😂 Happy Birthday, Selena!");
                setSubmitting(false);
            }, 1000);
        }
    };

    return (
        <div className="flex-1 w-full max-w-2xl p-6 flex flex-col items-center justify-center min-h-screen mx-auto">
            <AnimatePresence mode="wait">
                {!prankMessage ? (
                    <motion.div 
                        key="form"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white p-8 rounded-[2.5rem] die-cut-border sticker-shadow w-full flex flex-col items-center"
                    >
                        <h2 className="font-headline text-3xl font-black mb-2 uppercase text-center">Claim Physical Gift</h2>
                        <p className="font-bold opacity-70 mb-8 mt-2 text-center text-sm">
                            Please provide your shipping address to receive the physical sticker pack!
                        </p>

                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest mb-1 opacity-60">Full Name</label>
                                <input required type="text" className="w-full p-4 rounded-xl die-cut-border bg-surface-container-low font-bold focus:bg-white outline-none" placeholder="Selena..." />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest mb-1 opacity-60">Address</label>
                                <textarea required rows={3} className="w-full p-4 rounded-xl die-cut-border bg-surface-container-low font-bold focus:bg-white outline-none" placeholder="123 Street..." />
                            </div>
                            <button 
                                disabled={submitting}
                                type="submit"
                                className="mt-4 px-8 py-4 bg-primary text-white font-black rounded-full die-cut-border sticker-shadow hover:pressed-shadow transition-all uppercase text-lg w-full active:translate-y-1"
                            >
                                {submitting ? "Processing..." : "Submit Securely"}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="prank"
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="bg-secondary p-12 rounded-[2.5rem] die-cut-border sticker-shadow w-full flex flex-col items-center justify-center text-center rotate-3"
                    >
                        <div className="text-[120px] mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] select-none">🤡</div>
                        <h2 className="font-headline text-3xl md:text-5xl font-black mb-6 uppercase text-on-surface leading-tight drop-shadow-md">
                            {prankMessage}
                        </h2>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-white text-on-surface font-black rounded-full die-cut-border sticker-shadow hover:pressed-shadow transition-all uppercase text-sm -rotate-2"
                        >
                            Reset App
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
