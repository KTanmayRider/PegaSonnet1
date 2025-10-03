# Shopping Cart Documentation

## Overview

The shopping cart system is a fully functional, accessible, and production-ready feature built with React Context API. It provides clean cart logic, type safety, and excellent user experience.

## Core Functions

### `addToCart(product, quantity?)`

Adds a product to the shopping cart with the specified quantity (default: 1).

**Parameters:**
- `product` (ShopifyProduct): The product to add to cart
- `quantity` (number, optional): Number of items to add (default: 1)

**Behavior:**
- If product already exists in cart, increments the quantity
- If product is new, adds it as a new cart item
- Automatically updates cart badge count
- Thread-safe with React state management

**Usage Example:**
```typescript
import { useCart } from './context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

### `getCartTotal()`

Calculates and returns the total price of all items in the cart.

**Returns:**
- `number`: Total cart value (sum of price × quantity for all items)

**Behavior:**
- Parses price strings to numbers
- Multiplies price by quantity for each item
- Returns accurate decimal calculations
- Returns 0 for empty cart

**Usage Example:**
```typescript
import { useCart } from './context/CartContext';
import { formatPrice } from './services/shopify.service';

function CartSummary() {
  const { getCartTotal, cart } = useCart();
  const total = getCartTotal();
  
  return (
    <div>
      Total: {formatPrice(
        total.toString(),
        cart.items[0]?.product.priceRange.minVariantPrice.currencyCode || 'USD'
      )}
    </div>
  );
}
```

## Additional Cart Functions

### `removeFromCart(productId)`

Removes a product from the cart completely.

**Parameters:**
- `productId` (string): The ID of the product to remove

### `updateQuantity(productId, quantity)`

Updates the quantity of a specific cart item.

**Parameters:**
- `productId` (string): The ID of the product to update
- `quantity` (number): New quantity (removes item if ≤ 0)

### `clearCart()`

Removes all items from the cart.

### `getCartItemCount()`

Returns the total number of items in the cart (sum of all quantities).

**Returns:**
- `number`: Total item count

### `toggleCart()`

Opens or closes the cart panel.

### `closeCart()`

Closes the cart panel.

## Cart Context

The cart is managed through React Context API, providing global state management.

### Using the Cart Context

```typescript
import { useCart } from './context/CartContext';

function MyComponent() {
  const {
    cart,              // Cart state object
    addToCart,         // Add product function
    removeFromCart,    // Remove product function
    updateQuantity,    // Update quantity function
    clearCart,         // Clear all items function
    getCartTotal,      // Get total price function
    getCartItemCount,  // Get item count function
    toggleCart,        // Toggle cart visibility function
    closeCart,         // Close cart function
  } = useCart();
  
  // Use cart functions...
}
```

## Type Definitions

### CartItem

```typescript
interface CartItem {
  product: ShopifyProduct;    // The product object
  quantity: number;            // Quantity in cart
  variantId: string;           // Selected variant ID
  addedAt: Date;              // Timestamp when added
}
```

### CartState

```typescript
interface CartState {
  items: CartItem[];          // Array of cart items
  isOpen: boolean;            // Cart panel visibility
}
```

## Cart Logic Flow

### Adding to Cart

1. **Check for duplicates**: Search for existing product by ID
2. **If exists**: Increment quantity by specified amount
3. **If new**: Create new CartItem with product data
4. **Update state**: Trigger React re-render
5. **Update badge**: Cart count automatically updates

### Calculating Total

1. **Iterate items**: Loop through all cart items
2. **Parse price**: Convert price string to float
3. **Calculate subtotal**: price × quantity
4. **Sum totals**: Accumulate all subtotals
5. **Return total**: Single number with decimals

### Removing from Cart

1. **Filter items**: Remove item matching productId
2. **Update state**: Trigger React re-render
3. **Update badge**: Cart count automatically updates

## UI Components

### Cart Panel

Located in `src/components/Cart.tsx`

**Features:**
- Slide-out panel from right side
- Full-screen on mobile, 384px on desktop
- Backdrop overlay with click-to-close
- Scroll container for many items
- Empty state with icon and message

**Layout:**
- Header: Title, item count, close button
- Body: Scrollable list of cart items
- Footer: Total, clear cart, checkout button

### Cart Item

Each item displays:
- Product image (80x80px on mobile, 96x96px on desktop)
- Product title (max 2 lines)
- Price and quantity
- Quantity controls (+/- buttons)
- Item subtotal
- Remove button

### Cart Badge

- Appears on shopping cart icon in header
- Shows total item count
- Red circular badge
- Displays "99+" for counts over 99
- Hidden when cart is empty

## Accessibility Features

### ARIA Labels

- Cart panel: `role="dialog"` with `aria-label="Shopping cart"`
- Close button: `aria-label="Close cart"`
- Cart items: `role="list"` with `role="listitem"`
- Quantity controls: Descriptive labels for each action
- Cart badge: Included in button aria-label

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close cart (can be added)
- Focus management on open/close

### Screen Readers

- Announces item counts
- Reads product names and prices
- Announces quantity changes
- Reads total price clearly

### Visual Indicators

- Focus rings on all interactive elements
- High contrast colors
- Clear button states (hover, active, disabled)
- Loading states if needed

## Responsive Design

### Mobile (< 640px)
- Full-screen cart panel
- Larger touch targets (min 44x44px)
- Stack layout
- Comfortable padding

### Tablet (640px - 1024px)
- Fixed-width cart panel (384px)
- Backdrop overlay
- Comfortable spacing

### Desktop (> 1024px)
- Fixed-width cart panel (384px)
- Smooth animations
- Hover effects
- Optimal spacing

## State Management

The cart uses React Context + useState for:
- Global state access
- Automatic re-renders
- Type-safe operations
- Clean separation of concerns

**Why Context?**
- No external dependencies
- Built into React
- Type-safe with TypeScript
- Easy to understand and maintain
- Perfect for this scale

## Performance

### Optimizations

- Efficient array operations
- Minimal re-renders
- Lazy loading of cart component
- Memoization opportunities (can be added)
- No unnecessary API calls

### Scaling Considerations

- Cart stored in memory (session-based)
- Can be persisted to localStorage
- Can sync with backend API
- Handles hundreds of items efficiently

## Mock Data Support

The cart works perfectly with mock product data:
- No API required for testing
- Realistic product information
- Images from Unsplash
- Various price points
- Different product types

## Testing the Cart

### Manual Testing Checklist

1. ✅ Add product to cart
2. ✅ Cart badge updates
3. ✅ Open cart panel
4. ✅ View cart items
5. ✅ Update quantities
6. ✅ Remove items
7. ✅ Clear cart
8. ✅ Check total calculation
9. ✅ Close cart (backdrop & button)
10. ✅ Mobile responsive
11. ✅ Keyboard navigation
12. ✅ Screen reader compatible

### Edge Cases Handled

- Empty cart display
- Quantity = 0 removes item
- Large quantities
- Many items (scrolling)
- Price calculations with decimals
- Currency formatting
- Duplicate products

## Common Use Cases

### Simple Add to Cart

```typescript
const { addToCart } = useCart();
addToCart(product); // Adds 1 item
```

### Add Multiple Items

```typescript
const { addToCart } = useCart();
addToCart(product, 5); // Adds 5 items
```

### Display Cart Total

```typescript
const { getCartTotal } = useCart();
const total = getCartTotal();
console.log(`Total: $${total.toFixed(2)}`);
```

### Display Item Count

```typescript
const { getCartItemCount } = useCart();
const count = getCartItemCount();
console.log(`${count} items in cart`);
```

### Check if Product in Cart

```typescript
const { cart } = useCart();
const isInCart = cart.items.some(item => item.product.id === productId);
```

## Future Enhancements

Potential features to add:

- 🔄 Persist cart to localStorage
- 🌐 Sync with backend API
- 💾 Save cart for later
- 🎁 Coupon/promo codes
- 🚚 Shipping calculator
- 💳 Tax calculation
- ❤️ Save to wishlist
- 🔔 Low stock warnings
- 📧 Abandoned cart emails
- 📊 Analytics tracking

## Security Considerations

- Client-side only (session-based)
- No sensitive data stored
- Validate quantities (> 0)
- Sanitize product data
- XSS protection via React
- Type safety prevents errors

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

Built with ❤️ using React Context API & TypeScript

