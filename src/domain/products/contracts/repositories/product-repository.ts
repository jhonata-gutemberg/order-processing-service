import { Product } from "@/domain/products/models/entities";
import { Page, Pageable } from "@/domain/shared/models/value-objects";

export interface ProductRepository {
    findById(id: string): Promise<Product | null>;
    findByIds(ids: string[]): Promise<Product[]>;
    findAll(pageable: Pageable): Promise<Page<Product>>;
    save(product: Product): Promise<Product>;
    saveAll(products: Product[]): Promise<void>;
}
