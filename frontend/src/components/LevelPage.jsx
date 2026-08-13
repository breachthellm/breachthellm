import { useEffect, useState } from 'react';
import { fetchLevel, ApiError } from '../api.js';
import ChatPanel from './ChatPanel.jsx';

function LevelPage({ packId, levelId }) {
  const [status, setStatus] = useState('loading');
  const [level, setLevel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchLevel(packId, levelId)
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
  }, [packId, levelId]);

  if (status === 'loading') {
    return (
      <main className="case-body case-body-status">
        <p>Loading case file...</p>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="case-body case-body-status">
        <p className="error-text">{error}</p>
      </main>
    );
  }

  return (
    <main className="case-body">
      <div className="title-row">
        <h1 className="level-title">{level.title}</h1>
        <span className="stamp-badge">
          [ <span className="stamp-word">{level.difficulty}</span> ]
        </span>
      </div>

      <p className="level-teaser">{level.teaser}</p>

      <section className="level-section">
        <h2>Investigator&rsquo;s Brief</h2>
        <p>{level.objective}</p>
      </section>

      <section className="level-section">
        <h2>Attached Notes</h2>
        <ul className="note-list">
          {level.hints.map((hint, index) => (
            <li key={index}>
              <details>
                <summary>
                  <span className="note-marker" />
                  <span className="note-label">
                    Note {String(index + 1).padStart(2, '0')}
                  </span>
                </summary>
                <p className="note-body">{hint}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>

      <section className="level-section">
        <h2>Chat with Veyra Shield</h2>
        <ChatPanel packId={packId} levelId={levelId} />
      </section>
    </main>
  );
}

export default LevelPage;
