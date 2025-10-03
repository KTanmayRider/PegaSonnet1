# Razorpay Integration Documentation

Complete guide for Razorpay Standard Checkout integration with secure payment processing, success/failure states, and mock data support.

## 🔑 Core Functions

### `initRazorpayCheckout(amount, currency, options)`

Initializes and opens the Razorpay checkout modal for payment processing.

**Parameters:**
- `amount` (number): Amount to charge (in main currency unit, e.g., 100 for ₹100)
- `currency` (string, optional): Currency code (default: 'INR')
- `options` (object, optional): Additional configuration
  - `name` (string): Merchant name
  - `description` (string): Payment description
  - `prefill` (object): Customer details (name, email, contact)
  - `notes` (object): Additional metadata

**Returns:** `Promise<PaymentResult>`
- `success` (boolean): Whether payment succeeded
- `paymentId` (string): Razorpay payment ID
- `orderId` (string): Order ID (if provided)
- `amount` (number): Payment amount
- `currency` (string): Currency code
- `error` (string): Error message (if failed)
- `timestamp` (Date): Transaction timestamp

**Usage Example:**
```typescript
import { initRazorpayCheckout } from './services/razorpay.service';

async function handlePayment() {
  try {
    const result = await initRazorpayCheckout(499, 'INR', {
      name: 'My Store',
      description: 'Purchase of 3 items',
      prefill: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '+919999999999',
      },
      notes: {
        items: '3',
        order_type: 'online',
      },
    });

    if (result.success) {
      console.log('Payment successful:', result.paymentId);
    } else {
      console.log('Payment failed:', result.error);
    }
  } catch (error) {
    console.error('Checkout error:', error);
  }
}
```

### `handlePaymentSuccess(response, amount, currency)`

Processes successful payment and returns payment result.

**Parameters:**
- `response` (RazorpaySuccessResponse): Response from Razorpay
- `amount` (number): Payment amount
- `currency` (string): Currency code

**Returns:** `PaymentResult` with success details

**Internal Usage:**
```typescript
// Called automatically by initRazorpayCheckout on success
const result = handlePaymentSuccess(
  {
    razorpay_payment_id: 'pay_xxx',
    razorpay_order_id: 'order_xxx',
  },
  499,
  'INR'
);
```

**What It Does:**
1. Logs payment details
2. Creates success PaymentResult object
3. Stores payment in localStorage history
4. Returns result for UI updates

### `handlePaymentFailure(error, amount, currency)`

Processes failed payment and returns failure result.

**Parameters:**
- `error` (RazorpayErrorResponse | Error | string): Error details
- `amount` (number): Attempted payment amount
- `currency` (string): Currency code

**Returns:** `PaymentResult` with failure details

**Internal Usage:**
```typescript
// Called automatically by initRazorpayCheckout on failure
const result = handlePaymentFailure(
  'Insufficient balance',
  499,
  'INR'
);
```

**What It Does:**
1. Parses error message
2. Logs failure details
3. Creates failure PaymentResult object
4. Returns result for UI updates

## 🔒 Secure API Key Management

### Environment Variables

Create a `.env` file in your project root:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
VITE_RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
```

### Security Best Practices

1. **Never commit `.env` file**
   - Already included in `.gitignore`
   - Share `.env.example` instead

2. **Use test keys in development**
   - Test keys: `rzp_test_`
   - Live keys: `rzp_live_`

3. **Production deployment**
   - Set environment variables on hosting platform
   - Never expose keys in client-side code
   - Key Secret should only be used on backend

4. **Access keys safely**
   ```typescript
   // Correct way (already implemented)
   const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
   
   // Never do this
   const key = 'rzp_test_xxxxxxxxxx'; // ❌ Hardcoded
   ```

## 🎨 Payment States

### State Management

The application uses four payment states:

1. **`idle`** - No payment in progress
2. **`processing`** - Payment is being processed
3. **`success`** - Payment completed successfully
4. **`failure`** - Payment failed or was cancelled

### State Flow

```
idle → (click checkout) → processing → success/failure → idle
```

### UI States

#### Processing State
- Checkout button shows spinner
- Button disabled
- Text: "Processing Payment..."
- ARIA: `aria-busy="true"`

#### Success State
- Green checkmark icon
- Payment ID and order ID displayed
- Amount confirmation
- "Continue Shopping" button
- Auto-clears cart

#### Failure State
- Red X icon
- Error message displayed
- Common failure reasons listed
- "Try Again" button
- Cart remains intact

## 🧪 Mock Payment Mode

### When Mock Mode is Used

Mock mode automatically activates when:
- Razorpay API keys are not configured
- `VITE_RAZORPAY_KEY_ID` is not set
- `VITE_RAZORPAY_KEY_SECRET` is not set

### Mock Mode Features

1. **Simulates Real Payment**
   - 2-second delay (network simulation)
   - 90% success rate
   - 10% failure rate (for testing)

2. **Mock Payment IDs**
   ```
   Payment ID: pay_mock_1234567890
   Order ID: order_mock_1234567890
   ```

3. **Console Logging**
   ```
   Using mock payment mode
   Payment Success: { ... }
   ```

4. **No External Dependencies**
   - Works without Razorpay account
   - Perfect for development
   - Great for testing flows

### Testing with Mock Mode

```typescript
// Just don't set the environment variables
// Mock mode will activate automatically

// Test success flow
await initRazorpayCheckout(100, 'INR');
// 90% chance of success

// Test failure handling
// Keep trying until you get a failure (10% chance)
```

## 🌐 Getting Razorpay API Keys

### Step 1: Sign Up

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create a free account
3. Verify your email

### Step 2: Get Test Keys

1. Navigate to **Settings** → **API Keys**
2. Click **Generate Test Keys**
3. Copy:
   - Key ID (starts with `rzp_test_`)
   - Key Secret (keep this secret!)

### Step 3: Configure Environment

Add to your `.env` file:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
VITE_RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

### Step 4: Test Payment

Use Razorpay test cards:

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure (Insufficient Funds):**
- Card: `4000 0000 0000 9995`

## 💳 Payment Flow

### Complete Flow Diagram

```
1. User adds items to cart
   ↓
2. User clicks "Proceed to Checkout"
   ↓
3. initRazorpayCheckout() called
   ↓
4. Check if Razorpay configured
   ├─ No → Use mock payment
   └─ Yes → Open Razorpay modal
   ↓
5. User enters payment details
   ↓
6. Payment processed
   ├─ Success → handlePaymentSuccess()
   │            - Show success modal
   │            - Clear cart
   │            - Store in history
   └─ Failure → handlePaymentFailure()
                - Show failure modal
                - Keep cart intact
                - Show retry option
```

### Integration in Cart Component

```typescript
const handleCheckout = async () => {
  setPaymentState('processing');
  
  try {
    const result = await initRazorpayCheckout(total, currency, {
      name: 'Shopify Store',
      description: `Purchase of ${itemCount} items`,
      prefill: customerDetails,
      notes: { items: itemCount.toString() },
    });
    
    if (result.success) {
      setPaymentState('success');
      clearCart();
    } else {
      setPaymentState('failure');
    }
  } catch (error) {
    setPaymentState('failure');
  }
};
```

## ♿ Accessibility Features

### ARIA Labels

- Checkout button: `aria-label="Proceed to checkout"`
- Processing state: `aria-busy="true"`
- Success modal: `role="dialog"` with `aria-modal="true"`
- Failure modal: `role="dialog"` with `aria-modal="true"`

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals (Razorpay native)

### Screen Reader Support

- Announces payment state changes
- Reads success/failure messages
- Describes payment IDs and amounts

## 📱 Mobile Responsive

### Payment Modals

- Full-screen on mobile (< 640px)
- Centered on desktop
- Touch-friendly buttons
- Comfortable padding

### Razorpay Checkout

- Native mobile optimization
- UPI support (India)
- Mobile wallets integration
- Responsive card input

## 🔄 Payment History

### Storing Payment Records

```typescript
// Get payment history
import { getPaymentHistory } from './services/razorpay.service';

const history = getPaymentHistory();
// Returns array of PaymentResult objects
```

### Clear History

```typescript
import { clearPaymentHistory } from './services/razorpay.service';

clearPaymentHistory();
```

### Storage Location

- Stored in `localStorage`
- Key: `payment_history`
- Format: JSON array
- Persists across sessions

## 🚀 Production Deployment

### Checklist

- [ ] Replace test keys with live keys
- [ ] Set environment variables on hosting
- [ ] Verify webhook endpoints (backend)
- [ ] Test with real cards (small amounts)
- [ ] Enable payment verification on backend
- [ ] Set up payment notifications
- [ ] Configure refund policies
- [ ] Add customer support contact

### Backend Integration

```typescript
// TODO: Implement backend verification
export async function verifyPayment(
  paymentId: string,
  orderId?: string,
  signature?: string
): Promise<boolean> {
  // Send to your backend API
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, orderId, signature }),
  });
  
  return response.ok;
}
```

### Backend Verification (Node.js Example)

```javascript
const crypto = require('crypto');

function verifyRazorpaySignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const body = orderId + '|' + paymentId;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  return expectedSignature === signature;
}
```

## 🐛 Troubleshooting

### Razorpay SDK Not Loading

**Error:** `Razorpay SDK not loaded`

**Solution:**
1. Check `index.html` has Razorpay script
2. Ensure script loads before app
3. Check browser console for errors

### Payment Not Opening

**Possible Causes:**
1. Invalid API keys
2. Browser popup blocked
3. SDK not loaded
4. Invalid amount (must be > 0)

**Solutions:**
1. Verify keys in `.env`
2. Allow popups for your domain
3. Check network tab for script load
4. Validate amount before calling

### Mock Mode Always Active

**Cause:** Environment variables not set

**Solution:**
1. Create `.env` file
2. Add Razorpay keys
3. Restart dev server
4. Check console for confirmation

### Payment Success but Cart Not Clearing

**Cause:** State management issue

**Solution:**
1. Check `handlePaymentSuccess` is called
2. Verify `clearCart()` is invoked
3. Check console for errors

## 📊 Testing Checklist

- [ ] Test successful payment
- [ ] Test payment failure
- [ ] Test payment cancellation
- [ ] Test with mock mode
- [ ] Test with real Razorpay
- [ ] Test on mobile devices
- [ ] Test keyboard navigation
- [ ] Test screen reader
- [ ] Test dark mode
- [ ] Test error states
- [ ] Test retry functionality
- [ ] Test cart clearing

## 🔐 Security Considerations

### Client-Side Security

✅ **What We Do:**
- Store keys in environment variables
- Never expose in source code
- Use HTTPS in production
- Sanitize user inputs

❌ **Never Do:**
- Hardcode API keys
- Commit `.env` file
- Log sensitive data
- Store card details

### Backend Requirements

For production, implement:
1. Payment signature verification
2. Webhook handling
3. Order management
4. Refund processing
5. Fraud detection
6. Rate limiting

## 📚 Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Standard Checkout Guide](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [API Reference](https://razorpay.com/docs/api/)

---

Built with security and user experience in mind 🔒

