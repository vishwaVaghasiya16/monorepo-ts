FROM node:18-alpine

WORKDIR /app

# Copy root package.json
COPY package.json ./

# Copy common package
COPY packages/common/package.json packages/common/package.json
COPY packages/common/tsconfig.json packages/common/tsconfig.json
COPY packages/common/src packages/common/src

# Copy service package
COPY services/auth-service/package.json services/auth-service/package.json
COPY services/auth-service/tsconfig.json services/auth-service/tsconfig.json
COPY services/auth-service/src services/auth-service/src

# Install dependencies
RUN npm install

# Build common package first
WORKDIR /app/packages/common
RUN npm run build

# Build service
WORKDIR /app/services/auth-service
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]

