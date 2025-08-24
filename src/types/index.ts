// ./src/types/index.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type VariationOption = {
  name: string;            // e.g. "Spiciness"
  choices: string[];       // e.g. ["Mild", "Medium", "Hot"]
  required?: boolean;
  defaultChoice?: string;
};

export type AddonOption = {
  id: string;
  name: string;
  price: number;
  maxQty?: number;         // optional cap (e.g. 5)
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  variations?: VariationOption[];
  addons?: AddonOption[];
};

export type Subcategory = {
  title: string;
  items: MenuItem[];
};

export type MenuSection = {
  title: string;
  subcategories: Subcategory[];
};