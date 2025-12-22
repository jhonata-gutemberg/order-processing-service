import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";
import { Customer } from "@/domain/customers/models/entities/customer";

export class CustomerMapper {
    public static toEntity(persistencyModel: CustomerPersistenceModel) {
        return Customer.create(persistencyModel);
    }

    public static toPersistencyModel(entity: Customer) {
        const customerPersistenceModel = new CustomerPersistenceModel();
        customerPersistenceModel.id = entity.id;
        customerPersistenceModel.name = entity.name;
        customerPersistenceModel.email = entity.email;
        return customerPersistenceModel;
    }
}
