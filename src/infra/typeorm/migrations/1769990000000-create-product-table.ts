import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1769990000000 implements MigrationInterface {
    name = "CreateProductTable1769990000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "products" ("id" uuid NOT NULL, "name" character varying(150) NOT NULL, "price" numeric(12,2) NOT NULL, "stock" integer NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }
}
