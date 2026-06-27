"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  canAddItem,
  clampQuantity,
  getItemCount,
  getSubtotal,
  type CartLine,
} from "@/lib/cart";
import { recordCartClosedWithItems, recordCartEmptied } from "@/lib/profileStats";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/constants";
import type { VerticalId } from "@/types/vertical";

interface CartContextValue {
  lines: CartLine[];
  isDrawerOpen: boolean;
  itemCount: number;
  subtotal: number;
  capMessage: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (vertical: VerticalId, itemId: string) => boolean;
  removeItem: (vertical: VerticalId, itemId: string) => void;
  setQuantity: (
    vertical: VerticalId,
    itemId: string,
    quantity: number,
  ) => boolean;
  clearCart: () => void;
  clearCapMessage: () => void;
  isAtMaxQuantity: (vertical: VerticalId, itemId: string) => boolean;
  showCapMessage: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [capMessage, setCapMessage] = useState<string | null>(null);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => {
    setLines((prev) => {
      if (prev.length > 0) {
        recordCartClosedWithItems(prev.reduce((s, l) => s + l.quantity, 0));
      }
      return prev;
    });
    setIsDrawerOpen(false);
  }, []);
  const clearCapMessage = useCallback(() => setCapMessage(null), []);
  const showCapMessage = useCallback((message: string) => {
    setCapMessage(message);
  }, []);

  const addItem = useCallback(
    (vertical: VerticalId, itemId: string): boolean => {
      let added = false;
      setLines((prev) => {
        const existing = prev.find(
          (line) => line.vertical === vertical && line.itemId === itemId,
        );
        if (existing && existing.quantity >= MAX_QUANTITY_PER_ITEM) {
          return prev;
        }
        if (!canAddItem(prev, vertical, itemId)) {
          return prev;
        }
        added = true;
        if (existing) {
          return prev.map((line) =>
            line.vertical === vertical && line.itemId === itemId
              ? { ...line, quantity: clampQuantity(line.quantity + 1) }
              : line,
          );
        }
        return [...prev, { vertical, itemId, quantity: 1 }];
      });
      if (added) {
        setIsDrawerOpen(true);
      }
      return added;
    },
    [],
  );

  const removeItem = useCallback((vertical: VerticalId, itemId: string) => {
    setLines((prev) =>
      prev.filter(
        (line) => !(line.vertical === vertical && line.itemId === itemId),
      ),
    );
  }, []);

  const setQuantity = useCallback(
    (vertical: VerticalId, itemId: string, quantity: number): boolean => {
      const clamped = clampQuantity(quantity);
      if (quantity > MAX_QUANTITY_PER_ITEM) {
        return false;
      }
      setLines((prev) => {
        if (clamped === 0) {
          return prev.filter(
            (line) => !(line.vertical === vertical && line.itemId === itemId),
          );
        }
        return prev.map((line) =>
          line.vertical === vertical && line.itemId === itemId
            ? { ...line, quantity: clamped }
            : line,
        );
      });
      return true;
    },
    [],
  );

  const clearCart = useCallback(() => {
    setLines((prev) => {
      if (prev.length > 0) {
        recordCartEmptied();
      }
      return [];
    });
  }, []);

  const isAtMaxQuantity = useCallback(
    (vertical: VerticalId, itemId: string) => {
      const line = lines.find(
        (l) => l.vertical === vertical && l.itemId === itemId,
      );
      return (line?.quantity ?? 0) >= MAX_QUANTITY_PER_ITEM;
    },
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      isDrawerOpen,
      itemCount: getItemCount(lines),
      subtotal: getSubtotal(lines),
      capMessage,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      clearCapMessage,
      isAtMaxQuantity,
      showCapMessage,
    }),
    [
      lines,
      isDrawerOpen,
      capMessage,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      clearCapMessage,
      isAtMaxQuantity,
      showCapMessage,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
