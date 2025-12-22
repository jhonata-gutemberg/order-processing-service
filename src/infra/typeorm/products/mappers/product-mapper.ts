import { ProductPersistenceModel } from "@/infra/typeorm/products/models";
import { Product } from "@/domain/products/models/entities";

export class ProductMapper {
    public static toEntity(persistencyModel: ProductPersistenceModel) {
        return Product.create(persistencyModel);
    }

    public static toPersistencyModel(entity: Product) {
        const productPersistenceModel = new ProductPersistenceModel();
        productPersistenceModel.id = entity.id;
        productPersistenceModel.name = entity.name;
        productPersistenceModel.price = entity.price;
        productPersistenceModel.stock = entity.stock;
        return productPersistenceModel;
    }
}
