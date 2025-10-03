# Quick Setup Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000` with **mock product data** automatically loaded.

### 3. (Optional) Configure Shopify API

To use real Shopify data, create a `.env` file:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
```

## ✅ What You Get

- ✅ **`fetchProducts()`** - Production-ready function with error handling
- ✅ **`renderProductGrid()`** - Accessible, responsive product grid
- ✅ **`addToCart()`** - Add products with clean duplicate handling
- ✅ **`getCartTotal()`** - Calculate cart total with accurate math
- ✅ **`initRazorpayCheckout()`** - Secure payment processing
- ✅ **Shopping Cart** - Full-featured cart with slide-out panel
- ✅ **Payment Gateway** - Razorpay integration with mock mode
- ✅ **Cart Badge** - Real-time item count display
- ✅ **Loading States** - Smooth loading indicators
- ✅ **Error Handling** - User-friendly error messages with retry
- ✅ **Accessibility** - WCAG 2.1 AA compliant with ARIA labels
- ✅ **Dark Mode** - Toggle button with smooth transitions
- ✅ **Mobile Responsive** - Mobile-first design with Tailwind
- ✅ **Mock Data** - 6 realistic products with images
- ✅ **Secure API Keys** - Environment variable configuration
- ✅ **TypeScript** - Full type safety throughout

## 🎨 Features

### Core Functions

**`fetchProducts(options?)`**
- Fetches from Shopify API or uses mock data
- Options: `limit`, `after`, `sortKey`
- Returns: `Promise<ProductsResponse>`
- Error handling with typed errors

**`renderProductGrid(products, darkMode)`**
- Renders responsive product grid
- Accessibility with ARIA labels
- Mobile-first responsive design
- Returns: `JSX.Element | null`

**`addToCart(product, quantity?)`**
- Adds product to shopping cart
- Handles duplicates automatically
- Updates cart badge in real-time
- Type-safe with TypeScript

**`getCartTotal()`**
- Calculates total cart value
- Returns accurate decimal total
- Handles empty cart gracefully
- Sum of (price × quantity)

**`initRazorpayCheckout(amount, currency, options?)`**
- Opens Razorpay payment checkout
- Handles success and failure states
- Mock mode when not configured
- Secure payment processing

### Accessibility Features

- Semantic HTML (`header`, `main`, `nav`, `article`)
- ARIA labels on all interactive elements
- Keyboard navigation with visible focus
- Screen reader announcements
- Color contrast WCAG AA compliant
- Alt text on all images

### Mobile Responsive

- Mobile-first Tailwind classes
- Breakpoints: Mobile < 640px, Tablet < 1024px
- Touch-friendly buttons (min 44x44px)
- Hamburger menu for mobile navigation
- Responsive typography and spacing

## 📦 Production Build

```bash
npm run build
```

Deploy the `dist` folder to:
- Vercel
- Netlify
- AWS Amplify
- Cloudflare Pages

## 🔑 Getting API Credentials

### Shopify (Optional)

1. Shopify Admin → **Apps** → **Develop apps**
2. **Create an app**
3. Configure **Storefront API** scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
4. Install app and copy credentials

### Razorpay (Optional)

1. Sign up at [Razorpay](https://dashboard.razorpay.com/)
2. **Settings** → **API Keys** → **Generate Test Keys**
3. Copy Key ID and Key Secret
4. Add to `.env` file

**Test Cards:**
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 9995`

## 💡 Tips

- **No API Keys?** The app works perfectly with mock data and mock payments
- **Shopping Cart:** Click cart icon to open/close
- **Add to Cart:** Click blue buttons on product cards
- **Checkout:** Click "Proceed to Checkout" in cart
- **Mock Payment:** 90% success rate, 10% failure (for testing)
- **Cart Badge:** Shows item count in real-time
- **Dark Mode:** Toggle button in top-right corner
- **Mobile:** Hamburger menu appears on small screens
- **Accessibility:** Full keyboard navigation support
- **Performance:** Images lazy load automatically

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Edit vite.config.ts to change port
server: { port: 3001 }
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API not working?**
- Check your `.env` file format
- Verify Storefront API is enabled
- Check network tab for errors
- App falls back to mock data automatically

---

Happy coding! 🎉

