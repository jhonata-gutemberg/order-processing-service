import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTables1777777777777 implements MigrationInterface {
    name = "CreateOrderTables1777777777777";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "orders" ("id" uuid NOT NULL, "customerId" uuid NOT NULL, "total" numeric(12,2) NOT NULL, CONSTRAINT "PK_orders_id" PRIMARY KEY ("id"), CONSTRAINT "FK_orders_customer" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION)` ,
        );
        await queryRunner.query(
            `CREATE TABLE "order_items" ("id" uuid NOT NULL, "orderId" uuid NOT NULL, "productId" uuid NOT NULL, "quantity" integer NOT NULL, "unitPrice" numeric(12,2) NOT NULL, "total" numeric(12,2) NOT NULL, CONSTRAINT "PK_order_items_id" PRIMARY KEY ("id"), CONSTRAINT "FK_order_items_order" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_order_items_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION)` ,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }
}
