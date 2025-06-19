import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  Composition,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { registerRoot } from "remotion";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

// Split the paragraph into ~max‑char chunks without cutting mid‑word
const chunkByChars = (text: string, max = 100) => {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const w of words) {
    const tentative = current ? `${current} ${w}` : w;
    if (tentative.length > max) {
      if (current) chunks.push(current);
      current = w; // start a new chunk
    } else {
      current = tentative;
    }
  }
  if (current) chunks.push(current);
  return chunks;
};

const Caption: React.FC<{ text: string; duration: number }> = ({
  text,
  duration,
}) => {
  const frame = useCurrentFrame(); // 0 ➜ duration

  const opacity = interpolate(
    frame,
    [0, duration * 0.15, duration * 0.85, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const translateY = interpolate(frame, [0, duration * 0.15], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 180,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          background: "#000", // solid black bar
          padding: "14px 28px",
          borderRadius: 14,
        }}
      >
        <span
          style={{
            fontSize: 64,
            fontWeight: 700,
            fontFamily: "sans-serif",
            color: "#fff",
            lineHeight: 1.3,
            WebkitTextStroke: "3px #000",
            textShadow: "0 0 8px rgba(0,0,0,0.8)",
            display: "inline-block",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main video component                                               */
/* ------------------------------------------------------------------ */

export const Video: React.FC<{
  images: string[];
  script: string;
}> = ({ images, script }) => {
  const fps = 30;
  const totalDuration = fps * 30; // 30 s

  // caption timing
  const chunks = chunkByChars(script, 100);
  const captionDur = Math.floor(totalDuration / chunks.length);

  // image timing
  const imgDur = Math.floor(totalDuration / images.length);
  const globalFrame = useCurrentFrame();

  return (
    <>
      {/* Image sequences */}
      {images.map((img, idx) => (
        <Sequence from={idx * imgDur} durationInFrames={imgDur} key={idx}>
          <AbsoluteFill>
            <Img
              src={img}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${interpolate(
                  globalFrame - idx * imgDur,
                  [0, imgDur],
                  [1.1, 1],
                )})`,
                opacity: interpolate(
                  globalFrame - idx * imgDur,
                  [0, imgDur * 0.15, imgDur * 0.85, imgDur],
                  [0, 1, 1, 0],
                ),
              }}
            />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* Caption sequences */}
      {chunks.map((txt, idx) => (
        <Sequence
          from={idx * captionDur}
          durationInFrames={captionDur}
          key={idx}
        >
          <Caption text={txt} duration={captionDur} />
        </Sequence>
      ))}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Register composition                                               */
/* ------------------------------------------------------------------ */

export const RemotionRoot: React.FC = () => (
  <>
    {/* 9:16 vertical 1080 × 1920 */}
    <Composition
      id="VideoVertical"
      component={Video}
      durationInFrames={30 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ images: [], script: "" }}
    />

    {/* 16:9 horizontal 1920 × 1080 */}
    <Composition
      id="VideoHorizontal"
      component={Video}
      durationInFrames={30 * 30}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ images: [], script: "" }}
    />
  </>
);

registerRoot(RemotionRoot);
