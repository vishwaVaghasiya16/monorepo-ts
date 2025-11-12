import { createLogger, ApiResponse, Order } from "@monorepo/common";
import { orderService } from "../services/order.service";

const logger = createLogger("order-controller");

export const orderController = {
  async getAll(userId: string) {
    try {
      const orders = await orderService.getByUserId(userId);
      return {
        success: true,
        data: orders,
        message: "Orders retrieved successfully",
      };
    } catch (error: any) {
      logger.error("Get all orders error", { error: error.message, userId });
      return {
        success: false,
        error: error.message || "Failed to retrieve orders",
      };
    }
  },

  async getById(orderId: string, userId: string) {
    try {
      const order = await orderService.getById(orderId);
      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      if (order.userId !== userId) {
        return {
          success: false,
          error: "Unauthorized to access this order",
        };
      }

      return {
        success: true,
        data: order,
        message: "Order retrieved successfully",
      };
    } catch (error: any) {
      logger.error("Get order by id error", {
        error: error.message,
        orderId,
        userId,
      });
      return {
        success: false,
        error: error.message || "Failed to retrieve order",
      };
    }
  },

  async create(
    userId: string,
    data: { products: Array<{ productId: string; quantity: number }> },
    token?: string
  ) {
    try {
      const { products } = data;

      if (!products || !Array.isArray(products) || products.length === 0) {
        return {
          success: false,
          error: "Products array is required and must not be empty",
        };
      }

      const order = await orderService.create(userId, products, token);
      logger.info("Order created", { orderId: order.id, userId });

      return {
        success: true,
        data: order,
        message: "Order created successfully",
      };
    } catch (error: any) {
      logger.error("Create order error", { error: error.message, userId });
      return {
        success: false,
        error: error.message || "Failed to create order",
      };
    }
  },

  async update(
    orderId: string,
    userId: string,
    data: { status?: Order["status"] }
  ) {
    try {
      const order = await orderService.getById(orderId);
      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      if (order.userId !== userId) {
        return {
          success: false,
          error: "Unauthorized to update this order",
        };
      }

      const updatedOrder = await orderService.update(orderId, data);
      logger.info("Order updated", { orderId, userId });

      return {
        success: true,
        data: updatedOrder,
        message: "Order updated successfully",
      };
    } catch (error: any) {
      logger.error("Update order error", {
        error: error.message,
        orderId,
        userId,
      });
      return {
        success: false,
        error: error.message || "Failed to update order",
      };
    }
  },

  async cancel(orderId: string, userId: string) {
    try {
      const order = await orderService.getById(orderId);
      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      if (order.userId !== userId) {
        return {
          success: false,
          error: "Unauthorized to cancel this order",
        };
      }

      if (order.status === "cancelled") {
        return {
          success: false,
          error: "Order is already cancelled",
        };
      }

      if (order.status === "completed") {
        return {
          success: false,
          error: "Cannot cancel a completed order",
        };
      }

      const updatedOrder = await orderService.update(orderId, {
        status: "cancelled",
      });
      logger.info("Order cancelled", { orderId, userId });

      return {
        success: true,
        data: updatedOrder,
        message: "Order cancelled successfully",
      };
    } catch (error: any) {
      logger.error("Cancel order error", {
        error: error.message,
        orderId,
        userId,
      });
      return {
        success: false,
        error: error.message || "Failed to cancel order",
      };
    }
  },
};
