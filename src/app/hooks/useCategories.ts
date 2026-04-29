import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from "../../services/api";
export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.onehub.ae/api/categories/get-all-categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
        } else {
          setError('Failed to load categories');
        }
      })
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}
