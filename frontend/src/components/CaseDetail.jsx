import { useParams } from 'react-router-dom';
import CaseHeader from './CaseHeader.jsx';
import LevelPage from './LevelPage.jsx';
import { placeholderCaseId } from '../caseIds.js';

const PACK_ID = 'veyra-shield';

// Only one real level exists today, so index 0 is hardcoded here. This will
// need to resolve the level's actual position once more levels exist.
const CASE_ID = placeholderCaseId(0);

function CaseDetail() {
  const { levelId } = useParams();

  return (
    <div className="review-panel">
      <CaseHeader caseId={CASE_ID} />
      <LevelPage packId={PACK_ID} levelId={levelId} caseId={CASE_ID} />
    </div>
  );
}

export default CaseDetail;
