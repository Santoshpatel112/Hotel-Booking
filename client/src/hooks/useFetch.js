import { useState, useEffect } from "react";
import api from "../services/api";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(url);
        setData(res.data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const refetch = async () => {
    setLoading(true);
    try {
      const res = await api.get(url);
      if (res.status !== 200) throw new Error(res.statusText);
      setData(res.data);
    } catch (error) {
      setError(error);
      console.error('API Error:', error);
    }
    setLoading(false);
  };
  return { data, error, loading, refetch };
};

export default useFetch;
