import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface WordSearchProps {
  onReturn: () => void;
  onWin: () => void;
}

export const WordSearch: React.FC<WordSearchProps> = ({ onReturn, onWin }) => {
  // 5x5 Grid
  const grid = [
    ['S', 'E', 'L', 'E', 'F'],
    ['B', 'O', 'R', 'N', 'E'],
    ['A', 'P', 'R', 'Q', 'T'],
    ['C', 'A', 'K', 'E', 'T'],
    ['P', 'U', 'M', 'P', 'I'],
    ['X', 'X', 'Y', 'Z', 'G']
  ];

  const targetWords = ['SELE', 'BORN', 'APR', 'CAKE', 'FETTIG'];
  const [selectedLetters, setSelectedLetters] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<string[]>([]);

  const handleTileClick = (r: number, c: number) => {
    const tileKey = `${r}-${c}`;
    const newSelected = new Set(selectedLetters);
    
    if (newSelected.has(tileKey)) {
      newSelected.delete(tileKey);
    } else {
      newSelected.add(tileKey);
    }
    
    setSelectedLetters(newSelected);

    // Simple hacky check: check if the selected sequence forms any of the target words.
    // In a real word search we check line connections, but here let's just check if 
    // the currently selected tiles exact-match the count and string of any target word not yet found.
    /* Removed unused currentStr */

    targetWords.forEach(word => {
      if (!foundWords.includes(word)) {
         // This is a naive check. A better approach is to check rows/cols specifically.
         // Let's implement exact row/col check.
         const coordsForWord: Record<string, string[]> = {
            'SELE': ['0-0', '0-1', '0-2', '0-3'],
            'BORN': ['1-0', '1-1', '1-2', '1-3'],
            'APR':  ['2-0', '2-1', '2-2'],
            'CAKE': ['3-0', '3-1', '3-2', '3-3'],
            'FETTIG': ['0-4', '1-4', '2-4', '3-4', '4-4', '5-4']
         };

         const targetCoords = coordsForWord[word];
         const isMatch = targetCoords.every(c => newSelected.has(c)) && targetCoords.length === newSelected.size;
         
         if (isMatch) {
            setFoundWords(prev => {
                const next = [...prev, word];
                if (next.length === targetWords.length) {
                    // Win condition
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                    setTimeout(onWin, 1000); // Transition to the win state / claim gift
                }
                return next;
            });
            setSelectedLetters(new Set()); // clear for next word
         }
      }
    });
  };

  const allFoundCoords = new Set<string>();
  const coordsForWord: Record<string, string[]> = {
    'SELE': ['0-0', '0-1', '0-2', '0-3'],
    'BORN': ['1-0', '1-1', '1-2', '1-3'],
    'APR':  ['2-0', '2-1', '2-2'],
    'CAKE': ['3-0', '3-1', '3-2', '3-3'],
    'FETTIG': ['0-4', '1-4', '2-4', '3-4', '4-4', '5-4']
  };
  foundWords.forEach(w => coordsForWord[w].forEach(c => allFoundCoords.add(c)));

  return (
    <div className="flex-1 w-full max-w-5xl p-6 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] die-cut-border sticker-shadow flex flex-col items-center w-full max-w-2xl">
        <h2 className="font-headline text-4xl font-black mb-2 uppercase text-center text-on-surface">WORD SEARCH</h2>
        <p className="font-bold opacity-70 mb-8 mt-2 text-center text-sm max-w-md">
           Hold 3 fingers to keep the Game Book open. Find: <br/>  
           <span className="text-primary tracking-widest">{targetWords.filter(w => !foundWords.includes(w)).join(' · ')}</span>
        </p>

        <div className="grid grid-cols-5 gap-3 w-full max-w-sm mb-8">
          {grid.map((row, r) => (
             row.map((letter, c) => {
               const tileKey = `${r}-${c}`;
               const isSelected = selectedLetters.has(tileKey);
               const isFound = allFoundCoords.has(tileKey);
               let bgClass = "bg-surface-container-lowest";
               if (isFound) bgClass = "bg-secondary";
               else if (isSelected) bgClass = "bg-primary text-white";

               return (
                 <div 
                    key={tileKey}
                    onClick={() => handleTileClick(r, c)}
                    className={`aspect-square rounded-2xl flex items-center justify-center font-headline text-3xl font-black cursor-pointer select-none sticker-tile ${bgClass} ${isSelected || isFound ? 'scale-105' : ''}`}
                 >
                    {letter}
                 </div>
               )
             })
          ))}
        </div>

        <button 
           onClick={onReturn}
           className="px-6 py-2 bg-lavender-sky text-on-surface font-bold rounded-full die-cut-border sticker-shadow hover:pressed-shadow transition-all text-sm uppercase -rotate-2 mt-4"
        >
           Return
        </button>
      </div>
    </div>
  );
};
