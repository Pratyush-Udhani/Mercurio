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

export default function Page() {
  const { id } = useParams();
  const { data: workflow, loading, error, getWorkflow } = useGetWorkflow();
  const {
    result: result,
    loading: loadingCreating,
    error: errorCreating,
    generateScripts: generateScripts,
  } = useGenerateScripts();

  useEffect(() => {
    if (id) {
      getWorkflow(id as string);
    }
  }, [id, getWorkflow]);

  if (loading) {
    return <div className="p-8">Loading workflow...</div>;
  }

  if (error || !workflow) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  const { product_name, product_description, images } = workflow.product;

  const handleGenerate = async () => {
    try {
      await generateScripts(workflow);
      toast.success("Script generated successfully!");
    } catch {
      toast.error(`Failed: ${errorCreating}`);
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
            defaultValue={product_name}
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
            defaultValue={product_description}
            rows={8}
            className="mt-1 w-full"
          />
        </div>

        {/* Images */}
        <div>
          <Label className="text-cyan-500">Images</Label>
          <div className="mt-2 flex space-x-4 overflow-x-auto">
            {images.map((src) => (
              <img
                key={src}
                src={src}
                alt={product_name}
                className="h-50 w-auto rounded-lg shadow-sm"
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loadingCreating}
          className="w-full hover:cursor-pointer"
        >
          {loading ? "Generating..." : "Generate LLM Script"}
        </Button>
      </div>
    </div>
  );
}
