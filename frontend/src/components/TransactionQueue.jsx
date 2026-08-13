import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLevels, ApiError } from '../api.js';
import QueueHeader from './QueueHeader.jsx';

const PACK_ID = 'veyra-shield';

function rowStateClass(level) {
  if (!level.unlocked) return 'queue-row queue-row-locked';
  if (level.completed) return 'queue-row queue-row-completed';
  return 'queue-row queue-row-active';
}

function QueueRow({ level }) {
  const content = (
    <>
      <div className="queue-row-main">
        <h3 className="queue-row-title">{level.title}</h3>
        <p className="queue-row-teaser">{level.teaser}</p>
        <span className="queue-row-difficulty">[ {level.difficulty} ]</span>
      </div>

      {!level.unlocked && <span className="lock-badge">[ LOCKED ]</span>}

      {level.completed && (
        <span className="stamp-badge">
          [ <span className="stamp-word">Closed</span> ]
        </span>
      )}
    </>
  );

  if (!level.unlocked) {
    return <div className={rowStateClass(level)}>{content}</div>;
  }

  return (
    <Link to={`/case/${level.id}`} className={rowStateClass(level)}>
      {content}
    </Link>
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
      <QueueHeader count={status === 'loaded' ? levels.length : undefined} />

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
          <h1 className="level-title queue-title">Flagged Transactions</h1>
          <ul className="queue-list">
            {levels.map((level) => (
              <li key={level.id}>
                <QueueRow level={level} />
              </li>
            ))}
          </ul>
        </main>
      )}
    </div>
  );
}

export default TransactionQueue;
