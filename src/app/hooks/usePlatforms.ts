import { useState, useEffect } from 'react';

export interface Platform {
  id: number;
  name: string;
  icon: string | null;
  is_active: number;
}

export function usePlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.onehub.ae/api/platform/get-all-platforms')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlatforms(data.data.filter((p: Platform) => p.is_active === 1));
        } else {
          setError('Failed to load platforms');
        }
      })
      .catch(() => setError('Failed to load platforms'))
      .finally(() => setLoading(false));
  }, []);

  return { platforms, loading, error };
}
