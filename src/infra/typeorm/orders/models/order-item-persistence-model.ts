import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OrderPersistenceModel } from "./order-persistence-model";
import { numericTransformer } from "@/infra/typeorm/transformers";

@Entity({ name: "order_items" })
export class OrderItemPersistenceModel {
    @PrimaryColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    orderId!: string;

    @ManyToOne(() => OrderPersistenceModel, (order) => order.items, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "orderId" })
    order!: OrderPersistenceModel;

    @Column({ type: "uuid" })
    productId!: string;

    @Column({ type: "integer" })
    quantity!: number;

    @Column({
        type: "numeric",
        precision: 12,
        scale: 2,
        transformer: numericTransformer,
    })
    unitPrice!: number;

    @Column({
        type: "numeric",
        precision: 12,
        scale: 2,
        transformer: numericTransformer,
    })
    total!: number;
}
