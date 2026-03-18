// src/components/reco/CommonStocksModal.jsx
import React, { useState } from 'react';
import { ANALYSTS } from '../../data/analysts';
import { formatINR } from '../../utils/helpers';
import Modal from '../common/Modal';
import styles from './CommonStocksModal.module.css';

export default function CommonStocksModal({ isOpen, onClose }) {
  const [checked, setChecked] = useState(new Set(ANALYSTS.map((a) => a.id)));
  const [results, setResults] = useState(null);

  const toggle = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size <= 2) return prev; next.delete(id); }
      else next.add(id);
      return next;
    });
    setResults(null);
  };

  const runCommon = () => {
    const selected = ANALYSTS.filter((a) => checked.has(a.id));
    const symMap = {};
    selected.forEach((a) =>
      a.recommendations.forEach((r) => {
        if (!symMap[r.sym]) symMap[r.sym] = { name: r.name, entries: [] };
        symMap[r.sym].entries.push({ analyst: a, rec: r });
      })
    );
    const commons = Object.entries(symMap)
      .filter(([, v]) => v.entries.length >= 2)
      .sort((a, b) => b[1].entries.length - a[1].entries.length);
    setResults({ commons, selectedCount: selected.length });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Common Stocks" subtitle="Select analysts to compare overlapping picks">
      <div className={styles.sectionLabel}>Select analysts to compare</div>
      <div className={styles.analystList}>
        {ANALYSTS.map((a) => {
          const isChecked = checked.has(a.id);
          return (
            <div key={a.id} className={`${styles.row} ${isChecked ? styles.checked : ''}`} onClick={() => toggle(a.id)}>
              <div className={`${styles.checkBox} ${isChecked ? styles.checkBoxOn : ''}`}>
                {isChecked && '✓'}
              </div>
              <div className={styles.av} style={{ background: a.avatarBg, color: a.avatarColor }}>{a.initials}</div>
              <div>
                <div className={styles.aName}>{a.name}</div>
                <div className={styles.aTag}>{a.tag} · {a.recommendations.length} picks</div>
              </div>
            </div>
          );
        })}
      </div>

      <p className={styles.hint}>Stocks picked by at least 2 selected analysts will be shown</p>
      <button className={styles.runBtn} onClick={runCommon}>Compare &amp; find common picks</button>

      {results && (
        <div className={styles.results}>
          <div className={styles.resLabel}>
            {results.commons.length} stock{results.commons.length !== 1 ? 's' : ''} common across {results.selectedCount} analysts
          </div>

          {results.commons.length === 0 ? (
            <div className={styles.empty}>No overlapping stocks found between the selected analysts.</div>
          ) : (
            results.commons.map(([sym, data]) => (
              <div key={sym} className={styles.resCard}>
                <div className={styles.resCardHead}>
                  <div>
                    <div className={styles.resSym}>{sym}</div>
                    <div className={styles.resName}>{data.name}</div>
                  </div>
                  <div className={styles.resCount}>{data.entries.length}/{results.selectedCount} analysts</div>
                </div>
                <div className={styles.resRows}>
                  {data.entries.map((e, i) => (
                    <div key={i} className={styles.resRow}>
                      <div className={styles.resAb}>
                        <div className={styles.resBav} style={{ background: e.analyst.avatarBg, color: e.analyst.avatarColor }}>{e.analyst.initials}</div>
                        <span className={styles.resBname}>{e.analyst.name}</span>
                      </div>
                      <div className={styles.resAction}>
                        <span className={`${styles.miniPill} ${styles[e.rec.action]}`}>{e.rec.action.toUpperCase()}</span>
                        <span className={styles.resPrice}>₹{formatINR(e.rec.cmp)} → ₹{formatINR(e.rec.target)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Modal>
  );
}
