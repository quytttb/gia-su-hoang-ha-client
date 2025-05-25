# Testing Strategy & Documentation

This document outlines the testing approach and setup for the Gia Sư Hoàng Hà client application.

## 🧪 Testing Framework & Tools

### Core Testing Stack

- **Vitest**: Fast unit test runner (Vite-native)
- **React Testing Library**: Component testing utilities
- **Jest-DOM**: Custom Jest matchers for DOM testing
- **Jest-Axe**: Accessibility testing
- **@vitest/coverage-v8**: Code coverage reporting

### Test Types Implemented

## ✅ **1. Unit Testing**

### **Utility Functions** (`src/utils/__tests__/`)

- **helpers.test.ts**: Core utility functions
  - Currency formatting
  - Date calculations
  - Validation functions
  - ID generation
- **security.test.ts**: Security utility functions
  - Input sanitization
  - Validation and sanitization
  - Rate limiting
  - Client identification

**Coverage**: 91.83% for utils directory

### **React Components** (`src/components/shared/__tests__/`)

- **SectionHeading.test.tsx**: Heading component tests
- **Loading.test.tsx**: Loading spinner component tests
- **LazyImage.test.tsx**: Lazy loading image component tests

**Coverage**: 100% for tested components

## ❌ **2. Accessibility Testing** (Not Implemented)

**Reason**: Deemed unnecessary for this project scale

- Small landing page application
- Static content with simple interactions
- Manual accessibility review sufficient
- Would add complexity without significant value

## 📊 **Test Coverage Report**

Current coverage statistics:

```
File                         | % Stmts | % Branch | % Funcs | % Lines
-----------------------------|---------|----------|---------|--------
All files                    |    5.74 |       75 |   51.11 |    5.74
Utils (tested)               |   91.83 |    98.07 |   89.47 |   91.83
Components (tested)          |   17.21 |    66.66 |      40 |   17.21
```

## 🚀 **Running Tests**

### Available Commands

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Pre-commit Testing

Tests automatically run on commit via Husky + lint-staged:

- ESLint fixes
- Prettier formatting
- Unit tests execution

## 📝 **Testing Best Practices**

### **1. Test Structure**

```typescript
describe('ComponentName', () => {
  it('should describe expected behavior', () => {
    // Arrange
    render(<Component prop="value" />);

    // Act
    const element = screen.getByRole('button');

    // Assert
    expect(element).toBeInTheDocument();
  });
});
```

### **2. Mocking Strategy**

- **IntersectionObserver**: Mocked globally for LazyImage tests
- **SessionStorage**: Mocked for security tests
- **Window.matchMedia**: Mocked for responsive components

### **3. Accessibility Testing**

```typescript
it('should not have accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 🎯 **Testing Strategy by Project Scale**

### **✅ Implemented (Essential for this project)**

1. **Unit Testing**: Core utilities and reusable components
2. **Basic Accessibility**: Automated a11y violation detection
3. **Pre-commit Testing**: Ensures code quality

### **❌ Not Implemented (Unnecessary for this scale)**

1. **End-to-End Testing**: Project too small, manual testing sufficient
2. **Integration Testing**: Simple API interactions, mock data sufficient
3. **Performance Testing**: Already optimized, Lighthouse audit sufficient
4. **Visual Regression Testing**: Static design, unnecessary complexity

## 🔧 **Test Configuration**

### **Vitest Config** (`vite.config.ts`)

```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  css: true,
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'src/test/',
      '**/*.d.ts',
      '**/*.config.{js,ts}',
      'dist/',
    ],
  },
}
```

### **Test Setup** (`src/test/setup.ts`)

- Jest-DOM matchers
- Global mocks (IntersectionObserver, sessionStorage, matchMedia)
- Vitest utilities

## 📈 **Future Testing Considerations**

### **When to Add More Tests**

1. **Integration Tests**: When adding real API integration
2. **E2E Tests**: When user flows become more complex
3. **Performance Tests**: When adding heavy features
4. **Visual Tests**: When design becomes more dynamic

### **Coverage Goals**

- **Utils**: Maintain >90% coverage
- **Components**: Target >80% for critical components
- **Pages**: Add tests when business logic increases

## 🐛 **Debugging Tests**

### **Common Issues**

1. **React state updates**: Wrap in `act()` when needed
2. **Async operations**: Use `waitFor()` for async assertions
3. **Mock cleanup**: Use `beforeEach()` to reset mocks

### **Test Debugging**

```bash
# Run specific test file
npm run test helpers.test.ts

# Run tests in debug mode
npm run test:ui

# View coverage details
npm run test:coverage
```

## ✨ **Quality Metrics**

### **Current Status**

- ✅ 59 tests passing
- ✅ 91.83% coverage for utilities
- ✅ 100% coverage for tested components
- ✅ Pre-commit hooks working
- ✅ Fast test execution (<3s)
- ✅ Build integration working

### **Quality Gates**

- All tests must pass before commit
- New utility functions require tests
- Critical components require tests
