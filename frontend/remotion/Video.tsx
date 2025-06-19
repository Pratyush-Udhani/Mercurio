import React from "react";
import {
  Composition,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
  Sequence,
  staticFile,
} from "remotion";
import { AbsoluteFill, Img } from "remotion";

export const Video: React.FC<{
  images: string[];
  script: string;
}> = ({ images, script }) => {
  const frame = useCurrentFrame();
  const durationInFrames = 20 * 30; // 20s × 30fps

  // Text‐reveal: split on words and reveal word by word
  const words = script.split(" ");
  const wordsToShow = Math.min(
    words.length,
    Math.floor(interpolate(frame, [0, durationInFrames], [0, words.length])),
  );

  // Duration per image
  const perImage = Math.floor(durationInFrames / images.length);

  return (
    <>
      {/* Sequence each image with a fade transition */}
      {images.map((img, idx) => {
        const start = idx * perImage;
        return (
          <Sequence from={start} durationInFrames={perImage} key={idx}>
            <AbsoluteFill style={{ backgroundColor: "#000" }}>
              <Img
                src={img}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${interpolate(
                    frame - start,
                    [0, perImage],
                    [1.1, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  )})`,
                  opacity: interpolate(
                    frame - start,
                    [0, perImage * 0.1, perImage * 0.9, perImage],
                    [0, 1, 1, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  ),
                }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Text overlay */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
          padding: 40,
        }}
      >
        <p style={{ fontSize: 32, color: "white", lineHeight: 1.2 }}>
          {words.slice(0, wordsToShow).join(" ")}
        </p>
      </AbsoluteFill>
    </>
  );
};

// Register the composition
export const RemotionRoot: React.FC = () => (
  <Composition
    id="Video"
    component={Video}
    durationInFrames={20 * 30}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      images: [],
      script: "",
    }}
  />
);

import { registerRoot } from "remotion";

registerRoot(RemotionRoot);
