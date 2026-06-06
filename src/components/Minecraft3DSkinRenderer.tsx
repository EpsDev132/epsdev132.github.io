import React, { useEffect, useRef, useState } from "react";
import {
  SkinViewer,
  WalkingAnimation,
  RunningAnimation,
  IdleAnimation,
  FlyingAnimation
} from "skinview3d";
import { mergeSkinAndBandage } from "../utils/skinMerger";
import { RotateCw, Move, HelpCircle } from "lucide-react";

interface Minecraft3DSkinRendererProps {
  skinUrl: string;
  bandageUrl?: string;
  showOuterLayers?: boolean;
}

export const Minecraft3DSkinRenderer: React.FC<Minecraft3DSkinRendererProps> = ({
  skinUrl,
  bandageUrl,
  showOuterLayers = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const skinViewerRef = useRef<SkinViewer | null>(null);
  const [mergedSkinUrl, setMergedSkinUrl] = useState<string>("");
  const [animation, setAnimation] = useState<string>("idle");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  // 1. Merge the skin and bandage whenever they change
  useEffect(() => {
    mergeSkinAndBandage(skinUrl, bandageUrl)
      .then((url) => {
        setMergedSkinUrl(url);
      })
      .catch((err) => {
        console.error("Error merging skin for 3D inside renderer:", err);
        setMergedSkinUrl(skinUrl);
      });
  }, [skinUrl, bandageUrl]);

  // 2. Initialize SkinViewer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create the SkinViewer instance
    const viewer = new SkinViewer({
      canvas: canvas,
      width: 250,
      height: 320,
      skin: mergedSkinUrl || skinUrl,
    });

    skinViewerRef.current = viewer;

    // Improve controls
    viewer.controls.enableZoom = true;
    viewer.autoRotate = autoRotate;
    viewer.autoRotateSpeed = 0.8;

    setIsReady(true);

    // Dynamic resize handler if parent expands
    const handleResize = () => {
      if (containerRef.current && skinViewerRef.current) {
        const width = Math.min(280, containerRef.current.clientWidth - 16);
        skinViewerRef.current.width = width;
        skinViewerRef.current.height = Math.round(width * 1.25);
      }
    };

    window.addEventListener("resize", handleResize);
    // Trigger initial sizing after immediate mount
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      viewer.dispose();
      skinViewerRef.current = null;
    };
  }, []);

  // 3. Update loading/loaded skins when skin data changes
  useEffect(() => {
    if (skinViewerRef.current && mergedSkinUrl) {
      skinViewerRef.current.loadSkin(mergedSkinUrl);
    }
  }, [mergedSkinUrl]);

  // 4. Handle outer layer state changes
  useEffect(() => {
    const viewer = skinViewerRef.current;
    if (viewer && viewer.playerObject && viewer.playerObject.skin) {
      const skin = viewer.playerObject.skin;
      // Safeguard property checks
      if (skin.head?.outerLayer) skin.head.outerLayer.visible = showOuterLayers;
      if (skin.body?.outerLayer) skin.body.outerLayer.visible = showOuterLayers;
      if (skin.leftArm?.outerLayer) skin.leftArm.outerLayer.visible = showOuterLayers;
      if (skin.rightArm?.outerLayer) skin.rightArm.outerLayer.visible = showOuterLayers;
      if (skin.leftLeg?.outerLayer) skin.leftLeg.outerLayer.visible = showOuterLayers;
      if (skin.rightLeg?.outerLayer) skin.rightLeg.outerLayer.visible = showOuterLayers;
    }
  }, [showOuterLayers, isReady]);

  // 5. Handle rotation speed/state
  useEffect(() => {
    if (skinViewerRef.current) {
      skinViewerRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // 6. Handle animations switching
  useEffect(() => {
    const viewer = skinViewerRef.current;
    if (!viewer) return;

    // Add selected animation directly to the viewer.animation property
    if (animation === "walk") {
      viewer.animation = new WalkingAnimation();
    } else if (animation === "run") {
      viewer.animation = new RunningAnimation();
    } else if (animation === "idle") {
      viewer.animation = new IdleAnimation();
    } else if (animation === "fly") {
      viewer.animation = new FlyingAnimation();
    } else {
      viewer.animation = null;
    }
  }, [animation, isReady]);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center gap-3">
      {/* 3D View Screen Canvas Wrapper */}
      <div className="relative p-2 rounded-xl bg-slate-950/20 border border-slate-500/10 backdrop-blur-md flex flex-col items-center">
        <canvas
          ref={canvasRef}
          className="drop-shadow-[0_10px_25px_rgba(0,0,0,0.3)] select-none cursor-grab active:cursor-grabbing outline-none rounded-lg"
        />

        {/* Small Overlay Help Info */}
        <div className="absolute top-4 right-4 flex items-center justify-center p-1.5 bg-slate-900/60 rounded-lg text-white pointer-events-none group">
          <HelpCircle className="w-3.5 h-3.5 text-slate-300 opacity-80" />
          <span className="absolute right-7 bg-slate-900 text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 pointer-events-none transition-opacity">
            Зажмите ЛКМ и вращайте модель
          </span>
        </div>

        <div className="mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
          <Move className="w-3 h-3 text-slate-400" />
          3D Интерактивное-Превью
        </div>
      </div>

      {/* 3D Controls Settings Dashboard */}
      <div className="w-full grid grid-cols-2 gap-3.5 mt-1">
        {/* Animation Selection */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-[9px] uppercase font-bold tracking-wider text-slate-400 font-mono">
            Движение
          </label>
          <select
            value={animation}
            onChange={(e) => setAnimation(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-550/20 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="none">Без движения</option>
            <option value="idle">Покой (Idle)</option>
            <option value="walk">Ходьба (Walk)</option>
            <option value="run">Бег (Run)</option>
            <option value="fly">Полет (Fly)</option>
          </select>
        </div>

        {/* Rotation switch */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-[9px] uppercase font-bold tracking-wider text-slate-400 font-mono">
            Авто-Вращение
          </label>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`w-full py-1.5 border rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              autoRotate
                ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <RotateCw className={`w-3 h-3 ${autoRotate ? "animate-spin-slow" : ""}`} />
            {autoRotate ? "Включено" : "Выключено"}
          </button>
        </div>
      </div>
    </div>
  );
};
