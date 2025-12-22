import {
    IsInt,
    IsNumber,
    IsUUID,
    Min,
    validateOrReject,
} from "class-validator";

export type OrderItemProps = {
    productId: string;
    quantity: number;
    unitPrice: number;
};

export class OrderItem {
    @IsUUID()
    public readonly productId: string;

    @IsInt()
    @Min(1)
    public readonly quantity: number;

    @IsNumber()
    @Min(0)
    public readonly unitPrice: number;

    @IsNumber()
    @Min(0)
    public readonly total: number;

    private constructor(productId: string, quantity: number, unitPrice: number) {
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.total = Number((unitPrice * quantity).toFixed(2));
    }

    public static async create(props: OrderItemProps) {
        const item = new OrderItem(props.productId, props.quantity, props.unitPrice);
        await validateOrReject(item);
        return item;
    }
}
