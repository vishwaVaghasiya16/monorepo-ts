import { createLogger, ApiResponse } from "@monorepo/common";
import { productService } from "../services/product.service";

const logger = createLogger("product-controller");

export const productController = {
  async getAll() {
    try {
      const products = await productService.getAll();
      return {
        success: true,
        data: products,
        message: "Products retrieved successfully",
      };
    } catch (error: any) {
      logger.error("Get all products error", { error: error.message });
      return {
        success: false,
        error: error.message || "Failed to retrieve products",
      };
    }
  },

  async getById(id: string) {
    try {
      const product = await productService.getById(id);
      if (!product) {
        return {
          success: false,
          error: "Product not found",
        };
      }
      return {
        success: true,
        data: product,
        message: "Product retrieved successfully",
      };
    } catch (error: any) {
      logger.error("Get product by id error", { error: error.message, id });
      return {
        success: false,
        error: error.message || "Failed to retrieve product",
      };
    }
  },

  async create(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
  }) {
    try {
      const { name, description, price, stock } = data;

      if (!name || !description || price === undefined || stock === undefined) {
        return {
          success: false,
          error: "Name, description, price, and stock are required",
        };
      }

      if (price < 0 || stock < 0) {
        return {
          success: false,
          error: "Price and stock must be non-negative",
        };
      }

      const product = await productService.create({
        name,
        description,
        price,
        stock,
      });
      logger.info("Product created", {
        productId: product.id,
        name: product.name,
      });

      return {
        success: true,
        data: product,
        message: "Product created successfully",
      };
    } catch (error: any) {
      logger.error("Create product error", { error: error.message });
      return {
        success: false,
        error: error.message || "Failed to create product",
      };
    }
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
    }>
  ) {
    try {
      const product = await productService.update(id, data);
      if (!product) {
        return {
          success: false,
          error: "Product not found",
        };
      }

      logger.info("Product updated", { productId: id });
      return {
        success: true,
        data: product,
        message: "Product updated successfully",
      };
    } catch (error: any) {
      logger.error("Update product error", { error: error.message, id });
      return {
        success: false,
        error: error.message || "Failed to update product",
      };
    }
  },

  async delete(id: string) {
    try {
      const deleted = await productService.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: "Product not found",
        };
      }

      logger.info("Product deleted", { productId: id });
      return {
        success: true,
        message: "Product deleted successfully",
      };
    } catch (error: any) {
      logger.error("Delete product error", { error: error.message, id });
      return {
        success: false,
        error: error.message || "Failed to delete product",
      };
    }
  },
};
