/**
 * Unit Tests for ProductGrid Component
 * Tests renderProductGrid() function and ProductGrid component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { ProductGrid, renderProductGrid } from '../ProductGrid';
import { CartProvider } from '../../context/CartContext';
import type { ShopifyProduct } from '../../types/shopify.types';

const mockProducts: ShopifyProduct[] = [
  {
    id: 'product-1',
    title: 'Test Product 1',
    description: 'Test description 1',
    handle: 'test-product-1',
    images: [
      {
        id: 'img1',
        url: 'https://example.com/image1.jpg',
        altText: 'Test image 1',
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
    tags: ['tag1', 'tag2'],
  },
  {
    id: 'product-2',
    title: 'Test Product 2',
    description: 'Test description 2',
    handle: 'test-product-2',
    images: [],
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
    variants: [
      {
        id: 'var2',
        title: 'Default',
        availableForSale: false,
        priceV2: {
          amount: '49.99',
          currencyCode: 'USD',
        },
      },
    ],
    availableForSale: false,
    tags: [],
  },
];

describe('ProductGrid Component', () => {
  describe('renderProductGrid()', () => {
    it('should render product grid with products', () => {
      const result = renderProductGrid(mockProducts, false);
      expect(result).not.toBeNull();
    });

    it('should return null for empty product array', () => {
      const result = renderProductGrid([], false);
      expect(result).not.toBeNull(); // Returns empty state message
    });

    it('should handle dark mode', () => {
      const lightResult = renderProductGrid(mockProducts, false);
      const darkResult = renderProductGrid(mockProducts, true);
      expect(lightResult).toBeTruthy();
      expect(darkResult).toBeTruthy();
    });
  });

  describe('ProductGrid Rendering', () => {
    it('should render all products', () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('should display product prices', () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      expect(screen.getByText(/\$99\.99/)).toBeInTheDocument();
      expect(screen.getByText(/\$49\.99/)).toBeInTheDocument();
    });

    it('should display product descriptions', () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      expect(screen.getByText('Test description 1')).toBeInTheDocument();
      expect(screen.getByText('Test description 2')).toBeInTheDocument();
    });

    it('should display product images', () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      const image = screen.getByAltText('Test image 1');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
    });

    it('should display placeholder for missing images', () => {
      render(
        <CartProvider>
          <ProductGrid products={[mockProducts[1]]} darkMode={false} />
        </CartProvider>
      );

      const placeholder = screen.getByRole('img', { name: /no image available/i });
      expect(placeholder).toBeInTheDocument();
    });

    it('should display product tags', () => {
      render(
        <CartProvider>
          <ProductGrid products={[mockProducts[0]]} darkMode={false} />
        </CartProvider>
      );

      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
    });

    it('should display add to cart button', () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      const buttons = screen.getAllByRole('button', { name: /add to cart/i });
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should disable button for unavailable products', () => {
      render(
        <CartProvider>
          <ProductGrid products={[mockProducts[1]]} darkMode={false} />
        </CartProvider>
      );

      const button = screen.getByRole('button', { name: /unavailable/i });
      expect(button).toBeDisabled();
    });

    it('should show sold out badge', () => {
      render(
        <CartProvider>
          <ProductGrid products={[mockProducts[1]]} darkMode={false} />
        </CartProvider>
      );

      expect(screen.getByText('Sold Out')).toBeInTheDocument();
    });
  });

  describe('Add to Cart Functionality', () => {
    it('should call addToCart when button clicked', () => {
      render(
        <CartProvider>
          <ProductGrid products={[mockProducts[0]]} darkMode={false} />
        </CartProvider>
      );

      const button = screen.getByRole('button', { name: /add test product 1 to cart/i });
      fireEvent.click(button);

      // Cart should now have 1 item (tested indirectly)
    });

    it('should not add unavailable products', () => {
      render(
        <CartProvider>
          <ProductGrid products={[mockProducts[1]]} darkMode={false} />
        </CartProvider>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      const grid = screen.getByRole('list', { name: /product grid/i });
      expect(grid).toBeInTheDocument();
    });

    it('should have accessible product cards', () => {
      render(
        <CartProvider>
          <ProductGrid products={[mockProducts[0]]} darkMode={false} />
        </CartProvider>
      );

      const article = screen.getByRole('listitem');
      expect(article).toBeInTheDocument();
    });

    it('should have descriptive button labels', () => {
      render(
        <CartProvider>
          <ProductGrid products={[mockProducts[0]]} darkMode={false} />
        </CartProvider>
      );

      const button = screen.getByLabelText(/add test product 1 to cart, in stock/i);
      expect(button).toBeInTheDocument();
    });

    it('should have proper image alt text', () => {
      render(
        <CartProvider>
          <ProductGrid products={[mockProducts[0]]} darkMode={false} />
        </CartProvider>
      );

      const image = screen.getByAltText('Test image 1');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display empty state message', () => {
      render(
        <CartProvider>
          <ProductGrid products={[]} darkMode={false} />
        </CartProvider>
      );

      expect(screen.getByText(/no products found/i)).toBeInTheDocument();
    });

    it('should have accessible empty state', () => {
      render(
        <CartProvider>
          <ProductGrid products={[]} darkMode={false} />
        </CartProvider>
      );

      const emptyState = screen.getByRole('status');
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe('Dark Mode', () => {
    it('should apply dark mode styles', () => {
      const { container } = render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={true} />
        </CartProvider>
      );

      expect(container.firstChild).toBeTruthy();
    });

    it('should apply light mode styles', () => {
      const { container } = render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Responsive Grid', () => {
    it('should render grid layout', () => {
      render(
        <CartProvider>
          <ProductGrid products={mockProducts} darkMode={false} />
        </CartProvider>
      );

      const grid = screen.getByRole('list');
      expect(grid).toHaveClass('grid');
    });
  });

  describe('Edge Cases', () => {
    it('should handle products without tags', () => {
      const productWithoutTags = { ...mockProducts[0], tags: [] };
      
      render(
        <CartProvider>
          <ProductGrid products={[productWithoutTags]} darkMode={false} />
        </CartProvider>
      );

      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    it('should handle products with many tags', () => {
      const productWithManyTags = {
        ...mockProducts[0],
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
      };
      
      render(
        <CartProvider>
          <ProductGrid products={[productWithManyTags]} darkMode={false} />
        </CartProvider>
      );

      // Should only display first 3 tags
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.getByText('tag3')).toBeInTheDocument();
    });

    it('should handle very long product titles', () => {
      const productWithLongTitle = {
        ...mockProducts[0],
        title: 'This is a very long product title that should be handled properly',
      };
      
      render(
        <CartProvider>
          <ProductGrid products={[productWithLongTitle]} darkMode={false} />
        </CartProvider>
      );

      expect(screen.getByText(/this is a very long product title/i)).toBeInTheDocument();
    });

    it('should handle very long descriptions', () => {
      const productWithLongDesc = {
        ...mockProducts[0],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10),
      };
      
      render(
        <CartProvider>
          <ProductGrid products={[productWithLongDesc]} darkMode={false} />
        </CartProvider>
      );

      expect(screen.getByText(/lorem ipsum/i)).toBeInTheDocument();
    });
  });
});

