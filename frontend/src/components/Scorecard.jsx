import { useEffect, useState } from 'react';
import { fetchScorecard, ApiError } from '../api.js';

function formatCategoryLabel(category) {
  return category
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function ModePill({ label, available, done }) {
  if (!available) {
    return <span className="scorecard-pill-na">{label}, not applicable</span>;
  }

  return (
    <span className={`scorecard-pill ${done ? 'scorecard-pill-done' : 'scorecard-pill-pending'}`}>
      {label}
    </span>
  );
}

function Scorecard() {
  const [status, setStatus] = useState('loading');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchScorecard()
      .then((data) => {
        if (cancelled) return;
        setCategories(data.categories);
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
    <main className="scorecard">
      <h1 className="scorecard-title">Your skills scorecard</h1>

      {status === 'loading' && <p className="scorecard-status">Loading scorecard...</p>}

      {status === 'error' && <p className="scorecard-status scorecard-status-error">{error}</p>}

      {status === 'loaded' && (
        <div className="scorecard-grid">
          {categories.map((cat) => (
            <div key={cat.category} className="scorecard-card">
              <span className="scorecard-card-name">{formatCategoryLabel(cat.category)}</span>
              <span className="scorecard-card-meta">
                {cat.owaspLLM} · {cat.mitreAtlas}
              </span>
              <div className="scorecard-pills">
                <ModePill
                  label="Attacked"
                  available={cat.availableModes.includes('attack')}
                  done={cat.attacked}
                />
                <ModePill
                  label="Defended"
                  available={cat.availableModes.includes('defend')}
                  done={cat.defended}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Scorecard;
