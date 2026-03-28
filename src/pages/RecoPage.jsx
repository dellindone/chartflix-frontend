// src/pages/RecoPage.jsx
import { useState, useRef, useEffect } from 'react';
import { apiCall, API_ENDPOINTS } from '../utils/api';
import AnalystSection from '../components/reco/AnalystSection';
import CommonStocksModal from '../components/reco/CommonStocksModal';
import styles from './RecoPage.module.css';

// Generate a consistent avatar color pair from an analyst_id string
const AVATAR_PALETTES = [
  { avatarBg: '#0d2349', avatarColor: '#388bfd' },
  { avatarBg: '#1e0d2d', avatarColor: '#bc8cff' },
  { avatarBg: '#0f2d1a', avatarColor: '#3fb950' },
  { avatarBg: '#2d1a0f', avatarColor: '#e3b341' },
  { avatarBg: '#2d0f1a', avatarColor: '#f78166' },
];

function analystDisplayFromId(analyst_id, analyst_name) {
  const hash = analyst_id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const palette = AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
  const name = analyst_name || 'Analyst';
  const initials = name.split(' ').map((p) => p[0] || '').join('').slice(0, 2).toUpperCase() || 'AN';
  return {
    id: analyst_id,
    name,
    tag: 'Analyst',
    initials,
    ...palette,
  };
}

export default function RecoPage() {
  const [analysts, setAnalysts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analystFilter, setAnalystFilter] = useState('ALL');
  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const [ddOpen, setDdOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const ddRef = useRef(null);

  useEffect(() => {
    const fetchRecos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiCall(`${API_ENDPOINTS.RECOMMENDATIONS}?limit=100`, { method: 'GET' });
        const json = await res.json();
        if (json.success) {
          // Group recommendations by analyst_id
          const grouped = {};
          json.data.forEach((r) => {
            if (!grouped[r.analyst_id]) grouped[r.analyst_id] = [];
            grouped[r.analyst_id].push(r);
          });
          const analystList = Object.entries(grouped).map(([analyst_id, recommendations]) => ({
            ...analystDisplayFromId(analyst_id, recommendations[0].analyst_name),
            recommendations,
          }));
          setAnalysts(analystList);
        } else {
          setError(json.message || 'Failed to load recommendations');
        }
      } catch (e) {
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecos();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isAll = analystFilter === 'ALL';
  const toShow = isAll ? analysts : analysts.filter((a) => a.id === analystFilter);
  const selectedAnalyst = analysts.find((a) => a.id === analystFilter);

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
                {analysts.map((a) => (
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
        {error ? (
          <div className={styles.empty}>⚠ {error}</div>
        ) : loading ? (
          <div className={styles.empty}>Loading recommendations...</div>
        ) : toShow.length === 0 ? (
          <div className={styles.empty}>No recommendations found.</div>
        ) : (
          toShow.map((analyst) => (
            <AnalystSection
              key={analyst.id}
              analyst={analyst}
              isCollapsed={collapsedSections.has(analyst.id)}
              onToggleCollapse={() => toggleSection(analyst.id)}
              showCollapseBtn={isAll}
            />
          ))
        )}
      </div>

      {/* Common Stocks Modal */}
      <CommonStocksModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        analysts={analysts}
      />
    </div>
  );
}
