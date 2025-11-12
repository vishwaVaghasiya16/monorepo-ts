import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createLogger, ApiResponse, User } from "@monorepo/common";
import { authService } from "../services/auth.service";

const logger = createLogger("auth-controller");
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const authController = {
  async register(data: { email: string; password: string; name: string }) {
    try {
      const { email, password, name } = data;

      if (!email || !password || !name) {
        return {
          success: false,
          error: "Email, password, and name are required",
        };
      }

      const user = await authService.createUser({ email, password, name });
      const token = generateToken(user);

      logger.info("User registered", { userId: user.id, email: user.email });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
        message: "User registered successfully",
      };
    } catch (error: any) {
      logger.error("Registration error", { error: error.message });
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  },

  async login(data: { email: string; password: string }) {
    try {
      const { email, password } = data;

      if (!email || !password) {
        return {
          success: false,
          error: "Email and password are required",
        };
      }

      const user = await authService.findUserByEmail(email);
      if (!user) {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }

      const token = generateToken(user);

      logger.info("User logged in", { userId: user.id, email: user.email });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
        message: "Login successful",
      };
    } catch (error: any) {
      logger.error("Login error", { error: error.message });
      return {
        success: false,
        error: error.message || "Login failed",
      };
    }
  },

  async verify(data: { token: string }) {
    try {
      const { token } = data;

      if (!token) {
        return {
          success: false,
          error: "Token is required",
        };
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await authService.findUserById(decoded.id);

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        message: "Token verified",
      };
    } catch (error: any) {
      logger.error("Token verification error", { error: error.message });
      return {
        success: false,
        error: "Invalid or expired token",
      };
    }
  },
};

function generateToken(user: User & { password: string }) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}
