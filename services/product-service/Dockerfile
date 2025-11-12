FROM node:18-alpine

WORKDIR /app

# Copy root package.json
COPY package.json ./

# Copy common package
COPY packages/common/package.json packages/common/package.json
COPY packages/common/tsconfig.json packages/common/tsconfig.json
COPY packages/common/src packages/common/src

# Copy service package
COPY services/product-service/package.json services/product-service/package.json
COPY services/product-service/tsconfig.json services/product-service/tsconfig.json
COPY services/product-service/src services/product-service/src

# Install dependencies
RUN npm install

# Build common package first
WORKDIR /app/packages/common
RUN npm run build

# Build service
WORKDIR /app/services/product-service
RUN npm run build

EXPOSE 3002

CMD ["npm", "start"]

