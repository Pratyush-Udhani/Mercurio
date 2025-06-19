"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useGetWorkflow } from "@/hooks/useGetWorkflow";
import { useGenerateScripts } from "@/hooks/useGenerateScripts";
import { useWorkflowStore } from "@/stores/useWorkflowStore";

export default function Page() {
  const { id } = useParams();
  const { loadingGet, errorGet, getWorkflow } = useGetWorkflow();
  const {
    loadingCr: loadingCr,
    errorCr: errorCr,
    generateScripts: generateScripts,
  } = useGenerateScripts();

  const { workflow, setWorkflow } = useWorkflowStore((state) => state);

  useEffect(() => {
    if (id) {
      getWorkflow(id as string);
    }
  }, [id, getWorkflow]);

  if (loadingGet) {
    return <div className="p-8">Loading workflow...</div>;
  }

  if (errorGet || !workflow) {
    return <div className="p-8 text-red-500">Error: {errorGet}</div>;
  }

  const handleGenerate = async () => {
    try {
      await generateScripts(workflow);
      toast.success("Script generated successfully!");
    } catch {
      toast.error(`Failed: ${errorCr}`);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto flex flex-col h-full max-w-2xl space-y-6">
        {/* Product Name */}
        <div>
          <Label className="text-cyan-500" htmlFor="name">
            Product Name
          </Label>
          <Input
            id="name"
            defaultValue={workflow.product.product_name}
            className="mt-1 w-full"
          />
        </div>

        {/* Product Description */}
        <div>
          <Label className="text-cyan-500" htmlFor="description">
            Product Description
          </Label>
          <Textarea
            id="description"
            defaultValue={workflow.product.product_description}
            rows={8}
            className="mt-1 w-full"
          />
        </div>

        {/* Images */}
        <div>
          <Label className="text-cyan-500">Images</Label>
          <div className="mt-2 flex space-x-4 overflow-x-auto">
            {workflow.product.images.map((src) => (
              <img
                key={src}
                src={src}
                alt={workflow.product.product_name}
                className="h-50 w-auto rounded-lg shadow-sm"
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loadingCr}
          className="w-full hover:cursor-pointer"
        >
          {loadingCr ? "Generating..." : "Generate LLM Script"}
        </Button>
      </div>
    </div>
  );
}
