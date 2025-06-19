"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useUrlScraper } from "@/hooks/useUrlScaper";

export default function Page() {
  const [url, setUrl] = useState("");
  const router = useRouter();
  const { data, loading, error, scrape } = useUrlScraper();

  // Redirect to workflow page when UUID is received
  useEffect(() => {
    if (data?.uuid) {
      router.push(`/workflows/${data.uuid}`);
    }
  }, [data, router]);

  const handleScrape = () => {
    if (!url.trim()) {
      toast("URL Required");
      return;
    }
    scrape(url);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <Toaster />
      <div className="w-full max-w-md space-y-4">
        <Input
          placeholder="Enter product URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className=""
        />
        <Button
          onClick={handleScrape}
          disabled={loading}
          className="w-full hover:cursor-pointer"
        >
          {loading ? "Scraping..." : "Scrape"}
        </Button>
      </div>

      {error && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  );
}
