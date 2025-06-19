"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useGetWorkflow } from "@/hooks/useGetWorkflow";
import { useGenerateScripts } from "@/hooks/useGenerateScripts";
import { useWorkflowStore } from "@/stores/useWorkflowStore";
import { useUpdateWorkflow } from "@/hooks/useUpdateWorkflow";

export default function Page() {
  const { id } = useParams();
  const { loadingGet, errorGet, getWorkflow } = useGetWorkflow();
  const {
    loadingCr: loadingCr,
    errorCr: errorCr,
    generateScripts: generateScripts,
  } = useGenerateScripts();

  const { workflow, setWorkflow, selectedScript, setSelectedScript } =
    useWorkflowStore((state) => state);
  const { updateWorkflow } = useUpdateWorkflow();

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);

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

  const handleRemoveImage = async (srcToRemove: string) => {
    // 1️⃣ remove locally
    const newImages = workflow.product.images.filter(
      (src) => src !== srcToRemove,
    );
    const updated = {
      ...workflow,
      product: { ...workflow.product, images: newImages },
    };
    setWorkflow(updated);

    // 2️⃣ call backend
    try {
      await updateWorkflow(updated);
      toast.success("Image removed");
    } catch (e) {
      toast.error("Failed to remove image");
      // revert local state on failure
      setWorkflow(workflow);
    }
  };

  const handleRenderVideo = async () => {
    if (selectedScript === null) return;
    setRendering(true);
    try {
      const resp = await fetch("/api/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: workflow.uuid,
          images: workflow.product.images,
          script: workflow.llm_scripts[selectedScript],
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        setVideoUrl(data.url);
        setTimeout(() => {
          document
            .getElementById("video-player")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 0);
        toast.success("Video ready!");
      } else {
        throw new Error(data.error || "Render failed");
      }
    } catch (e: any) {
      toast.error(`Video render failed: ${e.message}`);
    } finally {
      setRendering(false);
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
          <div className="mt-3 flex flex-row space-x-4 overflow-x-scroll">
            {workflow.product.images.map((src) => (
              <div key={src} className="relative group min-w-fit">
                <img
                  src={src}
                  alt={workflow.product.product_name}
                  className="h-50 rounded-lg shadow-sm"
                />
                <button
                  onClick={() => handleRemoveImage(src)}
                  className="absolute top-1 right-1 group-hover:block 
                            bg-cyan-500 bg-opacity-75 rounded-full px-1 
                            hover:bg-red-500 hover:text-white hover:cursor-pointer transition"
                  aria-label="Remove image"
                >
                  x
                </button>
              </div>
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

        {/* LLM Script Cards */}
        {workflow.llm_scripts &&
          Object.keys(workflow.llm_scripts).length > 0 && (
            <div>
              <div className="mt-4 overflow-x-auto cursor-pointer">
                <div className="flex space-x-4 pb-2">
                  {Object.entries(workflow.llm_scripts).map(
                    ([variation, script]) => {
                      const isSelected = selectedScript === variation;
                      return (
                        <div
                          key={variation}
                          onClick={() => setSelectedScript(variation)}
                          className={`min-w-[280px] max-w-[280px] flex-shrink-0 rounded-xl border p-4 shadow-sm
                          ${
                            isSelected
                              ? "bg-cyan-50 dark:bg-gray-800 border-cyan-500"
                              : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <h3 className="mb-2 font-semibold text-cyan-600 capitalize">
                            {variation}
                          </h3>
                          <p className="text-sm whitespace-pre-line leading-relaxed">
                            {script}
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleRenderVideo}
                  disabled={
                    (selectedScript == null ? true : false) || rendering
                  }
                  className="w-full hover:cursor-pointer"
                >
                  {rendering ? "Rendering" : "Generate Video"}
                </Button>

                {/* Centered video player */}
                {videoUrl && (
                  <div className="mt-6 flex justify-center">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full max-w-[320px] md:max-w-[400px] lg:max-w-[480px] rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
