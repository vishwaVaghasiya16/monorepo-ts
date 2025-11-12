import { Router, Request, Response } from "express";
import {
  asyncHandler,
  ApiResponse,
  HTTP_STATUS,
  AuthRequest,
} from "@monorepo/common";
import { orderController } from "../controllers/order.controller";

export const orderRoutes = Router();

orderRoutes.get(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
    const result = await orderController.getAll(req.user!.id);
    res.status(HTTP_STATUS.OK).json(result);
  })
);

orderRoutes.get(
  "/:id",
  asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
    const result = await orderController.getById(req.params.id, req.user!.id);
    res.status(HTTP_STATUS.OK).json(result);
  })
);

orderRoutes.post(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
    const token = req.headers.authorization;
    const result = await orderController.create(req.user!.id, req.body, token);
    res.status(HTTP_STATUS.CREATED).json(result);
  })
);

orderRoutes.put(
  "/:id",
  asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
    const result = await orderController.update(
      req.params.id,
      req.user!.id,
      req.body
    );
    res.status(HTTP_STATUS.OK).json(result);
  })
);

orderRoutes.post(
  "/:id/cancel",
  asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
    const result = await orderController.cancel(req.params.id, req.user!.id);
    res.status(HTTP_STATUS.OK).json(result);
  })
);
