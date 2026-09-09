import SystemMasthead from './SystemMasthead.jsx';

function QueueHeader({ packName }) {
  return (
    <div className="panel-header">
      <SystemMasthead crumb="Queue" packName={packName} />
      <span className="panel-reviewer">
        Assigned Reviewer: <strong>YOU</strong>
      </span>
    </div>
  );
}

export default QueueHeader;
