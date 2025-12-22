import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { z } from "zod";
import {
    CreateProductUseCase,
    UpdateProductStockUseCase,
} from "@/domain/products/use-cases";
import { PRODUCT_REPOSITORY_TOKEN } from "@/infra/di/tokens";
import { ProductRepository } from "@/domain/products/contracts/repositories";
import { Page } from "@/domain/shared/models/value-objects";
import {
    ProductInputSchema,
    UpdateProductStockInputSchema,
} from "@/api/products/schemas";
import { Product } from "@/domain/products/models/entities";
import { PageQueryParamsSchema } from "@/api/shared/schemas";
import { PageQueryParamsMapper } from "@/api/shared/mappers";

@injectable()
export class ProductController {
    constructor(
        @inject(CreateProductUseCase)
        private readonly createProductUseCase: CreateProductUseCase,
        @inject(UpdateProductStockUseCase)
        private readonly updateProductStockUseCase: UpdateProductStockUseCase,
        @inject(PRODUCT_REPOSITORY_TOKEN)
        private readonly productRepository: ProductRepository,
    ) {}

    public create = async (req: Request, res: Response<Product>) => {
        const props = await ProductInputSchema.parseAsync(req.body);
        const product = await this.createProductUseCase.perform(props);
        res.status(201).send(product);
    };

    public updateStock = async (req: Request, res: Response<Product>) => {
        const id = z.uuidv4().parse(req.params.id);
        const body = await UpdateProductStockInputSchema.parseAsync(req.body);
        const product = await this.updateProductStockUseCase.perform({
            id,
            stock: body.stock,
        });
        res.send(product);
    };

    public search = async (req: Request, res: Response<Page<Product>>) => {
        const pageQueryParams = PageQueryParamsSchema.parse(req.query);
        const pageable =
            await PageQueryParamsMapper.toPageable(pageQueryParams);
        const page = await this.productRepository.findAll(pageable);
        res.send(page);
    };
}
