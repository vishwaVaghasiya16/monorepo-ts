import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { createLogger, User } from "@monorepo/common";

const logger = createLogger("auth-service");

// In-memory database (in production, use a real database)
const users: (User & { password: string })[] = [];

export const authService = {
  async createUser(data: { email: string; password: string; name: string }) {
    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user: User & { password: string } = {
      id: uuidv4(),
      email: data.email,
      name: data.name,
      role: "user",
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.push(user);
    logger.info("User created", { userId: user.id, email: user.email });

    return user;
  },

  async findUserByEmail(email: string) {
    return users.find((u) => u.email === email) || null;
  },

  async findUserById(id: string) {
    return users.find((u) => u.id === id) || null;
  },
};
