import axios from "axios";
import { useState, useCallback } from "react";
import { useWorkflowStore } from "@/stores/useWorkflowStore";
import { Workflow } from "@/types/workflow";

/**
 * fetches a workflow by UUID
 */

export function useGetWorkflow() {
  const { setWorkflow } = useWorkflowStore((state) => state);
  const [errorGet, setErrorGet] = useState<string | null>(null);
  const [loadingGet, setLoadingGet] = useState<boolean>();

  const getWorkflow = useCallback(async (id: string) => {
    setLoadingGet(true);
    setErrorGet(null);
    try {
      const res = await axios.get<Workflow>(
        `${process.env.NEXT_PUBLIC_API_URL}/workflows/${id}`,
      );
      setWorkflow(res.data);
    } catch (e: any) {
      setErrorGet(e.message || "Error fetching workflow");
    } finally {
      setLoadingGet(false);
    }
  }, []);

  return { loadingGet, errorGet, getWorkflow };
}
