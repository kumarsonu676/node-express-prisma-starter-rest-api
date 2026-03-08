# Node Express Prisma Starter REST API

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-black)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-red)](https://jwt.io/)
[![CI/CD](https://img.shields.io/badge/CI/CD-GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-ISC-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen)](https://makeapullrequest.com)

Production-ready REST API starter template built with Node.js, Express, and TypeScript. Features JWT authentication, PostgreSQL with Prisma ORM, Docker support, CI/CD pipeline, and best practices for scalable backend development.

Perfect for quickly bootstrapping new Node.js projects with enterprise-grade architecture.

## Why This Starter?

- 🚀 **Quick Start** - Bootstrap your API in minutes
- 🔒 **Secure** - JWT auth, helmet, rate limiting, input validation
- 🐳 **Docker Ready** - Containerize with Docker & Docker Compose
- ✅ **Well Tested** - Jest unit & integration tests
- 📚 **Documented** - Swagger/OpenAPI docs out of the box
- 🔧 **Production Ready** - Winston logging, error handling, graceful shutdown
- 💼 **Best Practices** - Clean architecture, DI, code linting

## Tech Stack

- **Runtime**: Node.js 20.x
- **Framework**: Express.js 5.x
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 14+ with Prisma ORM 7.x
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Dependency Injection**: Inversify
- **Testing**: Jest with ts-jest
- **Logging**: Winston with file rotation
- **API Docs**: Swagger/OpenAPI

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/kumarsonu676/node-express-prisma-starter-rest-api.git
cd node-express-prisma-starter-rest-api

# Start with Docker
docker-compose up --build
```

### Manual Setup

```bash
# Clone and install
git clone https://github.com/kumarsonu676/node-express-prisma-starter-rest-api.git
cd node-express-prisma-starter-rest-api
npm install

# Setup environment
cp .env.example .env

# Start PostgreSQL with Docker
docker run -d -p 5432:5432 -e POSTGRES_USER=app -e POSTGRES_PASSWORD=password -e POSTGRES_DB=app postgres:14

# Generate client & run migrations
npm run generate_prisma_client
npm run update_database

# Start development server
npm run dev
```

Server runs on `http://localhost:3001`

## Features

### Authentication & Authorization

- JWT access + refresh token authentication
- Role-based access control (RBAC)
- Secure password hashing with bcrypt

### API & Data

- RESTful API design
- Prisma ORM with PostgreSQL
- Input validation with Zod
- Swagger documentation at `/api/docs`

### Security

- Helmet.js for HTTP headers
- Rate limiting
- CORS configuration
- Request ID tracking

### Developer Experience

- Hot reload with nodemon
- TypeScript strict mode
- Prettier code formatting
- Commit message linting
- Git hooks with Husky

### Production Ready

- Winston logging with rotation
- Global error handling
- Graceful shutdown
- Docker multi-stage build

## Available Scripts

| Command                 | Description               |
| ----------------------- | ------------------------- |
| `npm run dev`           | Start development server  |
| `npm run build`         | Compile TypeScript        |
| `npm run start`         | Start production server   |
| `npm run test`          | Run all tests             |
| `npm run test:watch`    | Run tests in watch mode   |
| `npm run test:coverage` | Run tests with coverage   |
| `npm run format`        | Format code with Prettier |
| `npm run lint`          | Check code formatting     |

## Project Structure

```text
src/
├── config/              # App configuration, IoC container
├── integrations/       # External services
│   ├── notification/   # Email (SMTP)
│   ├── payment/        # Stripe
│   └── upload/         # Azure Blob Storage
├── middleware/         # Express middleware
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── validate.middleware.ts
│   └── ...
├── modules/            # Feature modules
│   └── {module}/
│       ├── {module}.controller.ts
│       ├── {module}.service.ts
│       ├── {module}.repository.ts
│       ├── {module}.routes.ts
│       ├── {module}.types.ts
│       └── {module}.validation.ts
├── routes/             # Route registration
├── services/           # Shared services
├── tests/             # Test files
├── types/             # Global types
├── utils/             # Utilities
└── app.ts             # Express app setup
```

## API Documentation

Swagger docs available at: `http://localhost:3001/api/docs`

## Authentication

Include tokens in Authorization header:

```text
Authorization: Bearer <access_token>
```

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

ISC License - see [LICENSE](LICENSE) for details.
