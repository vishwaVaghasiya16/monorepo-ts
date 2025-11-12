export const SERVICE_PORTS = {
  AUTH: 3001,
  PRODUCT: 3002,
  ORDER: 3003,
} as const;

export const SERVICE_NAMES = {
  AUTH: "auth-service",
  PRODUCT: "product-service",
  ORDER: "order-service",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    VERIFY: "/api/auth/verify",
  },
  PRODUCT: {
    LIST: "/api/products",
    GET: "/api/products/:id",
    CREATE: "/api/products",
    UPDATE: "/api/products/:id",
    DELETE: "/api/products/:id",
  },
  ORDER: {
    LIST: "/api/orders",
    GET: "/api/orders/:id",
    CREATE: "/api/orders",
    UPDATE: "/api/orders/:id",
    CANCEL: "/api/orders/:id/cancel",
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
