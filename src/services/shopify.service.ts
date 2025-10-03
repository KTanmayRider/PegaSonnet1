/**
 * Shopify Storefront API Service
 * Handles all API calls to Shopify Storefront API with mock data fallback
 * Implements secure API key handling and error management
 */

import type { ShopifyProduct, ProductsResponse, FetchProductsOptions, ApiError } from '../types/shopify.types';

// Step 1: Secure API configuration with environment variables
// API keys are loaded from environment variables to prevent exposure
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Mock data for demonstration and testing purposes
const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'gid://shopify/Product/1',
    title: 'Classic Cotton T-Shirt',
    description: 'Premium quality cotton t-shirt. Comfortable, breathable, and perfect for everyday wear. Made from 100% organic cotton.',
    handle: 'classic-cotton-tshirt',
    images: [
      {
        id: 'img1',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
        altText: 'Classic white cotton t-shirt on wooden hanger',
        width: 800,
        height: 800,
      },
    ],
    priceRange: {
      minVariantPrice: {
        amount: '29.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '29.99',
        currencyCode: 'USD',
      },
    },
    variants: [
      {
        id: 'var1',
        title: 'Medium',
        availableForSale: true,
        priceV2: {
          amount: '29.99',
          currencyCode: 'USD',
        },
      },
    ],
    availableForSale: true,
    tags: ['clothing', 'basics', 'bestseller'],
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Denim Jeans - Slim Fit',
    description: 'Modern slim-fit jeans with stretch denim for comfort. Features a classic five-pocket design and durable construction.',
    handle: 'denim-jeans-slim-fit',
    images: [
      {
        id: 'img2',
        url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
        altText: 'Blue denim slim fit jeans',
        width: 800,
        height: 800,
      },
    ],
    priceRange: {
      minVariantPrice: {
        amount: '79.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '79.99',
        currencyCode: 'USD',
      },
    },
    variants: [
      {
        id: 'var2',
        title: '32x32',
        availableForSale: true,
        priceV2: {
          amount: '79.99',
          currencyCode: 'USD',
        },
      },
    ],
    availableForSale: true,
    tags: ['clothing', 'denim', 'new'],
  },
  {
    id: 'gid://shopify/Product/3',
    title: 'Leather Crossbody Bag',
    description: 'Elegant leather crossbody bag with adjustable strap. Perfect for everyday use with multiple compartments for organization.',
    handle: 'leather-crossbody-bag',
    images: [
      {
        id: 'img3',
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop',
        altText: 'Brown leather crossbody bag',
        width: 800,
        height: 800,
      },
    ],
    priceRange: {
      minVariantPrice: {
        amount: '149.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '149.99',
        currencyCode: 'USD',
      },
    },
    variants: [
      {
        id: 'var3',
        title: 'Brown',
        availableForSale: true,
        priceV2: {
          amount: '149.99',
          currencyCode: 'USD',
        },
      },
    ],
    availableForSale: true,
    tags: ['accessories', 'leather', 'bestseller'],
  },
  {
    id: 'gid://shopify/Product/4',
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-canceling headphones with 30-hour battery life. Crystal clear sound quality and comfortable fit.',
    handle: 'wireless-bluetooth-headphones',
    images: [
      {
        id: 'img4',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        altText: 'Black wireless bluetooth headphones',
        width: 800,
        height: 800,
      },
    ],
    priceRange: {
      minVariantPrice: {
        amount: '199.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '199.99',
        currencyCode: 'USD',
      },
    },
    variants: [
      {
        id: 'var4',
        title: 'Black',
        availableForSale: true,
        priceV2: {
          amount: '199.99',
          currencyCode: 'USD',
        },
      },
    ],
    availableForSale: true,
    tags: ['electronics', 'audio', 'new'],
  },
  {
    id: 'gid://shopify/Product/5',
    title: 'Running Sneakers',
    description: 'Lightweight running sneakers with responsive cushioning. Breathable mesh upper and durable rubber outsole.',
    handle: 'running-sneakers',
    images: [
      {
        id: 'img5',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
        altText: 'White and orange running sneakers',
        width: 800,
        height: 800,
      },
    ],
    priceRange: {
      minVariantPrice: {
        amount: '119.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '119.99',
        currencyCode: 'USD',
      },
    },
    variants: [
      {
        id: 'var5',
        title: 'Size 10',
        availableForSale: true,
        priceV2: {
          amount: '119.99',
          currencyCode: 'USD',
        },
      },
    ],
    availableForSale: true,
    tags: ['footwear', 'sports', 'bestseller'],
  },
  {
    id: 'gid://shopify/Product/6',
    title: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.',
    handle: 'stainless-steel-water-bottle',
    images: [
      {
        id: 'img6',
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop',
        altText: 'Blue stainless steel water bottle',
        width: 800,
        height: 800,
      },
    ],
    priceRange: {
      minVariantPrice: {
        amount: '34.99',
        currencyCode: 'USD',
      },
      maxVariantPrice: {
        amount: '34.99',
        currencyCode: 'USD',
      },
    },
    variants: [
      {
        id: 'var6',
        title: '32oz',
        availableForSale: true,
        priceV2: {
          amount: '34.99',
          currencyCode: 'USD',
        },
      },
    ],
    availableForSale: true,
    tags: ['accessories', 'eco-friendly', 'new'],
  },
];

/**
 * Step 2: Fetch products from Shopify Storefront API
 * Falls back to mock data if API credentials are not configured
 * Implements comprehensive error handling and loading simulation
 */
export async function fetchProducts(
  options: FetchProductsOptions = {}
): Promise<ProductsResponse> {
  // Check if API credentials are configured
  const isApiConfigured = SHOPIFY_STORE_DOMAIN && STOREFRONT_ACCESS_TOKEN;

  // If API is not configured, use mock data with simulated delay
  if (!isApiConfigured) {
    console.info('Using mock product data. Configure VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN to use live API.');
    
    // Simulate network delay for realistic loading experience
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      products: MOCK_PRODUCTS.slice(0, options.limit || MOCK_PRODUCTS.length),
    };
  }

  // Step 3: Make actual API request to Shopify Storefront API
  try {
    const query = buildProductsQuery(options);
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2023-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Check for GraphQL errors
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL query failed');
    }

    // Transform API response to match our types
    const products: ShopifyProduct[] = data.data?.products?.edges?.map((edge: any) => edge.node) || [];

    return { products };
  } catch (error) {
    // Step 4: Handle errors gracefully
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'Failed to fetch products',
      code: 'FETCH_ERROR',
    };
    
    console.error('Shopify API Error:', apiError);
    throw apiError;
  }
}

/**
 * Step 5: Build GraphQL query for fetching products
 * Constructs a properly formatted GraphQL query based on options
 */
function buildProductsQuery(options: FetchProductsOptions): string {
  const limit = options.limit || 20;
  const sortKey = options.sortKey || 'CREATED_AT';

  return `
    query GetProducts {
      products(first: ${limit}, sortKey: ${sortKey}) {
        edges {
          node {
            id
            title
            description
            handle
            availableForSale
            tags
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
}

/**
 * Format price for display
 * Utility function to format price amounts with proper currency symbols
 */
export function formatPrice(amount: string, currencyCode: string): string {
  const numAmount = parseFloat(amount);
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(numAmount);
  } catch {
    // Fallback if currency code is invalid
    return `${currencyCode} ${numAmount.toFixed(2)}`;
  }
}

