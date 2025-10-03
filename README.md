# Shopify Storefront - React TypeScript

A production-ready, fully accessible React TypeScript storefront powered by Shopify Storefront API with comprehensive mock data support.

## 🚀 Features

- **🛍️ Shopify Integration**: Full Shopify Storefront API integration with GraphQL
- **♿ Accessibility First**: WCAG 2.1 AA compliant with ARIA labels, semantic HTML, and keyboard navigation
- **📱 Mobile Responsive**: Mobile-first design with Tailwind CSS
- **🌓 Dark Mode**: Elegant dark mode toggle with smooth transitions
- **⚡ Performance**: Optimized with lazy loading, efficient state management
- **🔒 Secure**: Environment-based API key handling
- **🎨 Modern UI**: Clean, professional design with smooth animations
- **🧪 Mock Data**: Built-in mock data for development and testing
- **♻️ Error Handling**: Comprehensive error handling with user-friendly messages
- **🔄 Loading States**: Smooth loading indicators for better UX

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- (Optional) Shopify store with Storefront API access

## 🛠️ Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Configure Shopify API (Optional):**

Create a `.env` file in the root directory:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
```

**Note:** If you don't provide API credentials, the app will automatically use mock data.

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

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ProductGrid.tsx  # Product grid with renderProductGrid()
│   ├── LoadingSpinner.tsx
│   └── ErrorDisplay.tsx
├── services/           # API and business logic
│   └── shopify.service.ts  # fetchProducts() and API calls
├── types/              # TypeScript type definitions
│   └── shopify.types.ts
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

## 📦 Getting Shopify API Credentials

1. Go to your Shopify Admin
2. Navigate to **Apps > Develop apps**
3. Click **Create an app**
4. Configure **Storefront API** scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
5. Install the app and copy:
   - Store domain (e.g., `your-store.myshopify.com`)
   - Storefront access token

## 🤝 Contributing

This is a production-ready template. Feel free to:
- Customize styling and branding
- Add shopping cart functionality
- Implement checkout flow
- Add product filtering and search
- Integrate payment processing

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

