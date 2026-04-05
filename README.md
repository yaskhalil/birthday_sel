# 🎂 Selena's Birthday App 2026

Welcome to the **Selena OS** - a high-performance, gesture-controlled birthday experience built for A friend!

## 🚀 Experience Highlights

- **Finger Gesture Navigation**: Use your hand! The app uses **MediaPipe Computer Vision** to track how many fingers you're holding up to switch modes.
  - **1 Finger**: 🕯️ Blow out 20 digital candles (Mic-detection enabled!).
  - **2 Fingers**: 💅 Photo Gallery - Toggle between **Diva** and **Gremlin** vibes.
  - **3 Fingers**: 🧩 Word Search - Find the secret words (including the legendary **FETTIG** vertically!).
- **Birthday Lockdown**: Built-in protection screen. Unless it's **April 12th, 2026**, you're staying out... unless you know the secret password.
- **The Gift Prank**: A psychological test... who enters their real address in a random app? (Don't worry, we're not actually evil 🤣).
- **Sticker Aesthetic**: Premium "Kawaii/Cozy" design with die-cut borders, hard shadows, and smooth bouncy animations.

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Sticker Design System)
- **Computer Vision**: @mediapipe/hands
- **Motion**: Framer Motion
- **Interactions**: Web Audio API (for blowing candles)

## 📦 How to Run Locally

1. **Clone the repo**:

   ```bash
   git clone https://github.com/yaskhalil/birthday_sel.git
   cd birthday_sel
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Start Development Server**:

   ```bash
   npm run dev
   ```

4. **Access the App**:
   Open `http://localhost:5173` in your browser.

## 🔐 Deployment

This app is optimized for **Vercel** deployment with a serverless backend handled in `/api/prank.ts`.

---

_Created for a friend's Birthday._
