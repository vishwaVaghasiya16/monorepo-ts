import { Router, Request, Response } from "express";
import { asyncHandler, ApiResponse, HTTP_STATUS } from "@monorepo/common";
import { authController } from "../controllers/auth.controller";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const result = await authController.register(req.body);
    res.status(HTTP_STATUS.CREATED).json(result);
  })
);

authRoutes.post(
  "/login",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const result = await authController.login(req.body);
    res.status(HTTP_STATUS.OK).json(result);
  })
);

authRoutes.post(
  "/verify",
  asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const result = await authController.verify(req.body);
    res.status(HTTP_STATUS.OK).json(result);
  })
);
