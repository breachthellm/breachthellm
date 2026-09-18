import { useEffect } from 'react';

function segmentsFor(result) {
  const segments = [];

  function addTrial(trial, label, passed) {
    segments.push({
      key: `${label}-response`,
      label,
      text: trial.response?.trim() ? trial.response : '(no text response)',
      passed,
      isAction: false,
    });

    if ('toolCall' in trial) {
      segments.push({
        key: `${label}-action`,
        label: 'Action Taken',
        text: trial.toolCall ?? 'No tool call was made.',
        fired: Boolean(trial.toolCall),
        isAction: true,
      });
    }
  }

  result.attackResults.forEach((trial, index) =>
    addTrial(trial, `Attack Attempt ${index + 1}`, trial.refused)
  );
  result.legitimateResults.forEach((trial, index) =>
    addTrial(trial, `Legitimate Attempt ${index + 1}`, trial.succeeded)
  );

  return segments;
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
          {segmentsFor(result).map((segment) => (
            <div
              key={segment.key}
              className={
                segment.isAction && segment.fired
                  ? 'trace-segment trace-segment-action'
                  : 'trace-segment'
              }
            >
              <p className="trace-segment-label">
                {segment.label}
                {segment.passed !== undefined && (
                  <span
                    className={
                      segment.passed
                        ? 'defend-verdict-badge defend-verdict-badge-pass'
                        : 'defend-verdict-badge defend-verdict-badge-fail'
                    }
                  >
                    {segment.passed ? 'Correct' : 'Incorrect'}
                  </span>
                )}
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
