import { inject, injectable } from "tsyringe";
import { ProductRepository } from "@/domain/products/contracts/repositories";
import { Product } from "@/domain/products/models/entities";
import { PRODUCT_REPOSITORY_TOKEN } from "@/infra/di/tokens";

export type CreateProductUseCaseProps = {
    name: string;
    price: number;
    stock: number;
};

@injectable()
export class CreateProductUseCase {
    constructor(
        @inject(PRODUCT_REPOSITORY_TOKEN)
        private readonly productRepository: ProductRepository,
    ) {}

    public async perform(props: CreateProductUseCaseProps) {
        const product = await Product.create(props);
        return await this.productRepository.save(product);
    }
}
