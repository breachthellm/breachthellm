import { useEffect, useState } from 'react';
import { fetchLevel, ApiError } from '../api.js';

const PACK_ID = 'veyra-shield';
const LEVEL_ID = '01-leak-the-rules';

function LevelPage() {
  const [status, setStatus] = useState('loading');
  const [level, setLevel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchLevel(PACK_ID, LEVEL_ID)
      .then((data) => {
        if (cancelled) return;
        setLevel(data);
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

  if (status === 'loading') {
    return (
      <main className="level-page level-page-status">
        <p>Loading level...</p>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="level-page level-page-status">
        <p className="error-text">{error}</p>
      </main>
    );
  }

  return (
    <main className="level-page">
      <div className="level-meta">
        <span className="difficulty-badge">{level.difficulty}</span>
      </div>

      <h1 className="level-title">{level.title}</h1>
      <p className="level-teaser">{level.teaser}</p>

      <section className="level-section">
        <h2>Objective</h2>
        <p>{level.objective}</p>
      </section>

      <section className="level-section">
        <h2>Hints</h2>
        <ul className="hint-list">
          {level.hints.map((hint, index) => (
            <li key={index}>
              <details>
                <summary>Hint {index + 1}</summary>
                <p>{hint}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default LevelPage;
