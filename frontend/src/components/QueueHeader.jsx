import SystemMasthead from './SystemMasthead.jsx';

function QueueHeader() {
  return (
    <div className="panel-header">
      <SystemMasthead crumb="Queue" />
      <span className="panel-reviewer">
        Assigned Reviewer: <strong>YOU</strong>
      </span>
    </div>
  );
}

export default QueueHeader;
