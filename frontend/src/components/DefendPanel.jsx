import { useState } from 'react';
import { submitDefense, ApiError } from '../api.js';
import DefendResultsModal from './DefendResultsModal.jsx';

function DefendPanel({ packId, levelId, level, onSolved }) {
  const [draftPrompt, setDraftPrompt] = useState(level.vulnerableSystemPrompt);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewingResults, setViewingResults] = useState(false);

  async function handleTest() {
    const trimmed = draftPrompt.trim();
    if (!trimmed || testing) return;

    setTesting(true);
    setError(null);
    setResult(null);

    try {
      const data = await submitDefense(packId, levelId, trimmed);
      setResult(data);
      if (data.passed) {
        onSolved();
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setTesting(false);
    }
  }

  const attackRefusedCount = result?.attackResults.filter((r) => r.refused).length ?? 0;
  const legitimateSucceededCount = result?.legitimateResults.filter((r) => r.succeeded).length ?? 0;

  return (
    <div className="defend-panel">
      <div className="defend-reference">
        <div>
          <p className="meta-label">Attack message</p>
          <p className="trace-segment-text defend-reference-text">{level.attackMessage}</p>
        </div>
        <div>
          <p className="meta-label">Legitimate message</p>
          <p className="trace-segment-text defend-reference-text">{level.legitimateMessage}</p>
        </div>
      </div>

      <label className="flag-submit-label" htmlFor="defend-prompt-input">
        Your patched system prompt
      </label>
      <textarea
        id="defend-prompt-input"
        className="chat-input defend-prompt-input"
        rows={16}
        value={draftPrompt}
        onChange={(event) => setDraftPrompt(event.target.value)}
        disabled={testing}
      />

      <div className="flag-submit-controls">
        <button
          type="button"
          className="chat-send-button"
          onClick={handleTest}
          disabled={testing || !draftPrompt.trim()}
        >
          Test My Patch
        </button>
      </div>

      {testing && (
        <div className="chat-typing">
          <span className="chat-typing-dot" />
          <span className="chat-typing-dot" />
          <span className="chat-typing-dot" />
          <span className="chat-typing-caption">
            Testing your patch against 6 live model calls (3 attack, 3 legitimate). This
            can take 15 to 60+ seconds on a local model, please don't close this tab.
          </span>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      {result && (
        <div className="defend-result">
          <p className={result.passed ? 'flag-feedback flag-feedback-correct' : 'flag-feedback flag-feedback-incorrect'}>
            {result.passed
              ? 'Passed. All 3 attack attempts were refused and all 3 legitimate transactions were approved.'
              : `Not yet. ${attackRefusedCount}/3 attack attempts refused, ${legitimateSucceededCount}/3 legitimate transactions approved.`}
          </p>
          <button
            type="button"
            className="trace-trigger"
            onClick={() => setViewingResults(true)}
          >
            View full responses
          </button>
        </div>
      )}

      {viewingResults && result && (
        <DefendResultsModal result={result} onClose={() => setViewingResults(false)} />
      )}
    </div>
  );
}

export default DefendPanel;
