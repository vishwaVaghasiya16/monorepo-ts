FROM node:18-alpine

WORKDIR /app

# Copy root package.json
COPY package.json ./

# Copy common package
COPY packages/common/package.json packages/common/package.json
COPY packages/common/tsconfig.json packages/common/tsconfig.json
COPY packages/common/src packages/common/src

# Copy service package
COPY services/order-service/package.json services/order-service/package.json
COPY services/order-service/tsconfig.json services/order-service/tsconfig.json
COPY services/order-service/src services/order-service/src

# Install dependencies
RUN npm install

# Build common package first
WORKDIR /app/packages/common
RUN npm run build

# Build service
WORKDIR /app/services/order-service
RUN npm run build

EXPOSE 3003

CMD ["npm", "start"]

