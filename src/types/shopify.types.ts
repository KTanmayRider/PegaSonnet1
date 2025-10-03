/**
 * Shopify Storefront API Types
 * These types match the Shopify Storefront API v2023-07 schema
 */

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: ShopifyImage[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: ShopifyVariant[];
  availableForSale: boolean;
  tags: string[];
}

export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  priceV2: {
    amount: string;
    currencyCode: string;
  };
}

export interface ProductsResponse {
  products: ShopifyProduct[];
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface FetchProductsOptions {
  limit?: number;
  after?: string;
  sortKey?: 'TITLE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING';
}

