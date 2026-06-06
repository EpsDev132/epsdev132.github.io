import React, { useEffect, useRef, useState } from "react";
import { mergeSkinAndBandage } from "../utils/skinMerger";

interface MinecraftSkinRendererProps {
  skinUrl: string;       // 64x64 Base image
  bandageUrl?: string;   // 64x64 Overlay image
  scale?: number;        // Canvas scaling multiplier (default 12 for high resolution crispness)
  showOuterLayers?: boolean;
}

export const MinecraftSkinRenderer: React.FC<MinecraftSkinRendererProps> = ({
  skinUrl,
  bandageUrl,
  scale = 12,
  showOuterLayers = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mergedSkinUrl, setMergedSkinUrl] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const combinedImgRef = useRef<HTMLImageElement | null>(null);

  // Merge the skin and bandage whenever they change
  useEffect(() => {
    setIsLoaded(false);
    mergeSkinAndBandage(skinUrl, bandageUrl)
      .then((url) => {
        setMergedSkinUrl(url);
      })
      .catch((err) => {
        console.error("Error merging inside renderer:", err);
        // Fallback to original skin if merge fails
        setMergedSkinUrl(skinUrl);
      });
  }, [skinUrl, bandageUrl]);

  // Load the merged skin image into an Image element
  useEffect(() => {
    if (!mergedSkinUrl) return;

    const img = new Image();
    img.referrerPolicy = "no-referrer";
    img.src = mergedSkinUrl;
    img.onload = () => {
      combinedImgRef.current = img;
      setIsLoaded(true);
    };
    img.onerror = () => {
      console.error("Failed to load merged skin image into HTML Image object");
    };
  }, [mergedSkinUrl]);

  // Redraw canvas on changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set pixel-art rendering properties for maximum crispness
    ctx.imageSmoothingEnabled = false;
    // @ts-ignore
    ctx.mozImageSmoothingEnabled = false;
    // @ts-ignore
    ctx.webkitImageSmoothingEnabled = false;
    // @ts-ignore
    ctx.msImageSmoothingEnabled = false;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const combinedImg = combinedImgRef.current;
    if (!isLoaded || !combinedImg || !combinedImg.complete) return;

    const drawPart = (
      // Source coords on 64x64 skin
      sx: number, sy: number, sw: number, sh: number,
      // Target coords on 16x32 grid
      tx: number, ty: number, tw: number, th: number
    ) => {
      // Scale coordinates
      const dx = tx * scale;
      const dy = ty * scale;
      const dw = tw * scale;
      const dh = th * scale;

      // Draw from the combined imagery (already contains original skin, bandage, and processed layers)
      ctx.drawImage(combinedImg, sx, sy, sw, sh, dx, dy, dw, dh);
    };

    // Draw grid layout of Front Minecraft skin (16x32 canvas)
    // 16 pixels wide:
    // Right Arm (0-3) , Torso (4-11) , Left Arm (12-15)
    // Legs: Right Leg (4-7) , Left Leg (8-11)
    // Head: Front Head is 8x8 in center (4 to 11)

    // 1. Legs (Y: 20 to 31)
    // Right Leg Base (Source X:4, Y:20, W:4, H:12)
    drawPart(4, 20, 4, 12, 4, 20, 4, 12);
    // Left Leg Base (Source X:20, Y:52, W:4, H:12)
    drawPart(20, 52, 4, 12, 8, 20, 4, 12);

    // 2. Torso (Y: 8 to 19)
    // Torso Base (Source X:20, Y:20, W:8, H:12)
    drawPart(20, 20, 8, 12, 4, 8, 8, 12);

    // 3. Arms (Y: 8 to 19)
    // Right Arm Base (Source X:44, Y:20, W:4, H:12)
    drawPart(44, 20, 4, 12, 0, 8, 4, 12);
    // Left Arm Base (Source X:36, Y:52, W:4, H:12)
    drawPart(36, 52, 4, 12, 12, 8, 4, 12);

    // 4. Head (Y: 0 to 7)
    // Head Base (Source X:8, Y:8, W:8, H:8)
    drawPart(8, 8, 8, 8, 4, 0, 8, 8);

    // -- OUTER LAYERS (OVERLAY / HAT / JACKET / ETC) --
    if (showOuterLayers) {
      // Legs outer:
      // Right Leg Outer (Source X:4, Y:36, W:4, H:12)
      drawPart(4, 36, 4, 12, 4, 20, 4, 12);
      // Left Leg Outer (Source X:4, Y:52, W:4, H:12)
      drawPart(4, 52, 4, 12, 8, 20, 4, 12);

      // Torso outer (Source X:20, Y:36, W:8, H:12)
      drawPart(20, 36, 8, 12, 4, 8, 8, 12);

      // Arms outer:
      // Right Arm Outer (Source X:44, Y:36, W:4, H:12)
      drawPart(44, 36, 4, 12, 0, 8, 4, 12);
      // Left Arm Outer (Source X:52, Y:52, W:4, H:12)
      drawPart(52, 52, 4, 12, 12, 8, 4, 12);

      // Head hat (Source X:40, Y:8, W:8, H:8)
      drawPart(40, 8, 8, 8, 4, 0, 8, 8);
    }
  }, [isLoaded, scale, showOuterLayers, mergedSkinUrl]);

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/20 border border-slate-500/10 backdrop-blur-md">
      <canvas
        id="minecraft-preview-canvas"
        ref={canvasRef}
        width={16 * scale}
        height={32 * scale}
        className="pixelated drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] max-w-full rounded-md"
        style={{ imageRendering: "pixelated" }}
      />
      <div className="mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        2D Характер-Превью
      </div>
    </div>
  );
};
