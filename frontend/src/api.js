const API_BASE_URL = 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(message, { unreachable = false } = {}) {
    super(message);
    this.unreachable = unreachable;
  }
}

export async function fetchLevel(packId, levelId) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/packs/${packId}/levels/${levelId}`);
  } catch (err) {
    throw new ApiError('Could not reach the backend. Is it running?', {
      unreachable: true,
    });
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error || `Request failed (${res.status})`);
  }

  return res.json();
}
