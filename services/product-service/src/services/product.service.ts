import { v4 as uuidv4 } from "uuid";
import { createLogger, Product } from "@monorepo/common";

const logger = createLogger("product-service");

// In-memory database (in production, use a real database)
const products: Product[] = [];

export const productService = {
  async getAll() {
    return products;
  },

  async getById(id: string) {
    return products.find((p) => p.id === id) || null;
  },

  async create(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
  }) {
    const product: Product = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      createdAt: new Date(),
    };

    products.push(product);
    logger.info("Product created", {
      productId: product.id,
      name: product.name,
    });

    return product;
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
    const product = products.find((p) => p.id === id);
    if (!product) {
      return null;
    }

    if (data.name !== undefined) product.name = data.name;
    if (data.description !== undefined) product.description = data.description;
    if (data.price !== undefined) product.price = data.price;
    if (data.stock !== undefined) product.stock = data.stock;

    logger.info("Product updated", { productId: id });
    return product;
  },

  async delete(id: string) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return false;
    }

    products.splice(index, 1);
    logger.info("Product deleted", { productId: id });
    return true;
  },
};
