import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";
import { Customer } from "@/domain/customers/models/entities/customer";
import { Email } from "@/domain/shared/models/value-objects";
import { Name } from "@/domain/shared/models/value-objects";
import { UUID } from "@/domain/customers/models/value-objects";

export class CustomerMapper {
    public static toEntity(persistencyModel: CustomerPersistenceModel) {
        return Customer.create({
            id: UUID.from(persistencyModel.id),
            name: Name.of(persistencyModel.name),
            email: Email.of(persistencyModel.email),
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
