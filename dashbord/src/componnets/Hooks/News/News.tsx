import { useState, useEffect } from 'react';
import { merchantApiClient } from './../../../Interceptor/axios';

export interface NewsSearchParams {
  _page: number;
  _limit: number;
  _sort?: string;
  _order?: string;
  Title?: string;
  IsActive?: boolean;
}

export interface NewsItem {
  id: number;
  newsGroupId: number;
  picture: string;
  title: string;
  summary: string;
  text: string;
  isActive: boolean;
  recordDateFa: string;
  recordTime: string;
}

export const useNews = (params: NewsSearchParams) => {
  const [data, setData] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await merchantApiClient.get('/admin/News/Search', { params });
      if (response.data && response.data.valueOrDefault) {
        setData(response.data.valueOrDefault.data || []);
        setTotal(response.data.valueOrDefault.total || 0);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (err) {
      setError(true);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params._page, params._limit, params.Title, params.IsActive]);

  return { data, total, loading, error, refetch: fetchData };
}