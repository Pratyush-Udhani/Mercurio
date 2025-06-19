import { useState, useCallback } from "react";
import axios from "axios";
import { Workflow } from "@/types/workflow";
import { useWorkflowStore } from "@/stores/useWorkflowStore";

/**
 * sends the workflow object to create a script
 */
export function useGenerateScripts() {
  const { setWorkflow } = useWorkflowStore((state) => state);

  const [errorCr, setErrorCr] = useState<string | null>(null);
  const [loadingCr, setLoadingCr] = useState<boolean>();

  const generateScripts = useCallback(
    async (workflow: Workflow): Promise<Workflow> => {
      setLoadingCr(true);
      setErrorCr(null);
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/workflows/${workflow.uuid}/generate-scripts`,
          workflow,
        );
        setWorkflow(res.data);
        return res.data;
      } catch (e: any) {
        setErrorCr(e.message || "Error creating script");
        throw e;
      } finally {
        setLoadingCr(false);
      }
    },
    [],
  );

  return { loadingCr, errorCr, generateScripts };
}
