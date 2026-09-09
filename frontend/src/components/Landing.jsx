import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPacks, ApiError } from '../api.js';

function Landing() {
  const [status, setStatus] = useState('loading');
  const [packs, setPacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchPacks()
      .then((data) => {
        if (cancelled) return;
        setPacks(data);
        setStatus('loaded');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : 'Something went wrong.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="landing">
      <h1 className="landing-title">Choose a range</h1>

      {status === 'loading' && <p className="landing-status">Loading available packs...</p>}

      {status === 'error' && <p className="landing-status landing-status-error">{error}</p>}

      {status === 'loaded' && (
        <div className="pack-list">
          {packs.map((pack) => (
            <Link key={pack.id} to={`/pack/${pack.id}`} className="pack-card">
              <span className="pack-card-org">{pack.org}</span>
              <span className="pack-card-name">{pack.name}</span>
              <span className="pack-card-tagline">{pack.tagline}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default Landing;
