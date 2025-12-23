import { inject, injectable } from "tsyringe";
import { GetCustomerByIdUseCase } from "@/domain/customers/use-cases";
import { CreateOrderUseCase } from "@/domain/orders/use-cases";

export type CreateOrderOrchestratorItemProps = {
    productId: string;
    quantity: number;
};

export type CreateOrderOrchestratorProps = {
    customerId: string;
    items: CreateOrderOrchestratorItemProps[];
};

@injectable()
export class CreateOrderOrchestrator {
    constructor(
        @inject(GetCustomerByIdUseCase)
        private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
        @inject(CreateOrderUseCase)
        private readonly createOrderUseCase: CreateOrderUseCase,
    ) {}

    public async perform(props: CreateOrderOrchestratorProps) {
        const { customerId, items } = props;
        await this.getCustomerByIdUseCase.perform(customerId);
        return await this.createOrderUseCase.perform({ customerId, items });
    }
}
