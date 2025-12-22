import { inject, injectable } from "tsyringe";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { CustomerNotFoundException } from "@/domain/customers/models/exceptions";
import { ProductRepository } from "@/domain/products/contracts/repositories";
import { ProductNotFoundException } from "@/domain/products/models/exceptions";
import { Product } from "@/domain/products/models/entities";
import { OrderRepository } from "@/domain/orders/contracts/repositories";
import { Order } from "@/domain/orders/models/entities";
import { InsufficientStockException } from "@/domain/orders/models/exceptions";
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

        const customer = await this.customerRepository.findById(customerId);
        if (customer == null) {
            throw new CustomerNotFoundException(
                `customer ${customerId} not found`,
            );
        }

        const productsById = new Map<string, Product>();

        for (const item of items) {
            const product = await this.productRepository.findById(item.productId);
            if (product == null) {
                throw new ProductNotFoundException(
                    `product ${item.productId} not found`,
                );
            }
            productsById.set(item.productId, product);
        }

        for (const item of items) {
            const product = productsById.get(item.productId);
            if (product == null) {
                throw new ProductNotFoundException(
                    `product ${item.productId} not found`,
                );
            }
            if (product.stock < item.quantity) {
                throw new InsufficientStockException(
                    `insufficient stock for product ${product.id}`,
                );
            }
        }

        for (const item of items) {
            const product = productsById.get(item.productId)!;
            await product.updateStock(product.stock - item.quantity);
            await this.productRepository.save(product);
        }

        const order = await Order.create({
            customerId,
            items: items.map((item) => {
                const product = productsById.get(item.productId)!;
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: product.price,
                };
            }),
        });

        return await this.orderRepository.save(order);
    }
}
