import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "customers" })
export class CustomerPersistenceModel {
    @PrimaryColumn("uuid")
    id!: string;
    @Column("varchar", { length: 100 })
    name!: string;
    @Column("varchar", { length: 250 })
    email!: string;
}
