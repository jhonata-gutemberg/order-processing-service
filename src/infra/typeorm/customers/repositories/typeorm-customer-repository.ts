import { DataSource, FindOptionsOrder, Repository } from "typeorm";
import { inject, injectable } from "tsyringe";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Customer } from "@/domain/customers/models/entities/customer";
import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";
import { CustomerMapper } from "@/infra/typeorm/customers/mappers";
import { DATA_SOURCE_TOKEN } from "@/infra/di/tokens";
import { Page, Pageable } from "@/domain/shared/models/value-objects";

@injectable()
export class TypeORMCustomerRepository implements CustomerRepository {
    private readonly repository: Repository<CustomerPersistenceModel>;

    constructor(@inject(DATA_SOURCE_TOKEN) dataSource: DataSource) {
        this.repository = dataSource.getRepository(CustomerPersistenceModel);
    }

    async findById(id: string): Promise<Customer | null> {
        const persistenceModel = await this.repository.findOneBy({
            id,
        });
        return persistenceModel != null
            ? CustomerMapper.toEntity(persistenceModel)
            : null;
    }

    async findByEmail(email: string): Promise<Customer | null> {
        const persistenceModel = await this.repository.findOneBy({
            email,
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

    async findAll(pageable: Pageable): Promise<Page<Customer>> {
        const { page, size, sort } = pageable;
        let order: FindOptionsOrder<CustomerPersistenceModel> | undefined;
        if (sort !== undefined && sort.by in CustomerPersistenceModel) {
            order = { [sort.by]: sort.direction };
        }
        const [persistenceModels, total] = await this.repository.findAndCount({
            skip: page * size,
            take: size,
            order,
        });
        const content = await Promise.all(
            persistenceModels.map(CustomerMapper.toEntity),
        );
        return new Page(
            content,
            pageable.page,
            pageable.size,
            persistenceModels.length,
            Math.ceil(total / size),
        );
    }
}
