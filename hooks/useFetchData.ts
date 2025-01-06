import { useState, useEffect } from 'react';
import { fetchDataFromAPI } from '../services/api';
import { Artwork } from '../models/Artwork.model';

export const useFetchData = (query: string) => {
  const [data, setData] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      fetchDataFromAPI(query)
        .then((detailedData) => {
          setData(detailedData);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [query]);

  return { data, loading, error };
};