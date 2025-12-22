import { Product } from "@/domain/products/models/entities";
import { Page, Pageable } from "@/domain/shared/models/value-objects";

export interface ProductRepository {
    findById(id: string): Promise<Product | null>;
    save(product: Product): Promise<Product>;
    findAll(pageable: Pageable): Promise<Page<Product>>;
}
