# TypeScript Basics

Learning notes for TypeScript fundamentals.

## Key Concepts

### Types
- **Primitive types**: `string`, `number`, `boolean`
- **Object types**: `{ name: string, age: number }`
- **Array types**: `string[]` or `Array<string>`

### Interfaces
```typescript
interface User {
  name: string;
  age: number;
  email?: string; // Optional property
}
```

### Functions
```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

## Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

