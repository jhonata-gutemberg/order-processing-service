import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { OrderItemPersistenceModel } from "./order-item-persistence-model";
import { numericTransformer } from "@/infra/typeorm/transformers";

@Entity({ name: "orders" })
export class OrderPersistenceModel {
    @PrimaryColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    customerId!: string;

    @OneToMany(() => OrderItemPersistenceModel, (item) => item.order, {
        cascade: true,
        eager: true,
    })
    items!: OrderItemPersistenceModel[];

    @Column({
        type: "numeric",
        precision: 12,
        scale: 2,
        transformer: numericTransformer,
    })
    total!: number;
}
