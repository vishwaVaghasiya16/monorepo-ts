# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed

## Setup (5 minutes)

1. **Install dependencies:**

```bash
npm install
```

2. **Build the shared library:**

```bash
npm run build --workspace=packages/common
```

3. **Start all services:**

```bash
npm run dev
```

This will start:

- Auth Service on `http://localhost:3001`
- Product Service on `http://localhost:3002`
- Order Service on `http://localhost:3003`

## Test the Services

### 1. Register a User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Save the `token` from the response.

### 2. Create a Product

```bash
curl -X POST http://localhost:3002/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 50
  }'
```

Save the `id` from the response.

### 3. Create an Order

```bash
curl -X POST http://localhost:3003/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "productId": "PRODUCT_ID_HERE",
        "quantity": 2
      }
    ]
  }'
```

### 4. View Your Orders

```bash
curl -X GET http://localhost:3003/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Using Docker

1. **Build and start all services:**

```bash
docker-compose up --build
```

2. **Services will be available on the same ports:**

- Auth Service: `http://localhost:3001`
- Product Service: `http://localhost:3002`
- Order Service: `http://localhost:3003`

## Health Checks

Check if services are running:

```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

## Troubleshooting

- **Port already in use**: Change the port in the service's `index.ts` or set `PORT` environment variable
- **Module not found**: Run `npm install` from the root directory
- **Build errors**: Make sure you've built the common package first: `npm run build --workspace=packages/common`
