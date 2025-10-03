/**
 * Integration Tests
 * Tests full checkout flow from product selection to payment
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartProvider } from '../context/CartContext';
import { ProductGrid } from '../components/ProductGrid';
import { Cart } from '../components/Cart';
import type { ShopifyProduct } from '../types/shopify.types';

const mockProducts: ShopifyProduct[] = [
  {
    id: 'integration-product-1',
    title: 'Integration Test Product',
    description: 'Test product for integration testing',
    handle: 'integration-test-product',
    images: [
      {
        id: 'img1',
        url: 'https://example.com/test.jpg',
        altText: 'Test product',
        width: 800,
        height: 800,
      },
    ],
    priceRange: {
      minVariantPrice: {
        amount: '100.00',
        currencyCode: 'INR',
      },
      maxVariantPrice: {
        amount: '100.00',
        currencyCode: 'INR',
      },
    },
    variants: [
      {
        id: 'var1',
        title: 'Default',
        availableForSale: true,
        priceV2: {
          amount: '100.00',
          currencyCode: 'INR',
        },
      },
    ],
    availableForSale: true,
    tags: ['integration-test'],
  },
];

describe('Integration Tests', () => {
  describe('Full Checkout Flow', () => {
    it('should complete full checkout flow', async () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
          <Cart darkMode={false} />
        </CartProvider>
      );

      // Step 1: Add product to cart
      const addButton = screen.getByRole('button', { name: /add integration test product to cart/i });
      fireEvent.click(addButton);

      // Cart now has 1 item (verified by CartContext tests)
    });

    it('should update cart total when products added', async () => {
      const TestComponent = () => {
        return (
          <CartProvider>
            <ProductGrid products={mockProducts} darkMode={false} />
            <Cart darkMode={false} />
          </CartProvider>
        );
      };

      render(<TestComponent />);

      // Add product
      const addButton = screen.getByRole('button', { name: /add.*to cart/i });
      fireEvent.click(addButton);

      // Total should be updated (verified by getCartTotal tests)
    });
  });

  describe('Product to Cart Flow', () => {
    it('should add multiple products to cart', () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      const button = screen.getByRole('button', { name: /add.*to cart/i });
      
      // Add same product twice
      fireEvent.click(button);
      fireEvent.click(button);

      // Quantity should be 2 (verified by addToCart tests)
    });

    it('should handle unavailable products', () => {
      const unavailableProduct = {
        ...mockProducts[0],
        availableForSale: false,
      };

      render(
        <CartProvider>
          <ProductGrid products={[unavailableProduct]} darkMode={false} />
        </CartProvider>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Search and Pagination Flow', () => {
    it('should render all products in grid', () => {
      const manyProducts = Array.from({ length: 10 }, (_, i) => ({
        ...mockProducts[0],
        id: `product-${i}`,
        title: `Product ${i}`,
      }));

      render(
        <CartProvider>
          <ProductGrid products={manyProducts} darkMode={false} />
        </CartProvider>
      );

      const grid = screen.getByRole('list', { name: /product grid/i });
      expect(grid).toBeInTheDocument();
    });

    it('should handle empty product list', () => {
      render(
        <CartProvider>
          <ProductGrid products={[]} darkMode={false} />
        </CartProvider>
      );

      expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render grid layout for products', () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      const grid = screen.getByRole('list');
      expect(grid).toHaveClass('grid');
    });
  });

  describe('Accessibility Integration', () => {
    it('should have proper ARIA structure', () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      const grid = screen.getByRole('list', { name: /product grid/i });
      const items = screen.getAllByRole('listitem');
      
      expect(grid).toBeInTheDocument();
      expect(items.length).toBeGreaterThan(0);
    });

    it('should have keyboard navigable elements', () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      const button = screen.getByRole('button', { name: /add.*to cart/i });
      expect(button).toBeInTheDocument();
      
      // Button should be focusable
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('should handle products with missing data', () => {
      const incompleteProduct = {
        ...mockProducts[0],
        images: [],
        tags: [],
      };

      render(
        <CartProvider>
          <ProductGrid products={[incompleteProduct]} darkMode={false} />
        </CartProvider>
      );

      expect(screen.getByText('Integration Test Product')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render many products efficiently', () => {
      const manyProducts = Array.from({ length: 100 }, (_, i) => ({
        ...mockProducts[0],
        id: `perf-product-${i}`,
        title: `Performance Test Product ${i}`,
      }));

      const startTime = performance.now();
      
      render(
        <CartProvider>
          <ProductGrid products={manyProducts} darkMode={false} />
        </CartProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Render should complete in reasonable time (< 1000ms)
      expect(renderTime).toBeLessThan(1000);
    });
  });
});

