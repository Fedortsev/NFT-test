import express from "express"
import authMiddleware, { requireAdmin } from './../middleware/auth.js';
import { placeOrder, verifyOrder, userOrders,listOrders,updateStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify", verifyOrder)
orderRouter.get("/userorders",authMiddleware,userOrders)
orderRouter.get('/list',authMiddleware, requireAdmin, listOrders)
orderRouter.post('/status', authMiddleware, requireAdmin, updateStatus)

export default orderRouter;