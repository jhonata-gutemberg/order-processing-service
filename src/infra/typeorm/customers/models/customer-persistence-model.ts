import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "customers" })
export class CustomerPersistenceModel {
    @PrimaryColumn("uuid")
    id!: string;
    @Column({ type: "varchar", length: 100 })
    name!: string;
    @Column({ type: "varchar", length: 250, unique: true })
    email!: string;
}
