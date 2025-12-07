import { DataSource, Repository } from "typeorm";
import { inject, injectable } from "tsyringe";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Email } from "@/domain/customers/models/value-objects";
import { Customer } from "@/domain/customers/models/entities/customer";
import { CustomerPersistenceModel } from "@/infra/typeorm/models/customer-persistence-model";
import { CustomerMapper } from "@/infra/typeorm/mappers/customer-mapper";
import { DATA_SOURCE_TOKEN } from "@/infra/di/tokens";

@injectable()
export class TypeORMCustomerRepository implements CustomerRepository {
    private readonly repository: Repository<CustomerPersistenceModel>;

    constructor(@inject(DATA_SOURCE_TOKEN) dataSource: DataSource) {
        this.repository = dataSource.getRepository(CustomerPersistenceModel);
    }

    async findByEmail(email: Email): Promise<Customer | null> {
        const persistenceModel = await this.repository.findOneBy({
            email: email.toString(),
        });
        return persistenceModel != null
            ? CustomerMapper.toEntity(persistenceModel)
            : null;
    }

    async save(customer: Customer): Promise<Customer> {
        let persistenceModel = CustomerMapper.toPersistencyModel(customer);
        persistenceModel = await this.repository.save(persistenceModel);
        return CustomerMapper.toEntity(persistenceModel);
    }
}
