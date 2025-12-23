import {
    IsInt,
    IsNumber,
    IsString,
    IsUUID,
    Min,
    MinLength,
    validateOrReject,
} from "class-validator";
import { UUIDGenerator } from "@/domain/shared/generators";
import { InsufficientStockException } from "@/domain/orders/models/exceptions";

export type ProductProps = {
    id?: string;
    name: string;
    price: number;
    stock: number;
};

export class Product {
    @IsUUID()
    public readonly id: string;

    @IsString()
    @MinLength(1)
    public readonly name: string;

    @IsNumber()
    @Min(0)
    public readonly price: number;

    @IsInt()
    @Min(0)
    public stock: number;

    private constructor(
        id: string = UUIDGenerator.generate(),
        name: string,
        price: number,
        stock: number,
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    public static async create(props: ProductProps) {
        const { id, name, price, stock } = props;
        const product = new Product(id, name, price, stock);
        await validateOrReject(product);
        return product;
    }

    public async updateStock(stock: number) {
        this.stock = stock;
        await validateOrReject(this);
    }

    public reserveStock(quantity: number) {
        if (this.stock < quantity) {
            throw new InsufficientStockException(
                `insufficient stock for product ${this.id}`,
            );
        }
        this.stock -= quantity;
    }
}
