import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CaseHeader from './CaseHeader.jsx';
import LevelPage from './LevelPage.jsx';
import { fetchLevels } from '../api.js';
import { placeholderCaseId } from '../caseIds.js';

const PACK_ID = 'veyra-shield';

function CaseDetail() {
  const { levelId } = useParams();
  const [caseId, setCaseId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchLevels(PACK_ID)
      .then((levels) => {
        if (cancelled) return;
        const index = levels.findIndex((l) => l.id === levelId);
        if (index !== -1) {
          setCaseId(placeholderCaseId(index));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [levelId]);

  return (
    <div className="review-panel">
      <CaseHeader caseId={caseId} />
      <LevelPage packId={PACK_ID} levelId={levelId} caseId={caseId} />
    </div>
  );
}

export default CaseDetail;
