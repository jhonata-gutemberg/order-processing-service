import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";
import { Customer } from "@/domain/customers/models/entities/customer";
import { Name, UUID } from "@/domain/shared/models/value-objects";

export class CustomerMapper {
    public static async toEntity(persistencyModel: CustomerPersistenceModel) {
        const { email } = persistencyModel;
        return Customer.create({
            id: await UUID.of(persistencyModel.id),
            name: Name.of(persistencyModel.name),
            email,
        });
    }

    public static toPersistencyModel(entity: Customer) {
        const customerPersistenceModel = new CustomerPersistenceModel();
        customerPersistenceModel.id = entity.id.toString();
        customerPersistenceModel.name = entity.name.toString();
        customerPersistenceModel.email = entity.email.toString();
        return customerPersistenceModel;
    }
}
