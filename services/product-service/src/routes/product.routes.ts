import { Router, Request, Response } from "express";
import { asyncHandler, ApiResponse, HTTP_STATUS } from "@monorepo/common";
import { productController } from "../controllers/product.controller";

export const productRoutes = Router();

productRoutes.get(
  "/",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const result = await productController.getAll();
    res.status(HTTP_STATUS.OK).json(result);
  })
);

productRoutes.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const result = await productController.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json(result);
  })
);

productRoutes.post(
  "/",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const result = await productController.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(result);
  })
);

productRoutes.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const result = await productController.update(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json(result);
  })
);

productRoutes.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const result = await productController.delete(req.params.id);
    res.status(HTTP_STATUS.OK).json(result);
  })
);
