# Node.js Monorepo Microservices Demo

A production-style Node.js monorepo demonstrating microservices architecture with shared modules, inter-service communication, and containerization.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Services](#services)
- [Shared Library](#shared-library)
- [Getting Started](#getting-started)
- [Development](#development)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Understanding the Architecture](#understanding-the-architecture)

## 🏗️ Architecture Overview

This monorepo implements a microservices architecture with three independent services:

1. **Auth Service** - Handles user authentication and authorization
2. **Product Service** - Manages product catalog
3. **Order Service** - Processes orders and integrates with Product Service

All services share common utilities through a shared package (`@monorepo/common`).

### Key Features

- ✅ **Monorepo Structure** - Single repository with multiple services
- ✅ **Shared Code** - Common utilities, types, and middleware
- ✅ **Inter-Service Communication** - Order Service communicates with Product Service
- ✅ **TypeScript** - Full type safety across services
- ✅ **Docker Support** - Containerized services with Docker Compose
- ✅ **Structured Logging** - Winston-based logging with service identification
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Authentication** - JWT-based authentication with middleware

## 📁 Project Structure

```
.
├── packages/
│   └── common/                 # Shared library
│       ├── src/
│       │   ├── types/          # TypeScript types and interfaces
│       │   ├── constants/      # Service constants and configurations
│       │   ├── logger/         # Winston logger setup
│       │   ├── middleware/     # Express middleware (auth, error handling)
│       │   └── index.ts        # Public exports
│       ├── package.json
│       └── tsconfig.json
├── services/
│   ├── auth-service/           # Authentication microservice
│   │   ├── src/
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── services/       # Business logic
│   │   │   ├── routes/         # API routes
│   │   │   └── index.ts        # Service entry point
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── product-service/        # Product management microservice
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   └── order-service/          # Order management microservice
│       ├── src/
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── routes/
│       │   └── index.ts
│       ├── Dockerfile
│       └── package.json
├── docker-compose.yml          # Docker Compose configuration
├── package.json                # Root package.json with workspaces
└── README.md

```

## 🔧 Services

### Auth Service (Port 3001)

Handles user authentication and authorization.

**Endpoints:**

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/verify` - Verify JWT token

**Features:**

- Password hashing with bcrypt
- JWT token generation and verification
- User management (in-memory storage)

### Product Service (Port 3002)

Manages product catalog.

**Endpoints:**

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

**Features:**

- Protected routes (requires authentication)
- Product CRUD operations
- Stock management

### Order Service (Port 3003)

Processes customer orders.

**Endpoints:**

- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update order status
- `POST /api/orders/:id/cancel` - Cancel an order

**Features:**

- Protected routes (requires authentication)
- Inter-service communication with Product Service
- Order validation and stock checking
- Order status management

## 📦 Shared Library

The `@monorepo/common` package provides shared utilities:

### Types (`packages/common/src/types/`)

- `User` - User interface
- `Product` - Product interface
- `Order` - Order interface
- `OrderItem` - Order item interface
- `ApiResponse` - Standard API response format
- `AuthRequest` - Express request with user context

### Constants (`packages/common/src/constants/`)

- Service ports configuration
- Service names
- API endpoints
- HTTP status codes

### Logger (`packages/common/src/logger/`)

- Winston-based structured logging
- Service-specific log files
- Console and file transports
- Request logging

### Middleware (`packages/common/src/middleware/`)

- `authMiddleware` - JWT token validation
- `errorHandler` - Centralized error handling
- `notFoundHandler` - 404 handler
- `asyncHandler` - Async route wrapper
- `requestLogger` - HTTP request logging

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd "Mono repo"
```

2. Install dependencies:

```bash
npm install
```

3. Build the shared library:

```bash
npm run build --workspace=packages/common
```

## 💻 Development

### Running Services Locally

Run all services concurrently:

```bash
npm run dev
```

Or run services individually:

```bash
# Auth Service
npm run dev --workspace=services/auth-service

# Product Service
npm run dev --workspace=services/product-service

# Order Service
npm run dev --workspace=services/order-service
```

### Building Services

Build all services:

```bash
npm run build
```

Build individual service:

```bash
npm run build --workspace=services/auth-service
```

## 🐳 Docker Deployment

### Using Docker Compose

Build and start all services:

```bash
docker-compose up --build
```

Start services in detached mode:

```bash
docker-compose up -d
```

Stop services:

```bash
docker-compose down
```

View logs:

```bash
docker-compose logs -f
```

### Individual Service Docker Build

Build a specific service:

```bash
docker build -f services/auth-service/Dockerfile -t auth-service .
```

## 📚 API Documentation

### Authentication Flow

1. **Register a new user:**

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

2. **Login:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response includes a JWT token:

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

3. **Use token for authenticated requests:**

```bash
curl -X GET http://localhost:3002/api/products \
  -H "Authorization: Bearer <your-token>"
```

### Product Service Examples

**Create a product:**

```bash
curl -X POST http://localhost:3002/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 50
  }'
```

**List products:**

```bash
curl -X GET http://localhost:3002/api/products \
  -H "Authorization: Bearer <token>"
```

### Order Service Examples

**Create an order:**

```bash
curl -X POST http://localhost:3003/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "productId": "<product-id>",
        "quantity": 2
      }
    ]
  }'
```

**Get user orders:**

```bash
curl -X GET http://localhost:3003/api/orders \
  -H "Authorization: Bearer <token>"
```

## 🧠 Understanding the Architecture

### Monorepo Benefits

1. **Code Sharing**: The `@monorepo/common` package allows all services to share:

   - Type definitions (ensuring consistency)
   - Utility functions (logger, middleware)
   - Constants (ports, endpoints)

2. **Single Source of Truth**: Types are defined once and used everywhere, reducing inconsistencies.

3. **Simplified Development**:
   - Single `npm install` installs all dependencies
   - Shared code changes are immediately available to all services
   - Easier refactoring across services

### Microservices Principles

1. **Service Independence**: Each service:

   - Runs on its own port
   - Has its own database (in-memory for demo)
   - Can be deployed independently
   - Has its own lifecycle

2. **Inter-Service Communication**:

   - Order Service calls Product Service via HTTP
   - Services communicate through well-defined APIs
   - Loose coupling between services

3. **Shared Concerns**:
   - Authentication handled by Auth Service
   - Other services validate tokens using shared middleware
   - Common logging and error handling

### Request Flow Example

**Creating an Order:**

1. Client sends request to Order Service with JWT token
2. Order Service validates token using `authMiddleware` (from common package)
3. Order Service extracts user ID from token
4. Order Service validates products by calling Product Service
5. Product Service validates token and returns product details
6. Order Service checks stock availability
7. Order Service creates order and returns response

### Data Flow

```
Client
  ↓
Order Service (validates auth)
  ↓
Product Service (validates products)
  ↓
Order Service (creates order)
  ↓
Client (receives order)
```

### Key Design Decisions

1. **In-Memory Storage**: For simplicity, all services use in-memory arrays. In production:

   - Use databases (PostgreSQL, MongoDB, etc.)
   - Implement proper data persistence
   - Add database migrations

2. **JWT Authentication**: Simple JWT implementation. In production:

   - Use refresh tokens
   - Implement token rotation
   - Add rate limiting
   - Use secure token storage

3. **HTTP Communication**: Direct HTTP calls between services. In production:

   - Consider message queues (RabbitMQ, Kafka)
   - Implement service discovery
   - Add circuit breakers
   - Use API gateways

4. **Error Handling**: Centralized error middleware. In production:
   - Add error tracking (Sentry, etc.)
   - Implement retry logic
   - Add monitoring and alerting

### Extending the Architecture

To add a new service:

1. Create service directory: `services/new-service/`
2. Add `package.json` with `@monorepo/common` dependency
3. Create service structure (controllers, services, routes)
4. Add to `docker-compose.yml`
5. Update root `package.json` scripts if needed

### Production Considerations

1. **Database**: Replace in-memory storage with real databases
2. **Caching**: Add Redis for caching
3. **Message Queue**: Use RabbitMQ/Kafka for async communication
4. **Service Discovery**: Implement Consul or Eureka
5. **API Gateway**: Add Kong or AWS API Gateway
6. **Monitoring**: Add Prometheus, Grafana, or Datadog
7. **Logging**: Centralize logs with ELK stack or similar
8. **Security**:
   - Use HTTPS
   - Implement rate limiting
   - Add input validation
   - Use environment variables for secrets
9. **Testing**: Add unit, integration, and E2E tests
10. **CI/CD**: Set up automated testing and deployment

## 📝 Environment Variables

Create `.env` files for each service or use environment variables:

**Auth Service:**

- `PORT` - Service port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens

**Product Service:**

- `PORT` - Service port (default: 3002)

**Order Service:**

- `PORT` - Service port (default: 3003)
- `PRODUCT_SERVICE_URL` - Product Service URL (default: http://localhost:3002)
- `INTER_SERVICE_TOKEN` - Token for inter-service communication

## 🤝 Contributing

This is a demo project. For production use, consider:

- Adding comprehensive tests
- Implementing proper database persistence
- Adding API documentation (Swagger/OpenAPI)
- Setting up CI/CD pipelines
- Adding monitoring and observability

## 📄 License

This is a demonstration project for educational purposes.
