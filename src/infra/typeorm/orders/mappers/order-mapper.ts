import { Order } from "@/domain/orders/models/entities";
import { UUIDGenerator } from "@/domain/shared/generators";
import {
    OrderItemPersistenceModel,
    OrderPersistenceModel,
} from "@/infra/typeorm/orders/models";

export class OrderMapper {
    public static async toEntity(persistencyModel: OrderPersistenceModel) {
        const { id, customerId } = persistencyModel;
        const items = await Promise.all(
            persistencyModel.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
            })),
        );
        return Order.create({
            id,
            customerId,
            items,
        });
    }

    public static toPersistencyModel(entity: Order) {
        const model = new OrderPersistenceModel();
        model.id = entity.id;
        model.customerId = entity.customerId;
        model.total = entity.total;
        model.items = entity.items.map((item) => {
            const itemModel = new OrderItemPersistenceModel();
            itemModel.id = UUIDGenerator.generate();
            itemModel.orderId = entity.id;
            itemModel.productId = item.productId;
            itemModel.quantity = item.quantity;
            return itemModel;
        });
        return model;
    }
}
