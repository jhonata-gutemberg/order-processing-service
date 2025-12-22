import { inject, injectable } from "tsyringe";
import { ProductRepository } from "@/domain/products/contracts/repositories";
import { ProductNotFoundException } from "@/domain/products/models/exceptions";
import { PRODUCT_REPOSITORY_TOKEN } from "@/infra/di/tokens";

export type UpdateProductStockUseCaseProps = {
    id: string;
    stock: number;
};

@injectable()
export class UpdateProductStockUseCase {
    constructor(
        @inject(PRODUCT_REPOSITORY_TOKEN)
        private readonly productRepository: ProductRepository,
    ) {}

    public async perform(props: UpdateProductStockUseCaseProps) {
        const { id, stock } = props;
        const product = await this.productRepository.findById(id);
        if (product == null) {
            throw new ProductNotFoundException(`product ${id} not found`);
        }
        await product.updateStock(stock);
        return await this.productRepository.save(product);
    }
}
