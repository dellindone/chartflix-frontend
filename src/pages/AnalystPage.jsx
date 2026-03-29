// src/pages/AnalystPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiCall, API_ENDPOINTS } from '../utils/api';
import { formatINR, calcPct } from '../utils/helpers';
import styles from './AnalystPage.module.css';

/* ─── Alert Create Form ─── */
const ALERT_DEFAULTS = {
  category: 'INDEX', direction: 'BULLISH',
  exchange: 'NSE', contract: '', symbol: '',
  ltp: '', strike: '', option_ltp: '', lot_size: '', investment: '',
};

/* ─── Reco Create Form ─── */
const RECO_DEFAULTS = {
  symbol: '', name: '', action: 'BUY',
  sector: '', cmp: '', target: '', stop_loss: '', note: '',
};

/* ─── Tiny modal ─── */
function Modal({ title, onClose, children }) {
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} slide-in-up`}>
        <div className={styles.modalHead}>
          <span className={styles.modalTitle}>{title}</span>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

/* ─── Field component ─── */
function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

export default function AnalystPage() {
  const { currentUser } = useAuth();
  const [tab, setTab]   = useState('alerts');

  // Alerts state
  const [alerts, setAlerts]         = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError]     = useState(null);
  const [alertModal, setAlertModal]       = useState(false);
  const [alertForm, setAlertForm]         = useState(ALERT_DEFAULTS);
  const [alertSaving, setAlertSaving]     = useState(false);
  const [alertFormErr, setAlertFormErr]   = useState('');

  // Recos state
  const [recos, setRecos]           = useState([]);
  const [recosLoading, setRecosLoading] = useState(true);
  const [recosError, setRecosError]     = useState(null);
  const [recoModal, setRecoModal]       = useState(false);
  const [recoForm, setRecoForm]         = useState(RECO_DEFAULTS);
  const [recoSaving, setRecoSaving]     = useState(false);
  const [recoFormErr, setRecoFormErr]   = useState('');

  const [toast, setToast]     = useState(null);
  const [publishing, setPublishing] = useState(null);

  const isAllowed = currentUser?.role === 'analyst' || currentUser?.role === 'admin';

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch my alerts ──
  const fetchAlerts = async () => {
    setAlertsLoading(true); setAlertsError(null);
    try {
      const res  = await apiCall(`${API_ENDPOINTS.ALERTS}/my`, { method: 'GET' });
      const json = await res.json();
      if (json.success) setAlerts(json.data);
      else setAlertsError(json.message || 'Failed to load alerts');
    } catch { setAlertsError('Failed to load alerts'); }
    finally { setAlertsLoading(false); }
  };

  // ── Fetch my recos ──
  const fetchRecos = async () => {
    setRecosLoading(true); setRecosError(null);
    try {
      const res  = await apiCall(`${API_ENDPOINTS.RECOMMENDATIONS}/my`, { method: 'GET' });
      const json = await res.json();
      if (json.success) setRecos(json.data);
      else setRecosError(json.message || 'Failed to load recommendations');
    } catch { setRecosError('Failed to load recommendations'); }
    finally { setRecosLoading(false); }
  };

  useEffect(() => {
    if (!isAllowed) return;
    fetchAlerts();
    fetchRecos();
  }, []);

  // ── Create alert ──
  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setAlertFormErr('');
    setAlertSaving(true);
    try {
      const body = {
        ...alertForm,
        ltp: parseFloat(alertForm.ltp), strike: parseFloat(alertForm.strike),
        option_ltp: parseFloat(alertForm.option_ltp), lot_size: parseInt(alertForm.lot_size),
        investment: parseFloat(alertForm.investment),
      };
      const res  = await apiCall(API_ENDPOINTS.ALERTS, { method: 'POST', body: JSON.stringify(body) });
      const json = await res.json();
      if (json.success) {
        setAlerts((p) => [json.data, ...p]);
        setAlertModal(false);
        setAlertForm(ALERT_DEFAULTS);
        showToast('Alert created');
      } else {
        setAlertFormErr(json.message || 'Failed to create alert');
      }
    } catch { setAlertFormErr('Server error'); }
    finally { setAlertSaving(false); }
  };

  // ── Create recommendation ──
  const handleCreateReco = async (e) => {
    e.preventDefault();
    setRecoFormErr('');
    setRecoSaving(true);
    try {
      const body = {
        ...recoForm,
        cmp: parseFloat(recoForm.cmp), target: parseFloat(recoForm.target),
        stop_loss: parseFloat(recoForm.stop_loss),
      };
      const res  = await apiCall(API_ENDPOINTS.RECOMMENDATIONS, { method: 'POST', body: JSON.stringify(body) });
      const json = await res.json();
      if (json.success) {
        setRecos((p) => [json.data, ...p]);
        setRecoModal(false);
        setRecoForm(RECO_DEFAULTS);
        showToast('Recommendation created');
      } else {
        setRecoFormErr(json.message || 'Failed to create recommendation');
      }
    } catch { setRecoFormErr('Server error'); }
    finally { setRecoSaving(false); }
  };

  // ── Update alert field (direction, etc.) ──
  const handleUpdateAlert = async (alertId, patch) => {
    try {
      const res  = await apiCall(`${API_ENDPOINTS.ALERTS}/${alertId}`, { method: 'PATCH', body: JSON.stringify(patch) });
      const json = await res.json();
      if (json.success) {
        setAlerts((p) => p.map((a) => a.id === alertId ? { ...a, ...patch } : a));
        showToast('Alert updated');
      } else showToast(json.message || 'Update failed', 'error');
    } catch { showToast('Server error', 'error'); }
  };

  // ── Update reco field (action, etc.) ──
  const handleUpdateReco = async (recoId, patch) => {
    try {
      const res  = await apiCall(`${API_ENDPOINTS.RECOMMENDATIONS}/${recoId}`, { method: 'PATCH', body: JSON.stringify(patch) });
      const json = await res.json();
      if (json.success) {
        setRecos((p) => p.map((r) => r.id === recoId ? { ...r, ...patch } : r));
        showToast('Recommendation updated');
      } else showToast(json.message || 'Update failed', 'error');
    } catch { showToast('Server error', 'error'); }
  };

  // ── Toggle publish ──
  const toggleAlertPublish = async (alertId) => {
    setPublishing(alertId);
    try {
      const res  = await apiCall(`${API_ENDPOINTS.ALERTS}/${alertId}/publish`, { method: 'PATCH' });
      const json = await res.json();
      if (json.success) {
        setAlerts((p) => p.map((a) => a.id === alertId ? json.data : a));
        showToast('Alert publish status updated');
      } else showToast(json.message || 'Failed', 'error');
    } catch { showToast('Server error', 'error'); }
    finally { setPublishing(null); }
  };

  const toggleRecoPublish = async (recoId) => {
    setPublishing(recoId);
    try {
      const res  = await apiCall(`${API_ENDPOINTS.RECOMMENDATIONS}/${recoId}/publish`, { method: 'PATCH' });
      const json = await res.json();
      if (json.success) {
        setRecos((p) => p.map((r) => r.id === recoId ? json.data : r));
        showToast('Recommendation publish status updated');
      } else showToast(json.message || 'Failed', 'error');
    } catch { showToast('Server error', 'error'); }
    finally { setPublishing(null); }
  };

  if (!isAllowed) {
    return (
      <div className={styles.denied}>
        <div className={styles.deniedIcon}>✦</div>
        <div className={styles.deniedTitle}>Analysts Only</div>
        <div className={styles.deniedSub}>This page is for analysts and admins.</div>
      </div>
    );
  }

  const af = alertForm;
  const setAF = (key, val) => setAlertForm((p) => {
    const next = { ...p, [key]: val };
    // Auto-extract strike from contract (e.g. NIFTY26MAR22000CE → 22000)
    if (key === 'contract') {
      const match = val.match(/(\d+(?:\.\d+)?)(CE|PE)$/i);
      if (match) next.strike = match[1];
    }
    // Auto-calculate investment = lot_size × option_ltp
    const lots = parseFloat(key === 'lot_size' ? val : next.lot_size);
    const optLtp = parseFloat(key === 'option_ltp' ? val : next.option_ltp);
    next.investment = (isFinite(lots) && isFinite(optLtp)) ? (lots * optLtp).toFixed(2) : next.investment;
    return next;
  });
  const rf = recoForm;
  const setRF = (key, val) => setRecoForm((p) => ({ ...p, [key]: val }));

  const statusColor = (s) => s === 'PUBLISHED' ? '#22c55e' : s === 'ACTIVE' ? '#22c55e' : s === 'INACTIVE' ? '#f59e0b' : '#818cf8';

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastErr : styles.toastOk} fade-in`}>
          {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>My Content</h1>
          <p className={styles.sub}>Manage your alerts &amp; recommendations</p>
        </div>
        <button
          className={styles.createBtn}
          onClick={() => tab === 'alerts' ? setAlertModal(true) : setRecoModal(true)}
        >
          + New {tab === 'alerts' ? 'Alert' : 'Recommendation'}
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'alerts' ? styles.tabActive : ''}`} onClick={() => setTab('alerts')}>
          ◈ Alerts
          <span className={styles.tabCount}>{alerts.length}</span>
        </button>
        <button className={`${styles.tab} ${tab === 'recos' ? styles.tabActive : ''}`} onClick={() => setTab('recos')}>
          ◆ Recommendations
          <span className={styles.tabCount}>{recos.length}</span>
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* ── ALERTS tab ── */}
        {tab === 'alerts' && (
          alertsLoading ? <div className={styles.empty}>Loading alerts...</div>
          : alertsError  ? <div className={styles.emptyErr}>⚠ {alertsError}</div>
          : alerts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>◈</div>
              <div className={styles.emptyText}>No alerts yet</div>
              <button className={styles.createBtn} onClick={() => setAlertModal(true)}>+ Create your first alert</button>
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {alerts.map((a) => (
                <div key={a.id} className={`${styles.mCard} ${a.direction === 'BULLISH' ? styles.bull : styles.bear}`}>
                  <div className={styles.mCardHead}>
                    <div className={styles.rowBadges}>
                      <span className={`${styles.pill} ${a.direction === 'BULLISH' ? styles.bull : styles.bear}`}>
                        {a.direction === 'BULLISH' ? '▲' : '▼'} {a.direction}
                      </span>
                      <span className={styles.pill2}>{a.category}</span>
                      <span className={styles.pill2}>{a.exchange}</span>
                    </div>
                    <span className={styles.statusPill} style={{ color: statusColor(a.status), borderColor: `${statusColor(a.status)}44`, background: `${statusColor(a.status)}11` }}>
                      {a.status}
                    </span>
                  </div>
                  <div className={styles.mCardBody}>
                    <div className={styles.rowTitle}>{a.contract}</div>
                    <div className={styles.rowMeta}>Strike {formatINR(a.strike)} · LTP ₹{formatINR(a.ltp)}</div>
                    <div className={styles.rowMeta}>Opt LTP ₹{a.option_ltp} · Lot {a.lot_size}</div>
                    <div className={styles.mInvest}>₹{formatINR(a.investment)}</div>
                  </div>
                  <div className={styles.mCardCtrl}>
                    <select
                      className={styles.ctrlSelect}
                      value={a.direction === 'BULLISH' ? 'BUY' : 'SELL'}
                      onChange={(e) => handleUpdateAlert(a.id, { direction: e.target.value === 'BUY' ? 'BULLISH' : 'BEARISH' })}
                    >
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                    <button
                      className={`${styles.publishBtn} ${a.status === 'ACTIVE' ? styles.unpublishBtn : ''}`}
                      onClick={() => toggleAlertPublish(a.id)}
                      disabled={publishing === a.id}
                    >
                      {publishing === a.id ? '…' : a.status === 'ACTIVE' ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── RECOS tab ── */}
        {tab === 'recos' && (
          recosLoading ? <div className={styles.empty}>Loading recommendations...</div>
          : recosError  ? <div className={styles.emptyErr}>⚠ {recosError}</div>
          : recos.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>◆</div>
              <div className={styles.emptyText}>No recommendations yet</div>
              <button className={styles.createBtn} onClick={() => setRecoModal(true)}>+ Create your first recommendation</button>
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {recos.map((r) => {
                const actionLower = r.action.toLowerCase();
                const upside = parseFloat(calcPct(r.cmp, r.target));
                return (
                  <div key={r.id} className={`${styles.mCard} ${styles[actionLower + 'Border']}`}>
                    <div className={styles.mCardHead}>
                      <div className={styles.rowBadges}>
                        <span className={`${styles.pill} ${actionLower === 'buy' ? styles.bull : actionLower === 'sell' ? styles.bear : styles.hold}`}>
                          {r.action}
                        </span>
                        <span className={styles.pill2}>{r.sector}</span>
                      </div>
                      <span className={styles.statusPill} style={{ color: statusColor(r.status), borderColor: `${statusColor(r.status)}44`, background: `${statusColor(r.status)}11` }}>
                        {r.status}
                      </span>
                    </div>
                    <div className={styles.mCardBody}>
                      <div className={styles.rowTitle}>{r.symbol}</div>
                      <div className={styles.rowSubtitle}>{r.name}</div>
                      <div className={styles.rowMeta}>CMP ₹{formatINR(r.cmp)} · TGT ₹{formatINR(r.target)}</div>
                      <div className={styles.rowMeta}>SL ₹{formatINR(r.stop_loss)}</div>
                      <div className={`${styles.mInvest} ${upside >= 0 ? styles.upsidePos : styles.upsideNeg}`}>
                        {upside >= 0 ? '+' : ''}{upside}% {r.action === 'SELL' ? 'downside' : 'upside'}
                      </div>
                    </div>
                    <div className={styles.mCardCtrl}>
                      <select
                        className={styles.ctrlSelect}
                        value={r.action}
                        onChange={(e) => handleUpdateReco(r.id, { action: e.target.value })}
                      >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                        <option value="HOLD">HOLD</option>
                      </select>
                      <button
                        className={`${styles.publishBtn} ${r.status === 'PUBLISHED' ? styles.unpublishBtn : ''}`}
                        onClick={() => toggleRecoPublish(r.id)}
                        disabled={publishing === r.id}
                      >
                        {publishing === r.id ? '…' : r.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* ── Create Alert Modal ── */}
      {alertModal && (
        <Modal title="Create Alert" onClose={() => { setAlertModal(false); setAlertFormErr(''); }}>
          <form onSubmit={handleCreateAlert} className={styles.form}>
            {alertFormErr && <div className={styles.formErr}>{alertFormErr}</div>}
            <div className={styles.formGrid}>
              <Field label="Category">
                <select className={styles.select} value={af.category} onChange={(e) => setAF('category', e.target.value)}>
                  {['INDEX','STOCK','COMMODITY'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Direction">
                <select className={styles.select} value={af.direction} onChange={(e) => setAF('direction', e.target.value)}>
                  {['BULLISH','BEARISH'].map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Exchange">
                <select className={styles.select} value={af.exchange} onChange={(e) => setAF('exchange', e.target.value)} required>
                  <option value="">Select exchange</option>
                  {['NSE','BSE','MCX'].map((x) => <option key={x}>{x}</option>)}
                </select>
              </Field>
              <Field label="Symbol">
                <input className={styles.input} placeholder="NIFTY50" value={af.symbol} onChange={(e) => setAF('symbol', e.target.value)} required />
              </Field>
              <Field label="Contract">
                <input className={styles.input} placeholder="NIFTY26MAR22000CE" value={af.contract} onChange={(e) => setAF('contract', e.target.value.toUpperCase())} required style={{ textTransform: 'uppercase' }} />
              </Field>
              <Field label="LTP">
                <input className={styles.input} type="number" step="0.01" placeholder="0.00" value={af.ltp} onChange={(e) => setAF('ltp', e.target.value)} required />
              </Field>
              <Field label="Strike">
                <input className={styles.input} type="number" step="0.01" placeholder="0.00" value={af.strike} onChange={(e) => setAF('strike', e.target.value)} required />
              </Field>
              <Field label="Option LTP">
                <input className={styles.input} type="number" step="0.01" placeholder="0.00" value={af.option_ltp} onChange={(e) => setAF('option_ltp', e.target.value)} required />
              </Field>
              <Field label="Quantity">
                <input className={styles.input} type="number" placeholder="1" value={af.lot_size} onChange={(e) => setAF('lot_size', e.target.value)} required />
              </Field>
              <Field label="Investment (lot size × option LTP)">
                <input className={styles.input} type="number" step="0.01" placeholder="0.00" value={af.investment} readOnly style={{ background: 'var(--surf-2)', cursor: 'default' }} required />
              </Field>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => { setAlertModal(false); setAlertFormErr(''); }}>Cancel</button>
              <button type="submit" className={styles.submitBtn} disabled={alertSaving}>
                {alertSaving ? 'Creating...' : 'Create Alert'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Create Reco Modal ── */}
      {recoModal && (
        <Modal title="Create Recommendation" onClose={() => { setRecoModal(false); setRecoFormErr(''); }}>
          <form onSubmit={handleCreateReco} className={styles.form}>
            {recoFormErr && <div className={styles.formErr}>{recoFormErr}</div>}
            <div className={styles.formGrid}>
              <Field label="Symbol">
                <input className={styles.input} placeholder="RELIANCE" value={rf.symbol} onChange={(e) => setRF('symbol', e.target.value)} required />
              </Field>
              <Field label="Company Name">
                <input className={styles.input} placeholder="Reliance Industries" value={rf.name} onChange={(e) => setRF('name', e.target.value)} required />
              </Field>
              <Field label="Action">
                <select className={styles.select} value={rf.action} onChange={(e) => setRF('action', e.target.value)}>
                  {['BUY','SELL','HOLD'].map((a) => <option key={a}>{a}</option>)}
                </select>
              </Field>
              <Field label="Sector">
                <input className={styles.input} placeholder="Energy / IT / Banking" value={rf.sector} onChange={(e) => setRF('sector', e.target.value)} required />
              </Field>
              <Field label="CMP">
                <input className={styles.input} type="number" step="0.01" placeholder="0.00" value={rf.cmp} onChange={(e) => setRF('cmp', e.target.value)} required />
              </Field>
              <Field label="Target">
                <input className={styles.input} type="number" step="0.01" placeholder="0.00" value={rf.target} onChange={(e) => setRF('target', e.target.value)} required />
              </Field>
              <Field label="Stop Loss">
                <input className={styles.input} type="number" step="0.01" placeholder="0.00" value={rf.stop_loss} onChange={(e) => setRF('stop_loss', e.target.value)} required />
              </Field>
            </div>
            <Field label="Note (optional)">
              <textarea className={styles.textarea} rows={3} placeholder="Your analysis or thesis..." value={rf.note} onChange={(e) => setRF('note', e.target.value)} />
            </Field>
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => { setRecoModal(false); setRecoFormErr(''); }}>Cancel</button>
              <button type="submit" className={styles.submitBtn} disabled={recoSaving}>
                {recoSaving ? 'Creating...' : 'Create Recommendation'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
