// Typography & Text Configurations for B-Bandages
// Isolating all headlines, subheadlines, menu items, and copy.

export const BRAND_NAME = "B-Bandages";

export const APP_TEXTS = {
  // Brand Header
  logoMainTitle: "B-Bandages",
  logoSubTitle: "Minecraft Bandages Studio",
  
  // Navigation Menus
  navCatalog: "Каталог повязок",
  navDesigner: "Конструктор примерок",
  
  // Main Hero Sections
  heroCatalogTitle: "Коллекция дизайнерских повязок и бандан",
  heroDesignerTitle: "Удобный интерактивный конструктор скинов",
  heroDesc: "Выбирайте из множества аксессуаров в каталоге, загружайте собственный скин и мгновенно получайте готовый майнкрафт-скин в самом лучшем виде!",
  
  // Catalog View Info
  catalogSectionTitle: "Каталог скинодекора",
  catalogSectionDesc: "Выберите повязку из списка ниже для добавления на ваш макет скина.",
  catalogFilterAll: "Все",
  noItemsInCategory: "В данной категории повязок пока нет.",
  
  // Sticky Applied Bandage Sheet/Banner
  bannerAppliedTitle: "Выбран бандаж",
  bannerAppliedDesc: "Он готов к примерке в дизайнере и слиянию с вашим скином.",
  bannerReset: "Сбросить",
  bannerGoToDesigner: "Перейти в конструктор ➔",
  
  // Designer View Panels
  uploadSkinTitle: "Загрузка скина",
  uploadSkinInputTitle: "Импортировать свой скин (.PNG)",
  uploadSkinInputSub: "64x64 или 64x32 пиксельный скин",
  skinStatusLabel: "Текущее состояние базы:",
  skinTypeLabel: "Тип основного скина:",
  skinTypeDefault: "Стандартный Стив",
  skinTypeCustom: "Загруженный PNG",
  fileLabel: "Файл:",
  btnResetSkin: "Сбросить",
  previewSectionTitle: "Превью скина",
  preview3DTitle: "3D Интерактивное-Превью",
  preview2DTitle: "2D Характер-Превью",
  
  bandageStatusLabel: "Повязка:",
  bandageNotSelected: "Не выбрана",
  bandageActionRemove: "Снять",
  bandageActionSelect: "Выбрать в каталоге",
  
  btnDownloadPng: "Скачать скин (.PNG)",
  btnGetDirectLink: "Прямая ссылка",
  btnGetDirectLinkLoading: "Загрузка...",
  directLinkLabel: "Прямая ссылка на скин (.PNG)",
  directLinkDesc: "Ссылка полностью прямая и ведет на готовый PNG-файл для Minecraft-лаунчеров.",
  btnCopy: "Копировать",
  btnCopied: "Скопировано!",
  exportInfoFooter: "Файл полностью готов к загрузке в любой Minecraft лаунчер или сервер.",
  
  // Simplified Footer Options
  footerCopyright: `B-Bandages • ${new Date().getFullYear()}`
};

// Explicit point sizes configured for every single title, subtitle, and menu component
export const TYPOGRAPHY_SIZES = {
  // Main Header Logo
  logoMainTitle: {
    pt: 15,
    className: "text-lg sm:text-xl font-bold tracking-tight text-slate-900"
  },
  logoSubTitle: {
    pt: 7.5,
    className: "text-[10px] text-slate-400 font-mono tracking-widest uppercase"
  },
  
  // Main Navigation links
  navItem: {
    pt: 10.5,
    className: "text-xs sm:text-sm font-semibold tracking-wider font-mono uppercase"
  },
  
  // Hero section typography
  heroTitle: {
    pt: 24,
    className: "text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight"
  },
  heroDesc: {
    pt: 10.5,
    className: "text-slate-500 text-xs sm:text-sm max-w-2xl leading-relaxed"
  },
  
  // Subsections titles
  sectionTitle: {
    pt: 13.5,
    className: "font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-widest font-mono"
  },
  sectionDesc: {
    pt: 9,
    className: "text-xs text-slate-500"
  },
  
  // Interactive widget state info / details
  metaLabel: {
    pt: 7.5,
    className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono"
  },
  metaValue: {
    pt: 8.25,
    className: "text-[11px] font-semibold font-mono"
  },
  
  // Action Buttons
  btnText: {
    pt: 9,
    className: "text-xs font-bold uppercase tracking-widest font-mono"
  }
};
