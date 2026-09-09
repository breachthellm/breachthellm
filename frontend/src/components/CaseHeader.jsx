import SystemMasthead from './SystemMasthead.jsx';

function CaseHeader({ caseId, packName }) {
  return (
    <div className="panel-header">
      <SystemMasthead crumb={caseId} packName={packName} />
      <span className="panel-reviewer">
        Assigned Reviewer: <strong>YOU</strong>
      </span>
    </div>
  );
}

export default CaseHeader;
