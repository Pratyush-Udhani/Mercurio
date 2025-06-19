// hooks/useGetWorkflow.ts
import { useState, useCallback } from "react";
import axios from "axios";

export type Product = {
  product_name: string;
  product_description: string;
  images: string[];
};

export type Workflow = {
  uuid: string;
  product: Product;
};

/**
 * fetches a workflow by UUID
 */
export function useGetWorkflow() {
  const [data, setData] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getWorkflow = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Workflow>(
        `${process.env.NEXT_PUBLIC_API_URL}/workflows/${id}`,
      );
      setData(res.data);
    } catch (e: any) {
      setError(e.message || "Error fetching workflow");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, getWorkflow };
}

// hooks/useCreateScript.ts
