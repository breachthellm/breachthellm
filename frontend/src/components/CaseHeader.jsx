// Hardcoded placeholder, not derived from real data, same treatment as the
// old "LVL 1/7" counter. Will need real wiring once cases/levels are tracked.
const CASE_ID = 'Case #VS-2026-0114';

function CaseHeader() {
  return (
    <div className="case-header">
      <p className="system-label">Veyra Internal Review System</p>
      <div className="case-meta">
        <span className="case-id">{CASE_ID}</span>
        <span className="case-reviewer">
          Assigned Reviewer: <span className="reviewer-value">YOU</span>
        </span>
      </div>
    </div>
  );
}

export default CaseHeader;
