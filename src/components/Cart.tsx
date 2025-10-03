/**
 * Shopping Cart Component
 * Accessible slide-out cart panel with full cart management
 * Implements clean UI with mobile-first responsive design
 * Integrated with Razorpay payment gateway
 */

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../services/shopify.service';
import { initRazorpayCheckout } from '../services/razorpay.service';
import { PaymentResult } from '../types/razorpay.types';
import { PaymentSuccess } from './PaymentSuccess';
import { PaymentFailure } from './PaymentFailure';

interface CartProps {
  darkMode: boolean;
}

type PaymentState = 'idle' | 'processing' | 'success' | 'failure';

export function Cart({ darkMode }: CartProps): JSX.Element {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    closeCart,
  } = useCart();

  const total = getCartTotal();
  const itemCount = getCartItemCount();

  // Payment state management
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  // Step 1: Handle quantity change with validation
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // Step 2: Handle backdrop click to close cart
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  // Step 3: Handle checkout with Razorpay
  const handleCheckout = async () => {
    if (itemCount === 0) return;

    setPaymentState('processing');

    try {
      // Get currency from first item (default to INR)
      const currency = cart.items[0]?.product.priceRange.minVariantPrice.currencyCode || 'INR';

      // Prepare customer details (can be fetched from user context in production)
      const customerDetails = {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '+919999999999',
      };

      // Initialize Razorpay checkout
      const result = await initRazorpayCheckout(total, currency, {
        name: 'Shopify Store',
        description: `Purchase of ${itemCount} item${itemCount > 1 ? 's' : ''}`,
        prefill: customerDetails,
        notes: {
          items: itemCount.toString(),
          total: total.toString(),
        },
      });

      setPaymentResult(result);

      if (result.success) {
        setPaymentState('success');
        // Clear cart on successful payment
        clearCart();
      } else {
        setPaymentState('failure');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentState('failure');
      setPaymentResult({
        success: false,
        amount: total,
        currency: cart.items[0]?.product.priceRange.minVariantPrice.currencyCode || 'INR',
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        timestamp: new Date(),
      });
    }
  };

  // Step 4: Handle payment success close
  const handleSuccessClose = () => {
    setPaymentState('idle');
    setPaymentResult(null);
    closeCart();
  };

  // Step 5: Handle payment failure close
  const handleFailureClose = () => {
    setPaymentState('idle');
    setPaymentResult(null);
  };

  // Step 6: Handle retry payment
  const handleRetryPayment = () => {
    setPaymentState('idle');
    setPaymentResult(null);
    handleCheckout();
  };

  // Step 3: Return null if cart is closed
  if (!cart.isOpen) {
    return <></>;
  }

  return (
    <>
      {/* Step 4: Backdrop overlay with accessibility */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Step 5: Cart panel with slide-in animation */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-full sm:w-96 z-50
          transform transition-transform duration-300 ease-in-out
          shadow-2xl flex flex-col
          ${darkMode ? 'bg-gray-800' : 'bg-white'}
        `}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Step 6: Cart Header */}
        <div
          className={`
            flex items-center justify-between p-4 sm:p-6 border-b
            ${darkMode ? 'border-gray-700' : 'border-gray-200'}
          `}
        >
          <h2
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Shopping Cart
            {itemCount > 0 && (
              <span
                className={`ml-2 text-base font-normal ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>

          <button
            onClick={closeCart}
            className={`
              p-2 rounded-full transition-colors
              focus:outline-none focus:ring-4
              ${
                darkMode
                  ? 'hover:bg-gray-700 focus:ring-gray-600'
                  : 'hover:bg-gray-100 focus:ring-gray-300'
              }
            `}
            aria-label="Close cart"
          >
            <svg
              className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Step 7: Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {cart.items.length === 0 ? (
            // Empty cart state
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className={`w-16 h-16 sm:w-20 sm:h-20 mb-4 ${
                  darkMode ? 'text-gray-600' : 'text-gray-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3
                className={`text-lg sm:text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Your cart is empty
              </h3>
              <p
                className={`text-sm sm:text-base ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Add some products to get started!
              </p>
            </div>
          ) : (
            // Cart items
            <ul className="space-y-4" role="list" aria-label="Cart items">
              {cart.items.map((item) => {
                const price = parseFloat(item.product.priceRange.minVariantPrice.amount);
                const itemTotal = price * item.quantity;
                const primaryImage = item.product.images[0];

                return (
                  <li
                    key={item.product.id}
                    className={`
                      flex gap-4 p-3 sm:p-4 rounded-lg border
                      ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}
                    `}
                    role="listitem"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-gray-200">
                      {primaryImage ? (
                        <img
                          src={primaryImage.url}
                          alt={primaryImage.altText || item.product.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}
                        >
                          <svg
                            className={`w-8 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
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
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3
                          className={`text-sm sm:text-base font-semibold mb-1 line-clamp-2 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {item.product.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {formatPrice(
                            item.product.priceRange.minVariantPrice.amount,
                            item.product.priceRange.minVariantPrice.currencyCode
                          )}{' '}
                          × {item.quantity}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className={`
                              w-8 h-8 rounded-md flex items-center justify-center
                              transition-colors focus:outline-none focus:ring-2
                              ${
                                darkMode
                                  ? 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500'
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-400'
                              }
                            `}
                            aria-label={`Decrease quantity of ${item.product.title}`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>

                          <span
                            className={`text-sm font-semibold w-8 text-center ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}
                            aria-label={`Quantity: ${item.quantity}`}
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className={`
                              w-8 h-8 rounded-md flex items-center justify-center
                              transition-colors focus:outline-none focus:ring-2
                              ${
                                darkMode
                                  ? 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500'
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-400'
                              }
                            `}
                            aria-label={`Increase quantity of ${item.product.title}`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              darkMode ? 'text-green-400' : 'text-green-600'
                            }`}
                          >
                            {formatPrice(
                              itemTotal.toString(),
                              item.product.priceRange.minVariantPrice.currencyCode
                            )}
                          </span>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className={`
                              p-1 rounded transition-colors
                              focus:outline-none focus:ring-2
                              ${
                                darkMode
                                  ? 'hover:bg-red-900/30 text-red-400 focus:ring-red-500'
                                  : 'hover:bg-red-50 text-red-600 focus:ring-red-300'
                              }
                            `}
                            aria-label={`Remove ${item.product.title} from cart`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Step 8: Cart Footer with Total and Actions */}
        {cart.items.length > 0 && (
          <div
            className={`
              border-t p-4 sm:p-6 space-y-4
              ${darkMode ? 'border-gray-700' : 'border-gray-200'}
            `}
          >
            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className={`
                w-full py-2 text-sm font-medium rounded-lg
                transition-colors focus:outline-none focus:ring-4
                ${
                  darkMode
                    ? 'text-red-400 hover:bg-red-900/20 focus:ring-red-500/50'
                    : 'text-red-600 hover:bg-red-50 focus:ring-red-300'
                }
              `}
              aria-label="Clear all items from cart"
            >
              Clear Cart
            </button>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span
                className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Total:
              </span>
              <span
                className={`text-2xl font-bold ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}
                aria-label={`Cart total: ${formatPrice(
                  total.toString(),
                  cart.items[0].product.priceRange.minVariantPrice.currencyCode
                )}`}
              >
                {formatPrice(
                  total.toString(),
                  cart.items[0].product.priceRange.minVariantPrice.currencyCode
                )}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={paymentState === 'processing'}
              className={`
                w-full py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg
                transition-colors focus:outline-none focus:ring-4
                flex items-center justify-center gap-2
                ${
                  paymentState === 'processing'
                    ? darkMode
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/50'
                    : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300'
                }
              `}
              aria-label={paymentState === 'processing' ? 'Processing payment' : 'Proceed to checkout'}
              aria-busy={paymentState === 'processing'}
            >
              {paymentState === 'processing' ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing Payment...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
          </div>
        )}
      </aside>

      {/* Step 7: Payment Success Modal */}
      {paymentState === 'success' && paymentResult && (
        <PaymentSuccess
          paymentResult={paymentResult}
          darkMode={darkMode}
          onClose={handleSuccessClose}
          onContinueShopping={handleSuccessClose}
        />
      )}

      {/* Step 8: Payment Failure Modal */}
      {paymentState === 'failure' && paymentResult && (
        <PaymentFailure
          paymentResult={paymentResult}
          darkMode={darkMode}
          onClose={handleFailureClose}
          onRetry={handleRetryPayment}
        />
      )}
    </>
  );
}

