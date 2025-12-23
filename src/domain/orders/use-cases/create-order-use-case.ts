import { inject, injectable } from "tsyringe";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { ProductRepository } from "@/domain/products/contracts/repositories";
import { ProductNotFoundException } from "@/domain/products/models/exceptions";
import { Product } from "@/domain/products/models/entities";
import { OrderRepository } from "@/domain/orders/contracts/repositories";
import { Order } from "@/domain/orders/models/entities";
import {
    CUSTOMER_REPOSITORY_TOKEN,
    PRODUCT_REPOSITORY_TOKEN,
    ORDER_REPOSITORY_TOKEN,
} from "@/infra/di/tokens";

export type CreateOrderUseCaseItemProps = {
    productId: string;
    quantity: number;
};

export type CreateOrderUseCaseProps = {
    customerId: string;
    items: CreateOrderUseCaseItemProps[];
};

@injectable()
export class CreateOrderUseCase {
    constructor(
        @inject(CUSTOMER_REPOSITORY_TOKEN)
        private readonly customerRepository: CustomerRepository,
        @inject(PRODUCT_REPOSITORY_TOKEN)
        private readonly productRepository: ProductRepository,
        @inject(ORDER_REPOSITORY_TOKEN)
        private readonly orderRepository: OrderRepository,
    ) {}

    public async perform(props: CreateOrderUseCaseProps) {
        const { customerId, items } = props;
        const quantityByProductId = this.groupQuantityByProductId(items);
        const productIds = quantityByProductId.keys().toArray();
        const products: Product[] =
            await this.productRepository.findByIds(productIds);
        const productsById = this.groupProductsById(products);
        this.checkForMissingProducts(productIds, productsById);
        await this.reserveStock(products, quantityByProductId);
        return this.createOrder(customerId, items, productsById);
    }

    private groupQuantityByProductId(items: CreateOrderUseCaseItemProps[]) {
        const quantityByProductId = new Map<string, number>();
        for (const item of items) {
            const quantity = quantityByProductId.get(item.productId) ?? 0;
            quantityByProductId.set(item.productId, quantity + item.quantity);
        }
        return quantityByProductId;
    }

    private groupProductsById(products: Product[]) {
        return new Map<string, Product>(
            products.map((product) => [product.id, product]),
        );
    }

    private checkForMissingProducts(
        productIds: string[],
        productsById: Map<string, Product>,
    ) {
        const missingProductIds = productIds.filter(
            (productId) => !productsById.has(productId),
        );
        if (missingProductIds.length > 0) {
            throw new ProductNotFoundException(
                `products ${missingProductIds.join(", ")} not found`,
            );
        }
    }

    private async reserveStock(
        products: Product[],
        quantityByProductId: Map<string, number>,
    ) {
        products.forEach((product) => {
            const quantity = quantityByProductId.get(product.id)!;
            product.reserveStock(quantity);
        });
        await this.productRepository.saveAll(products);
    }

    private async createOrder(
        customerId: string,
        items: CreateOrderUseCaseItemProps[],
        productsById: Map<string, Product>,
    ) {
        const order = await Order.create({
            customerId,
            items: items.map(({ productId, quantity }) => {
                const { price: unitPrice } = productsById.get(productId)!;
                return {
                    productId,
                    quantity,
                    unitPrice,
                };
            }),
        });
        return this.orderRepository.save(order);
    }
}
