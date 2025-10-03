/**
 * Shopping Cart Types
 * Type definitions for cart items and cart state
 */

import { ShopifyProduct } from './shopify.types';

export interface CartItem {
  product: ShopifyProduct;
  quantity: number;
  variantId: string;
  addedAt: Date;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface CartContextType {
  cart: CartState;
  addToCart: (product: ShopifyProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  toggleCart: () => void;
  closeCart: () => void;
}

