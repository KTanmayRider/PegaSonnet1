/**
 * Shopping Cart Context
 * Provides cart state and functions throughout the application
 * Implements addToCart() and getCartTotal() with clean logic
 */

import { createContext, useContext, useState, ReactNode } from 'react';
import { CartContextType, CartState, CartItem } from '../types/cart.types';
import { ShopifyProduct } from '../types/shopify.types';

// Step 1: Create Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Step 2: Cart Provider Component
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  // Initialize cart state
  const [cart, setCart] = useState<CartState>({
    items: [],
    isOpen: false,
  });

  /**
   * Step 3: addToCart() - Add product to cart with quantity
   * If product exists, increment quantity; otherwise add new item
   * Implements clean cart logic with duplicate checking
   */
  const addToCart = (product: ShopifyProduct, quantity: number = 1): void => {
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.product.id === product.id
      );

      let updatedItems: CartItem[];

      if (existingItemIndex > -1) {
        // Product exists - update quantity
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Product doesn't exist - add new item
        const newItem: CartItem = {
          product,
          quantity,
          variantId: product.variants[0]?.id || product.id,
          addedAt: new Date(),
        };
        updatedItems = [...prevCart.items, newItem];
      }

      return {
        ...prevCart,
        items: updatedItems,
      };
    });

    // Log for debugging (can be removed in production)
    console.log(`Added ${quantity}x "${product.title}" to cart`);
  };

  /**
   * Step 4: removeFromCart() - Remove product from cart
   * Filters out the product by ID
   */
  const removeFromCart = (productId: string): void => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((item) => item.product.id !== productId),
    }));
  };

  /**
   * Step 5: updateQuantity() - Update quantity of cart item
   * If quantity is 0 or negative, remove the item
   */
  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ),
    }));
  };

  /**
   * Step 6: clearCart() - Remove all items from cart
   */
  const clearCart = (): void => {
    setCart((prevCart) => ({
      ...prevCart,
      items: [],
    }));
  };

  /**
   * Step 7: getCartTotal() - Calculate total price of all items in cart
   * Returns the sum of (price × quantity) for all items
   * Implements clean calculation logic with proper number handling
   */
  const getCartTotal = (): number => {
    return cart.items.reduce((total, item) => {
      const price = parseFloat(item.product.priceRange.minVariantPrice.amount);
      return total + (price * item.quantity);
    }, 0);
  };

  /**
   * Step 8: getCartItemCount() - Get total number of items in cart
   * Returns sum of all quantities
   */
  const getCartItemCount = (): number => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  /**
   * Step 9: toggleCart() - Toggle cart visibility
   */
  const toggleCart = (): void => {
    setCart((prevCart) => ({
      ...prevCart,
      isOpen: !prevCart.isOpen,
    }));
  };

  /**
   * Step 10: closeCart() - Close cart panel
   */
  const closeCart = (): void => {
    setCart((prevCart) => ({
      ...prevCart,
      isOpen: false,
    }));
  };

  // Step 11: Provide cart context value
  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    toggleCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Step 12: useCart() - Custom hook to access cart context
 * Ensures context is used within CartProvider
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}

