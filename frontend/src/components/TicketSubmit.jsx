import { useState } from 'react';
import { postTicket, ApiError } from '../api.js';

function TicketSubmit({ packId, levelId, ticketSubmitted, ticketInputLabel, onSubmitted }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await postTicket(packId, levelId, trimmed);
      onSubmitted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  if (ticketSubmitted) {
    return <p className="flag-feedback flag-feedback-correct">Ticket submitted.</p>;
  }

  return (
    <form className="flag-submit-row" onSubmit={handleSubmit}>
      <label className="flag-submit-label" htmlFor="ticket-input">
        {ticketInputLabel ?? 'Ticket details'}
      </label>
      <textarea
        id="ticket-input"
        className="chat-input"
        rows={4}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={submitting}
      />
      <div className="flag-submit-controls">
        <button
          type="submit"
          className="chat-send-button"
          disabled={submitting || !content.trim()}
        >
          Submit Ticket
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}

export default TicketSubmit;
