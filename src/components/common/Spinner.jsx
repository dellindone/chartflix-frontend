// src/components/common/Spinner.jsx
import styles from './Spinner.module.css';

export default function Spinner({ text = 'Loading...' }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.ring}>
        <svg viewBox="0 0 48 48" className={styles.svg}>
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="3"/>
          <circle cx="24" cy="24" r="20" fill="none" stroke="#c9a84c" strokeWidth="3"
            strokeLinecap="round" strokeDasharray="30 96" className={styles.arc}/>
        </svg>
        {/* mini candlestick in center */}
        <svg viewBox="0 0 20 20" className={styles.icon}>
          <line x1="5"  y1="3"  x2="5"  y2="17" stroke="#c9a84c" strokeWidth="1.2"/>
          <rect x="3"   y="6"  width="4" height="7" rx="0.5" fill="#c9a84c"/>
          <line x1="10" y1="2"  x2="10" y2="18" stroke="#c9a84c" strokeWidth="1.2"/>
          <rect x="8"   y="5"  width="4" height="9" rx="0.5" fill="none" stroke="#c9a84c" strokeWidth="1.2"/>
          <line x1="15" y1="4"  x2="15" y2="16" stroke="#c9a84c" strokeWidth="1.2"/>
          <rect x="13"  y="7"  width="4" height="6" rx="0.5" fill="#c9a84c"/>
        </svg>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}
