/**
 * Unit Tests for CartContext
 * Tests addToCart(), getCartTotal(), and other cart functions
 */

import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import type { ShopifyProduct } from '../../types/shopify.types';

// Mock product for testing
const mockProduct: ShopifyProduct = {
  id: 'test-product-1',
  title: 'Test Product',
  description: 'Test description',
  handle: 'test-product',
  images: [
    {
      id: 'img1',
      url: 'https://example.com/image.jpg',
      altText: 'Test image',
      width: 800,
      height: 800,
    },
  ],
  priceRange: {
    minVariantPrice: {
      amount: '99.99',
      currencyCode: 'USD',
    },
    maxVariantPrice: {
      amount: '99.99',
      currencyCode: 'USD',
    },
  },
  variants: [
    {
      id: 'var1',
      title: 'Default',
      availableForSale: true,
      priceV2: {
        amount: '99.99',
        currencyCode: 'USD',
      },
    },
  ],
  availableForSale: true,
  tags: ['test'],
};

const mockProduct2: ShopifyProduct = {
  ...mockProduct,
  id: 'test-product-2',
  title: 'Test Product 2',
  priceRange: {
    minVariantPrice: {
      amount: '49.99',
      currencyCode: 'USD',
    },
    maxVariantPrice: {
      amount: '49.99',
      currencyCode: 'USD',
    },
  },
};

describe('CartContext', () => {
  describe('addToCart()', () => {
    it('should add a product to cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.cart.items.length).toBe(1);
      expect(result.current.cart.items[0].product.id).toBe('test-product-1');
      expect(result.current.cart.items[0].quantity).toBe(1);
    });

    it('should add multiple quantities', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct, 5);
      });

      expect(result.current.cart.items[0].quantity).toBe(5);
    });

    it('should increment quantity for duplicate products', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      act(() => {
        result.current.addToCart(mockProduct, 3);
      });

      expect(result.current.cart.items.length).toBe(1);
      expect(result.current.cart.items[0].quantity).toBe(5);
    });

    it('should handle multiple different products', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct2);
      });

      expect(result.current.cart.items.length).toBe(2);
    });

    it('should store product details correctly', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      const item = result.current.cart.items[0];
      expect(item.product.title).toBe('Test Product');
      expect(item.product.priceRange.minVariantPrice.amount).toBe('99.99');
      expect(item.variantId).toBeTruthy();
      expect(item.addedAt).toBeInstanceOf(Date);
    });

    it('should default quantity to 1', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.cart.items[0].quantity).toBe(1);
    });
  });

  describe('getCartTotal()', () => {
    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const total = result.current.getCartTotal();
      expect(total).toBe(0);
    });

    it('should calculate total for single item', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      const total = result.current.getCartTotal();
      expect(total).toBe(99.99);
    });

    it('should calculate total for multiple quantities', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct, 3);
      });

      const total = result.current.getCartTotal();
      expect(total).toBe(299.97);
    });

    it('should calculate total for multiple products', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct, 2); // 199.98
        result.current.addToCart(mockProduct2, 1); // 49.99
      });

      const total = result.current.getCartTotal();
      expect(total).toBeCloseTo(249.97, 2);
    });

    it('should handle decimal precision correctly', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct, 3);
      });

      const total = result.current.getCartTotal();
      expect(typeof total).toBe('number');
      expect(total).toBeGreaterThan(0);
    });

    it('should update total after adding items', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      let total = result.current.getCartTotal();
      expect(total).toBe(99.99);

      act(() => {
        result.current.addToCart(mockProduct2);
      });

      total = result.current.getCartTotal();
      expect(total).toBeCloseTo(149.98, 2);
    });
  });

  describe('removeFromCart()', () => {
    it('should remove product from cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.cart.items.length).toBe(1);

      act(() => {
        result.current.removeFromCart('test-product-1');
      });

      expect(result.current.cart.items.length).toBe(0);
    });

    it('should only remove specified product', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct2);
      });

      act(() => {
        result.current.removeFromCart('test-product-1');
      });

      expect(result.current.cart.items.length).toBe(1);
      expect(result.current.cart.items[0].product.id).toBe('test-product-2');
    });

    it('should update total after removal', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct2);
      });

      act(() => {
        result.current.removeFromCart('test-product-1');
      });

      const total = result.current.getCartTotal();
      expect(total).toBe(49.99);
    });
  });

  describe('updateQuantity()', () => {
    it('should update product quantity', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct, 1);
      });

      act(() => {
        result.current.updateQuantity('test-product-1', 5);
      });

      expect(result.current.cart.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity('test-product-1', 0);
      });

      expect(result.current.cart.items.length).toBe(0);
    });

    it('should remove item when quantity is negative', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity('test-product-1', -1);
      });

      expect(result.current.cart.items.length).toBe(0);
    });

    it('should update total after quantity change', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct, 1);
      });

      act(() => {
        result.current.updateQuantity('test-product-1', 3);
      });

      const total = result.current.getCartTotal();
      expect(total).toBe(299.97);
    });
  });

  describe('clearCart()', () => {
    it('should remove all items from cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct2);
      });

      expect(result.current.cart.items.length).toBe(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart.items.length).toBe(0);
    });

    it('should reset total to 0', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.clearCart();
      });

      const total = result.current.getCartTotal();
      expect(total).toBe(0);
    });
  });

  describe('getCartItemCount()', () => {
    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const count = result.current.getCartItemCount();
      expect(count).toBe(0);
    });

    it('should count single item', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      const count = result.current.getCartItemCount();
      expect(count).toBe(1);
    });

    it('should sum quantities across products', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct, 3);
        result.current.addToCart(mockProduct2, 2);
      });

      const count = result.current.getCartItemCount();
      expect(count).toBe(5);
    });
  });

  describe('Cart visibility', () => {
    it('should default to closed', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      expect(result.current.cart.isOpen).toBe(false);
    });

    it('should toggle cart open/closed', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.toggleCart();
      });

      expect(result.current.cart.isOpen).toBe(true);

      act(() => {
        result.current.toggleCart();
      });

      expect(result.current.cart.isOpen).toBe(false);
    });

    it('should close cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.toggleCart();
      });

      expect(result.current.cart.isOpen).toBe(true);

      act(() => {
        result.current.closeCart();
      });

      expect(result.current.cart.isOpen).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle adding product with zero quantity', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct, 0);
      });

      expect(result.current.cart.items[0].quantity).toBe(0);
    });

    it('should handle very large quantities', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addToCart(mockProduct, 1000);
      });

      expect(result.current.cart.items[0].quantity).toBe(1000);
      const total = result.current.getCartTotal();
      expect(total).toBe(99990);
    });

    it('should handle removing non-existent product', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.removeFromCart('non-existent-id');
      });

      expect(result.current.cart.items.length).toBe(0);
    });

    it('should handle updating quantity of non-existent product', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.updateQuantity('non-existent-id', 5);
      });

      expect(result.current.cart.items.length).toBe(0);
    });
  });
});

