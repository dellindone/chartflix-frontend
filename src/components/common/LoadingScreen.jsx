// src/components/common/LoadingScreen.jsx
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>
        {/* Animated logo */}
        <div className={styles.logoWrap}>
          <img src="/logo.png" alt="Chartflix" className={styles.logoImg} />
          <div className={styles.spinRingWrap}>
            <svg viewBox="0 0 140 140" className={styles.spinRingSvg}>
              <circle cx="70" cy="70" r="62" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="2"/>
              <circle cx="70" cy="70" r="62" fill="none" stroke="#c9a84c" strokeWidth="2"
                strokeLinecap="round" strokeDasharray="60 330" className={styles.spinArc}/>
            </svg>
          </div>
        </div>

        {/* Brand text */}
        <div className={styles.brand}>CHARTFLIX</div>
        <div className={styles.tagline}>STREAMING MARKET INSIGHTS</div>

        {/* Loading bar */}
        <div className={styles.barTrack}>
          <div className={styles.barFill} />
        </div>

        {/* Dots */}
        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      </div>
    </div>
  );
}
