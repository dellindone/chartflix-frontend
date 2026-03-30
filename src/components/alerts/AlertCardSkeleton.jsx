// src/components/alerts/AlertCardSkeleton.jsx
import styles from './AlertCardSkeleton.module.css';

export default function AlertCardSkeleton({ index = 0 }) {
  return (
    <div className={styles.card} style={{ animationDelay: `${index * 60}ms` }}>
      <div className={styles.head}>
        <div className={styles.row}>
          <div className={`${styles.bone} ${styles.pill}`} />
          <div className={`${styles.bone} ${styles.pillSm}`} />
        </div>
        <div className={`${styles.bone} ${styles.exchip}`} />
      </div>
      <div className={styles.body}>
        <div className={`${styles.bone} ${styles.contract}`} />
        <div className={`${styles.bone} ${styles.sym}`} />
        <div className={styles.grid}>
          <div className={styles.field}>
            <div className={`${styles.bone} ${styles.label}`} />
            <div className={`${styles.bone} ${styles.val}`} />
          </div>
          <div className={styles.field}>
            <div className={`${styles.bone} ${styles.label}`} />
            <div className={`${styles.bone} ${styles.val}`} />
          </div>
          <div className={styles.field}>
            <div className={`${styles.bone} ${styles.label}`} />
            <div className={`${styles.bone} ${styles.val}`} />
          </div>
          <div className={styles.field}>
            <div className={`${styles.bone} ${styles.label}`} />
            <div className={`${styles.bone} ${styles.val}`} />
          </div>
        </div>
        <div className={`${styles.bone} ${styles.invest}`} />
      </div>
      <div className={styles.footer}>
        <div className={`${styles.bone} ${styles.ts}`} />
      </div>
    </div>
  );
}
