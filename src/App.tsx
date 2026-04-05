import React, { useRef, useState } from 'react';
import { useHandTracker } from './hooks/useHandTracker';
import { Lobby } from './views/Lobby';
import { Candles } from './views/Candles';
import { Photo } from './views/Photo';
import { WordSearch } from './views/WordSearch';
import { PrankForm } from './views/PrankForm';
import { AuthGuard } from './components/AuthGuard';

const App: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [cameraEnabled, setCameraEnabled] = useState(false);

    const handleEnableCamera = async () => {
        try {
            // Explicitly prompt the browser to ask for camera permissions
            await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraEnabled(true);
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Camera access is required for the hand tracking to work!");
        }
    };

    const { fingerCount, isReady, landmarks } = useHandTracker(videoRef.current, cameraEnabled);
    
    // We maintain a forced view override for when a user engages in an app
    // e.g. if they start WordSearch, we don't want to just eject them if their hand shifts
    const [overrideView, setOverrideView] = useState<number | null>(null);
    const [giftClaimed, setGiftClaimed] = useState(false);

    // activeMode logic: override takes precedence, fallback to current fingerCount, or Lobby (0)
    let activeMode = 0;
    if (giftClaimed) activeMode = 4; // Claim form
    else if (overrideView !== null) activeMode = overrideView;
    else if (fingerCount >= 1 && fingerCount <= 3) activeMode = fingerCount;

    const handleReturn = () => {
        setOverrideView(null);
    };

    if (!isAuthorized) {
        return <AuthGuard onSuccess={() => setIsAuthorized(true)} />;
    }

    return (
        <div className="min-h-screen bg-background text-on-surface font-body overflow-x-hidden flex flex-col items-center selection:bg-primary/30">
            {/* Top Navigation */}
            <header className="w-full flex justify-between items-center px-6 py-4 bg-transparent z-50">
                <div className="text-xl font-extrabold tracking-tight font-headline uppercase bg-white px-4 py-1 die-cut-border rounded-full sticker-shadow">
                    SELENA_OS
                </div>
                
            </header>

            <main className="flex-1 w-full flex flex-col pt-8 pb-20 px-4 md:px-8 max-w-7xl relative">
                <div className={activeMode === 0 ? "w-full" : "hidden"}>
                    <Lobby 
                         fingerCount={fingerCount} 
                         isReady={isReady} 
                         videoRef={videoRef} 
                         cameraEnabled={cameraEnabled}
                         onEnableCamera={handleEnableCamera}
                         onSelectMode={setOverrideView}
                    />
                </div>
                {activeMode === 1 && (
                    <div className="w-full animate-in slide-in-from-bottom-8 duration-700">
                         <Candles onReturn={handleReturn} fingerCount={fingerCount} landmarks={landmarks} />
                    </div>
                )}
                {activeMode === 2 && (
                    <div className="w-full">
                         <Photo onReturn={handleReturn} />
                    </div>
                )}
                {activeMode === 3 && (
                    <div className="w-full">
                         <WordSearch 
                             onReturn={handleReturn} 
                             onWin={() => setGiftClaimed(true)} 
                         />
                    </div>
                )}
                {activeMode === 4 && (
                    <div className="w-full">
                         <PrankForm />
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
