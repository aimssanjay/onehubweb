import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../services/api';

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
    fetch(`${API_BASE_URL}/categories/get-all-categories`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load categories');
        }
        return res.json();
      })
      .then((data) => {
        const categoryList = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.categories)
            ? data.categories
            : Array.isArray(data)
              ? data
              : [];

        if (categoryList.length > 0) {
          setCategories(categoryList);
        } else {
          setError('Failed to load categories');
        }
      })
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}
