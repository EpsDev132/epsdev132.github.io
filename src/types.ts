export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Bandage {
  id: string;
  categoryId: string;
  name: string;
  imageUrl: string; // Base64 PNG image or data URL of 64x64
  previewUrl?: string; // Optional 1x1 preview image
  createdAt: number;
}

export interface PresetSkin {
  id: string;
  name: string;
  imageUrl: string; // Base64 pre-generated skin
}
