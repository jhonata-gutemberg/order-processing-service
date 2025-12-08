import { container } from "tsyringe";
import { CUSTOMER_REPOSITORY_TOKEN } from "@/infra/di/tokens";
import { TypeORMCustomerRepository } from "@/infra/typeorm/customers/repositories";

container.register(CUSTOMER_REPOSITORY_TOKEN, {
    useClass: TypeORMCustomerRepository,
});
