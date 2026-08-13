import SystemMasthead from './SystemMasthead.jsx';

function QueueHeader({ count }) {
  return (
    <div className="panel-header">
      <SystemMasthead />
      <div className="panel-meta">
        <span className="case-id">
          {count === undefined ? '—' : count} Cases in Queue
        </span>
        <span className="panel-reviewer">
          Assigned Reviewer: <span className="reviewer-value">YOU</span>
        </span>
      </div>
    </div>
  );
}

export default QueueHeader;
