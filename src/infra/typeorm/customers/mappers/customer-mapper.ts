import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";
import { Customer } from "@/domain/customers/models/entities/customer";
import { UUID } from "@/domain/shared/models/value-objects";

export class CustomerMapper {
    public static async toEntity(persistencyModel: CustomerPersistenceModel) {
        const { id, name, email } = persistencyModel;
        return Customer.create({
            id: await UUID.of(id),
            name,
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
