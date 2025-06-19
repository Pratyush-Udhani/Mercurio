// src/pages/api/render-video.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { bundle } from "@remotion/bundler";
import path from "path";
import fs from "fs";

const ENTRY = path.join(process.cwd(), "remotion", "Video.tsx");
const OUT_DIR = path.join(process.cwd(), "public", "videos");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { uuid, images, script } = req.body as {
    uuid: string;
    images: string[];
    script: string;
  };

  try {
    const bundled = await bundle({ entryPoint: ENTRY });

    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
    const out = path.join(OUT_DIR, `${uuid}.mp4`);

    const inputProps = { images, script };
    const comp = await selectComposition({
      serveUrl: bundled,
      id: "Video",
      inputProps,
    });

    await renderMedia({
      serveUrl: bundled,
      composition: comp,
      codec: "h264",
      outputLocation: out,
      inputProps,
    });

    return res.status(200).json({ url: `/videos/${uuid}.mp4` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Render failed" });
  }
}
