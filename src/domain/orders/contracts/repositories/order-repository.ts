import { Order } from "@/domain/orders/models/entities";

export interface OrderRepository {
    save(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
}
