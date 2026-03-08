# Cricko API

Cricket scoring app REST API built with Node.js, Express, TypeScript, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM 7.x
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Dependency Injection**: Inversify
- **Testing**: Jest with ts-jest
- **Logging**: Winston

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Getting Started

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/cricko
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Optional - Azure Storage
AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_CONTAINER_NAME=
AZURE_STORAGE_DEFAULT_BASE_URL=

# Optional - SMTP (Email)
SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM_NAME=Cricko
SMTP_FROM_EMAIL=noreply@cricko.com

# Optional - Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

CORS_ORIGIN=*
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run generate_prisma_client

# Run migrations
npm run update_database
```

### 4. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Available Scripts

| Command                          | Description                           |
| -------------------------------- | ------------------------------------- |
| `npm run dev`                    | Start development server with nodemon |
| `npm run build`                  | Compile TypeScript to dist/           |
| `npm run start`                  | Start production server               |
| `npm run test`                   | Run all tests                         |
| `npm run test:watch`             | Run tests in watch mode               |
| `npm run test:coverage`          | Run tests with coverage               |
| `npm run create_migration`       | Create Prisma migration               |
| `npm run update_database`        | Run Prisma migrations                 |
| `npm run generate_prisma_client` | Generate Prisma client                |

## API Documentation

When running in development mode, Swagger documentation is available at:

```text
http://localhost:3001/api/docs
```

## Project Structure

```text
src/
├── config/           # App configuration, IoC container
├── integrations/    # External services
│   ├── notification/ # Email/SMTP
│   ├── payment/      # Stripe
│   └── upload/       # Azure Blob Storage
├── middleware/      # Express middleware
├── modules/         # Feature modules
│   ├── auth/        # Authentication
│   ├── country/     # Country management
│   └── health/      # Health checks
├── routes/          # Route registration
├── services/        # Shared services
├── tests/           # Test files
├── types/           # Global types
└── utils/           # Utilities
```

## Authentication

The API uses JWT authentication with access and refresh tokens:

- **Access Token**: Valid for 1 day (configurable)
- **Refresh Token**: Valid for 7 days (configurable)

Include tokens in the Authorization header:

```text
Authorization: Bearer <access_token>
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Testing

```bash
# Run all tests
npm run test

# Run specific test file
npx jest src/tests/unit/modules/auth/auth.service.test.ts

# Run tests in watch mode
npm run test:watch
```

## License

ISC
