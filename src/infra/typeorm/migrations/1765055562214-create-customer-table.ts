import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomerTable1765055562214 implements MigrationInterface {
    name = "CreateCustomerTable1765055562214";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "customers" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(250) NOT NULL, CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customers"`);
    }
}
