import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProductById } from '../../constants/products';
import { readStorage, writeStorage } from '../../lib/storage';

const CART_STORAGE_KEY = 'butakeando:cart';
// Mirrors the backend checkout limit per line item.
export const MAX_ITEM_QUANTITY = 10;
const CartContext = createContext(null);

function normalizeQuantity(quantity) {
  return Math.min(MAX_ITEM_QUANTITY, Math.max(1, Number(quantity) || 1));
}

function toCartItem(product, quantity) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image,
    imageAlt: product.imageAlt,
    tone: product.tone,
    quantity: normalizeQuantity(quantity),
  };
}

// Stored carts can hold stale names, prices or hashed image URLs from older builds,
// so only the id and quantity are trusted and everything else comes from the catalog.
function hydrateStoredCart(storedItems) {
  if (!Array.isArray(storedItems)) {
    return [];
  }

  return storedItems.flatMap((item) => {
    const product = getProductById(item?.id);
    return product?.purchasable ? [toCartItem(product, item.quantity)] : [];
  });
}

function calculateCartItemsCount(items) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function calculateCartTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => hydrateStoredCart(readStorage(CART_STORAGE_KEY, [])));

  useEffect(() => {
    writeStorage(CART_STORAGE_KEY, items);
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    if (!product.purchasable) {
      return;
    }

    setItems((current) => {
      const nextQuantity = normalizeQuantity(quantity);
      const existingItem = current.find((item) => item.id === product.id);

      if (existingItem) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: normalizeQuantity(item.quantity + nextQuantity),
              }
            : item,
        );
      }

      return [...current, toCartItem(product, nextQuantity)];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((current) =>
      current.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: normalizeQuantity(quantity),
            }
          : item,
      ),
    );
  }, []);

  // Keeping the same array when already empty avoids needless re-renders.
  const clearCart = useCallback(() => setItems((current) => (current.length ? [] : current)), []);

  const value = useMemo(
    () => ({
      items,
      cartItemsCount: calculateCartItemsCount(items),
      cartTotal: calculateCartTotal(items),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider.');
  }

  return context;
}
