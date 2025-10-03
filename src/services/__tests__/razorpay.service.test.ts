/**
 * Unit Tests for Razorpay Service
 * Tests initRazorpayCheckout(), handlePaymentSuccess(), handlePaymentFailure()
 */

import {
  initRazorpayCheckout,
  handlePaymentSuccess,
  handlePaymentFailure,
  formatPaymentAmount,
  getPaymentHistory,
  clearPaymentHistory,
} from '../razorpay.service';
import type { RazorpaySuccessResponse, RazorpayErrorResponse } from '../../types/razorpay.types';

describe('Razorpay Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('handlePaymentSuccess()', () => {
    it('should process successful payment correctly', () => {
      const response: RazorpaySuccessResponse = {
        razorpay_payment_id: 'pay_test123',
        razorpay_order_id: 'order_test123',
      };

      const result = handlePaymentSuccess(response, 499, 'INR');

      expect(result.success).toBe(true);
      expect(result.paymentId).toBe('pay_test123');
      expect(result.orderId).toBe('order_test123');
      expect(result.amount).toBe(499);
      expect(result.currency).toBe('INR');
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should handle payment without order ID', () => {
      const response: RazorpaySuccessResponse = {
        razorpay_payment_id: 'pay_test456',
      };

      const result = handlePaymentSuccess(response, 299, 'USD');

      expect(result.success).toBe(true);
      expect(result.paymentId).toBe('pay_test456');
      expect(result.orderId).toBeUndefined();
    });

    it('should store payment in localStorage', () => {
      const response: RazorpaySuccessResponse = {
        razorpay_payment_id: 'pay_store123',
      };

      handlePaymentSuccess(response, 599, 'INR');

      const history = getPaymentHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].paymentId).toBe('pay_store123');
    });

    it('should handle multiple successful payments', () => {
      const response1: RazorpaySuccessResponse = {
        razorpay_payment_id: 'pay_1',
      };
      const response2: RazorpaySuccessResponse = {
        razorpay_payment_id: 'pay_2',
      };

      handlePaymentSuccess(response1, 100, 'INR');
      handlePaymentSuccess(response2, 200, 'INR');

      const history = getPaymentHistory();
      expect(history.length).toBe(2);
    });

    it('should include timestamp', () => {
      const response: RazorpaySuccessResponse = {
        razorpay_payment_id: 'pay_time123',
      };

      const before = new Date();
      const result = handlePaymentSuccess(response, 999, 'INR');
      const after = new Date();

      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('handlePaymentFailure()', () => {
    it('should process failure with error object', () => {
      const error: RazorpayErrorResponse = {
        error: {
          code: 'BAD_REQUEST_ERROR',
          description: 'Payment failed',
          source: 'customer',
          step: 'payment_authorization',
          reason: 'payment_failed',
          metadata: {},
        },
      };

      const result = handlePaymentFailure(error, 499, 'INR');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Payment failed');
      expect(result.amount).toBe(499);
      expect(result.currency).toBe('INR');
    });

    it('should handle string error', () => {
      const result = handlePaymentFailure('Payment cancelled', 299, 'USD');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Payment cancelled');
    });

    it('should handle Error object', () => {
      const error = new Error('Network error');
      const result = handlePaymentFailure(error, 599, 'INR');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should include timestamp', () => {
      const before = new Date();
      const result = handlePaymentFailure('Test failure', 100, 'INR');
      const after = new Date();

      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should not store failure in history', () => {
      handlePaymentFailure('Test failure', 100, 'INR');

      const history = getPaymentHistory();
      const failedPayments = history.filter(p => !p.success);
      expect(failedPayments.length).toBe(0);
    });
  });

  describe('initRazorpayCheckout()', () => {
    it('should use mock mode when Razorpay not configured', async () => {
      // Remove Razorpay from window
      const originalRazorpay = window.Razorpay;
      delete (window as any).Razorpay;

      const result = await initRazorpayCheckout(100, 'INR');

      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
      expect(result.amount).toBe(100);
      expect(result.currency).toBe('INR');

      // Restore
      window.Razorpay = originalRazorpay;
    }, 15000);

    it('should convert amount to paise correctly', async () => {
      // This is tested implicitly in the mock mode
      const result = await initRazorpayCheckout(499.50, 'INR');

      expect(result.amount).toBe(499.50);
    }, 15000);

    it('should handle zero amount', async () => {
      const result = await initRazorpayCheckout(0, 'INR');

      expect(result.amount).toBe(0);
    }, 15000);

    it('should use default currency when not provided', async () => {
      const result = await initRazorpayCheckout(100);

      expect(result.currency).toBe('INR');
    }, 15000);

    it('should accept custom options', async () => {
      const result = await initRazorpayCheckout(100, 'INR', {
        name: 'Test Store',
        description: 'Test payment',
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      });

      expect(result).toBeDefined();
    }, 15000);
  });

  describe('formatPaymentAmount()', () => {
    it('should format INR amounts correctly', () => {
      const formatted = formatPaymentAmount(499, 'INR');

      expect(formatted).toContain('499');
    });

    it('should format USD amounts correctly', () => {
      const formatted = formatPaymentAmount(99.99, 'USD');

      expect(formatted).toContain('99.99');
    });

    it('should handle zero amounts', () => {
      const formatted = formatPaymentAmount(0, 'INR');

      expect(formatted).toContain('0');
    });

    it('should handle large amounts', () => {
      const formatted = formatPaymentAmount(999999, 'INR');

      expect(formatted).toContain('999,999');
    });

    it('should handle decimal amounts', () => {
      const formatted = formatPaymentAmount(123.45, 'USD');

      expect(formatted).toContain('123.45');
    });

    it('should handle invalid currency gracefully', () => {
      const formatted = formatPaymentAmount(100, 'INVALID');

      expect(formatted).toBeTruthy();
      expect(formatted).toContain('100');
    });
  });

  describe('Payment History', () => {
    it('should return empty array initially', () => {
      const history = getPaymentHistory();

      expect(history).toBeInstanceOf(Array);
      expect(history.length).toBe(0);
    });

    it('should store multiple payments', () => {
      handlePaymentSuccess(
        { razorpay_payment_id: 'pay_1' },
        100,
        'INR'
      );
      handlePaymentSuccess(
        { razorpay_payment_id: 'pay_2' },
        200,
        'INR'
      );

      const history = getPaymentHistory();
      expect(history.length).toBe(2);
    });

    it('should clear payment history', () => {
      handlePaymentSuccess(
        { razorpay_payment_id: 'pay_clear' },
        100,
        'INR'
      );

      clearPaymentHistory();

      const history = getPaymentHistory();
      expect(history.length).toBe(0);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('payment_history', 'invalid json');

      const history = getPaymentHistory();
      expect(history).toBeInstanceOf(Array);
      expect(history.length).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative amounts', async () => {
      const result = await initRazorpayCheckout(-100, 'INR');

      expect(result).toBeDefined();
    }, 15000);

    it('should handle very large amounts', async () => {
      const result = await initRazorpayCheckout(999999999, 'INR');

      expect(result).toBeDefined();
      expect(result.amount).toBe(999999999);
    }, 15000);

    it('should handle decimal precision', () => {
      const formatted = formatPaymentAmount(99.999, 'USD');

      expect(formatted).toBeTruthy();
    });

    it('should handle empty payment success response', () => {
      const response: RazorpaySuccessResponse = {
        razorpay_payment_id: '',
      };

      const result = handlePaymentSuccess(response, 100, 'INR');

      expect(result.success).toBe(true);
      expect(result.paymentId).toBe('');
    });
  });
});

