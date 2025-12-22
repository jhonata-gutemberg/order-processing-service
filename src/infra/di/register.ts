import { container } from "tsyringe";
import {
    CUSTOMER_REPOSITORY_TOKEN,
    PRODUCT_REPOSITORY_TOKEN,
} from "@/infra/di/tokens";
import { TypeORMCustomerRepository } from "@/infra/typeorm/customers/repositories";
import { TypeORMProductRepository } from "@/infra/typeorm/products/repositories";

container.register(CUSTOMER_REPOSITORY_TOKEN, {
    useClass: TypeORMCustomerRepository,
});

container.register(PRODUCT_REPOSITORY_TOKEN, {
    useClass: TypeORMProductRepository,
});
