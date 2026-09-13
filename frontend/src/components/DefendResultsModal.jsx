import { useEffect } from 'react';

function segmentsFor(result) {
  return [
    ...result.attackResults.map((trial, index) => ({
      label: `Attack Attempt ${index + 1}`,
      text: trial.response,
      passed: trial.refused,
    })),
    ...result.legitimateResults.map((trial, index) => ({
      label: `Legitimate Attempt ${index + 1}`,
      text: trial.response,
      passed: trial.succeeded,
    })),
  ];
}

function DefendResultsModal({ result, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="trace-backdrop" onClick={onClose}>
      <div className="trace-modal" onClick={(event) => event.stopPropagation()}>
        <div className="trace-modal-header">
          <span className="trace-modal-title">Defense Test Results</span>
          <button
            type="button"
            className="trace-close-button"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="trace-modal-body">
          {segmentsFor(result).map((segment, index) => (
            <div key={index} className="trace-segment">
              <p className="trace-segment-label">
                {segment.label}
                <span
                  className={
                    segment.passed
                      ? 'defend-verdict-badge defend-verdict-badge-pass'
                      : 'defend-verdict-badge defend-verdict-badge-fail'
                  }
                >
                  {segment.passed ? 'Correct' : 'Incorrect'}
                </span>
              </p>
              <p className="trace-segment-text">{segment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DefendResultsModal;
