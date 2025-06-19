"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useUrlScraper } from "@/hooks/useUrlScaper";

export default function Page() {
  const [url, setUrl] = useState("");
  const { data, loading, error, scrape } = useUrlScraper();

  const handleScrape = () => {
    if (!url.trim()) {
      toast("URL Required");
      return;
    }
    scrape(url);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-white p-4">
      <Toaster />
      <div className="w-full max-w-md space-y-4">
        <Input
          placeholder="Enter product URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border-black placeholder-gray-400 text-black"
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
      {data && (
        <pre className="mt-4 max-w-md w-full bg-gray-800 p-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
