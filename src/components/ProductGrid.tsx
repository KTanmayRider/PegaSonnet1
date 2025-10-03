/**
 * ProductGrid Component
 * Renders a responsive grid of products with full accessibility support
 * Implements mobile-first design with Tailwind CSS
 */

import { ShopifyProduct } from '../types/shopify.types';
import { formatPrice } from '../services/shopify.service';

interface ProductGridProps {
  products: ShopifyProduct[];
  darkMode: boolean;
}

/**
 * Step 1: Main renderProductGrid function
 * Renders a grid of product cards with accessibility and responsive design
 * Returns null if no products to display
 */
export function renderProductGrid(products: ShopifyProduct[], darkMode: boolean): JSX.Element | null {
  if (products.length === 0) {
    return (
      <div 
        className="text-center py-12"
        role="status"
        aria-live="polite"
      >
        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          No products found. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      role="list"
      aria-label="Product grid"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} darkMode={darkMode} />
      ))}
    </div>
  );
}

/**
 * Step 2: ProductGrid wrapper component
 * Provides a clean interface for rendering the product grid
 */
export function ProductGrid({ products, darkMode }: ProductGridProps): JSX.Element {
  return <>{renderProductGrid(products, darkMode)}</>;
}

/**
 * Step 3: Individual ProductCard component
 * Renders a single product with image, title, description, and price
 * Includes full accessibility attributes and responsive design
 */
interface ProductCardProps {
  product: ShopifyProduct;
  darkMode: boolean;
}

function ProductCard({ product, darkMode }: ProductCardProps): JSX.Element {
  const primaryImage = product.images[0];
  const price = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  );

  // Determine availability status for accessibility
  const availabilityText = product.availableForSale ? 'In stock' : 'Out of stock';

  return (
    <article
      className={`
        rounded-lg overflow-hidden shadow-md hover:shadow-xl
        transition-all duration-300 transform hover:-translate-y-1
        ${darkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
        }
      `}
      role="listitem"
      aria-label={`${product.title}, ${price}`}
    >
      {/* Step 4: Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText || product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            width={primaryImage.width}
            height={primaryImage.height}
          />
        ) : (
          <div 
            className={`w-full h-full flex items-center justify-center ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}
            role="img"
            aria-label="No image available"
          >
            <svg
              className={`w-16 h-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Availability badge */}
        {!product.availableForSale && (
          <div
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
            role="status"
            aria-label={availabilityText}
          >
            Sold Out
          </div>
        )}
      </div>

      {/* Step 5: Product Details */}
      <div className="p-4 sm:p-6">
        <h3
          className={`text-lg sm:text-xl font-semibold mb-2 line-clamp-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {product.title}
        </h3>

        <p
          className={`text-sm mb-4 line-clamp-3 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {product.description}
        </p>

        {/* Step 6: Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Product tags">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2 py-1 rounded-full ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
                role="listitem"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Step 7: Price and CTA */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? 'text-green-400' : 'text-green-600'
            }`}
            aria-label={`Price: ${price}`}
          >
            {price}
          </span>

          <button
            className={`
              px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold
              transition-colors duration-200
              focus:outline-none focus:ring-4
              ${
                product.availableForSale
                  ? darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/50'
                    : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300'
                  : darkMode
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
            disabled={!product.availableForSale}
            aria-label={`Add ${product.title} to cart, ${availabilityText}`}
            aria-disabled={!product.availableForSale}
          >
            {product.availableForSale ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  );
}

