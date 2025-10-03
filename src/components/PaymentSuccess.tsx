/**
 * PaymentSuccess Component
 * Displays successful payment confirmation with order details
 * Accessible and mobile-responsive design
 */

import { PaymentResult } from '../types/razorpay.types';
import { formatPaymentAmount } from '../services/razorpay.service';

interface PaymentSuccessProps {
  paymentResult: PaymentResult;
  darkMode: boolean;
  onClose: () => void;
  onContinueShopping?: () => void;
}

export function PaymentSuccess({
  paymentResult,
  darkMode,
  onClose,
  onContinueShopping,
}: PaymentSuccessProps): JSX.Element {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      role="dialog"
      aria-labelledby="payment-success-title"
      aria-modal="true"
    >
      <div
        className={`
          max-w-md w-full rounded-xl shadow-2xl p-6 sm:p-8
          ${darkMode ? 'bg-gray-800' : 'bg-white'}
        `}
        role="document"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h2
          id="payment-success-title"
          className={`text-2xl sm:text-3xl font-bold text-center mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Payment Successful!
        </h2>

        <p
          className={`text-center mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Payment Details */}
        <div
          className={`
            rounded-lg p-4 sm:p-6 mb-6 space-y-3
            ${darkMode ? 'bg-gray-750 border border-gray-700' : 'bg-gray-50 border border-gray-200'}
          `}
        >
          <div className="flex justify-between">
            <span
              className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Payment ID:
            </span>
            <span
              className={`text-sm font-mono ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              {paymentResult.paymentId || 'N/A'}
            </span>
          </div>

          {paymentResult.orderId && (
            <div className="flex justify-between">
              <span
                className={`text-sm font-medium ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Order ID:
              </span>
              <span
                className={`text-sm font-mono ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}
              >
                {paymentResult.orderId}
              </span>
            </div>
          )}

          <div className="flex justify-between pt-3 border-t border-gray-300 dark:border-gray-600">
            <span
              className={`font-semibold ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              Amount Paid:
            </span>
            <span className="text-xl font-bold text-green-500">
              {formatPaymentAmount(paymentResult.amount, paymentResult.currency)}
            </span>
          </div>

          <div className="flex justify-between">
            <span
              className={`text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Date & Time:
            </span>
            <span
              className={`text-sm ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              {new Date(paymentResult.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onContinueShopping || onClose}
            className={`
              w-full py-3 sm:py-4 rounded-lg font-semibold text-base
              transition-colors focus:outline-none focus:ring-4
              ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/50'
                  : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300'
              }
            `}
            aria-label="Continue shopping"
          >
            Continue Shopping
          </button>

          <button
            onClick={onClose}
            className={`
              w-full py-2 sm:py-3 rounded-lg font-medium text-base
              transition-colors focus:outline-none focus:ring-4
              ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-700 focus:ring-gray-600'
                  : 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300'
              }
            `}
            aria-label="Close dialog"
          >
            Close
          </button>
        </div>

        {/* Order Confirmation Note */}
        <p
          className={`text-xs text-center mt-6 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}

