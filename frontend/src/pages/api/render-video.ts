// src/pages/api/render-video.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const ENTRY = path.join(process.cwd(), "remotion", "Video.tsx"); // file that calls registerRoot
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
    /* -------------------------------------------------- */
    /* 1. bundle once                                     */
    /* -------------------------------------------------- */
    const bundled = await bundle({ entryPoint: ENTRY });

    /* -------------------------------------------------- */
    /* 2. prepare output paths                            */
    /* -------------------------------------------------- */
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    const outputs = {
      vertical: path.join(OUT_DIR, `${uuid}-vertical.mp4`),
      horizontal: path.join(OUT_DIR, `${uuid}-horizontal.mp4`),
    };

    const inputProps = { images, script };

    /* -------------------------------------------------- */
    /* 3. look up both compositions                       */
    /* -------------------------------------------------- */
    const [compVertical, compHorizontal] = await Promise.all([
      selectComposition({
        serveUrl: bundled,
        id: "VideoVertical", // must match Composition id in remotion file
        inputProps,
      }),
      selectComposition({
        serveUrl: bundled,
        id: "VideoHorizontal", // must match Composition id in remotion file
        inputProps,
      }),
    ]);

    /* -------------------------------------------------- */
    /* 4. render both videos in parallel                  */
    /* -------------------------------------------------- */
    await Promise.all([
      renderMedia({
        serveUrl: bundled,
        composition: compVertical,
        codec: "h264",
        outputLocation: outputs.vertical,
        inputProps,
      }),
      renderMedia({
        serveUrl: bundled,
        composition: compHorizontal,
        codec: "h264",
        outputLocation: outputs.horizontal,
        inputProps,
      }),
    ]);

    /* -------------------------------------------------- */
    /* 5. respond with public URLs                        */
    /* -------------------------------------------------- */
    return res.status(200).json({
      vertical: `/videos/${uuid}-vertical.mp4`,
      horizontal: `/videos/${uuid}-horizontal.mp4`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Render failed" });
  }
}
