# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-03-08

### Added

- Initial release
- Authentication with JWT (access + refresh tokens)
- Role-based authorization (ADMIN, USER)
- Country management module
- Health check endpoints
- Email integration (SMTP)
- Payment integration (Stripe)
- File upload integration (Azure Blob Storage)
- Swagger API documentation
- Winston logging with file rotation
- Rate limiting middleware
- Request ID tracking
- Global error handling
- Prisma ORM with PostgreSQL
- Unit and integration tests with Jest

### Tech Stack

- Node.js with Express 5.x
- TypeScript (strict mode)
- PostgreSQL 14+
- Prisma 7.x
- Inversify for DI
- Zod for validation
- Jest for testing
