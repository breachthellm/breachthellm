import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLevels, ApiError } from '../api.js';
import QueueHeader from './QueueHeader.jsx';
import RiskBadge from './RiskBadge.jsx';
import { placeholderCaseId } from '../caseIds.js';

const PACK_ID = 'veyra-shield';

function statusFor(level) {
  if (!level.unlocked) return 'Locked';
  if (level.completed) return 'Closed';
  return 'Open';
}

function summarize(levels) {
  const counts = { Closed: 0, Open: 0, Locked: 0 };
  levels.forEach((level) => {
    counts[statusFor(level)] += 1;
  });

  return `${levels.length} cases · ${counts.Closed} closed · ${counts.Open} open · ${counts.Locked} locked`;
}

function QueueTableRow({ level, index }) {
  const navigate = useNavigate();
  const clickable = level.unlocked;

  return (
    <tr
      className={clickable ? 'queue-row-clickable' : 'queue-row-locked'}
      onClick={clickable ? () => navigate(`/case/${level.id}`) : undefined}
    >
      <td className="cell-mono">{placeholderCaseId(index)}</td>
      <td>
        <div className="cell-title">{level.title}</div>
        <div className="cell-subtext">{level.teaser}</div>
      </td>
      <td>
        <RiskBadge difficulty={level.difficulty} />
      </td>
      <td className="cell-status">
        <span className={`status-badge status-badge-${statusFor(level).toLowerCase()}`}>
          {statusFor(level)}
        </span>
      </td>
    </tr>
  );
}

function TransactionQueue() {
  const [status, setStatus] = useState('loading');
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchLevels(PACK_ID)
      .then((data) => {
        if (cancelled) return;
        setLevels(data);
        setStatus('loaded');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : 'Something went wrong.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="review-panel">
      <QueueHeader />

      {status === 'loading' && (
        <main className="case-body case-body-status">
          <p>Loading transaction queue...</p>
        </main>
      )}

      {status === 'error' && (
        <main className="case-body case-body-status">
          <p className="error-text">{error}</p>
        </main>
      )}

      {status === 'loaded' && (
        <main className="case-body">
          <h1 className="page-title">Flagged Transactions</h1>
          <p className="queue-summary">{summarize(levels)}</p>
          <table className="queue-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((level, index) => (
                <QueueTableRow key={level.id} level={level} index={index} />
              ))}
            </tbody>
          </table>
        </main>
      )}
    </div>
  );
}

export default TransactionQueue;
