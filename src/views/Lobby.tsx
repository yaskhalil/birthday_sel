import React from 'react';
import { Home, Cake, Image as ImageIcon } from 'lucide-react';

interface LobbyProps {
  fingerCount: number;
  isReady: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null> | ((node: HTMLVideoElement | null) => void);
  cameraEnabled: boolean;
  onEnableCamera: () => void;
  onSelectMode: (mode: number) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ fingerCount, isReady, videoRef, cameraEnabled, onEnableCamera, onSelectMode }) => {
  return (
    <div className="flex-1 w-full max-w-7xl p-6 md:p-12 flex flex-col gap-8 items-center justify-center animate-in fade-in duration-500">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
        <div>
          <h1 className="font-headline text-5xl md:text-6xl font-black mb-2">Welcome back!</h1>
          <p className="text-xl font-medium opacity-80">Ready for the next big birthday adventure?</p>
        </div>
        
        {/* Webcam Live Feed Sticker */}
        <div className="relative w-48 h-48 bg-surface-container-highest die-cut-border rounded-xl sticker-shadow rotate-3 overflow-hidden bg-black flex flex-col items-center justify-center p-2 text-center pointer-events-auto">
             
             {/* The video element ALWAYS exists in the DOM so React hooks can bind to its ref immediately */}
             <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 z-0" 
                autoPlay playsInline muted 
             />

             {!cameraEnabled && (
              <div className="flex flex-col items-center justify-center gap-2 h-full w-full z-10 absolute inset-0 bg-black/85">
                 <span className="text-sm text-white opacity-80 font-bold uppercase tracking-widest">
                   Camera Off
                 </span>
              </div>
             )}

             {cameraEnabled && !isReady && (
                 <div className="text-white animate-pulse z-10 relative font-bold text-sm">Loading AI...</div>
             )}

             {cameraEnabled && (
                <>
                  <div className="absolute top-3 left-3 bg-error-container text-white text-[10px] px-2 py-0.5 rounded-full border-2 border-sticker-border flex items-center gap-1 z-10">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> LIVE
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 backdrop-blur-sm p-2 text-center text-[10px] font-bold text-white uppercase flex justify-between items-center px-4 z-10">
                     <span>Webcam 01</span>
                     <span className="text-secondary font-black">Fingers: {fingerCount}</span>
                  </div>
                </>
             )}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="flex flex-col md:flex-row gap-8 w-full mt-8 items-stretch">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
          <div onClick={() => onSelectMode(1)} className={`group flex flex-col items-center justify-center p-8 bg-surface-container-lowest die-cut-border rounded-xl sticker-shadow transition-all duration-300 -rotate-2 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[8px_8px_0px_0px_var(--color-sticker-border)] cursor-pointer ${fingerCount === 1 ? 'pressed-shadow bg-primary/10' : ''}`}>
            <div className="w-20 h-20 bg-primary/20 rounded-full die-cut-border flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
               <Cake className="w-10 h-10 text-primary" />
            </div>
            <span className="text-xs font-black opacity-60 uppercase tracking-widest mb-1">Hold 1 Finger</span>
            <h3 className="font-headline font-black text-2xl">CANDLES</h3>
          </div>

          <div onClick={() => onSelectMode(2)} className={`group flex flex-col items-center justify-center p-8 bg-surface-container-lowest die-cut-border rounded-xl sticker-shadow transition-all duration-300 rotate-1 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[8px_8px_0px_0px_var(--color-sticker-border)] cursor-pointer ${fingerCount === 2 ? 'pressed-shadow bg-secondary/20' : ''}`}>
            <div className="w-20 h-20 bg-secondary/40 rounded-full die-cut-border flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
               <ImageIcon className="w-10 h-10 text-yellow-600" />
            </div>
            <span className="text-xs font-black opacity-60 uppercase tracking-widest mb-1">Hold 2 Fingers</span>
            <h3 className="font-headline font-black text-2xl">PHOTO</h3>
          </div>

          <div onClick={() => onSelectMode(3)} className={`group flex flex-col items-center justify-center p-8 bg-surface-container-lowest die-cut-border rounded-xl sticker-shadow transition-all duration-300 -rotate-1 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[8px_8px_0px_0px_var(--color-sticker-border)] cursor-pointer ${fingerCount === 3 ? 'pressed-shadow bg-tertiary/20' : ''}`}>
            <div className="w-20 h-20 bg-tertiary/40 rounded-full die-cut-border flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
               <Home className="w-10 h-10 text-orange-600" />
            </div>
            <span className="text-xs font-black opacity-60 uppercase tracking-widest mb-1">Hold 3 Fingers</span>
            <h3 className="font-headline font-black text-2xl">GAME BOOK</h3>
          </div>
        </div>

        {/* Vertical Text Column */}
        <div className="hidden md:flex items-center justify-center w-16">
           <div 
             className="font-bold text-center uppercase tracking-widest text-on-surface opacity-80" 
             style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
           >
              do all of these to get a <span className="font-black text-primary text-2xl block mt-2">gift</span>
           </div>
        </div>
      </div>

      {/* Disclaimers & Camera Entry */}
      {!cameraEnabled && (
        <div className="mt-8 flex flex-col items-center gap-4 bg-surface-container-lowest p-6 rounded-xl die-cut-border sticker-shadow max-w-2xl text-center w-full animate-in zoom-in-95 duration-300 -rotate-1">
           <button 
             onClick={onEnableCamera}
             className="px-8 py-4 bg-primary text-white text-lg font-black rounded-full die-cut-border sticker-shadow hover:pressed-shadow transition-all uppercase cursor-pointer active:translate-y-1 hover:-translate-y-1 hover:scale-[1.02]"
           >
              Turn On Camera
           </button>
           <p className="text-sm font-bold opacity-80 mt-2 text-on-surface leading-snug">
              CAMERA NEEDS TO BE ON TO WORK (or your boring cuz I spent time on this)
              <br />
              (Nothing is saved by the way im not evil) 
           </p>
        </div>
      )}
    </div>
  );
};
