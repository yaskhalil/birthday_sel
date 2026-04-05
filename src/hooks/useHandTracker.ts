import { useEffect, useRef, useState } from 'react';
import type { Results, LandmarkList, Hands as HandsType } from '@mediapipe/hands';
import type { Camera as CameraType } from '@mediapipe/camera_utils';

export interface TrackerState {
  fingerCount: number;
  isReady: boolean;
  landmarks: LandmarkList | null;
}

export const useHandTracker = (videoElement: HTMLVideoElement | null, enabled: boolean) => {
  const [state, setState] = useState<TrackerState>({
    fingerCount: 0,
    isReady: false,
    landmarks: null,
  });

  const handsRef = useRef<HandsType | null>(null);
  const cameraRef = useRef<CameraType | null>(null);

  // Debounce refs to prevent flicker
  const consecutiveCountRef = useRef(0);
  const lastRawCountRef = useRef(-1);

  useEffect(() => {
    if (!videoElement || !enabled) return;

    let isSubscribed = true;

    // We do explicit window assignment bindings or standard constructor 
    // depending on exactly how Vite resolves it. 
    // Fallback if local module is broken: 
    const HandsClass = (window as any).Hands;
    const CameraClass = (window as any).Camera;
    
    const hands = new HandsClass({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results: Results) => {
      if (!isSubscribed) return;

      let currentRawCount = 0;
      let currentLandmarks: LandmarkList | null = null;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        currentLandmarks = results.multiHandLandmarks[0];
        const handedness = results.multiHandedness[0]; // Left or Right
        currentRawCount = countFingers(currentLandmarks, handedness.label);
      }

      // 7-Frame Consensus Debounce Logic
      if (currentRawCount === lastRawCountRef.current) {
         consecutiveCountRef.current += 1;
      } else {
         lastRawCountRef.current = currentRawCount;
         consecutiveCountRef.current = 1;
      }

      setState(prev => {
         // Require the new finger count to be completely stable for 7 consecutive frames (~200ms)
         const nextFingerCount = consecutiveCountRef.current >= 7 ? currentRawCount : prev.fingerCount;
         
         return {
           ...prev,
           fingerCount: nextFingerCount,
           landmarks: currentLandmarks,
           isReady: true
         };
      });
    });

    handsRef.current = hands;

    const camera = new CameraClass(videoElement, {
      onFrame: async () => {
        if (handsRef.current && isSubscribed) {
          await handsRef.current.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480
    });

    camera.start();
    cameraRef.current = camera;

    return () => {
      isSubscribed = false;
      camera.stop();
      hands.close();
      setState(prev => ({ ...prev, isReady: false, fingerCount: 0, landmarks: null }));
    };
  }, [videoElement, enabled]);

  return state;
};

// Helper: Count up-facing fingers
function countFingers(landmarks: LandmarkList, handedness: string): number {
  let count = 0;

  // MediaPipe joints: 
  // Thumb: 4, Index: 8, Middle: 12, Ring: 16, Pinky: 20
  // MCP (base): Thumb: 2, Index: 5, Middle: 9, Ring: 13, Pinky: 17
  
  // Thumb check (x-axis)
  // Because the camera is 'flipped', handedness might be inverted relative to image.
  // We'll use a basic heuristic for the thumb based on x relative to index MCP.
  const isRightHand = handedness === 'Right';
  
  // Thumb is extended if its tip (4) is further 'out' than the IP (3).
  // Note: For mirrored video, Right is really Left. 
  // Let's use distance from thumb tip to index PIP as a rough check, or simply x-axis check.
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];
  
  if (isRightHand) {
      if (thumbTip.x < thumbIp.x) count++;
  } else {
      if (thumbTip.x > thumbIp.x) count++;
  }

  // Fingers (y-axis check against PIP joints)
  // Tip must be higher (y is smaller) than the PIP joint.
  const fingers = [
    { tip: 8, pip: 6 },  // Index
    { tip: 12, pip: 10 }, // Middle
    { tip: 16, pip: 14 }, // Ring
    { tip: 20, pip: 18 }  // Pinky
  ];

  fingers.forEach(f => {
    if (landmarks[f.tip].y < landmarks[f.pip].y) {
      count++;
    }
  });

  return count;
}
