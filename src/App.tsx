/**
 * Main App Component
 * Shopify Storefront with state management, dark mode, and accessibility
 * Implements mobile-first responsive design
 */

import { useState, useEffect } from 'react';
import { ShopifyProduct } from './types/shopify.types';
import { fetchProducts } from './services/shopify.service';
import { ProductGrid } from './components/ProductGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';

// Step 1: Define application state types
type AppState = 'loading' | 'success' | 'error';

function App() {
  // Step 2: Initialize state management
  // Dark mode state following project pattern
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Products state
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  
  // Application state for loading, error, and success
  const [appState, setAppState] = useState<AppState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Mobile menu state for responsive navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Step 3: Fetch products on component mount
  // Load products when component initializes and on retry
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Step 4: Load products function with comprehensive error handling
   * Manages loading state, fetches data, and handles errors
   */
  const loadProducts = async () => {
    try {
      setAppState('loading');
      setErrorMessage('');
      
      const response = await fetchProducts({ limit: 20 });
      
      setProducts(response.products);
      setAppState('success');
    } catch (error) {
      setAppState('error');
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Unable to load products. Please try again later.'
      );
      console.error('Failed to load products:', error);
    }
  };

  /**
   * Step 5: Toggle dark mode
   * Switches between light and dark themes
   */
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  /**
   * Step 6: Toggle mobile menu
   * Controls mobile navigation visibility
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Step 7: Header with navigation and dark mode toggle */}
      <header
        className={`sticky top-0 z-50 shadow-md transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <h1
                className={`text-xl sm:text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                <span className="text-blue-500">Shop</span>ify Store
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
              <a
                href="#products"
                className={`text-sm font-medium transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Products
              </a>
              <a
                href="#about"
                className={`text-sm font-medium transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                About
              </a>
              <a
                href="#contact"
                className={`text-sm font-medium transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Contact
              </a>
            </nav>

            {/* Actions: Cart and Dark Mode Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Shopping Cart */}
              <button
                className={`
                  p-2 sm:p-3 rounded-full transition-colors
                  focus:outline-none focus:ring-4
                  ${
                    darkMode
                      ? 'hover:bg-gray-700 focus:ring-gray-600'
                      : 'hover:bg-gray-100 focus:ring-gray-300'
                  }
                `}
                aria-label="Shopping cart"
              >
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`
                  p-2 sm:p-3 rounded-full transition-all duration-300
                  focus:outline-none focus:ring-4
                  ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 focus:ring-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200 focus:ring-gray-300'
                  }
                `}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={darkMode}
              >
                {darkMode ? (
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className={`
                  md:hidden p-2 rounded-full transition-colors
                  focus:outline-none focus:ring-4
                  ${
                    darkMode
                      ? 'hover:bg-gray-700 focus:ring-gray-600'
                      : 'hover:bg-gray-100 focus:ring-gray-300'
                  }
                `}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                <svg
                  className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Step 8: Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <nav
              className={`
                md:hidden py-4 border-t
                ${darkMode ? 'border-gray-700' : 'border-gray-200'}
              `}
              aria-label="Mobile navigation"
            >
              <a
                href="#products"
                className={`
                  block py-2 px-4 text-base font-medium transition-colors
                  ${
                    darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </a>
              <a
                href="#about"
                className={`
                  block py-2 px-4 text-base font-medium transition-colors
                  ${
                    darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#contact"
                className={`
                  block py-2 px-4 text-base font-medium transition-colors
                  ${
                    darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Step 9: Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12" role="main">
        {/* Hero Section */}
        <section className="mb-8 sm:mb-12 text-center">
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Discover Amazing Products
          </h2>
          <p
            className={`text-base sm:text-lg lg:text-xl max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Shop our curated collection of high-quality products with fast shipping and excellent customer service.
          </p>
        </section>

        {/* Step 10: Conditional rendering based on app state */}
        {appState === 'loading' && <LoadingSpinner darkMode={darkMode} />}

        {appState === 'error' && (
          <ErrorDisplay
            message={errorMessage}
            onRetry={loadProducts}
            darkMode={darkMode}
          />
        )}

        {appState === 'success' && (
          <section id="products" aria-label="Products section">
            <ProductGrid products={products} darkMode={darkMode} />
          </section>
        )}
      </main>

      {/* Step 11: Footer */}
      <footer
        className={`mt-12 sm:mt-20 py-8 sm:py-12 border-t transition-colors duration-300 ${
          darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* About */}
            <div>
              <h3
                className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                About Us
              </h3>
              <p
                className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Quality products, exceptional service, and fast delivery.
              </p>
            </div>

            {/* Customer Service */}
            <div>
              <h3
                className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Customer Service
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#contact"
                    className={`transition-colors ${
                      darkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#shipping"
                    className={`transition-colors ${
                      darkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a
                    href="#returns"
                    className={`transition-colors ${
                      darkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Returns
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3
                className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Legal
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#privacy"
                    className={`transition-colors ${
                      darkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className={`transition-colors ${
                      darkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3
                className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Connect
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#facebook"
                  className={`transition-colors ${
                    darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="#twitter"
                  className={`transition-colors ${
                    darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-label="Twitter"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#instagram"
                  className={`transition-colors ${
                    darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div
            className={`mt-8 pt-8 border-t text-center text-sm ${
              darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
            }`}
          >
            <p>&copy; 2025 Shopify Store. All rights reserved. Built with React & TypeScript.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

