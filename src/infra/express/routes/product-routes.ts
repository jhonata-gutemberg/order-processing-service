import { Router } from "express";
import { container } from "tsyringe";
import { ProductController } from "@/api/products/controllers";

export function productRoutes() {
    const router = Router();
    const productController = container.resolve(ProductController);
    router.post("/products", productController.create);
    router.patch("/products/:id/stock", productController.updateStock);
    router.get("/products", productController.search);
    return router;
}
