import { useState } from 'react';
import { resetLevelProgress, ApiError } from '../api.js';

function ResetLevel({ packId, levelId, onReset }) {
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirm() {
    setResetting(true);
    setError(null);

    try {
      await resetLevelProgress(packId, levelId);
      setConfirming(false);
      onReset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setResetting(false);
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        className="reset-level-button"
        onClick={() => setConfirming(true)}
      >
        Reset this case
      </button>
    );
  }

  return (
    <div className="reset-level-confirm">
      <p className="reset-level-confirm-text">
        Are you sure? This will reset your progress on this case.
      </p>
      <div className="reset-level-confirm-controls">
        <button
          type="button"
          className="reset-level-button-cancel"
          onClick={() => setConfirming(false)}
          disabled={resetting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="reset-level-button-confirm"
          onClick={handleConfirm}
          disabled={resetting}
        >
          Confirm
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default ResetLevel;
