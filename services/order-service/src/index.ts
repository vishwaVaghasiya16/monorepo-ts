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
import { orderRoutes } from "./routes/order.routes";

const app = express();
const logger = createLogger(SERVICE_NAMES.ORDER);
const PORT = process.env.PORT || SERVICE_PORTS.ORDER;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: SERVICE_NAMES.ORDER });
});

app.use("/api/orders", authMiddleware, orderRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Order Service running on port ${PORT}`);
});
