import { DataSource, Repository } from "typeorm";
import { inject, injectable } from "tsyringe";
import { DATA_SOURCE_TOKEN } from "@/infra/di/tokens";
import { OrderRepository } from "@/domain/orders/contracts/repositories";
import { Order } from "@/domain/orders/models/entities";
import { OrderPersistenceModel } from "@/infra/typeorm/orders/models";
import { OrderMapper } from "@/infra/typeorm/orders/mappers";

@injectable()
export class TypeORMOrderRepository implements OrderRepository {
    private readonly repository: Repository<OrderPersistenceModel>;

    constructor(@inject(DATA_SOURCE_TOKEN) dataSource: DataSource) {
        this.repository = dataSource.getRepository(OrderPersistenceModel);
    }

    async save(order: Order): Promise<Order> {
        let persistenceModel = OrderMapper.toPersistencyModel(order);
        persistenceModel = await this.repository.save(persistenceModel);
        return await OrderMapper.toEntity(persistenceModel);
    }

    async findById(id: string): Promise<Order | null> {
        const persistenceModel = await this.repository.findOneBy({
            id,
        });
        return persistenceModel != null
            ? await OrderMapper.toEntity(persistenceModel)
            : null;
    }
}
