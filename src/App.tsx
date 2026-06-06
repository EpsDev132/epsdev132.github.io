import React, { useState, useEffect } from "react";
import { Category, Bandage } from "./types";
import { MinecraftSkinRenderer } from "./components/MinecraftSkinRenderer";
import { Minecraft3DSkinRenderer } from "./components/Minecraft3DSkinRenderer";
import { CATEGORIES, BANDAGES } from "./catalogConfig";
import { generateSteveSkin } from "./utils/assetsGenerator";
import { mergeSkinAndBandage } from "./utils/skinMerger";
import { BRAND_NAME, APP_TEXTS, TYPOGRAPHY_SIZES } from "./typographyConfig";
import { 
  Download, 
  Upload, 
  Check, 
  Layers, 
  Folder, 
  Tag, 
  Compass, 
  Eraser, 
  Link, 
  Copy, 
  Box
} from "lucide-react";

export default function App() {
  // --- STATE ---
  const [activeMenuTab, setActiveMenuTab] = useState<"catalog" | "designer">("catalog");
  const [selectedBandage, setSelectedBandage] = useState<Bandage | null>(null);
  
  // Skin State: Defaults to a procedurally generated standard Steve skin
  const [activeSkinUrl, setActiveSkinUrl] = useState<string>("");
  const [isCustomSkin, setIsCustomSkin] = useState<boolean>(false);
  const [customSkinName, setCustomSkinName] = useState<string>("");

  // Filtering TAB in Catalog
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("all");

  // Default to showing outer layers correctly as standard
  const showOuterLayers = true;

  // Preview Mode: '2d' | '3d'
  const [previewMode, setPreviewMode] = useState<"2d" | "3d">("2d");

  // States for direct link upload
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [directLink, setDirectLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Load Steve skin on initial mount
  useEffect(() => {
    setActiveSkinUrl(generateSteveSkin());
  }, []);

  // --- ACTIONS ---

  // Handle local user skin .PNG upload
  const handleCustomSkinUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("image/png")) {
      alert("Пожалуйста, загрузите валидный скин Minecraft в формате .PNG!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setActiveSkinUrl(dataUrl);
      setIsCustomSkin(true);
      setCustomSkinName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Reset custom skin back to Steve
  const handleResetToDefaultSkin = () => {
    setActiveSkinUrl(generateSteveSkin());
    setIsCustomSkin(false);
    setCustomSkinName("");
  };

  // Merge & Download updated Skin file
  const handleDownloadSkin = async () => {
    try {
      const mergedBase64 = await mergeSkinAndBandage(
        activeSkinUrl,
        selectedBandage ? selectedBandage.imageUrl : undefined
      );

      // Create download trigger
      const link = document.createElement("a");
      link.download = `skin_with_bandage_${selectedBandage ? selectedBandage.name.replace(/\s+/g, "_").toLowerCase() : "none"}.png`;
      link.href = mergedBase64;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      alert("Произошла ошибка при сборке и скачивании скина.");
    }
  };

  // Helper to convert base64 to Blob
  const base64ToBlob = (base64: string, mime: string) => {
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
  };

  // Upload to tmpfiles.org and return direct link
  const handleUploadAndGetLink = async () => {
    if (isUploading) return;
    setIsUploading(true);
    setDirectLink("");
    setCopied(false);

    try {
      const mergedBase64 = await mergeSkinAndBandage(
        activeSkinUrl,
        selectedBandage ? selectedBandage.imageUrl : undefined
      );

      const blob = base64ToBlob(mergedBase64, "image/png");
      const file = new File([blob], "skin.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image to tmpfiles.org");
      }

      const resData = await response.json();
      if (resData.status === "success" && resData.data?.url) {
        // Convert viewer URL to direct download URL (ends in .png for launchers/compatibility)
        const viewerUrl = resData.data.url;
        const directUrl = viewerUrl.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
        setDirectLink(directUrl);
      } else {
        throw new Error("Invalid response format from tmpfiles.org");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка при загрузке: не удалось загрузить скин у хостинга. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (!directLink) return;
    navigator.clipboard.writeText(directLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter Catalog Bandages
  const filteredBandages = selectedCategoryTab === "all"
    ? BANDAGES
    : BANDAGES.filter((b) => b.categoryId === selectedCategoryTab);

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-800 font-sans selection:bg-blue-500/20 selection:text-blue-900 transition-colors flex flex-col justify-between">
      
      {/* TOP HEADER */}
      <header className="h-20 bg-white border-b border-blue-100 px-4 sm:px-10 flex items-center justify-between shrink-0 sticky top-0 z-50 shadow-xs">
        
        {/* Custom Uploaded Logo slightly larger */}
        <div className="flex items-center gap-3.5">
          <img 
            src="/logo.png" 
            alt="B-Bandages" 
            className="w-12 h-12 object-contain select-none shrink-0" 
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback if the file logo.png is not loaded yet (rendered as subtle blue vector icon)
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <h1 className={`${TYPOGRAPHY_SIZES.logoMainTitle.className} decoration-blue-500/30 underline decoration-2 underline-offset-4`}>
              {APP_TEXTS.logoMainTitle}
            </h1>
            <p className={`hidden md:inline ${TYPOGRAPHY_SIZES.logoSubTitle.className}`}>
              {APP_TEXTS.logoSubTitle}
            </p>
          </div>
        </div>

        {/* Navigation - Switches Active Menu Tab */}
        <nav className="flex items-center gap-6 sm:gap-10">
          <button 
            id="nav-catalog-btn"
            onClick={() => setActiveMenuTab("catalog")} 
            className={`pb-1 transition-all flex items-center gap-2 border-b-2 py-1 cursor-pointer ${TYPOGRAPHY_SIZES.navItem.className} ${
              activeMenuTab === "catalog" 
                ? "text-blue-600 border-blue-500 font-bold" 
                : "text-slate-400 hover:text-slate-800 border-transparent"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            {APP_TEXTS.navCatalog}
          </button>
          
          <button 
            id="nav-designer-btn"
            onClick={() => setActiveMenuTab("designer")} 
            className={`pb-1 transition-all flex items-center gap-2 border-b-2 py-1 cursor-pointer ${TYPOGRAPHY_SIZES.navItem.className} ${
              activeMenuTab === "designer" 
                ? "text-blue-600 border-blue-500 font-bold" 
                : "text-slate-400 hover:text-slate-800 border-transparent"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {APP_TEXTS.navDesigner}
          </button>
        </nav>
      </header>

      {/* COMPACT CLEAN CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8">
        
        {/* HERO TITLE - Sleek without redundant badges or Work Mode boxes */}
        <section className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center justify-between shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <h2 className={TYPOGRAPHY_SIZES.heroTitle.className}>
              {activeMenuTab === "catalog" ? (
                <span>Коллекция дизайнерских <span className="underline decoration-blue-400 decoration-wavy underline-offset-4">повязок и бандан</span></span>
              ) : (
                <span>Удобный интерактивный <span className="underline decoration-blue-400 decoration-wavy underline-offset-4">конструктор скинов</span></span>
              )}
            </h2>
            <p className={TYPOGRAPHY_SIZES.heroDesc.className}>
              {APP_TEXTS.heroDesc}
            </p>
          </div>
        </section>

        {/* 1. CATALOG TAB MENU VIEW */}
        {activeMenuTab === "catalog" && (
          <section id="catalog-tab-view" className="space-y-6 animate-fadeIn">
            
            {/* Header and filters for catalog */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-150 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-blue-500" />
                  <h3 className={TYPOGRAPHY_SIZES.sectionTitle.className}>{APP_TEXTS.catalogSectionTitle}</h3>
                </div>
                <p className={TYPOGRAPHY_SIZES.sectionDesc.className}>
                  {APP_TEXTS.catalogSectionDesc}
                </p>
              </div>

              {/* Tab category filters */}
              <div className="flex flex-wrap bg-slate-100 p-1 rounded-full border border-slate-200/60 gap-1 self-start">
                <button
                  id="cat-tab-all"
                  onClick={() => setSelectedCategoryTab("all")}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer text-[11px] font-bold uppercase tracking-wider ${
                    selectedCategoryTab === "all"
                      ? "bg-white text-slate-900 shadow-xs border border-slate-250"
                      : "text-slate-400 hover:text-slate-755 hover:text-slate-700"
                  }`}
                >
                  {APP_TEXTS.catalogFilterAll} ({BANDAGES.length})
                </button>
                {CATEGORIES.map((cat) => {
                  const count = BANDAGES.filter(b => b.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      id={`cat-tab-${cat.id}`}
                      onClick={() => setSelectedCategoryTab(cat.id)}
                      className={`px-4 py-1.5 rounded-full transition-all cursor-pointer text-[11px] font-bold uppercase tracking-wider ${
                        selectedCategoryTab === cat.id
                          ? "bg-white text-slate-900 shadow-xs border border-slate-250"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of elements (bandages) */}
            {filteredBandages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filteredBandages.map((bandage) => {
                  const isSelected = selectedBandage?.id === bandage.id;
                  const cat = CATEGORIES.find((c) => c.id === bandage.categoryId);
                  return (
                    <div
                      key={bandage.id}
                      onClick={() => setSelectedBandage(bandage)}
                      className={`p-5 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 bg-white relative ${
                        isSelected
                          ? "ring-2 ring-blue-500/20 border-blue-500"
                          : "border-slate-200 hover:border-blue-300 hover:shadow-xs group"
                      }`}
                    >
                      {/* Bandage visual preview */}
                      <div className={`aspect-square w-full rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-50 transition-colors ${
                        bandage.previewUrl ? "" : "p-4"
                      }`}>
                        <img
                          src={bandage.previewUrl || bandage.imageUrl}
                          alt={bandage.name}
                          className={
                            bandage.previewUrl
                              ? "w-full h-full object-cover transition-transform group-hover:scale-105"
                              : "w-24 h-24 object-contain pixelated drop-shadow-md transition-transform group-hover:scale-105"
                          }
                          style={bandage.previewUrl ? undefined : { imageRendering: "pixelated" }}
                        />
                        
                        {isSelected && (
                          <span className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-md shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                      {/* Information */}
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-800 line-clamp-1">{bandage.name}</div>
                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-mono">
                          <Tag className="w-2.5 h-2.5 text-blue-500" />
                          <span>{cat?.name || "Повязки"}</span>
                        </div>
                      </div>

                      {/* Wear/Select handler */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBandage(bandage);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 text-blue-600 border border-blue-200 font-bold"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isSelected ? "Выбрано 🗸" : "Выбрать"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-16 text-center rounded-2xl bg-white border border-blue-100">
                <p className="text-slate-400 text-sm">{APP_TEXTS.noItemsInCategory}</p>
              </div>
            )}

            {/* Sticky/Floating Selected Item Notification Banner */}
            {selectedBandage && (
              <div className="bg-blue-600 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-fadeIn shadow-blue-700/10">
                <div className="flex items-center gap-3.5">
                  <div className="p-1.5 bg-white/10 rounded-lg shrink-0 border border-white/15">
                    <img
                      src={selectedBandage.imageUrl}
                      alt=""
                      className="w-8 h-8 object-contain pixelated"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{APP_TEXTS.bannerAppliedTitle}: {selectedBandage.name}</h4>
                    <p className="text-[11px] text-blue-100 font-mono">
                      {APP_TEXTS.bannerAppliedDesc}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                  <button
                    onClick={() => setSelectedBandage(null)}
                    className="px-4 py-2 hover:bg-white/10 transition-all text-xs font-bold text-blue-100 hover:text-white rounded-xl uppercase tracking-wider cursor-pointer font-mono"
                  >
                    {APP_TEXTS.bannerReset}
                  </button>
                  <button
                    id="banner-apply-btn"
                    onClick={() => setActiveMenuTab("designer")}
                    className="px-5 py-2.5 bg-white text-blue-700 hover:bg-slate-50 transition-all text-xs font-bold rounded-xl uppercase tracking-wider shadow-sm cursor-pointer flex items-center gap-1.5 font-mono"
                  >
                    {APP_TEXTS.bannerGoToDesigner}
                  </button>
                </div>
              </div>
            )}
            
          </section>
        )}

        {/* 2. CONSTRUCTOR DESIGNER TAB VIEW */}
        {activeMenuTab === "designer" && (
          <section id="designer-tab-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            
            {/* Column 1: Choose Skin Preset OR upload custom (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-white border border-blue-100 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <Upload className="w-4 h-4 text-blue-500" />
                  <h3 className={TYPOGRAPHY_SIZES.sectionTitle.className}>{APP_TEXTS.uploadSkinTitle}</h3>
                </div>

                {/* Upload Skin Input */}
                <div className="mb-6 relative border-2 border-dashed border-slate-200 hover:border-blue-300 rounded-xl p-6 text-center transition bg-slate-50 group">
                  <input
                    type="file"
                    onChange={handleCustomSkinUpload}
                    accept=".png"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2.5 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 mt-1">{APP_TEXTS.uploadSkinInputTitle}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{APP_TEXTS.uploadSkinInputSub}</span>
                  </div>
                </div>

                {/* Current skin info panel */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-blue-50/50">
                  <div className={TYPOGRAPHY_SIZES.metaLabel.className}>{APP_TEXTS.skinStatusLabel}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{APP_TEXTS.skinTypeLabel}</span>
                    <span className="font-bold text-slate-700 font-mono">
                      {isCustomSkin ? APP_TEXTS.skinTypeCustom : APP_TEXTS.skinTypeDefault}
                    </span>
                  </div>
                  
                  {isCustomSkin && (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                      <div className="text-slate-500 truncate mr-3">{APP_TEXTS.fileLabel} <code className="text-blue-600 font-mono bg-blue-50 px-1 py-0.5 rounded">{customSkinName}</code></div>
                      <button
                        onClick={handleResetToDefaultSkin}
                        className="text-[10px] text-rose-500 hover:underline font-bold uppercase tracking-wider shrink-0 cursor-pointer flex items-center gap-1 font-mono"
                      >
                        <Eraser className="w-3 h-3" />
                        {APP_TEXTS.btnResetSkin}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: Big 2D/3D Preview Frame & Integrated Actions (lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col items-center bg-white border border-blue-100 rounded-2xl p-6 relative shadow-xs gap-6 min-h-[450px]">
              
              {/* Header inside the renderer block */}
              <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span className={TYPOGRAPHY_SIZES.sectionTitle.className}>{APP_TEXTS.previewSectionTitle}</span>
                </div>
                
                {/* Clean Mode Selector 2D vs 3D - With fully visual icons, text removed */}
                <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1.5">
                  <button
                    title="2D MOCKUP"
                    onClick={() => setPreviewMode("2d")}
                    className={`p-2 rounded-md transition-all cursor-pointer ${
                      previewMode === "2d"
                        ? "bg-white text-blue-600 shadow-xs"
                        : "text-slate-400 hover:text-slate-650 hover:text-slate-700"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                  <button
                    title="3D ИНТЕРАКТИВ"
                    onClick={() => setPreviewMode("3d")}
                    className={`p-2 rounded-md transition-all cursor-pointer ${
                      previewMode === "3d"
                        ? "bg-white text-blue-600 shadow-xs"
                        : "text-slate-400 hover:text-slate-650 hover:text-slate-700"
                    }`}
                  >
                    <Box className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* High fidelity 2D/3D renderer of combined skin + bandage */}
              <div className="flex-grow w-full flex items-center justify-center p-2 min-h-[300px]">
                {previewMode === "2d" ? (
                  <MinecraftSkinRenderer
                    skinUrl={activeSkinUrl}
                    bandageUrl={selectedBandage?.imageUrl}
                    scale={14}
                    showOuterLayers={showOuterLayers}
                  />
                ) : (
                  <Minecraft3DSkinRenderer
                    skinUrl={activeSkinUrl}
                    bandageUrl={selectedBandage?.imageUrl}
                    showOuterLayers={showOuterLayers}
                  />
                )}
              </div>

              {/* Status info of applied bandage inside the card */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                <div className="truncate text-slate-500 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-500" />
                  <span>{APP_TEXTS.bandageStatusLabel} </span>
                  <span className={`font-bold ${selectedBandage ? "text-slate-800" : "text-slate-400 italic"}`}>
                    {selectedBandage ? selectedBandage.name : APP_TEXTS.bandageNotSelected}
                  </span>
                </div>
                {selectedBandage ? (
                  <button
                    onClick={() => setSelectedBandage(null)}
                    className="text-[10px] text-rose-500 hover:underline font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    {APP_TEXTS.bandageActionRemove}
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveMenuTab("catalog")}
                    className="text-[10px] text-blue-600 hover:underline font-bold uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    {APP_TEXTS.bandageActionSelect}
                  </button>
                )}
              </div>

              {/* Consolidated Dynamic Export Button inside the master Visual Frame container */}
              <div className="w-full space-y-4 border-t border-slate-105 border-slate-100 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    id="btn-download-skin"
                    onClick={handleDownloadSkin}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
                  >
                    <Download className="w-4 h-4" />
                    {APP_TEXTS.btnDownloadPng}
                  </button>

                  <button
                    id="btn-upload-direct-link"
                    disabled={isUploading}
                    onClick={handleUploadAndGetLink}
                    className="w-full py-3.5 bg-slate-800 text-white hover:bg-slate-900 disabled:bg-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {APP_TEXTS.btnGetDirectLinkLoading}
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4" />
                        {APP_TEXTS.btnGetDirectLink}
                      </>
                    )}
                  </button>
                </div>

                {directLink && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 animate-fadeIn text-left">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">{APP_TEXTS.directLinkLabel}</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={directLink}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition whitespace-nowrap font-mono"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 animate-pulse" />
                            {APP_TEXTS.btnCopied}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            {APP_TEXTS.btnCopy}
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal font-mono">
                      {APP_TEXTS.directLinkDesc}
                    </p>
                  </div>
                )}

                <p className="text-[10px] text-slate-400 text-center font-mono leading-normal">
                  {APP_TEXTS.exportInfoFooter}
                </p>
              </div>

            </div>

          </section>
        )}

      </main>

      {/* FOOTER - Minimalist, single line */}
      <footer className="h-16 border-t border-slate-200 bg-white px-4 sm:px-10 flex items-center justify-center shrink-0 mt-12">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono text-center">
          {APP_TEXTS.footerCopyright}
        </div>
      </footer>

    </div>
  );
}
