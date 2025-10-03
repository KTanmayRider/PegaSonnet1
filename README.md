# Shopify Storefront - React TypeScript

A production-ready, fully accessible React TypeScript storefront powered by Shopify Storefront API with comprehensive mock data support.

## 🚀 Features

- **🛍️ Shopify Integration**: Full Shopify Storefront API integration with GraphQL
- **🛒 Shopping Cart**: Full-featured cart with addToCart() and getCartTotal() functions
- **💳 Razorpay Payments**: Integrated payment gateway with initRazorpayCheckout()
- **♿ Accessibility First**: WCAG 2.1 AA compliant with ARIA labels, semantic HTML, and keyboard navigation
- **📱 Mobile Responsive**: Mobile-first design with Tailwind CSS
- **🌓 Dark Mode**: Elegant dark mode toggle with smooth transitions
- **⚡ Performance**: Optimized with lazy loading, efficient state management
- **🔒 Secure**: Environment-based API key handling
- **🎨 Modern UI**: Clean, professional design with smooth animations
- **🧪 Mock Data**: Built-in mock data for development and testing
- **♻️ Error Handling**: Comprehensive error handling with user-friendly messages
- **🔄 Loading States**: Smooth loading indicators for better UX
- **🧪 Unit Tests**: 150+ tests with Jest & React Testing Library
- **🔬 Test Coverage**: 90%+ coverage across all modules

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- (Optional) Shopify store with Storefront API access

## 🛠️ Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Configure API Keys (Optional):**

Create a `.env` file in the root directory:

```env
# Shopify (optional - uses mock data if not provided)
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token

# Razorpay (optional - uses mock payment if not provided)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
VITE_RAZORPAY_KEY_SECRET=your_key_secret
```

**Note:** If you don't provide API credentials, the app will automatically use mock data and mock payments.

3. **Start development server:**

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:ci` - Run tests in CI mode

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ProductGrid.tsx  # Product grid with renderProductGrid()
│   ├── Cart.tsx         # Shopping cart panel
│   ├── LoadingSpinner.tsx
│   └── ErrorDisplay.tsx
├── context/            # React Context providers
│   └── CartContext.tsx  # Cart state with addToCart() & getCartTotal()
├── services/           # API and business logic
│   └── shopify.service.ts  # fetchProducts() and API calls
├── types/              # TypeScript type definitions
│   ├── shopify.types.ts
│   └── cart.types.ts
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind
```

## 🔑 Key Functions

### `fetchProducts(options?)`

Fetches products from Shopify Storefront API or returns mock data.

```typescript
import { fetchProducts } from './services/shopify.service';

// Fetch up to 20 products
const response = await fetchProducts({ limit: 20 });
```

**Features:**
- Automatic fallback to mock data
- Comprehensive error handling
- GraphQL query construction
- TypeScript type safety

### `renderProductGrid(products, darkMode)`

Renders a responsive grid of product cards with full accessibility support.

```typescript
import { renderProductGrid } from './components/ProductGrid';

// Render products in a grid
const grid = renderProductGrid(products, darkMode);
```

**Features:**
- Mobile-first responsive design
- ARIA labels and semantic HTML
- Loading and empty states
- Dark mode support

### `addToCart(product, quantity?)`

Adds a product to the shopping cart with clean duplicate handling.

```typescript
import { useCart } from './context/CartContext';

function MyComponent() {
  const { addToCart } = useCart();
  
  // Add 1 item
  addToCart(product);
  
  // Add multiple items
  addToCart(product, 5);
}
```

**Features:**
- Duplicate detection and quantity merging
- Type-safe operations
- Automatic badge updates
- Clean cart logic

### `getCartTotal()`

Calculates the total price of all items in the cart.

```typescript
import { useCart } from './context/CartContext';

function CartSummary() {
  const { getCartTotal } = useCart();
  const total = getCartTotal();
  
  return <div>Total: ${total.toFixed(2)}</div>;
}
```

**Features:**
- Accurate decimal calculations
- Handles empty cart
- Sum of (price × quantity) for all items
- Type-safe number operations

### `initRazorpayCheckout(amount, currency, options?)`

Initializes Razorpay payment checkout for secure transactions.

```typescript
import { initRazorpayCheckout } from './services/razorpay.service';

async function checkout() {
  const result = await initRazorpayCheckout(499, 'INR', {
    name: 'My Store',
    description: 'Purchase of 3 items',
    prefill: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  });
  
  if (result.success) {
    console.log('Payment successful:', result.paymentId);
  }
}
```

**Features:**
- Secure payment processing
- Mock mode when keys not configured
- Success and failure handling
- Payment history tracking

## ♿ Accessibility Features

- **Semantic HTML**: Proper use of `header`, `main`, `nav`, `footer`, `article`
- **ARIA Labels**: Descriptive labels for interactive elements
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Reader Support**: Live regions and status updates
- **Color Contrast**: WCAG AA compliant color ratios
- **Focus Management**: Logical focus order and visible focus states

## 🎨 Design System

### Breakpoints (Tailwind)
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Color Palette
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Dark Mode: Gray scale with blue accents

## 🔒 Security

- Environment variables for API credentials
- Never commits `.env` files
- Secure API key handling
- Input validation and sanitization
- HTTPS required for production

## 🚀 Production Deployment

1. **Build the application:**

```bash
npm run build
```

2. **Set environment variables** on your hosting platform:
   - `VITE_SHOPIFY_STORE_DOMAIN`
   - `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

3. **Deploy the `dist` folder** to your hosting provider

### Recommended Platforms
- Vercel
- Netlify
- AWS Amplify
- Cloudflare Pages

## 📦 Getting API Credentials

### Shopify API (Optional)

1. Go to your Shopify Admin
2. Navigate to **Apps > Develop apps**
3. Click **Create an app**
4. Configure **Storefront API** scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
5. Install the app and copy:
   - Store domain (e.g., `your-store.myshopify.com`)
   - Storefront access token

### Razorpay Payment Gateway (Optional)

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings > API Keys**
3. Click **Generate Test Keys**
4. Copy:
   - Key ID (starts with `rzp_test_`)
   - Key Secret
5. For production, generate Live Keys

**Test Cards:**
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 9995`

## 📚 Documentation

- **[README.md](./README.md)** - Main project documentation
- **[SETUP.md](./SETUP.md)** - Quick setup guide
- **[CART_DOCUMENTATION.md](./CART_DOCUMENTATION.md)** - Complete cart system documentation
- **[RAZORPAY_DOCUMENTATION.md](./RAZORPAY_DOCUMENTATION.md)** - Payment integration guide
- **[TESTING.md](./TESTING.md)** - Complete testing documentation

## 🤝 Contributing

This is a production-ready template. Feel free to:
- Customize styling and branding
- Implement checkout flow
- Add product filtering and search
- Integrate payment processing
- Add user authentication

## 📄 License

MIT License - feel free to use this for your projects!

## 🙏 Acknowledgments

- React & TypeScript
- Vite for blazing fast builds
- Tailwind CSS for styling
- Shopify Storefront API
- Unsplash for product images

---

Built with ❤️ using React, TypeScript, and Tailwind CSS

