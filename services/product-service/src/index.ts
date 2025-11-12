import express from "express";
import {
  createLogger,
  SERVICE_PORTS,
  SERVICE_NAMES,
  errorHandler,
  notFoundHandler,
  requestLogger,
  authMiddleware,
} from "@monorepo/common";
import { productRoutes } from "./routes/product.routes";

const app = express();
const logger = createLogger(SERVICE_NAMES.PRODUCT);
const PORT = process.env.PORT || SERVICE_PORTS.PRODUCT;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: SERVICE_NAMES.PRODUCT });
});

app.use("/api/products", authMiddleware, productRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Product Service running on port ${PORT}`);
});
