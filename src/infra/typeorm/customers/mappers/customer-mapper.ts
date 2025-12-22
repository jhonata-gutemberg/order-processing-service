import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";
import { Customer } from "@/domain/customers/models/entities/customer";

export class CustomerMapper {
    public static async toEntity(persistencyModel: CustomerPersistenceModel) {
        const { id, name, email } = persistencyModel;
        return Customer.create({
            id,
            name,
            email,
        });
    }

    public static toPersistencyModel(entity: Customer) {
        const customerPersistenceModel = new CustomerPersistenceModel();
        customerPersistenceModel.id = entity.id;
        customerPersistenceModel.name = entity.name;
        customerPersistenceModel.email = entity.email;
        return customerPersistenceModel;
    }
}
