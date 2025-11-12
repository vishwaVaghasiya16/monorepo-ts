import express from "express";
import {
  createLogger,
  SERVICE_PORTS,
  SERVICE_NAMES,
  errorHandler,
  notFoundHandler,
  requestLogger,
  asyncHandler,
  ApiResponse,
  User,
} from "@monorepo/common";
import { authRoutes } from "./routes/auth.routes";

const app = express();
const logger = createLogger(SERVICE_NAMES.AUTH);
const PORT = process.env.PORT || SERVICE_PORTS.AUTH;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: SERVICE_NAMES.AUTH });
});

app.use("/api/auth", authRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Auth Service running on port ${PORT}`);
});
