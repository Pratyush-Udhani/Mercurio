import { useState } from "react";
import axios from "axios";

export function useUrlScraper() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrape = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/scrape`,
        { url },
      );
      setData(res.data);
    } catch (e: any) {
      setError(e.message || "Error scraping URL");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, scrape };
}
