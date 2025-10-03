# Shopping Cart - Usage Examples

Quick reference for using the shopping cart functions in your components.

## Basic Usage

### Import the Cart Hook

```typescript
import { useCart } from './context/CartContext';
```

## Adding Products to Cart

### Simple Add (1 item)

```typescript
function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  );
}
```

### Add Multiple Items

```typescript
function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <button onClick={() => addToCart(product, 3)}>
      Add 3 to Cart
    </button>
  );
}
```

### Add with Quantity Selector

```typescript
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <button onClick={handleAddToCart}>
        Add {quantity} to Cart
      </button>
    </div>
  );
}
```

## Displaying Cart Total

### Simple Total Display

```typescript
function CartTotal() {
  const { getCartTotal, cart } = useCart();
  const total = getCartTotal();
  
  return (
    <div>
      Total: ${total.toFixed(2)}
    </div>
  );
}
```

### Formatted Total with Currency

```typescript
import { formatPrice } from './services/shopify.service';

function CartTotal() {
  const { getCartTotal, cart } = useCart();
  const total = getCartTotal();
  
  // Get currency from first item (or default to USD)
  const currency = cart.items[0]?.product.priceRange.minVariantPrice.currencyCode || 'USD';
  
  return (
    <div>
      Total: {formatPrice(total.toString(), currency)}
    </div>
  );
}
```

### Total with Item Count

```typescript
function CartSummary() {
  const { getCartTotal, getCartItemCount } = useCart();
  const total = getCartTotal();
  const itemCount = getCartItemCount();
  
  return (
    <div>
      <p>{itemCount} items in cart</p>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}
```

## Displaying Item Count

### Cart Badge

```typescript
function CartIcon() {
  const { getCartItemCount, toggleCart } = useCart();
  const itemCount = getCartItemCount();
  
  return (
    <button onClick={toggleCart}>
      <ShoppingCartIcon />
      {itemCount > 0 && (
        <span className="badge">{itemCount}</span>
      )}
    </button>
  );
}
```

### Item Count with "99+"

```typescript
function CartBadge() {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();
  
  if (itemCount === 0) return null;
  
  return (
    <span className="badge">
      {itemCount > 99 ? '99+' : itemCount}
    </span>
  );
}
```

## Managing Cart Items

### Remove from Cart

```typescript
function CartItem({ item }) {
  const { removeFromCart } = useCart();
  
  return (
    <div>
      <h3>{item.product.title}</h3>
      <button onClick={() => removeFromCart(item.product.id)}>
        Remove
      </button>
    </div>
  );
}
```

### Update Quantity

```typescript
function CartItem({ item }) {
  const { updateQuantity } = useCart();
  
  const increment = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };
  
  const decrement = () => {
    updateQuantity(item.product.id, item.quantity - 1);
  };
  
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{item.quantity}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

### Clear Entire Cart

```typescript
function ClearCartButton() {
  const { clearCart } = useCart();
  
  const handleClear = () => {
    if (confirm('Clear all items from cart?')) {
      clearCart();
    }
  };
  
  return (
    <button onClick={handleClear}>
      Clear Cart
    </button>
  );
}
```

## Checking Cart State

### Check if Cart is Empty

```typescript
function CheckoutButton() {
  const { cart, getCartItemCount } = useCart();
  const isEmpty = getCartItemCount() === 0;
  
  return (
    <button disabled={isEmpty}>
      {isEmpty ? 'Cart is Empty' : 'Proceed to Checkout'}
    </button>
  );
}
```

### Check if Product is in Cart

```typescript
function ProductStatus({ productId }) {
  const { cart } = useCart();
  const isInCart = cart.items.some(item => item.product.id === productId);
  
  return (
    <div>
      {isInCart ? '✓ In Cart' : 'Not in cart'}
    </div>
  );
}
```

### Get Quantity of Specific Product

```typescript
function ProductQuantity({ productId }) {
  const { cart } = useCart();
  const item = cart.items.find(item => item.product.id === productId);
  const quantity = item?.quantity || 0;
  
  return (
    <div>
      {quantity > 0 && `${quantity} in cart`}
    </div>
  );
}
```

## Toggle Cart Visibility

### Open Cart

```typescript
function AddToCartButton({ product }) {
  const { addToCart, toggleCart } = useCart();
  
  const handleClick = () => {
    addToCart(product);
    toggleCart(); // Open cart after adding
  };
  
  return (
    <button onClick={handleClick}>
      Add to Cart
    </button>
  );
}
```

### Close Cart

```typescript
function ContinueShoppingButton() {
  const { closeCart } = useCart();
  
  return (
    <button onClick={closeCart}>
      Continue Shopping
    </button>
  );
}
```

## Complete Component Example

### Full Featured Product Card

```typescript
import { useCart } from './context/CartContext';
import { formatPrice } from './services/shopify.service';
import { ShopifyProduct } from './types/shopify.types';

interface ProductCardProps {
  product: ShopifyProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart, toggleCart } = useCart();
  
  // Check if product is in cart
  const cartItem = cart.items.find(item => item.product.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;
  
  const handleAddToCart = () => {
    addToCart(product, 1);
    // Optionally open cart after adding
    // toggleCart();
  };
  
  return (
    <div className="product-card">
      <img 
        src={product.images[0]?.url} 
        alt={product.title}
      />
      
      <h3>{product.title}</h3>
      
      <p>{product.description}</p>
      
      <p className="price">
        {formatPrice(
          product.priceRange.minVariantPrice.amount,
          product.priceRange.minVariantPrice.currencyCode
        )}
      </p>
      
      {quantityInCart > 0 && (
        <p className="in-cart">
          {quantityInCart} in cart
        </p>
      )}
      
      <button 
        onClick={handleAddToCart}
        disabled={!product.availableForSale}
      >
        {product.availableForSale ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}
```

### Full Featured Cart Summary

```typescript
import { useCart } from './context/CartContext';
import { formatPrice } from './services/shopify.service';

function CartSummary() {
  const { 
    cart, 
    getCartTotal, 
    getCartItemCount,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart();
  
  const total = getCartTotal();
  const itemCount = getCartItemCount();
  const currency = cart.items[0]?.product.priceRange.minVariantPrice.currencyCode || 'USD';
  
  if (itemCount === 0) {
    return <p>Your cart is empty</p>;
  }
  
  return (
    <div className="cart-summary">
      <h2>Cart ({itemCount} items)</h2>
      
      <ul>
        {cart.items.map(item => (
          <li key={item.product.id}>
            <img 
              src={item.product.images[0]?.url}
              alt={item.product.title}
              width={60}
              height={60}
            />
            
            <div>
              <h4>{item.product.title}</h4>
              
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                  +
                </button>
              </div>
              
              <p>
                {formatPrice(
                  (parseFloat(item.product.priceRange.minVariantPrice.amount) * item.quantity).toString(),
                  currency
                )}
              </p>
              
              <button onClick={() => removeFromCart(item.product.id)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="cart-footer">
        <button onClick={clearCart}>Clear Cart</button>
        
        <div className="total">
          <strong>Total:</strong>
          <span>{formatPrice(total.toString(), currency)}</span>
        </div>
        
        <button className="checkout">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
```

## TypeScript Types

### Using Cart Types in Your Components

```typescript
import { CartItem, CartState } from './types/cart.types';
import { ShopifyProduct } from './types/shopify.types';

// Access individual cart item
function processCartItem(item: CartItem) {
  const product: ShopifyProduct = item.product;
  const quantity: number = item.quantity;
  const variantId: string = item.variantId;
  const addedAt: Date = item.addedAt;
}

// Access cart state
function processCart(cartState: CartState) {
  const items: CartItem[] = cartState.items;
  const isOpen: boolean = cartState.isOpen;
}
```

---

These examples cover all common use cases for the shopping cart. Copy and adapt them for your specific needs!

