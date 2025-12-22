import {
    IsArray,
    IsNumber,
    IsUUID,
    Min,
    validateOrReject,
} from "class-validator";
import { UUIDGenerator } from "@/domain/shared/generators";
import { OrderItem, OrderItemProps } from "./order-item";

export type OrderProps = {
    id?: string;
    customerId: string;
    items: OrderItemProps[];
};

export class Order {
    @IsUUID()
    public readonly id: string;

    @IsUUID()
    public readonly customerId: string;

    @IsArray()
    public readonly items: OrderItem[];

    @IsNumber()
    @Min(0)
    public readonly total: number;

    private constructor(
        id: string = UUIDGenerator.generate(),
        customerId: string,
        items: OrderItem[],
    ) {
        this.id = id;
        this.customerId = customerId;
        this.items = items;
        this.total = Number(
            items.reduce((acc, item) => acc + item.total, 0).toFixed(2),
        );
    }

    public static async create(props: OrderProps) {
        const items = await Promise.all(
            props.items.map((item) => OrderItem.create(item)),
        );
        const order = new Order(props.id, props.customerId, items);
        await validateOrReject(order);
        return order;
    }
}
