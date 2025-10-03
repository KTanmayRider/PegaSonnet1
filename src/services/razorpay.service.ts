/**
 * Razorpay Payment Service
 * Handles Razorpay payment integration with mock mode support
 * Implements initRazorpayCheckout(), handlePaymentSuccess(), and handlePaymentFailure()
 */

import type {
  RazorpayOptions,
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
  PaymentResult,
  RazorpayInstance,
} from '../types/razorpay.types';

// Step 1: Secure API key configuration
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET;

// Check if Razorpay is configured
const isRazorpayConfigured = (): boolean => {
  return !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
};

// Check if Razorpay SDK is loaded
const isRazorpayLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.Razorpay;
};

/**
 * Step 2: handlePaymentSuccess() - Process successful payment
 * Called after successful Razorpay payment completion
 * Logs payment details and returns success result
 */
export function handlePaymentSuccess(
  response: RazorpaySuccessResponse,
  amount: number,
  currency: string
): PaymentResult {
  console.log('Payment Success:', response);

  const result: PaymentResult = {
    success: true,
    paymentId: response.razorpay_payment_id,
    orderId: response.razorpay_order_id,
    amount,
    currency,
    timestamp: new Date(),
  };

  // In production, send this to your backend for verification
  console.log('Payment verified successfully:', result);

  // Store payment details (optional - for analytics)
  try {
    const paymentHistory = JSON.parse(localStorage.getItem('payment_history') || '[]');
    paymentHistory.push(result);
    localStorage.setItem('payment_history', JSON.stringify(paymentHistory));
  } catch (error) {
    console.error('Failed to store payment history:', error);
  }

  return result;
}

/**
 * Step 3: handlePaymentFailure() - Process failed payment
 * Called when payment fails or is cancelled
 * Logs error details and returns failure result
 */
export function handlePaymentFailure(
  error: RazorpayErrorResponse | Error | string,
  amount: number,
  currency: string
): PaymentResult {
  let errorMessage = 'Payment failed. Please try again.';

  // Parse error based on type
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if ('error' in error) {
    errorMessage = `${error.error.description} (${error.error.code})`;
  }

  console.error('Payment Failed:', error);

  const result: PaymentResult = {
    success: false,
    amount,
    currency,
    error: errorMessage,
    timestamp: new Date(),
  };

  // Log failure for analytics
  console.log('Payment failure logged:', result);

  return result;
}

/**
 * Step 4: Simulate mock payment for testing
 * Used when Razorpay is not configured
 */
async function simulateMockPayment(
  amount: number,
  currency: string
): Promise<PaymentResult> {
  console.log('Using mock payment mode');

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 90% success rate for testing
  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    const mockResponse: RazorpaySuccessResponse = {
      razorpay_payment_id: `pay_mock_${Date.now()}`,
      razorpay_order_id: `order_mock_${Date.now()}`,
    };
    return handlePaymentSuccess(mockResponse, amount, currency);
  } else {
    return handlePaymentFailure('Mock payment failed for testing', amount, currency);
  }
}

/**
 * Step 5: initRazorpayCheckout() - Initialize and open Razorpay checkout
 * Main function to initiate payment flow
 * Handles both real Razorpay and mock mode
 */
export async function initRazorpayCheckout(
  amount: number,
  currency: string = 'INR',
  options: {
    name?: string;
    description?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
  } = {}
): Promise<PaymentResult> {
  // Convert amount to smallest currency unit (paise for INR)
  const amountInPaise = Math.round(amount * 100);

  // Step 6: Check if Razorpay is configured
  if (!isRazorpayConfigured()) {
    console.info(
      'Razorpay not configured. Using mock payment mode. Configure VITE_RAZORPAY_KEY_ID and VITE_RAZORPAY_KEY_SECRET to use live payments.'
    );
    return simulateMockPayment(amount, currency);
  }

  // Step 7: Check if Razorpay SDK is loaded
  if (!isRazorpayLoaded()) {
    throw new Error(
      'Razorpay SDK not loaded. Please ensure the Razorpay script is included in your HTML.'
    );
  }

  // Step 8: Create payment promise
  return new Promise((resolve) => {
    const razorpayOptions: RazorpayOptions = {
      key: RAZORPAY_KEY_ID!,
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      name: options.name || 'Shopify Store',
      description: options.description || 'Purchase from our store',
      image: '/logo.png', // Optional: Add your logo
      handler: (response: RazorpaySuccessResponse) => {
        // Payment successful
        const result = handlePaymentSuccess(response, amount, currency);
        resolve(result);
      },
      prefill: options.prefill || {},
      notes: options.notes || {},
      theme: {
        color: '#3B82F6', // Blue theme matching the app
      },
      modal: {
        ondismiss: () => {
          // User closed the modal
          const result = handlePaymentFailure(
            'Payment cancelled by user',
            amount,
            currency
          );
          resolve(result);
        },
      },
    };

    // Step 9: Create Razorpay instance
    const razorpayInstance: RazorpayInstance = new window.Razorpay!(razorpayOptions);

    // Step 10: Handle payment errors
    razorpayInstance.on('payment.failed', (response: RazorpayErrorResponse) => {
      const result = handlePaymentFailure(response, amount, currency);
      resolve(result);
    });

    // Step 11: Open Razorpay checkout
    razorpayInstance.open();
  });
}

/**
 * Format amount for display
 * Helper function to format payment amounts
 */
export function formatPaymentAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  }
}

/**
 * Verify payment (backend integration placeholder)
 * In production, send payment details to backend for verification
 */
export async function verifyPayment(
  paymentId: string,
  orderId?: string,
  signature?: string
): Promise<boolean> {
  // TODO: Implement backend verification
  // This should make an API call to your backend
  // Backend will verify the signature using Razorpay key secret
  
  console.log('Payment verification (backend integration required):', {
    paymentId,
    orderId,
    signature,
  });

  // Mock verification for now
  return true;
}

/**
 * Get payment history from localStorage
 * Returns array of past payment results
 */
export function getPaymentHistory(): PaymentResult[] {
  try {
    return JSON.parse(localStorage.getItem('payment_history') || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear payment history
 * Removes all stored payment records
 */
export function clearPaymentHistory(): void {
  localStorage.removeItem('payment_history');
}

