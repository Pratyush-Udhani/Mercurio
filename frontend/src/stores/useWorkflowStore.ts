// src/stores/useWorkflowStore.ts
import { create } from "zustand";
import type { Workflow, Product } from "@/types/workflow";

interface WorkflowState {
  loading: boolean;
  workflow: Workflow | null;
  setWorkflow: (w: Workflow) => void;
  setLoading: (l: boolean) => void;

  /* Convenience setters if you need granular updates */
  setProduct: (p: Product) => void;
  setLLMScripts: (scripts: Record<string, string>) => void;
  reset: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  loading: false,
  workflow: null,

  setWorkflow: (w) => set({ workflow: w }),

  setLoading: (l) => set({ loading: l }),

  setProduct: (product) =>
    set((state) =>
      state.workflow ? { workflow: { ...state.workflow, product } } : {},
    ),

  setLLMScripts: (llm_scripts) =>
    set((state) =>
      state.workflow ? { workflow: { ...state.workflow, llm_scripts } } : {},
    ),

  reset: () => set({ workflow: null }),
}));
