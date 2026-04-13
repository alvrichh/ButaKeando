import { createContext, useContext, useEffect, useState } from 'react';
import { readStorage, writeStorage } from '../../lib/storage';

const CART_STORAGE_KEY = 'butakeando:cart';
const CartContext = createContext(null);

function normalizeQuantity(quantity) {
  return Math.max(1, Number(quantity) || 1);
}

function calculateCartItemsCount(items) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function calculateCartTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStorage(CART_STORAGE_KEY, []));

  useEffect(() => {
    writeStorage(CART_STORAGE_KEY, items);
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((current) => {
      const nextQuantity = normalizeQuantity(quantity);
      const existingItem = current.find((item) => item.id === product.id);

      if (existingItem) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + nextQuantity,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          imageAlt: product.imageAlt,
          tone: product.tone,
          quantity: nextQuantity,
        },
      ];
    });
  };

  const removeItem = (productId) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
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
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        cartItemsCount: calculateCartItemsCount(items),
        cartTotal: calculateCartTotal(items),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider.');
  }

  return context;
}
