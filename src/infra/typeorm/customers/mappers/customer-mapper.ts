import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";
import { Customer } from "@/domain/customers/models/entities/customer";
import { Email, UUID } from "@/domain/customers/models/value-objects";

export class CustomerMapper {
    public static toEntity(persistencyModel: CustomerPersistenceModel) {
        return new Customer({
            id: UUID.from(persistencyModel.id),
            name: persistencyModel.name,
            email: Email.from(persistencyModel.email),
        });
    }

    public static toPersistencyModel(entity: Customer) {
        const customerPersistenceModel = new CustomerPersistenceModel();
        customerPersistenceModel.id = entity.id.toString();
        customerPersistenceModel.name = entity.name;
        customerPersistenceModel.email = entity.email.toString();
        return customerPersistenceModel;
    }
}
