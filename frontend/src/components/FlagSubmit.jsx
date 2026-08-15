import { useState } from 'react';
import { submitFlag, ApiError } from '../api.js';

function FlagSubmit({ packId, levelId, onSolved }) {
  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = flag.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setResult(null);

    try {
      const data = await submitFlag(packId, levelId, trimmed);
      if (data.correct) {
        setResult('correct');
        onSolved();
      } else {
        setResult('incorrect');
      }
    } catch (err) {
      setResult({ error: err instanceof ApiError ? err.message : 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (result === 'correct') {
    return (
      <p className="flag-feedback flag-feedback-correct">
        Correct. Updating case details...
      </p>
    );
  }

  return (
    <form className="flag-submit-row" onSubmit={handleSubmit}>
      <label className="flag-submit-label" htmlFor="flag-input">
        Submit flag
      </label>
      <div className="flag-submit-controls">
        <input
          id="flag-input"
          type="text"
          autoComplete="off"
          className="chat-input"
          placeholder="BTL{...}"
          value={flag}
          onChange={(event) => {
            setFlag(event.target.value);
            setResult(null);
          }}
          disabled={submitting}
        />
        <button
          type="submit"
          className="chat-send-button"
          disabled={submitting || !flag.trim()}
        >
          Submit
        </button>
      </div>

      {result === 'incorrect' && (
        <p className="flag-feedback flag-feedback-incorrect">Incorrect, try again.</p>
      )}
      {result?.error && <p className="error-text">{result.error}</p>}
    </form>
  );
}

export default FlagSubmit;
