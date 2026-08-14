import SystemMasthead from './SystemMasthead.jsx';

function CaseHeader({ caseId }) {
  return (
    <div className="panel-header">
      <SystemMasthead crumb={caseId} />
      <span className="panel-reviewer">
        Assigned Reviewer: <strong>YOU</strong>
      </span>
    </div>
  );
}

export default CaseHeader;
