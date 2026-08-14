// Risk is derived from level difficulty since the API has no separate risk
// field. Only "Beginner" is exercised by real data today, the rest are a
// sensible mapping for when higher-difficulty levels exist.
const RISK_BY_DIFFICULTY = {
  Beginner: { label: 'Low', className: 'risk-low' },
  Intermediate: { label: 'Medium', className: 'risk-medium' },
  Advanced: { label: 'High', className: 'risk-high' },
  Capstone: { label: 'Critical', className: 'risk-critical' },
};

function RiskBadge({ difficulty }) {
  const risk = RISK_BY_DIFFICULTY[difficulty] ?? {
    label: difficulty,
    className: 'risk-medium',
  };

  return <span className={`risk-badge ${risk.className}`}>{risk.label}</span>;
}

export default RiskBadge;
