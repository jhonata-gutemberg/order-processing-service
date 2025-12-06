import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Email, UUID } from "@/domain/customers/models/value-objects";
import { Customer } from "@/domain/customers/models/entities/customer";
import { CustomerPersistenceModel } from "@/infra/typeorm/models/entities";
import { DataSource, Repository } from "typeorm";

export class TypeORMCustomerRepository implements CustomerRepository {
    private readonly repository: Repository<CustomerPersistenceModel>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(CustomerPersistenceModel);
    }

    findByEmail(email: Email): Promise<Customer | null> {
        throw new Error("Method not implemented.");
    }

    async save(customer: Customer): Promise<Customer> {
        let customerPersistenceModel = new CustomerPersistenceModel();
        customerPersistenceModel.id = customer.id.toString();
        customerPersistenceModel.name = customer.name;
        customerPersistenceModel.email = customer.email.toString();
        customerPersistenceModel = await this.repository.save(
            customerPersistenceModel,
        );
        return new Customer({
            id: UUID.from(customerPersistenceModel.id),
            name: customerPersistenceModel.name,
            email: Email.from(customerPersistenceModel.email),
        });
    }
}
