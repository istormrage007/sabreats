export type MenuItemType = "text" | "riddle";

export interface MenuItem {
  id: string;
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
