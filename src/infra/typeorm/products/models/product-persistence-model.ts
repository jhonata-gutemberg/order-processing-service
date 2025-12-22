import { Column, Entity, PrimaryColumn } from "typeorm";

const numericTransformer = {
    to: (value?: number) => value,
    from: (value?: string) =>
        value === null || value === undefined ? null : Number(value),
};

@Entity({ name: "products" })
export class ProductPersistenceModel {
    @PrimaryColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 150 })
    name!: string;

    @Column({
        type: "numeric",
        precision: 12,
        scale: 2,
        transformer: numericTransformer,
    })
    price!: number;

    @Column({ type: "integer" })
    stock!: number;
}
