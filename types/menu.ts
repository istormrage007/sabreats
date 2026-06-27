import type { VerticalId } from "@/types/vertical";

export type MenuItemType = "text" | "riddle";

export interface MenuItem {
  id: string;
  vertical: VerticalId;
  name: string;
  description: string;
  price: number;
  category: string;
  type: MenuItemType;
  payload: string;
  riddleAnswer?: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface Catalog {
  vertical: VerticalId;
  categories: Category[];
  items: MenuItem[];
}

export interface MastheadSlide {
  vertical: VerticalId;
  imageUrl: string;
  tagline: string;
  subtitle: string;
  verticalLabel: string;
}
