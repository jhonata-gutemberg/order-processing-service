import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { z } from "zod";
import { CreateOrderUseCase, GetOrderByIdUseCase } from "@/domain/orders/use-cases";
import { OrderInputSchema } from "@/api/orders/schemas";
import { Order } from "@/domain/orders/models/entities";

@injectable()
export class OrderController {
    constructor(
        @inject(CreateOrderUseCase)
        private readonly createOrderUseCase: CreateOrderUseCase,
        @inject(GetOrderByIdUseCase)
        private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    ) {}

    public create = async (req: Request, res: Response<Order>) => {
        const props = await OrderInputSchema.parseAsync(req.body);
        const order = await this.createOrderUseCase.perform(props);
        res.status(201).send(order);
    };

    public getById = async (req: Request, res: Response<Order>) => {
        const id = z.uuidv4().parse(req.params.id);
        const order = await this.getOrderByIdUseCase.perform(id);
        res.send(order);
    };
}
