import { useEffect, useState } from 'react';
import { fetchLevel, ApiError } from '../api.js';
import ChatPanel from './ChatPanel.jsx';
import RiskBadge from './RiskBadge.jsx';
import FlagSubmit from './FlagSubmit.jsx';
import TicketSubmit from './TicketSubmit.jsx';
import ResetLevel from './ResetLevel.jsx';

function LevelPage({ packId, levelId, caseId }) {
  const [status, setStatus] = useState('loading');
  const [level, setLevel] = useState(null);
  const [error, setError] = useState(null);
  const [resetCount, setResetCount] = useState(0);

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

  function handleSolved() {
    fetchLevel(packId, levelId)
      .then((data) => setLevel(data))
      .catch(() => {});
  }

  function handleTicketSubmitted() {
    fetchLevel(packId, levelId)
      .then((data) => setLevel(data))
      .catch(() => {});
  }

  function handleReset() {
    fetchLevel(packId, levelId)
      .then((data) => setLevel(data))
      .catch(() => {});
    setResetCount((count) => count + 1);
  }

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
      <h1 className="page-title">{level.title}</h1>

      <div className="meta-grid">
        <div className="meta-field">
          <span className="meta-label">Case ID</span>
          <span className="meta-value cell-mono">{caseId}</span>
        </div>
        <div className="meta-field">
          <span className="meta-label">Risk</span>
          <RiskBadge difficulty={level.difficulty} />
        </div>
        <div className="meta-field">
          <span className="meta-label">Status</span>
          <span className="meta-value">{level.solved ? 'Closed' : 'Open'}</span>
        </div>
        {level.solved && (
          <div className="meta-field">
            <span className="meta-label">Reset</span>
            <ResetLevel packId={packId} levelId={levelId} onReset={handleReset} />
          </div>
        )}
      </div>

      <p className="level-teaser">{level.teaser}</p>

      <section className="detail-section">
        <h2>Objective</h2>
        <p>{level.objective}</p>
      </section>

      <section className="detail-section">
        <h2>Notes</h2>
        <ul className="faq-list">
          {level.hints.map((hint, index) => (
            <li key={index}>
              <details>
                <summary>Note {index + 1}</summary>
                <p>{hint}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>

      {level.usesTicket && (
        <section className="detail-section">
          <h2>{level.ticketLabel ?? 'Submit Dispute Ticket'}</h2>
          <TicketSubmit
            packId={packId}
            levelId={levelId}
            ticketSubmitted={level.ticketSubmitted}
            ticketInputLabel={level.ticketInputLabel}
            onSubmitted={handleTicketSubmitted}
          />
        </section>
      )}

      <section className="detail-section">
        <h2>Chat with Veyra Shield</h2>
        <ChatPanel
          key={resetCount}
          packId={packId}
          levelId={levelId}
          solved={level.solved}
          systemPrompt={level.systemPrompt}
          onSolved={handleSolved}
        />
      </section>

      <section className="detail-section">
        <h2>Flag Submission</h2>
        {level.solved ? (
          <div className="solved-summary">
            <div className="meta-field">
              <span className="meta-label">Flag</span>
              <span className="meta-value cell-mono">{level.flag}</span>
            </div>
            <p className="level-teaser">{level.postSolveExplanation}</p>
          </div>
        ) : (
          <FlagSubmit packId={packId} levelId={levelId} onSolved={handleSolved} />
        )}
      </section>
    </main>
  );
}

export default LevelPage;
