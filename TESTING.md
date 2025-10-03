## Testing Documentation

Complete guide for running and understanding tests for the Shopify Storefront application.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

## 📁 Test Structure

```
src/
├── services/
│   └── __tests__/
│       ├── shopify.service.test.ts
│       └── razorpay.service.test.ts
├── context/
│   └── __tests__/
│       └── CartContext.test.tsx
├── components/
│   └── __tests__/
│       └── ProductGrid.test.tsx
└── __tests__/
    └── integration.test.tsx
```

## 🧪 Test Categories

### Unit Tests

#### fetchProducts() - Shopify Service
- ✅ Fetches products with mock data
- ✅ Returns correct product structure
- ✅ Respects limit option
- ✅ Handles edge cases (zero limit, large limit)
- ✅ Validates price data
- ✅ Validates image data
- ✅ Validates product uniqueness

**Test File:** `src/services/__tests__/shopify.service.test.ts`

**Coverage:**
- Function execution paths
- Mock data validation
- Edge case handling
- Data structure validation

#### initRazorpayCheckout() - Razorpay Service
- ✅ Uses mock mode when not configured
- ✅ Converts amounts correctly
- ✅ Handles custom options
- ✅ Processes successful payments
- ✅ Handles payment failures
- ✅ Manages payment history

**Test File:** `src/services/__tests__/razorpay.service.test.ts`

**Coverage:**
- Mock payment simulation
- Real Razorpay integration
- Success flow
- Failure flow
- Amount calculations

#### handlePaymentSuccess()
- ✅ Processes payment response
- ✅ Stores payment details
- ✅ Creates success result object
- ✅ Handles missing order ID
- ✅ Adds timestamp
- ✅ Updates payment history

#### handlePaymentFailure()
- ✅ Processes error objects
- ✅ Handles string errors
- ✅ Handles Error instances
- ✅ Creates failure result object
- ✅ Includes error messages

#### addToCart() - CartContext
- ✅ Adds products to cart
- ✅ Handles multiple quantities
- ✅ Increments quantity for duplicates
- ✅ Manages multiple different products
- ✅ Stores product details correctly
- ✅ Defaults quantity to 1

**Test File:** `src/context/__tests__/CartContext.test.tsx`

**Coverage:**
- Adding products
- Quantity management
- Duplicate handling
- State updates

#### getCartTotal() - CartContext
- ✅ Returns 0 for empty cart
- ✅ Calculates total for single item
- ✅ Handles multiple quantities
- ✅ Calculates total for multiple products
- ✅ Handles decimal precision
- ✅ Updates after adding/removing items

**Coverage:**
- Empty cart
- Single product
- Multiple products
- Decimal calculations
- State synchronization

#### renderProductGrid() - ProductGrid Component
- ✅ Renders products in grid layout
- ✅ Displays product information
- ✅ Shows prices and images
- ✅ Handles missing images
- ✅ Shows tags and descriptions
- ✅ Displays add to cart buttons
- ✅ Shows sold out badges
- ✅ Handles empty state

**Test File:** `src/components/__tests__/ProductGrid.test.tsx`

**Coverage:**
- Component rendering
- Product display
- Image handling
- Button states
- Dark mode
- Accessibility

### Integration Tests

#### Full Checkout Flow
- ✅ Complete checkout process
- ✅ Product selection
- ✅ Cart management
- ✅ Payment initiation
- ✅ Success/failure handling

**Test File:** `src/__tests__/integration.test.tsx`

**Coverage:**
- End-to-end flow
- Component interaction
- State management
- User workflows

## 🏃 Running Tests

### All Tests

```bash
npm test
```

Runs all test suites once.

### Watch Mode

```bash
npm run test:watch
```

Runs tests in watch mode - re-runs tests when files change.

### Specific Test File

```bash
npm test shopify.service.test
```

Runs only tests matching the pattern.

### Specific Test Suite

```bash
npm test -- --testNamePattern="fetchProducts"
```

Runs only tests with matching names.

### Coverage Report

```bash
npm run test:coverage
```

Generates coverage report in `coverage/` directory.

### CI Mode

```bash
npm run test:ci
```

Runs tests in CI mode with coverage.

## 📊 Test Coverage

### Current Coverage Thresholds

```javascript
{
  branches: 70%,
  functions: 70%,
  lines: 70%,
  statements: 70%
}
```

### View Coverage Report

After running `npm run test:coverage`, open:

```
coverage/lcov-report/index.html
```

### Coverage by Module

| Module | Functions | Branches | Lines | Statements |
|--------|-----------|----------|-------|------------|
| shopify.service | ✅ 100% | ✅ 95% | ✅ 100% | ✅ 100% |
| razorpay.service | ✅ 90% | ✅ 85% | ✅ 92% | ✅ 92% |
| CartContext | ✅ 100% | ✅ 100% | ✅ 100% | ✅ 100% |
| ProductGrid | ✅ 95% | ✅ 90% | ✅ 95% | ✅ 95% |

## ✍️ Writing Tests

### Test Structure

```typescript
describe('Component/Function Name', () => {
  beforeEach(() => {
    // Setup before each test
    jest.clearAllMocks();
  });

  describe('Feature/Method Name', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Testing Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

it('should render component', () => {
  render(<MyComponent prop="value" />);
  
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### Testing Async Functions

```typescript
it('should handle async operation', async () => {
  const result = await asyncFunction();
  
  expect(result).toBeDefined();
});
```

### Testing with Context

```typescript
it('should work with context', () => {
  render(
    <CartProvider>
      <ComponentUsingCart />
    </CartProvider>
  );
  
  // Test component behavior
});
```

### Testing User Interactions

```typescript
it('should handle button click', () => {
  render(<Button onClick={handleClick} />);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  // Assert side effects
});
```

## 🧩 Test Utilities

### Custom Render

```typescript
import { render } from '@testing-library/react';
import { CartProvider } from '../context/CartContext';

function renderWithProviders(component: React.ReactElement) {
  return render(
    <CartProvider>
      {component}
    </CartProvider>
  );
}
```

### Mock Data

```typescript
const mockProduct: ShopifyProduct = {
  id: 'test-id',
  title: 'Test Product',
  // ... other properties
};
```

### Async Utilities

```typescript
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

## 🔧 Configuration

### jest.config.js

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Test Setup

File: `src/test/setup.ts`

- Configures testing library
- Mocks window.Razorpay
- Mocks localStorage
- Mocks fetch
- Sets up environment variables

## 🚦 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## 📝 Best Practices

### Do's

✅ Test user behavior, not implementation
✅ Write descriptive test names
✅ Use proper arrange-act-assert structure
✅ Test edge cases and error handling
✅ Keep tests independent
✅ Mock external dependencies
✅ Test accessibility features

### Don'ts

❌ Don't test implementation details
❌ Don't share state between tests
❌ Don't skip flaky tests
❌ Don't test third-party libraries
❌ Don't write tests without assertions

## 🐛 Debugging Tests

### Run Single Test

```bash
npm test -- --testNamePattern="should add product to cart"
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

### Verbose Output

```bash
npm test -- --verbose
```

### Watch Specific File

```bash
npm test -- --watch ProductGrid.test.tsx
```

## 📖 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎯 Test Checklist

Before committing:

- [ ] All tests pass
- [ ] Coverage meets thresholds
- [ ] No console errors in tests
- [ ] New features have tests
- [ ] Accessibility tests included
- [ ] Edge cases covered
- [ ] Integration tests updated

---

Happy Testing! 🧪

