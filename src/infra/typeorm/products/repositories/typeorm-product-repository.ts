import { DataSource, FindOptionsOrder, Repository } from "typeorm";
import { inject, injectable } from "tsyringe";
import { ProductRepository } from "@/domain/products/contracts/repositories";
import { Product } from "@/domain/products/models/entities/product";
import { ProductPersistenceModel } from "@/infra/typeorm/products/models";
import { ProductMapper } from "@/infra/typeorm/products/mappers";
import { DATA_SOURCE_TOKEN } from "@/infra/di/tokens";
import { Page, Pageable } from "@/domain/shared/models/value-objects";

@injectable()
export class TypeORMProductRepository implements ProductRepository {
    private readonly repository: Repository<ProductPersistenceModel>;

    constructor(@inject(DATA_SOURCE_TOKEN) dataSource: DataSource) {
        this.repository = dataSource.getRepository(ProductPersistenceModel);
    }

    async findById(id: string): Promise<Product | null> {
        const persistenceModel = await this.repository.findOneBy({
            id,
        });
        return persistenceModel != null
            ? ProductMapper.toEntity(persistenceModel)
            : null;
    }

    async save(product: Product): Promise<Product> {
        let persistenceModel = ProductMapper.toPersistencyModel(product);
        persistenceModel = await this.repository.save(persistenceModel);
        return ProductMapper.toEntity(persistenceModel);
    }

    async findAll(pageable: Pageable): Promise<Page<Product>> {
        const { page, size, sort } = pageable;
        let order: FindOptionsOrder<ProductPersistenceModel> | undefined;
        if (sort !== undefined && sort.by in ProductPersistenceModel) {
            order = { [sort.by]: sort.direction };
        }
        const [persistenceModels, total] = await this.repository.findAndCount({
            skip: page * size,
            take: size,
            order,
        });
        const content = await Promise.all(
            persistenceModels.map(ProductMapper.toEntity),
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
