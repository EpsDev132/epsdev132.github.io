/**
 * Maps a base-layer coordinate on a Minecraft skin to its corresponding overlay/second-layer coordinate.
 * Returns the second-layer coordinate { x, y } if found, or null.
 */
function getCorrespondingOverlayPixel(x: number, y: number, height: number): { x: number; y: number } | null {
  // If classic 64x32 skin, only head has an overlay/hat layer at (32, 0)
  if (height === 32) {
    if (x >= 0 && x <= 31 && y >= 0 && y <= 15) {
      return { x: x + 32, y };
    }
    return null;
  }

  // Head Base: [0, 31] x [0, 15] -> Head Overlay (Hat): [32, 63] x [0, 15]
  if (x >= 0 && x <= 31 && y >= 0 && y <= 15) {
    return { x: x + 32, y };
  }

  // Right Leg Base: [0, 15] x [16, 31] -> Right Leg Overlay (Pant): [0, 15] x [32, 47]
  if (x >= 0 && x <= 15 && y >= 16 && y <= 31) {
    return { x, y: y + 16 };
  }

  // Torso Base: [16, 39] x [16, 31] -> Torso Overlay (Jacket): [16, 39] x [32, 47]
  if (x >= 16 && x <= 39 && y >= 16 && y <= 31) {
    return { x, y: y + 16 };
  }

  // Right Arm Base: [40, 55] x [16, 31] -> Right Arm Overlay (Sleeve): [40, 55] x [32, 47]
  if (x >= 40 && x <= 55 && y >= 16 && y <= 31) {
    return { x, y: y + 16 };
  }

  // Left Leg Base: [16, 31] x [48, 63] -> Left Leg Overlay: [0, 15] x [48, 63]
  if (x >= 16 && x <= 31 && y >= 48 && y <= 63) {
    return { x: x - 16, y };
  }

  // Left Arm Base: [32, 47] x [48, 63] -> Left Arm Overlay: [48, 63] x [48, 63]
  if (x >= 32 && x <= 47 && y >= 48 && y <= 63) {
    return { x: x + 16, y };
  }

  return null;
}

/**
 * Overlays a bandage (which is a 64x64 transparent PNG) on top of a Minecraft skin (64x64/64x32 PNG).
 * If the bandage has pixels on the base layer of the skin, the corresponding second-layer pixels
 * (if they do not belong to the bandage itself) are cleared out from the skin.
 * Returns the merged skin as a Base64 data URL.
 */
export function mergeSkinAndBandage(skinUrl: string, bandageUrl?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const skinImg = new Image();
    skinImg.crossOrigin = "anonymous";
    skinImg.referrerPolicy = "no-referrer";
    skinImg.src = skinUrl;

    skinImg.onload = () => {
      const skinHeight = skinImg.height === 32 ? 32 : 64;

      // Create main canvas
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64; // Keep standard format (always 64x64 output for 1.8+ compatibility)
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Unable to get 2D context"));
        return;
      }

      // Draw original skin (stretch/convert 64x32 to 64x64 Minecraft style if needed)
      if (skinHeight === 32) {
        ctx.drawImage(skinImg, 0, 0, 64, 32);
        // Standard conversions mirror the right leg/arm to left leg/arm to fill 1.8+ spaces:
        // Right Leg (0, 16) -> Left Leg (16, 48)
        ctx.drawImage(canvas, 0, 16, 16, 16, 16, 48, 16, 16);
        // Right Arm (40, 16) -> Left Arm (32, 48)
        ctx.drawImage(canvas, 40, 16, 16, 16, 32, 48, 16, 16);
      } else {
        ctx.drawImage(skinImg, 0, 0, 64, 64);
      }

      if (!bandageUrl) {
        resolve(canvas.toDataURL("image/png"));
        return;
      }

      // Draw bandage overlay
      const bandageImg = new Image();
      bandageImg.crossOrigin = "anonymous";
      bandageImg.referrerPolicy = "no-referrer";
      bandageImg.src = bandageUrl;

      bandageImg.onload = () => {
        // Draw bandage into a separate temporary canvas to inspect pixels easily
        const bandageCanvas = document.createElement("canvas");
        bandageCanvas.width = 64;
        bandageCanvas.height = 64;
        const bCtx = bandageCanvas.getContext("2d");
        if (!bCtx) {
          // Fallback
          ctx.drawImage(bandageImg, 0, 0, 64, 64);
          resolve(canvas.toDataURL("image/png"));
          return;
        }

        bCtx.drawImage(bandageImg, 0, 0, 64, 64);

        const skinImgData = ctx.getImageData(0, 0, 64, 64);
        const bandageImgData = bCtx.getImageData(0, 0, 64, 64);

        // Perform overlay pixel removal logic
        for (let y = 0; y < 64; y++) {
          for (let x = 0; x < 64; x++) {
            const idx = (y * 64 + x) * 4;

            // If the bandage has a pixel at this location (alpha > 0)
            if (bandageImgData.data[idx + 3] > 0) {
              // Find matching second-layer coordinate for a base layer pixel
              const overlayCoord = getCorrespondingOverlayPixel(x, y, 64);
              if (overlayCoord) {
                const ox = overlayCoord.x;
                const oy = overlayCoord.y;
                const oIdx = (oy * 64 + ox) * 4;

                // If that overlay coordinate is NOT covered by the bandage itself (bandage has no pixel there)
                if (bandageImgData.data[oIdx + 3] === 0) {
                  // Erase the original skin's overlay pixel so the bandage can display clearly!
                  skinImgData.data[oIdx] = 0;
                  skinImgData.data[oIdx + 1] = 0;
                  skinImgData.data[oIdx + 2] = 0;
                  skinImgData.data[oIdx + 3] = 0;
                }
              }
            }
          }
        }

        // Put the modified base skin back
        ctx.putImageData(skinImgData, 0, 0);

        // Overlay the bandage on top of cleared skin
        ctx.drawImage(bandageImg, 0, 0, 64, 64);

        resolve(canvas.toDataURL("image/png"));
      };

      bandageImg.onerror = () => {
        resolve(canvas.toDataURL("image/png"));
      };
    };

    skinImg.onerror = (err) => {
      reject(err);
    };
  });
}
