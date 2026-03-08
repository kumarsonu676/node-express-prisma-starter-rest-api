# Agent Guidelines for Cricko Backend

This document provides guidelines for agentic coding agents working in this repository.

## Project Overview

- **Type**: Node.js/Express REST API with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest with ts-jest
- **DI**: Inversify for dependency injection

---

## Build, Lint, and Test Commands

### Development

```bash
npm run dev          # Start development server with nodemon
```

### Building

```bash
npm run build        # Compile TypeScript to dist/
npm run start        # Start production server from dist/
```

### Database

```bash
npm run create_migration  # Create Prisma migration (needs name: npm run create_migration -- <name>)
npm run update_database    # Run Prisma migrations
npm run validate_schema     # Validate Prisma schema
npm run generate_prisma_client  # Generate Prisma client
```

### Testing

```bash
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
```

#### Running a Single Test

```bash
# Run specific test file
npx jest src/tests/unit/modules/auth/auth.service.test.ts

# Run specific test by name pattern
npx jest --testNamePattern="should return login response"

# Run tests in specific directory
npx jest src/tests/unit/modules/auth/
```

---

## Code Style Guidelines

### Formatting

- Uses **Prettier** with: single quotes, semicolons, trailing commas (es5), 2-space indent, 150 print width
- Run `npx prettier --write` before committing

### TypeScript

- **Strict mode enabled** - no implicit any, strict null checks
- Use explicit types for function parameters and return types
- Use `interface` for object shapes, `type` for unions/aliases
- Import types using `import type { ... }` when only using types

### Naming Conventions

- **Files**: kebab-case (e.g., `auth.service.ts`) except class files can be PascalCase
- **Classes**: PascalCase (e.g., `AuthService`)
- **Functions/variables**: camelCase
- **Enums**: PascalCase with PascalCase members (e.g., `RoleName.ADMIN`)
- **Constants**: SCREAMING_SNAKE_CASE

### Imports

- Order imports: external libs → internal modules → relative paths
- Use path aliases: `@/` maps to `src/`

  ```typescript
  import { AuthService } from '@/modules/auth/auth.service';
  ```

- Use `import type` for types only

### Error Handling

- Use custom error classes from `@/utils/errors`:
  - `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`
  - `ConflictError`, `InternalServerError`, `ServiceUnavailableError`
  - `ValidationError` for request validation errors
- Always use `ErrorCode` enum for error codes
- Wrap async controllers with `asyncHandler`:

  ```typescript
  public login = asyncHandler(async (req: Request, res: Response) => {
    // handler code
  });
  ```

### Validation

- Use **Zod** for request validation schemas
- Define schemas in `{module}.validation.ts` files
- Use helpers from `@/utils/validate`:

  ```typescript
  const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  });
  export type LoginDto = z.infer<typeof loginSchema>;
  ```

### Dependency Injection (Inversify)

- Use `@injectable()` decorator on services
- Register dependencies in `@/config/ioc.config.ts`
- Use `TYPES_*` constants from `@/config/ioc.types` for injection tokens
- Inject via constructor:

  ```typescript
  @injectable()
  export class AuthService {
    constructor(private authRepository = container.get<AuthRepository>(TYPES_AUTH.AuthRepository)) {}
  }
  ```

### Project Structure

```text/plain
src/
├── config/           # App configuration, IoC container
├── integrations/     # External services (email, payment, upload)
├── middleware/       # Express middleware (auth, validation, rate-limit)
├── modules/          # Feature modules (auth, country, health)
│   └── {module}/
│       ├── {module}.controller.ts
│       ├── {module}.service.ts
│       ├── {module}.repository.ts
│       ├── {module}.routes.ts
│       ├── {module}.types.ts
│       └── {module}.validation.ts
├── routes/           # Route registration
├── services/         # Shared services (Prisma)
├── tests/            # Test files
│   ├── setup.ts      # Jest setup
│   ├── unit/         # Unit tests
│   └── integration/  # Integration tests
├── types/            # Global type definitions
└── utils/            # Utilities (errors, helpers, schemas)
```

### Testing Guidelines

- Unit tests go in `src/tests/unit/`
- Integration tests go in `src/tests/integration/`
- Test file naming: `*.test.ts` or `*.spec.ts`
- Use Jest's `describe`/`it` blocks
- Mock dependencies using `jest.mock()`:

  ```typescript
  jest.mock('../../../../config/ioc.config', () => ({
    __esModule: true,
    default: {
      get: jest.fn(),
    },
  }));
  ```

- Use `jest.clearAllMocks()` in `beforeEach`
- Use `jest.Mocked<T>` for typed mocks

### API Response Format

- Use helpers from `@/utils/api-response`:

  ```typescript
  import { ok, created, error } from '@/utils/api-response';
  return ok(req, res, data);
  return created(req, res, data);
  return error(req, res, errorMessage, statusCode);
  ```

### Logging

- Use Winston logger from `@/utils/logger`
- Include request ID from middleware for traceability

---

## Notes

- No ESLint config present - rely on Prettier and TypeScript strict mode
- Prisma 7.x used for database - migrations and client generation required after schema changes
- Swagger docs available at `/api/docs` when running
