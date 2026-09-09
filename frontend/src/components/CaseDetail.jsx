import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CaseHeader from './CaseHeader.jsx';
import LevelPage from './LevelPage.jsx';
import { fetchLevels, fetchPacks } from '../api.js';
import { placeholderCaseId } from '../caseIds.js';

function CaseDetail() {
  const { packId, levelId } = useParams();
  const [caseId, setCaseId] = useState(null);
  const [packName, setPackName] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchLevels(packId)
      .then((levels) => {
        if (cancelled) return;
        const index = levels.findIndex((l) => l.id === levelId);
        if (index !== -1) {
          setCaseId(placeholderCaseId(index));
        }
      })
      .catch(() => {});

    fetchPacks()
      .then((packs) => {
        if (cancelled) return;
        setPackName(packs.find((pack) => pack.id === packId)?.name ?? null);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [packId, levelId]);

  return (
    <div className="review-panel">
      <CaseHeader caseId={caseId} packName={packName} />
      <LevelPage packId={packId} levelId={levelId} caseId={caseId} packName={packName} />
    </div>
  );
}

export default CaseDetail;
