import axios from "axios";
import { useCallback, useState } from "react";
import type { Workflow } from "@/types/workflow";

export function useUpdateWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateWorkflow = useCallback(async (workflow: Workflow) => {
    setLoading(true);
    setError(null);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/workflows/${workflow.uuid}/update`,
        workflow,
      );
    } catch (err: any) {
      setError(err.message || "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateWorkflow, loading, error };
}
