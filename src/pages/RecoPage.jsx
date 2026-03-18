// src/pages/RecoPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ANALYSTS } from '../data/analysts';
import AnalystSection from '../components/reco/AnalystSection';
import CommonStocksModal from '../components/reco/CommonStocksModal';
import styles from './RecoPage.module.css';

export default function RecoPage() {
  const [analystFilter, setAnalystFilter] = useState('ALL');
  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const [ddOpen, setDdOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const ddRef = useRef(null);

  const isAll = analystFilter === 'ALL';
  const toShow = isAll ? ANALYSTS : ANALYSTS.filter((a) => a.id === analystFilter);
  const selectedAnalyst = ANALYSTS.find((a) => a.id === analystFilter);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectAnalyst = (id) => {
    setAnalystFilter(id);
    setCollapsedSections(new Set());
    setDdOpen(false);
  };

  const toggleSection = (id) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.page}>
      {/* Fixed header */}
      <div className={styles.fixed}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.heading}>Stock Recommendations</div>
            <div className={styles.sub}>Curated picks from top analysts</div>
          </div>
        </div>

        <div className={styles.controls}>
          {/* Analyst dropdown */}
          <div className={styles.ddWrap} ref={ddRef}>
            <div className={styles.ddBtn} onClick={() => setDdOpen((p) => !p)}>
              <div className={styles.ddBtnLeft}>
                {selectedAnalyst ? (
                  <div
                    className={styles.ddBtnAv}
                    style={{ background: selectedAnalyst.avatarBg, color: selectedAnalyst.avatarColor }}
                  >
                    {selectedAnalyst.initials}
                  </div>
                ) : (
                  <div className={styles.ddBtnAvDefault}>◆</div>
                )}
                <span>{selectedAnalyst ? selectedAnalyst.name : 'All Analysts'}</span>
              </div>
              <span className={styles.caret}>▼</span>
            </div>

            {ddOpen && (
              <div className={`${styles.ddMenu} fade-in`}>
                {/* All option */}
                <div
                  className={`${styles.ddItem} ${analystFilter === 'ALL' ? styles.ddItemActive : ''}`}
                  onClick={() => selectAnalyst('ALL')}
                >
                  <div className={styles.ddItemAvDefault}>◆</div>
                  <div>
                    <div className={styles.ddItemName}>All Analysts</div>
                    <div className={styles.ddItemTag}>Show everyone</div>
                  </div>
                </div>
                <div className={styles.ddSep} />
                {ANALYSTS.map((a) => (
                  <div
                    key={a.id}
                    className={`${styles.ddItem} ${analystFilter === a.id ? styles.ddItemActive : ''}`}
                    onClick={() => selectAnalyst(a.id)}
                  >
                    <div className={styles.ddItemAv} style={{ background: a.avatarBg, color: a.avatarColor }}>
                      {a.initials}
                    </div>
                    <div>
                      <div className={styles.ddItemName}>{a.name}</div>
                      <div className={styles.ddItemTag}>{a.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Common stocks button */}
          <button className={styles.commonBtn} onClick={() => setModalOpen(true)}>
            Common Stocks
          </button>
        </div>
      </div>

      {/* Scrollable analyst sections */}
      <div className={styles.scroll}>
        {toShow.map((analyst) => (
          <AnalystSection
            key={analyst.id}
            analyst={analyst}
            isCollapsed={collapsedSections.has(analyst.id)}
            onToggleCollapse={() => toggleSection(analyst.id)}
            showCollapseBtn={isAll}
          />
        ))}
      </div>

      {/* Common Stocks Modal */}
      <CommonStocksModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
