import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  createLogger,
  Order,
  OrderItem,
  Product,
  SERVICE_PORTS,
} from "@monorepo/common";

const logger = createLogger("order-service");

// In-memory database (in production, use a real database)
const orders: Order[] = [];

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL ||
  `http://localhost:${SERVICE_PORTS.PRODUCT}`;

export const orderService = {
  async getByUserId(userId: string) {
    return orders.filter((o) => o.userId === userId);
  },

  async getById(id: string) {
    return orders.find((o) => o.id === id) || null;
  },

  async create(
    userId: string,
    products: Array<{ productId: string; quantity: number }>,
    authToken?: string
  ) {
    // Validate products by calling Product Service
    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of products) {
      try {
        // Call Product Service to get product details
        // Pass through the user's auth token for inter-service communication
        const headers: Record<string, string> = {};
        if (authToken) {
          headers.Authorization = authToken;
        }

        const response = await axios.get(
          `${PRODUCT_SERVICE_URL}/api/products/${item.productId}`,
          { headers }
        );

        if (!response.data.success || !response.data.data) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const product: Product = response.data.data;

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        const itemTotal = product.price * item.quantity;
        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });

        total += itemTotal;
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            `Failed to validate product ${item.productId}: ${error.message}`
          );
        }
        throw error;
      }
    }

    const order: Order = {
      id: uuidv4(),
      userId,
      products: orderItems,
      total,
      status: "pending",
      createdAt: new Date(),
    };

    orders.push(order);
    logger.info("Order created", { orderId: order.id, userId, total });

    return order;
  },

  async update(id: string, data: Partial<{ status: Order["status"] }>) {
    const order = orders.find((o) => o.id === id);
    if (!order) {
      return null;
    }

    if (data.status !== undefined) {
      order.status = data.status;
    }

    logger.info("Order updated", { orderId: id, status: order.status });
    return order;
  },
};
