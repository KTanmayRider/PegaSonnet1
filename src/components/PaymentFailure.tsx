/**
 * PaymentFailure Component
 * Displays payment failure message with retry option
 * Accessible and mobile-responsive design
 */

import { PaymentResult } from '../types/razorpay.types';
import { formatPaymentAmount } from '../services/razorpay.service';

interface PaymentFailureProps {
  paymentResult: PaymentResult;
  darkMode: boolean;
  onClose: () => void;
  onRetry?: () => void;
}

export function PaymentFailure({
  paymentResult,
  darkMode,
  onClose,
  onRetry,
}: PaymentFailureProps): JSX.Element {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      role="dialog"
      aria-labelledby="payment-failure-title"
      aria-modal="true"
    >
      <div
        className={`
          max-w-md w-full rounded-xl shadow-2xl p-6 sm:p-8
          ${darkMode ? 'bg-gray-800' : 'bg-white'}
        `}
        role="document"
      >
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-red-500"
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
          </div>
        </div>

        {/* Failure Message */}
        <h2
          id="payment-failure-title"
          className={`text-2xl sm:text-3xl font-bold text-center mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Payment Failed
        </h2>

        <p
          className={`text-center mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {paymentResult.error || 'We were unable to process your payment. Please try again.'}
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
              className={`font-semibold ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              Attempted Amount:
            </span>
            <span className="text-xl font-bold text-red-500">
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

        {/* Common Reasons */}
        <div
          className={`
            rounded-lg p-4 mb-6
            ${darkMode ? 'bg-yellow-900/20 border border-yellow-700/50' : 'bg-yellow-50 border border-yellow-200'}
          `}
        >
          <h3
            className={`text-sm font-semibold mb-2 ${
              darkMode ? 'text-yellow-400' : 'text-yellow-800'
            }`}
          >
            Common reasons for payment failure:
          </h3>
          <ul
            className={`text-xs space-y-1 list-disc list-inside ${
              darkMode ? 'text-yellow-300/80' : 'text-yellow-700'
            }`}
          >
            <li>Insufficient funds in account</li>
            <li>Incorrect card details or CVV</li>
            <li>Card expired or blocked</li>
            <li>Bank server temporarily unavailable</li>
            <li>Payment cancelled by user</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`
                w-full py-3 sm:py-4 rounded-lg font-semibold text-base
                transition-colors focus:outline-none focus:ring-4
                ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/50'
                    : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300'
                }
              `}
              aria-label="Retry payment"
            >
              Try Again
            </button>
          )}

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

        {/* Support Note */}
        <p
          className={`text-xs text-center mt-6 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          If the problem persists, please contact our support team.
        </p>
      </div>
    </div>
  );
}

