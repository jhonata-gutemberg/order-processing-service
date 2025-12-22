import { inject, injectable } from "tsyringe";
import { ORDER_REPOSITORY_TOKEN } from "@/infra/di/tokens";
import { OrderRepository } from "@/domain/orders/contracts/repositories";
import { OrderNotFoundException } from "@/domain/orders/models/exceptions";

@injectable()
export class GetOrderByIdUseCase {
    constructor(
        @inject(ORDER_REPOSITORY_TOKEN)
        private readonly orderRepository: OrderRepository,
    ) {}

    public async perform(id: string) {
        const order = await this.orderRepository.findById(id);
        if (order == null) {
            throw new OrderNotFoundException(`order ${id} not found`);
        }
        return order;
    }
}
