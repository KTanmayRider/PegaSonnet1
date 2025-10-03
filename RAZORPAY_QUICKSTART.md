# Razorpay Quick Start Guide

Get started with Razorpay payment integration in 5 minutes.

## 🚀 Quick Setup

### Option 1: Mock Mode (No Configuration Required)

Just run the app - payments work automatically in mock mode!

```bash
npm install
npm run dev
```

**Features:**
- ✅ No API keys needed
- ✅ 90% success rate for testing
- ✅ 10% failure rate for testing
- ✅ Simulates 2-second processing
- ✅ Full success/failure UI

### Option 2: Real Razorpay Integration

1. **Get Razorpay Keys (2 minutes)**
   - Sign up: https://dashboard.razorpay.com/
   - Settings → API Keys → Generate Test Keys
   - Copy Key ID and Key Secret

2. **Add to `.env` file**
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
   VITE_RAZORPAY_KEY_SECRET=your_key_secret
   ```

3. **Restart server**
   ```bash
   npm run dev
   ```

## 💳 Testing Payments

### With Mock Mode

1. Add products to cart
2. Click "Proceed to Checkout"
3. Wait 2 seconds
4. See success (90%) or failure (10%)

### With Real Razorpay

1. Add products to cart
2. Click "Proceed to Checkout"
3. Use test cards:
   - **Success:** `4111 1111 1111 1111`
   - **Failure:** `4000 0000 0000 9995`
4. CVV: Any 3 digits
5. Expiry: Any future date

## 📋 Core Functions Reference

### Initialize Payment

```typescript
import { initRazorpayCheckout } from './services/razorpay.service';

const result = await initRazorpayCheckout(
  499,        // amount in main currency (₹499)
  'INR',      // currency code
  {
    name: 'My Store',
    description: 'Product purchase',
    prefill: {
      name: 'Customer Name',
      email: 'customer@example.com',
      contact: '+919999999999',
    },
  }
);

if (result.success) {
  console.log('Payment ID:', result.paymentId);
} else {
  console.log('Error:', result.error);
}
```

### Check Payment Success

```typescript
// Result object structure
{
  success: true,
  paymentId: 'pay_xxx',
  orderId: 'order_xxx',
  amount: 499,
  currency: 'INR',
  timestamp: Date
}
```

### Check Payment Failure

```typescript
// Result object structure
{
  success: false,
  amount: 499,
  currency: 'INR',
  error: 'Payment cancelled by user',
  timestamp: Date
}
```

## 🎨 Payment Flow

```
1. User clicks "Proceed to Checkout"
   ↓
2. handleCheckout() called
   ↓
3. Payment state → 'processing'
   ↓
4. initRazorpayCheckout() opens modal
   ↓
5. User completes payment
   ↓
6a. Success → handlePaymentSuccess()
    - Show success modal
    - Clear cart
    - Store payment history
    
6b. Failure → handlePaymentFailure()
    - Show failure modal
    - Keep cart intact
    - Allow retry
```

## ✅ What's Already Integrated

- ✅ Razorpay SDK loaded in `index.html`
- ✅ Payment service with 3 core functions
- ✅ Success modal component
- ✅ Failure modal component
- ✅ Cart integration complete
- ✅ Processing state with spinner
- ✅ Mock mode fallback
- ✅ Type-safe TypeScript
- ✅ Full accessibility
- ✅ Mobile responsive
- ✅ Dark mode support

## 🔐 Security Checklist

### Development
- [x] Keys in environment variables
- [x] `.env` in `.gitignore`
- [x] Using test keys (`rzp_test_`)
- [x] No hardcoded credentials

### Production
- [ ] Replace with live keys (`rzp_live_`)
- [ ] Set keys on hosting platform
- [ ] Enable webhook verification
- [ ] Add backend payment verification
- [ ] Test with small real amounts
- [ ] Monitor transaction logs

## 🎯 Common Use Cases

### Basic Payment

```typescript
await initRazorpayCheckout(100, 'INR');
```

### With Customer Details

```typescript
await initRazorpayCheckout(299, 'INR', {
  name: 'My Shop',
  prefill: {
    name: 'John Doe',
    email: 'john@example.com',
  },
});
```

### With Order Metadata

```typescript
await initRazorpayCheckout(999, 'INR', {
  description: 'Premium Plan',
  notes: {
    plan: 'premium',
    duration: '1 year',
  },
});
```

## 🐛 Troubleshooting

### Mock Mode Always Active?

✅ **Solution:** Check `.env` file exists and has correct keys

```env
VITE_RAZORPAY_KEY_ID=rzp_test_...
VITE_RAZORPAY_KEY_SECRET=...
```

### Payment Modal Not Opening?

✅ **Check:**
1. Razorpay script loaded in `index.html`
2. Browser console for errors
3. Amount is greater than 0
4. No popup blockers active

### Payment Success but Cart Not Clearing?

✅ **Solution:** This is expected in mock failure mode (10% of time). Try again!

## 📚 Documentation

- **Full docs:** [RAZORPAY_DOCUMENTATION.md](./RAZORPAY_DOCUMENTATION.md)
- **API reference:** [Razorpay Docs](https://razorpay.com/docs/)
- **Cart docs:** [CART_DOCUMENTATION.md](./CART_DOCUMENTATION.md)

## 🎉 You're Ready!

The integration is complete and ready to use. Just:

1. Add items to cart
2. Click checkout
3. See it work in mock mode
4. Add real keys when ready

Happy coding! 💙

