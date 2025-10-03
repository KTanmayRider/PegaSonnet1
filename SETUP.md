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

## 🔑 Getting Shopify Credentials

1. Shopify Admin → **Apps** → **Develop apps**
2. **Create an app**
3. Configure **Storefront API** scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
4. Install app and copy credentials

## 💡 Tips

- **No API Key?** The app works perfectly with mock data
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

