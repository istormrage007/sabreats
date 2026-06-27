import { menuItems } from "@/data/menu";
import {
  MAX_LINE_ITEMS,
  MAX_QUANTITY_PER_ITEM,
  SERVICE_FEE,
  SMALL_THOUGHT_FEE,
} from "@/lib/constants";
import type { MenuItem } from "@/types/menu";

export interface CartLine {
  itemId: string;
  quantity: number;
}

export interface CartLineWithDetails extends CartLine {
  item: MenuItem;
  lineTotal: number;
}

export function getMenuItem(itemId: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === itemId);
}

export function clampQuantity(quantity: number): number {
  return Math.max(0, Math.min(quantity, MAX_QUANTITY_PER_ITEM));
}

export function getCartLinesWithDetails(lines: CartLine[]): CartLineWithDetails[] {
  return lines
    .map((line) => {
      const item = getMenuItem(line.itemId);
      if (!item) return null;
      return {
        ...line,
        item,
        lineTotal: item.price * line.quantity,
      };
    })
    .filter((line): line is CartLineWithDetails => line !== null);
}

export function getSubtotal(lines: CartLine[]): number {
  return getCartLinesWithDetails(lines).reduce(
    (sum, line) => sum + line.lineTotal,
    0,
  );
}

export function getItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function canAddItem(lines: CartLine[], itemId: string): boolean {
  const existing = lines.find((line) => line.itemId === itemId);
  if (existing && existing.quantity >= MAX_QUANTITY_PER_ITEM) {
    return false;
  }
  if (!existing && lines.length >= MAX_LINE_ITEMS) {
    return false;
  }
  return true;
}

export function getTaxTotal(): number {
  return SMALL_THOUGHT_FEE + SERVICE_FEE;
}

export function getOrderTotal(
  subtotal: number,
  priorityDelivery: boolean,
  priorityFee: number,
  tip: number,
): number {
  const priority = priorityDelivery ? priorityFee : 0;
  return subtotal + priority + getTaxTotal() + tip;
}

export interface OrderPayload {
  itemId: string;
  name: string;
  type: MenuItem["type"];
  payload: string;
  riddleAnswer?: string;
  quantity: number;
}

export function getOrderPayloads(lines: CartLine[]): OrderPayload[] {
  return getCartLinesWithDetails(lines).map((line) => ({
    itemId: line.item.id,
    name: line.item.name,
    type: line.item.type,
    payload: line.item.payload,
    riddleAnswer: line.item.riddleAnswer,
    quantity: line.quantity,
  }));
}
