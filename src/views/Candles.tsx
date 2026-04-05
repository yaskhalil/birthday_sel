import React, { useEffect, useRef, useState } from 'react';

interface CandlesProps {
  onReturn: () => void;
  fingerCount: number;
  landmarks: any; // MediaPipe Landmarks
}

export const Candles: React.FC<CandlesProps> = ({ onReturn }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [extinguished, setExtinguished] = useState(false);

  // Z-axis swipe detection removed
  // Audio volume detection (Web Audio API)
  useEffect(() => {
    if (extinguished) return;

    let audioContext: AudioContext;
    let analyzer: AnalyserNode;
    let source: MediaStreamAudioSourceNode;
    let loopId: number;

    const startAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new window.AudioContext();
        analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256;
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyzer);

        const dataArray = new Uint8Array(analyzer.frequencyBinCount);

        const checkVolume = () => {
          analyzer.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          // Threshold for "blowing". Typically produces loud wind noise/high volume
          if (average > 80) { 
            setExtinguished(true);
            return; // Stop checking
          }
          loopId = requestAnimationFrame(checkVolume);
        };
        
        checkVolume();
      } catch (e) {
        console.error("Audio detection blocked or unavailable", e);
      }
    };

    startAudio();

    return () => {
      if (loopId) cancelAnimationFrame(loopId);
      if (audioContext) audioContext.close();
    };
  }, [extinguished]);

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: {x: number, y: number, life: number, vx: number, vy: number}[] = [];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw 20 candles
      const spacing = canvas.width / 22;
      for (let i = 0; i < 20; i++) {
        const cx = spacing + (i * spacing) + 10;
        const cy = canvas.height - 40;
        
        // Candle body
        ctx.fillStyle = '#FAB1A0';
        ctx.fillRect(cx - 5, cy - 60, 10, 60);
        ctx.strokeStyle = '#2D3436';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 5, cy - 60, 10, 60);

        // Flame
        if (!extinguished) {
          ctx.beginPath();
          // Jiggle flame slightly for effect
          const jiggle = Math.random() * 4 - 2;
          ctx.moveTo(cx, cy - 60);
          ctx.quadraticCurveTo(cx - 15 + jiggle, cy - 75, cx, cy - 90);
          ctx.quadraticCurveTo(cx + 15 + jiggle, cy - 75, cx, cy - 60);
          ctx.fillStyle = '#FFEAA7';
          ctx.fill();
          ctx.stroke();
        } else {
            // If extinguished, generate particles once
            if (particles.length === 0 && i === 19) {
               for(let p=0; p<100; p++) {
                   particles.push({
                       x: Math.random() * canvas.width,
                       y: cy - 60,
                       life: 1.0,
                       vx: (Math.random() - 0.5) * 5,
                       vy: (Math.random() - 1) * 5
                   });
               }
            }
        }
      }

      if (extinguished) {
          particles.forEach((p) => {
              p.x += p.vx;
              p.y += p.vy;
              p.life -= 0.02;
              if (p.life > 0) {
                  ctx.fillStyle = `rgba(45, 52, 54, ${p.life})`;
                  ctx.beginPath();
                  ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
                  ctx.fill();
              }
          });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [extinguished]);

  return (
    <div className="flex-1 w-full max-w-5xl p-6 flex flex-col items-center justify-center animate-in slide-in-from-bottom-8 duration-700">
      <div className="bg-surface-container-lowest p-8 rounded-2xl die-cut-border sticker-shadow w-full flex flex-col items-center">
        <h2 className="font-headline text-4xl font-black mb-4 uppercase">Blow out the candles!</h2>
        <p className="font-medium opacity-80 mb-8 text-center text-sm">
          Keep 1 finger up. Blow directly into your microphone!
        </p>

        <canvas 
           ref={canvasRef} 
           width={800} 
           height={400} 
           className="bg-primary/10 rounded-xl die-cut-border sticker-shadow w-full max-w-3xl mb-8"
        />

        {extinguished && (
            <div className="animate-in zoom-in font-bold text-2xl text-primary mb-4">
                Yay! Make a wish!
            </div>
        )}

        <button 
           onClick={onReturn}
           className="px-6 py-3 bg-secondary text-on-surface font-bold rounded-full die-cut-border sticker-shadow hover:pressed-shadow transition-all active:translate-y-1"
        >
           Return to Lobby
        </button>
      </div>
    </div>
  );
};
