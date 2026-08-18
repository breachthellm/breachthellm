import { useEffect } from 'react';

const SOURCE_LABELS = {
  system: 'System Prompt',
  ticket: 'Submitted Ticket',
  user: 'Your Message',
};

function labelFor(source) {
  return SOURCE_LABELS[source] ?? source.charAt(0).toUpperCase() + source.slice(1);
}

function TraceModal({ trace, solved, systemPrompt, onClose }) {
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
          <span className="trace-modal-title">Context Trace</span>
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
          {trace.map((segment, index) => {
            const text =
              segment.source === 'system' && solved && systemPrompt
                ? systemPrompt
                : segment.text;

            return (
              <div key={index} className={`trace-segment trace-segment-${segment.source}`}>
                <p className="trace-segment-label">{labelFor(segment.source)}</p>
                <p className="trace-segment-text">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TraceModal;
