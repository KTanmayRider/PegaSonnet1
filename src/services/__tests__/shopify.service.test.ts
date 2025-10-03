/**
 * Unit Tests for Shopify Service
 * Tests fetchProducts() function and related utilities
 */

import { fetchProducts, formatPrice } from '../shopify.service';

describe('Shopify Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchProducts()', () => {
    it('should fetch products successfully with mock data', async () => {
      const result = await fetchProducts();

      expect(result).toBeDefined();
      expect(result.products).toBeInstanceOf(Array);
      expect(result.products.length).toBeGreaterThan(0);
    });

    it('should return products with correct structure', async () => {
      const result = await fetchProducts();
      const product = result.products[0];

      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('images');
      expect(product).toHaveProperty('priceRange');
      expect(product).toHaveProperty('variants');
      expect(product).toHaveProperty('availableForSale');
    });

    it('should respect limit option', async () => {
      const limit = 3;
      const result = await fetchProducts({ limit });

      expect(result.products.length).toBeLessThanOrEqual(limit);
    });

    it('should handle limit of 0', async () => {
      const result = await fetchProducts({ limit: 0 });

      expect(result.products.length).toBe(0);
    });

    it('should return all products when limit exceeds available', async () => {
      const result = await fetchProducts({ limit: 1000 });

      expect(result.products.length).toBeGreaterThan(0);
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await fetchProducts();
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(700);
    });

    it('should return products with valid price data', async () => {
      const result = await fetchProducts();
      const product = result.products[0];

      expect(product.priceRange.minVariantPrice).toHaveProperty('amount');
      expect(product.priceRange.minVariantPrice).toHaveProperty('currencyCode');
      expect(parseFloat(product.priceRange.minVariantPrice.amount)).toBeGreaterThan(0);
    });

    it('should return products with images', async () => {
      const result = await fetchProducts();
      const product = result.products[0];

      expect(product.images).toBeInstanceOf(Array);
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.images[0]).toHaveProperty('url');
      expect(product.images[0]).toHaveProperty('altText');
    });

    it('should return products with variants', async () => {
      const result = await fetchProducts();
      const product = result.products[0];

      expect(product.variants).toBeInstanceOf(Array);
      expect(product.variants.length).toBeGreaterThan(0);
      expect(product.variants[0]).toHaveProperty('id');
      expect(product.variants[0]).toHaveProperty('availableForSale');
    });

    it('should return products with tags', async () => {
      const result = await fetchProducts();
      const product = result.products[0];

      expect(product.tags).toBeInstanceOf(Array);
      expect(product.tags.length).toBeGreaterThan(0);
    });
  });

  describe('formatPrice()', () => {
    it('should format USD prices correctly', () => {
      const formatted = formatPrice('29.99', 'USD');

      expect(formatted).toContain('29.99');
      expect(formatted).toContain('$');
    });

    it('should format INR prices correctly', () => {
      const formatted = formatPrice('499', 'INR');

      expect(formatted).toContain('499');
      expect(formatted).toMatch(/₹|INR/);
    });

    it('should handle zero prices', () => {
      const formatted = formatPrice('0', 'USD');

      expect(formatted).toContain('0');
    });

    it('should handle large prices', () => {
      const formatted = formatPrice('9999.99', 'USD');

      expect(formatted).toContain('9,999.99');
    });

    it('should handle decimal places correctly', () => {
      const formatted = formatPrice('19.5', 'USD');

      expect(formatted).toContain('19.50');
    });

    it('should handle invalid currency gracefully', () => {
      const formatted = formatPrice('100', 'INVALID');

      expect(formatted).toBeTruthy();
      expect(formatted).toContain('100');
    });

    it('should handle empty string amount', () => {
      const formatted = formatPrice('', 'USD');

      expect(formatted).toBeTruthy();
    });

    it('should handle non-numeric strings gracefully', () => {
      const formatted = formatPrice('abc', 'USD');

      expect(formatted).toBeTruthy();
    });
  });

  describe('Product Data Validation', () => {
    it('should have unique product IDs', async () => {
      const result = await fetchProducts();
      const ids = result.products.map(p => p.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have non-empty product titles', async () => {
      const result = await fetchProducts();

      result.products.forEach(product => {
        expect(product.title).toBeTruthy();
        expect(product.title.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty descriptions', async () => {
      const result = await fetchProducts();

      result.products.forEach(product => {
        expect(product.description).toBeTruthy();
        expect(product.description.length).toBeGreaterThan(0);
      });
    });

    it('should have valid image URLs', async () => {
      const result = await fetchProducts();

      result.products.forEach(product => {
        product.images.forEach(image => {
          expect(image.url).toMatch(/^https?:\/\//);
        });
      });
    });

    it('should have consistent price format', async () => {
      const result = await fetchProducts();

      result.products.forEach(product => {
        const amount = product.priceRange.minVariantPrice.amount;
        expect(amount).toMatch(/^\d+(\.\d{1,2})?$/);
      });
    });
  });
});

