import { useState, useCallback } from "react";
import axios from "axios";
import type { Workflow } from "./useGetWorkflow";

/**
 * sends the workflow object to create a script
 */
export function useGenerateScripts() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateScripts = useCallback(async (workflow: Workflow) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workflows/${workflow.uuid}/generate-scripts`,
        workflow,
      );
      setResult(res.data);
      return res.data;
    } catch (e: any) {
      setError(e.message || "Error creating script");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, generateScripts };
}
