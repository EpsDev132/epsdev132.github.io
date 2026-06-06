/**
 * Utility to procedurally generate valid Minecraft Skins and Bandages as 64x64 Base64 PNGs.
 * This guarantees offline support, fast loading, and zero external dependency failures.
 */

// Draw Steve Skin
export function generateSteveSkin(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  // Clear
  ctx.clearRect(0, 0, 64, 64);

  // Colors
  const hair = "#5c3e21";
  const skin = "#dbac8c";
  const darkSkin = "#b28062";
  const eyesBlue = "#2a5cd1";
  const eyesWhite = "#ffffff";
  const mouth = "#873220";
  const shirt = "#00a3a3"; // Cyan
  const pants = "#3c44aa"; // Indigo/Blue
  const shoes = "#505050";
  const armSkin = "#dbac8c";

  // --- HEAD --- (Front: X: 8-15, Y: 8-15)
  // Fill all sides roughly for realistic texture
  ctx.fillStyle = hair;
  ctx.fillRect(0, 0, 32, 8); // Top & bottom of head
  ctx.fillRect(0, 8, 32, 8); // Side, Front, Side, Back head base

  // Face Skin
  ctx.fillStyle = skin;
  ctx.fillRect(8, 10, 8, 6); // Bottom part of face
  ctx.fillStyle = darkSkin;
  ctx.fillRect(10, 14, 4, 1); // Nose/mouth area shadow
  
  // Mouth
  ctx.fillStyle = mouth;
  ctx.fillRect(11, 13, 2, 1); 

  // Eyes (White & Blue)
  ctx.fillStyle = eyesWhite;
  ctx.fillRect(9, 12, 1, 1);
  ctx.fillRect(13, 12, 1, 1);
  ctx.fillStyle = eyesBlue;
  ctx.fillRect(10, 12, 1, 1);
  ctx.fillRect(14, 12, 1, 1);

  // Hair Details (front bangs)
  ctx.fillStyle = hair;
  ctx.fillRect(8, 8, 8, 2);
  ctx.fillRect(8, 10, 1, 1);
  ctx.fillRect(15, 10, 1, 1);

  // --- TORSO --- (Front: X: 20-27, Y: 20-31)
  ctx.fillStyle = shirt;
  ctx.fillRect(16, 20, 24, 12); // Front, back, sides of torso
  // Pants
  ctx.fillStyle = pants;
  ctx.fillRect(16, 32, 24, 4); // Pants waist wrap

  // --- ARMS ---
  // Right Arm (X: 44-47, Y: 20-31)
  ctx.fillStyle = shirt;
  ctx.fillRect(40, 20, 16, 4);  // Sleeve
  ctx.fillStyle = armSkin;
  ctx.fillRect(40, 24, 16, 8);  // Skin

  // Left Arm (X: 36-39, Y: 52-63)
  ctx.fillStyle = shirt;
  ctx.fillRect(32, 52, 16, 4);  // Sleeve
  ctx.fillStyle = armSkin;
  ctx.fillRect(32, 56, 16, 8);  // Skin

  // --- LEGS ---
  // Right Leg (X: 4-7, Y: 20-31)
  ctx.fillStyle = pants;
  ctx.fillRect(0, 20, 16, 10);
  ctx.fillStyle = shoes;
  ctx.fillRect(0, 30, 16, 2);  // Shoes

  // Left Leg (X: 20-23, Y: 52-63)
  ctx.fillStyle = pants;
  ctx.fillRect(16, 52, 16, 10);
  ctx.fillStyle = shoes;
  ctx.fillRect(16, 62, 16, 2);  // Shoes

  return canvas.toDataURL("image/png");
}

// Draw Alex Skin
export function generateAlexSkin(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  // Clear
  ctx.clearRect(0, 0, 64, 64);

  // Colors
  const hair = "#d37c22"; // Orange
  const skin = "#ecd0be";
  const eyesGreen = "#5ca85c";
  const eyesWhite = "#ffffff";
  const mouth = "#cc6c5c";
  const shirt = "#5c8c4c"; // Green
  const pants = "#403020"; // Dark Brown
  const shoes = "#2a1e12";
  const armSkin = "#ecd0be";

  // Head front: 8,8 to 15,15
  ctx.fillStyle = hair;
  ctx.fillRect(0, 0, 32, 8);
  ctx.fillRect(0, 8, 32, 8);

  ctx.fillStyle = skin;
  ctx.fillRect(8, 10, 8, 6);

  ctx.fillStyle = mouth;
  ctx.fillRect(11, 13, 2, 1);

  // Eyes
  ctx.fillStyle = eyesWhite;
  ctx.fillRect(9, 12, 1, 1);
  ctx.fillRect(13, 12, 1, 1);
  ctx.fillStyle = eyesGreen;
  ctx.fillRect(10, 12, 1, 1);
  ctx.fillRect(14, 12, 1, 1);

  // Hair bangs
  ctx.fillStyle = hair;
  ctx.fillRect(8, 8, 8, 2);
  ctx.fillRect(8, 10, 2, 1);
  ctx.fillRect(14, 10, 2, 1);

  // Torso
  ctx.fillStyle = shirt;
  ctx.fillRect(16, 20, 24, 12);
  // Belt / pants
  ctx.fillStyle = pants;
  ctx.fillRect(16, 32, 24, 4);

  // Arms (Slightly thinner but 4 wide for base canvas rendering)
  ctx.fillStyle = shirt;
  ctx.fillRect(40, 20, 16, 4);
  ctx.fillStyle = armSkin;
  ctx.fillRect(40, 24, 16, 8);

  ctx.fillStyle = shirt;
  ctx.fillRect(32, 52, 16, 4);
  ctx.fillStyle = armSkin;
  ctx.fillRect(32, 56, 16, 8);

  // Legs
  ctx.fillStyle = pants;
  ctx.fillRect(0, 20, 16, 10);
  ctx.fillStyle = shoes;
  ctx.fillRect(0, 30, 16, 2);

  ctx.fillStyle = pants;
  ctx.fillRect(16, 52, 16, 10);
  ctx.fillStyle = shoes;
  ctx.fillRect(16, 62, 16, 2);

  return canvas.toDataURL("image/png");
}

// Draw Shadow Hero Skin
export function generateVampireSkin(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 64, 64);

  const hair = "#1e1e24"; // Charcoal
  const skin = "#f0e6df";
  const eyesRed = "#ff1a1a";
  const shirt = "#2a1e1e";
  const coat = "#4a0e17"; // Crimson
  const pants = "#151518";
  const shoes = "#f0e6df";

  // Head
  ctx.fillStyle = hair;
  ctx.fillRect(0, 0, 32, 16);
  ctx.fillStyle = skin;
  ctx.fillRect(8, 10, 8, 6);
  // Red Eyes
  ctx.fillStyle = eyesRed;
  ctx.fillRect(10, 12, 1, 1);
  ctx.fillRect(14, 12, 1, 1);
  // Mouth
  ctx.fillStyle = "#ff1a1a";
  ctx.fillRect(11, 14, 2, 1);

  // Torso
  ctx.fillStyle = coat;
  ctx.fillRect(16, 20, 24, 12);
  ctx.fillStyle = shirt;
  ctx.fillRect(19, 20, 2, 12); // Tie/inner shirt

  // Arms
  ctx.fillStyle = coat;
  ctx.fillRect(40, 20, 16, 12);
  ctx.fillStyle = coat;
  ctx.fillRect(32, 52, 16, 12);

  // Legs
  ctx.fillStyle = pants;
  ctx.fillRect(0, 20, 16, 10);
  ctx.fillStyle = shoes;
  ctx.fillRect(0, 30, 16, 2);

  ctx.fillStyle = pants;
  ctx.fillRect(16, 52, 16, 10);
  ctx.fillStyle = shoes;
  ctx.fillRect(16, 62, 16, 2);

  return canvas.toDataURL("image/png");
}

// --- BANDAGES PROCEDURAL DRAWING ---
// These return transparent 64x64 canvases with bandage pixels drawn in correct positions

export function drawRedShinobiHeadband(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 64, 64);

  // Red Headband runs horizontally around the head at Y: 9-10
  // Head Y sides run from X: 0-31, Y: 8-15
  ctx.fillStyle = "#e11d48"; // Rose 600
  // Wrap-around band
  ctx.fillRect(0, 9, 32, 2);

  // Metal plaque in front center (At X: 8 to 15 range, center is 11, 12)
  ctx.fillStyle = "#cbd5e1"; // Slate 300
  ctx.fillRect(11, 9, 3, 2);
  ctx.fillStyle = "#64748b"; // Slate 500
  ctx.fillRect(12, 9, 1, 2); // plaque detail

  // Knots at the back of head (Back is X: 24 to 31)
  // Let's place a knot hanging down at X: 27, 28 going to Y: 11-13
  ctx.fillStyle = "#be123c"; // Crimson Rose
  ctx.fillRect(27, 10, 1, 4);
  ctx.fillRect(28, 11, 1, 3);

  return canvas.toDataURL("image/png");
}

export function drawPirateEyePatch(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 64, 64);

  // Black Eye patch over left eye of front face
  // Front Face coords: X: 8-15, Y: 8-15.
  // Left eye is around X:13-14, Y:12. Let's cover X:12-14, Y:11-12
  const color = "#1e293b"; // Slate 800

  // The patch
  ctx.fillStyle = color;
  ctx.fillRect(12, 11, 2, 2);

  // Diagonal straps going across the head
  // From top-left of front face X:8, Y:8 to bottom-right X:15, Y:13
  ctx.fillRect(8, 8, 1, 1);
  ctx.fillRect(9, 9, 2, 1);
  ctx.fillRect(11, 10, 1, 1);
  ctx.fillRect(14, 12, 2, 1);

  // Strap going wrap-around around the right side and left side (Y: 8 to 10)
  ctx.fillRect(0, 8, 8, 1);
  ctx.fillRect(16, 12, 16, 1);

  return canvas.toDataURL("image/png");
}

export function drawGoldenCrown(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 64, 64);

  // Crown sits above the head or on top of it.
  // Standard head height begins at Y=8.
  // So crown is at Y=7, with spikes up to Y=5,6.
  // Standard head wrap-around: X: 0-31, Y: 6-7.
  const gold = "#f59e0b"; // Amber 500
  const lightGold = "#fbbf24"; // Amber 400
  const jewel = "#ef4444"; // Red jewel

  // Base rim
  ctx.fillStyle = gold;
  ctx.fillRect(0, 7, 32, 1);

  // Spikes (Crown peaks) on all 4 sides!
  // Front: X: 8-15. Peaks at 8, 11, 15
  ctx.fillStyle = lightGold;
  // Front peaks
  ctx.fillRect(8, 5, 1, 2);
  ctx.fillRect(11, 4, 2, 3);
  ctx.fillRect(15, 5, 1, 2);

  // Right Side peaks: X: 0-7. Peak at 3
  ctx.fillRect(3, 5, 2, 2);

  // Left Side peaks: X: 16-23. Peak at 19
  ctx.fillRect(19, 5, 2, 2);

  // Back peaks: X: 24-31. Peak at 27
  ctx.fillRect(27, 5, 2, 2);

  // Tiny jewels
  ctx.fillStyle = jewel;
  ctx.fillRect(11, 7, 1, 1);
  ctx.fillRect(12, 5, 1, 1); // Peak jewel
  ctx.fillStyle = "#3b82f6"; // Blue jewel
  ctx.fillRect(19, 7, 1, 1);
  ctx.fillRect(3, 7, 1, 1);

  return canvas.toDataURL("image/png");
}

export function drawNinjaMaskBlack(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 64, 64);

  // Black mask covering lower face (Y: 12-15, X: 8-15) and wrap-around sides.
  const black = "#18181b"; // Zinc 900
  const accent = "#3f3f46"; // Zinc 700

  // Front face
  ctx.fillStyle = black;
  ctx.fillRect(8, 12, 8, 4);
  // Bridge of nose peak
  ctx.fillRect(11, 11, 2, 1);

  // Wrap around side of head (X: 0-7, 16-31, Y: 12-15)
  ctx.fillRect(0, 12, 8, 4);
  ctx.fillRect(16, 12, 16, 4);

  // Shading detail
  ctx.fillStyle = accent;
  ctx.fillRect(9, 13, 1, 1);
  ctx.fillRect(14, 13, 1, 1);
  ctx.fillRect(11, 14, 2, 1);

  return canvas.toDataURL("image/png");
}

export function drawGreenElvenBand(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 64, 64);

  const green = "#10b981"; // Emerald 500
  const emerald = "#34d399"; // Emerald 450
  const flower = "#f472b6"; // Pink flower accent

  // Headband wrap around at Y=9
  ctx.fillStyle = green;
  ctx.fillRect(0, 9, 32, 1);

  // Front leaf crown detail at X:11-12, Y:8-9
  ctx.fillStyle = emerald;
  ctx.fillRect(11, 8, 2, 2);
  ctx.fillRect(10, 8, 1, 1);
  ctx.fillRect(13, 8, 1, 1);

  // Pink flower at the side (X: 16)
  ctx.fillStyle = flower;
  ctx.fillRect(16, 8, 2, 2);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(17, 9, 1, 1);

  return canvas.toDataURL("image/png");
}

export function drawCreeperVisor(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 64, 64);

  const visorGreen = "#16a34a"; // Green 600
  const pixelDark = "#14532d"; // Green 900
  const alphaGlass = "rgba(0, 255, 0, 0.6)";

  // Visor base plate wrapping front of face (X: 8-15, Y: 10-12)
  ctx.fillStyle = visorGreen;
  ctx.fillRect(8, 10, 8, 3);
  
  // Creeper eyes looking style
  ctx.fillStyle = pixelDark;
  ctx.fillRect(9, 11, 1, 1);
  ctx.fillRect(14, 11, 1, 1);
  ctx.fillRect(11, 12, 2, 1); // mouth style visor

  // Wrap straps
  ctx.fillStyle = pixelDark;
  ctx.fillRect(0, 11, 8, 1);
  ctx.fillRect(16, 11, 16, 1);

  return canvas.toDataURL("image/png");
}

export function drawMedicArmband(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 64, 64);

  // Right arm bandage or Armband
  // Right Arm coordinates (X: 44-47, Y: 20-31)
  // Let's create a red-cross white armband wrapped around Y: 24-27
  // On the arm sprite, wrap includes entire arm textures: X: 40-55, Y: 24-27
  ctx.fillStyle = "#f8fafc"; // White
  ctx.fillRect(40, 24, 16, 3);

  // Draw the red cross on the front plate of right arm: X: 44-47, Y: 24-26
  ctx.fillStyle = "#ef4444"; // Red
  ctx.fillRect(45, 24, 1, 3);
  ctx.fillRect(44, 25, 3, 1);

  // Let's also wrap the left arm!
  // Left arm coordinates (X: 36-39, Y: 52-63)
  // Wrap at Y: 56-59 (all 4 sides: X: 32-47, Y: 56-59)
  ctx.fillStyle = "#f8fafc"; // White
  ctx.fillRect(32, 56, 16, 3);
  ctx.fillStyle = "#ef4444"; // Red
  ctx.fillRect(37, 56, 1, 3);
  ctx.fillRect(36, 57, 3, 1);

  return canvas.toDataURL("image/png");
}

export function drawGothicBeanie(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 64, 64);

  // Purple-dark gothic beanie / head scarf
  // Covered outer layer of head (X: 40-47, Y: 8-15 is front, X: 32-63, Y: 0-15 overall)
  // Let's draw on head overlay (top, sides, back)
  const purple = "#6b21a8"; // Purple 700
  const darkpurple = "#4c1d95"; // Purple 900

  // Fill beanie base on top & sides of head overlay map (X: 32-63, Y: 0-15)
  ctx.fillStyle = purple;
  ctx.fillRect(32, 0, 32, 12); // Wrap head completely!
  
  // Dark accents / stripes
  ctx.fillStyle = darkpurple;
  ctx.fillRect(32, 11, 32, 1); // rim
  ctx.fillRect(40, 8, 2, 2); // front design
  ctx.fillRect(46, 8, 2, 2);

  return canvas.toDataURL("image/png");
}
